# 🗓️ Doctor Availability Calendar System

## 🎯 Overview

A comprehensive doctor availability management system that allows admins to view schedules, block time slots, and patients to see real-time available appointments.

---

## ✨ Features

### **1. Visual Doctor Calendar** 📅
- Interactive calendar showing doctor schedules
- Month, week, and day views
- Color-coded events:
  - 🟢 **Green** - Scheduled appointments
  - 🔵 **Blue** - Pending appointments  
  - ⚫ **Gray** - Blocked time slots
  - 🔴 **Red** - Cancelled appointments

### **2. Time Slot Blocking** 🚫
- Admins can block specific time slots
- Set date, start time, end time
- Add reason for blocking
- Prevents double booking

### **3. Real-Time Availability** ⚡
- Shows available slots when booking
- Grouped by time of day (Morning, Afternoon, Evening)
- Visual feedback for available/booked slots
- 30-minute interval slots

### **4. Smart Slot Management** 🧠
- Automatically calculates available slots
- Considers:
  - Doctor's weekly schedule
  - Existing appointments
  - Blocked time slots
- Prevents overbooking

---

## 📁 File Structure

```
lib/
├── actions/
│   └── availability.actions.ts       # Server actions for availability
components/
├── DoctorCalendar.tsx                # Visual calendar component
└── TimeSlotPicker.tsx                # Time slot selection component
app/
├── admin/
│   └── availability/
│       └── page.tsx                  # Admin availability management
└── api/
    └── availability/
        ├── [doctorName]/
        │   ├── slots/
        │   │   └── route.ts          # Get available time slots
        │   └── schedule/
        │       └── route.ts          # Get doctor schedule
        └── block/
            └── route.ts              # Block time slots
types/
└── index.d.ts                        # TypeScript types
```

---

## 🗄️ Database Collections

### **Collection 1: doctor_availability**

Stores weekly availability schedules for doctors.

**Attributes:**
```
- doctorName: string (required)
- dayOfWeek: string (required) - "Monday", "Tuesday", etc.
- startTime: string (required) - "09:00"
- endTime: string (required) - "17:00"
- isAvailable: boolean (required) - true/false
```

**Example Document:**
```json
{
  "$id": "unique_id",
  "doctorName": "Dr. Smith",
  "dayOfWeek": "Monday",
  "startTime": "09:00",
  "endTime": "17:00",
  "isAvailable": true
}
```

### **Collection 2: doctor_blocked_slots**

Stores specific blocked time slots for doctors.

**Attributes:**
```
- doctorName: string (required)
- date: datetime (required)
- startTime: string (required) - "14:00"
- endTime: string (required) - "15:00"  
- reason: string (optional) - "Personal leave", "Conference"
```

**Example Document:**
```json
{
  "$id": "unique_id",
  "doctorName": "Dr. Smith",
  "date": "2024-12-28T00:00:00.000Z",
  "startTime": "14:00",
  "endTime": "15:00",
  "reason": "Conference"
}
```

---

## 🔧 Setup Instructions

### **Step 1: Create Appwrite Collections**

1. Go to your Appwrite console
2. Navigate to your database
3. Create two new collections:

#### **Collection: doctor_availability**
- Add attributes:
  - `doctorName` (String, required)
  - `dayOfWeek` (String, required)
  - `startTime` (String, required)
  - `endTime` (String, required)
  - `isAvailable` (Boolean, required, default: true)

#### **Collection: doctor_blocked_slots**
- Add attributes:
  - `doctorName` (String, required)
  - `date` (DateTime, required)
  - `startTime` (String, required)
  - `endTime` (String, required)
  - `reason` (String, optional)

### **Step 2: Update Environment Variables**

Add to your `.env.local`:

```env
DOCTOR_AVAILABILITY_COLLECTION_ID=doctor_availability
DOCTOR_BLOCKED_SLOTS_COLLECTION_ID=doctor_blocked_slots
```

### **Step 3: Set Initial Doctor Schedules**

You can set default schedules using the admin panel or programmatically:

```typescript
import { setDoctorAvailability } from "@/lib/actions/availability.actions";

// Set Dr. Smith's Monday schedule
await setDoctorAvailability({
  doctorName: "Dr. Smith",
  dayOfWeek: "Monday",
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: true,
});
```

---

## 🎮 How to Use

### **For Admins:**

#### **1. View Doctor Calendars**
```
1. Go to /admin/availability
2. Select a doctor from the grid
3. View their calendar with all appointments and blocked slots
4. Switch between month, week, and day views
```

#### **2. Block Time Slots**
```
1. Click "Block Time Slot" button
2. Select date, start time, end time
3. Add reason (optional)
4. Click "Block Slot"
5. Slot is now unavailable for booking
```

#### **3. Calendar Views**
- **Month View**: Overview of entire month
- **Week View**: Detailed weekly schedule
- **Day View**: Hour-by-hour breakdown

### **For Patients (In Booking Form):**

When booking an appointment, patients will see:

```
1. Select a date
2. Available time slots appear automatically
3. Grouped by:
   - 🌅 Morning (Before 12 PM)
   - ☀️ Afternoon (12 PM - 5 PM)
   - 🌙 Evening (After 5 PM)
4. Click a slot to select
5. Booked slots are grayed out
6. Complete booking
```

---

## 💻 API Endpoints

### **GET `/api/availability/[doctorName]/slots`**

Get available time slots for a specific date.

**Query Parameters:**
- `date` (required): ISO date string

**Example:**
```javascript
GET /api/availability/Dr.%20Smith/slots?date=2024-12-28T00:00:00.000Z

Response:
{
  "success": true,
  "slots": [
    { "time": "09:00", "isAvailable": true, "isBooked": false },
    { "time": "09:30", "isAvailable": true, "isBooked": false },
    { "time": "10:00", "isAvailable": false, "isBooked": true },
    ...
  ]
}
```

### **GET `/api/availability/[doctorName]/schedule`**

Get doctor's full schedule (appointments + blocked slots).

**Response:**
```javascript
{
  "success": true,
  "appointments": [...],
  "blockedSlots": [...]
}
```

### **POST `/api/availability/block`**

Block a time slot.

**Body:**
```json
{
  "doctorName": "Dr. Smith",
  "date": "2024-12-28",
  "startTime": "14:00",
  "endTime": "15:00",
  "reason": "Personal leave"
}
```

---

## 🎨 UI Components

### **1. DoctorCalendar**

Interactive calendar component.

**Usage:**
```tsx
import { DoctorCalendar } from "@/components/DoctorCalendar";

<DoctorCalendar 
  doctorName="Dr. Smith"
  onSelectSlot={(date) => console.log(date)}
/>
```

**Features:**
- Color-coded events
- Multiple view modes
- Click to select slots
- Auto-refreshes

### **2. TimeSlotPicker**

Time slot selection interface.

**Usage:**
```tsx
import { TimeSlotPicker } from "@/components/TimeSlotPicker";

<TimeSlotPicker
  doctorName="Dr. Smith"
  selectedDate={new Date()}
  onSelectTime={(time) => console.log(time)}
  selectedTime="10:00"
/>
```

**Features:**
- Grouped by time of day
- Visual availability indicators
- Selected state management
- Responsive grid layout

---

## 🎯 Business Logic

### **Slot Availability Algorithm:**

```
For a given doctor and date:

1. Get doctor's weekly schedule
   - Check if doctor works on this day
   - Get start/end times (e.g., 9 AM - 5 PM)

2. Generate 30-minute time slots
   - 9:00, 9:30, 10:00, 10:30, etc.

3. Check blocked slots
   - Mark slots within blocked ranges as unavailable

4. Check existing appointments
   - Mark booked slots as unavailable

5. Return available slots
   - Only slots that are not blocked AND not booked
```

### **Booking Validation:**

Before creating an appointment:
```typescript
const isAvailable = await isDoctorAvailable(doctorName, dateTime);

if (!isAvailable) {
  throw new Error("This time slot is not available");
}

// Proceed with booking...
```

---

## 🎤 Bootcamp Demo Script

### **Feature Showcase:**

```
"Let me show you our advanced availability management system.

[Navigate to /admin/availability]

As an admin, I can see the full schedule for any doctor...

[Select a doctor]

This interactive calendar shows:
- Green: Scheduled appointments
- Blue: Pending approvals
- Gray: Blocked time slots

[Click 'Block Time Slot']

I can also block specific times when doctors are unavailable...

[Fill in date, times, reason]

Now let's see this from a patient's perspective...

[Go to appointment booking]

When a patient books an appointment, they only see 
available time slots in real-time...

[Select a date]

Notice how booked slots are automatically hidden, 
and blocked times don't appear at all.

This prevents double-booking and ensures efficient 
schedule management."
```

---

## 🏆 Why This Feature Wins

### **For Bootcamp Judges:**

1. **Complex Business Logic** ✨
   - Not just CRUD operations
   - Real-time availability calculation
   - Smart slot management

2. **Professional UI** 🎨
   - Interactive calendar (like Google Calendar)
   - Beautiful time slot picker
   - Multiple view modes

3. **Real-World Application** 💼
   - Actual clinic need
   - Prevents overbooking
   - Improves efficiency

4. **Technical Sophistication** 💻
   - React Big Calendar integration
   - Complex date/time handling
   - Server-side validation

### **For Paid Clients:**

**Clinics will pay MORE because:**
- Reduces scheduling conflicts
- Saves receptionist time
- Professional appearance
- Better resource management

**Value Addition:** +₹25,000 - ₹50,000 to project price!

---

## 🚀 Integration with Existing Form

The availability system integrates with your appointment booking form:

```tsx
// In your AppointmentForm component:
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { isDoctorAvailable } from "@/lib/actions/availability.actions";

// When date and doctor are selected:
<TimeSlotPicker
  doctorName={selectedDoctor}
  selectedDate={selectedDate}
  onSelectTime={(time) => setSelectedTime(time)}
/>

// Before submitting:
const isAvailable = await isDoctorAvailable(
  selectedDoctor,
  new Date(selectedDate + " " + selectedTime)
);

if (!isAvailable) {
  alert("This slot is no longer available. Please choose another time.");
  return;
}
```

---

## 📊 Statistics & Impact

### **Before This Feature:**
❌ Manual schedule checking
❌ Double bookings possible
❌ No blocked time management
❌ Confusing for patients
❌ Time-consuming for staff

### **After This Feature:**
✅ Visual calendar overview
✅ Zero double bookings
✅ Easy time slot blocking
✅ Clear availability for patients
✅ Automated scheduling

---

## 🔮 Future Enhancements

1. **Recurring Blocks**
   - Block same time every week
   - Vacation mode (block multiple days)

2. **Doctor Self-Management**
   - Doctors set their own availability
   - Mobile app for schedule changes

3. **Waitlist System**
   - When slot is full, add to waitlist
   - Auto-notify when slot opens

4. **Analytics**
   - Most booked times
   - Doctor utilization rates
   - Peak hours insights

---

## 💡 Tips & Best Practices

### **For Development:**
- Always validate availability before booking
- Use server-side checks (don't trust client)
- Handle timezone conversions carefully
- Cache availability data for performance

### **For Demo:**
- Pre-populate some appointments
- Block a few slots to show the feature
- Use the calendar to tell a story
- Show both admin and patient views

---

## 🎉 Summary

**You now have:**
✅ Visual doctor calendar
✅ Time slot blocking system
✅ Real-time availability checking
✅ Professional UI components
✅ Complete API integration

**This feature:**
- Sets you apart from other students
- Shows production-ready thinking
- Demonstrates technical skill
- Adds real business value

---

**Your project is now BOOTCAMP WINNER material! 🏆**

