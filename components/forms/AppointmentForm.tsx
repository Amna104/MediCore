"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { isDoctorAvailable } from "@/lib/actions/availability.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { TimeSlotPicker } from "../TimeSlotPicker";

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        // Validate availability before creating appointment
        const appointmentDateTime = new Date(values.schedule);
        
        if (selectedDoctor && selectedTime) {
          const [hours, minutes] = selectedTime.split(":");
          appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const isAvailable = await isDoctorAvailable(
            values.primaryPhysician,
            appointmentDateTime
          );

          if (!isAvailable) {
            alert("This time slot is no longer available. Please select another time.");
            setIsLoading(false);
            return;
          }
        }

        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: appointmentDateTime,
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
              onChange={(value) => {
                setSelectedDoctor(value);
                setSelectedTime(""); // Reset time when doctor changes
              }}
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect={false}
              dateFormat="MM/dd/yyyy"
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedTime(""); // Reset time when date changes
              }}
            />

            {/* Time Slot Picker - Only show for create type */}
            {type === "create" && selectedDoctor && selectedDate && (
              <div className="mb-6">
                <TimeSlotPicker
                  doctorName={selectedDoctor}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={(time) => {
                    setSelectedTime(time);
                    // Update the form schedule value with the selected time
                    const dateTime = new Date(selectedDate);
                    const [hours, minutes] = time.split(":");
                    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    form.setValue("schedule", dateTime);
                  }}
                />
              </div>
            )}

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
