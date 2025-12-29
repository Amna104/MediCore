import Image from "next/image";
import Link from "next/link";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Link href="/" className="group inline-block mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-green-300 group-hover:via-green-400 group-hover:to-emerald-400">
                Medi
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:via-blue-400 group-hover:to-cyan-400">
                Core
              </span>
            </h1>
          </Link>
          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
