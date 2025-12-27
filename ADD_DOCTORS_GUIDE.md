# 👨‍⚕️ HOW TO ADD MORE DOCTORS & THEIR AVAILABILITY

## 🎯 Three Methods (Choose One):

---

## **Method 1: Add to Constants File** ⭐ (Recommended)

### **Step 1: Add Doctor to Constants**

Open `constants/index.ts` and add your new doctor:

```typescript
export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  // ... existing doctors ...
  
  // ADD NEW DOCTOR HERE:
  {
    image: "/assets/images/dr-new-doctor.png", // Add doctor image
    name: "Dr. Sarah Johnson",
  },
];
```

### **Step 2: Add Doctor Image**

Place doctor image in `public/assets/images/`:
- Filename: `dr-sarah-johnson.png`
- Recommended size: 400x400px
- Format: PNG with transparent background

### **Step 3: Run Setup Again**

Go to: `http://localhost:3000/setup-availability`

Click: "Initialize Doctor Availability"

This will automatically:
- ✅ Create Monday-Friday schedule (9 AM - 5 PM)
- ✅ Add 16 slots per day
- ✅ Make doctor available for booking

### **That's it!** ✅

---

## **Method 2: Manual API Call** 💻

### **For Custom Hours Per Doctor**

Use this if you want different working hours:

```javascript
// In browser console or create a script:

async function addDoctorAvailability() {
  const newDoctor = {
    name: "Dr. Sarah Johnson",
    schedule: [
      // Custom schedule per day
      { day: "Monday", start: "08:00", end: "16:00" },
      { day: "Tuesday", start: "10:00", end: "18:00" },
      { day: "Wednesday", start: "08:00", end: "16:00" },
      { day: "Thursday", start: "10:00", end: "18:00" },
      { day: "Friday", start: "08:00", end: "14:00" },
      { day: "Saturday", start: "09:00", end: "13:00" }, // Weekend hours
    ]
  };

  for (const schedule of newDoctor.schedule) {
    await fetch('/api/availability/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorName: newDoctor.name,
        dayOfWeek: schedule.day,
        startTime: schedule.start,
        endTime: schedule.end,
        isAvailable: true
      })
    });
  }
}

addDoctorAvailability();
```

---

## **Method 3: Direct Database Entry** 📊

### **Add Manually in Appwrite Console**

1. Go to Appwrite Console
2. Navigate to `doctor_availability` collection
3. Click "Add Document"
4. Fill in:

```json
{
  "doctorName": "Dr. Sarah Johnson",
  "dayOfWeek": "Monday",
  "startTime": "09:00",
  "endTime": "17:00",
  "isAvailable": true
}
```

5. Repeat for each day of the week

---

## 🔧 **Create API Route for Setting Availability**

Let me create a convenient API endpoint:

```typescript
// app/api/availability/set/route.ts

import { NextResponse } from "next/server";
import { setDoctorAvailability } from "@/lib/actions/availability.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorName, dayOfWeek, startTime, endTime, isAvailable } = body;

    if (!doctorName || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const availability = await setDoctorAvailability({
      doctorName,
      dayOfWeek,
      startTime,
      endTime,
      isAvailable: isAvailable ?? true,
    });

    return NextResponse.json({
      success: true,
      data: availability,
      message: "Availability set successfully",
    });
  } catch (error) {
    console.error("Error setting availability:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set availability" },
      { status: 500 }
    );
  }
}
```

---

## 📋 **COMPLETE EXAMPLE: Adding New Doctor**

### **Scenario:** Add Dr. Sarah Johnson (Cardiologist)

#### **1. Add to constants/index.ts:**

```typescript
{
  image: "/assets/images/dr-johnson.png",
  name: "Sarah Johnson",
}
```

#### **2. Add image:**
Place `dr-johnson.png` in `public/assets/images/`

#### **3. Set Custom Schedule:**

Dr. Johnson works different hours:
- Monday/Wednesday/Friday: 8 AM - 4 PM
- Tuesday/Thursday: 10 AM - 6 PM  
- Saturday: 9 AM - 1 PM (half day)
- Sunday: OFF

#### **4. Run this script:**

```javascript
// Create file: scripts/add-doctor.js

const schedules = [
  { day: "Monday", start: "08:00", end: "16:00" },
  { day: "Tuesday", start: "10:00", end: "18:00" },
  { day: "Wednesday", start: "08:00", end: "16:00" },
  { day: "Thursday", start: "10:00", end: "18:00" },
  { day: "Friday", start: "08:00", end: "16:00" },
  { day: "Saturday", start: "09:00", end: "13:00" },
];

async function setupDrJohnson() {
  for (const schedule of schedules) {
    const response = await fetch('http://localhost:3000/api/availability/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorName: "Sarah Johnson",
        dayOfWeek: schedule.day,
        startTime: schedule.start,
        endTime: schedule.end,
        isAvailable: true
      })
    });
    const data = await response.json();
    console.log(`${schedule.day}: ${data.success ? '✅' : '❌'}`);
  }
}

setupDrJohnson();
```

---

## 🎨 **Advanced: Specialty-Based Slots**

### **Different Slot Durations:**

Some doctors might need different appointment lengths:

**Cardiologist:** 45-minute slots
**Dentist:** 30-minute slots
**Therapist:** 60-minute slots

Currently, system uses 30-minute slots. To customize:

1. Modify `getAvailableTimeSlots()` in `lib/actions/availability.actions.ts`
2. Add `slotDuration` field to doctor availability
3. Calculate slots based on specialty

---

## 🔄 **Bulk Add Multiple Doctors**

### **Create a Setup Script:**

```typescript
// scripts/bulk-add-doctors.ts

const newDoctors = [
  { name: "Sarah Johnson", specialty: "Cardiology" },
  { name: "Michael Brown", specialty: "Orthopedics" },
  { name: "Emily Davis", specialty: "Pediatrics" },
];

const defaultSchedule = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];

async function bulkAddDoctors() {
  for (const doctor of newDoctors) {
    console.log(`Setting up ${doctor.name}...`);
    
    for (const day of defaultSchedule) {
      await setDoctorAvailability({
        doctorName: doctor.name,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      });
    }
    
    console.log(`✅ ${doctor.name} complete!`);
  }
}
```

---

## 📊 **View All Doctors & Their Availability**

### **Create an Admin Page:**

```typescript
// app/admin/doctors/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function DoctorsManagementPage() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    // Fetch all doctors and their availability
    const response = await fetch('/api/doctors/list');
    const data = await response.json();
    setDoctors(data.doctors);
  };

  return (
    <div>
      <h1>Doctor Management</h1>
      {doctors.map(doctor => (
        <div key={doctor.name}>
          <h2>{doctor.name}</h2>
          <button onClick={() => editDoctor(doctor)}>
            Edit Schedule
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚡ **Quick Commands:**

### **Add single doctor with default hours:**
```bash
# 1. Add to constants/index.ts
# 2. Visit: http://localhost:3000/setup-availability
# 3. Click button
```

### **Add doctor with custom hours:**
```bash
# Use Method 2 (API call) from above
```

### **Remove doctor:**
```bash
# 1. Remove from constants/index.ts
# 2. Delete availability records from Appwrite
```

---

## 🎯 **Summary:**

| Method | Difficulty | Use Case |
|--------|-----------|----------|
| **Method 1: Constants** | ⭐ Easy | Standard 9-5 schedule |
| **Method 2: API Call** | ⭐⭐ Medium | Custom hours per doctor |
| **Method 3: Database** | ⭐⭐⭐ Hard | One-time manual entry |

---

## 📝 **Recommendation:**

**For most cases:** Use Method 1
1. Add doctor to `constants/index.ts`
2. Add doctor image
3. Run `/setup-availability`
4. Done! ✅

**For custom hours:** Use Method 2
- Different start/end times
- Weekend availability
- Part-time doctors

---

**Which method works best for your use case?** 🤔

