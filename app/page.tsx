"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PasskeyModal } from "@/components/PasskeyModal";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const features = [
  {
    title: "Easy Appointment Booking",
    description: "Schedule appointments with verified doctors at your convenience. Real-time availability and instant confirmation.",
    icon: "calendar",
  },
  {
    title: "Secure Medical Records",
    description: "Access your complete medical history anytime, anywhere. Industry-standard encryption keeps your data safe.",
    icon: "medical",
  },
  {
    title: "Smart Notifications",
    description: "Never miss an appointment with SMS and email reminders. Get real-time updates on your healthcare journey.",
    icon: "notification",
  },
  {
    title: "Admin Dashboard",
    description: "Powerful tools for healthcare providers. Manage appointments, patients, and schedules efficiently.",
    icon: "dashboard",
  },
  {
    title: "Document Management",
    description: "Securely upload and store medical documents. Easy access to prescriptions, test results, and reports.",
    icon: "document",
  },
  {
    title: "24/7 Accessibility",
    description: "Access your healthcare portal anytime. Responsive design works seamlessly across all devices.",
    icon: "access",
  },
];

const doctors = [
  { name: "Dr. John Green", initials: "JG", specialty: "Cardiologist", experience: "15+ years" },
  { name: "Dr. Leila Cameron", initials: "LC", specialty: "Pediatrician", experience: "12+ years" },
  { name: "Dr. David Livingston", initials: "DL", specialty: "Orthopedic Surgeon", experience: "18+ years" },
  { name: "Dr. Evan Peter", initials: "EP", specialty: "Neurologist", experience: "14+ years" },
  { name: "Dr. Jane Powell", initials: "JP", specialty: "Dermatologist", experience: "10+ years" },
  { name: "Dr. Alex Ramirez", initials: "AR", specialty: "General Practitioner", experience: "16+ years" },
  { name: "Dr. Jasmine Lee", initials: "JL", specialty: "Ophthalmologist", experience: "11+ years" },
  { name: "Dr. Alyana Cruz", initials: "AC", specialty: "Gynecologist", experience: "13+ years" },
];

const testimonials = [
  {
    name: "Sarah Anderson",
    role: "Regular Patient",
    quote: "MediCore has transformed how I manage my family's healthcare. The platform is intuitive, and the doctors are exceptional.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Healthcare Professional",
    quote: "As a physician, I appreciate the efficiency of MediCore. It streamlines appointment management and improves patient care.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Working Mother",
    quote: "Booking appointments is now effortless. The SMS reminders ensure I never miss important checkups for my children.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "Creating an appointment is simple. Register on our platform, browse available doctors by specialty, select your preferred time slot, and confirm. You'll receive instant confirmation via SMS and email.",
  },
  {
    question: "Is my medical information secure?",
    answer: "Yes, absolutely. We employ industry-standard encryption and secure cloud storage through Appwrite. Your data is protected with enterprise-grade security measures and is fully HIPAA compliant.",
  },
  {
    question: "Do you accept insurance?",
    answer: "Yes, we work with most major insurance providers. During registration, you can provide your insurance information, and we'll verify coverage for your appointments.",
  },
  {
    question: "What if I need emergency care?",
    answer: "For medical emergencies, please call 911 or visit your nearest emergency room immediately. MediCore is designed for scheduled appointments and non-emergency healthcare services.",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for scroll animations
  const featuresRef = useRef(null);
  const doctorsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isDoctorsInView = useInView(doctorsRef, { once: true, amount: 0.2 });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const isFaqInView = useInView(faqRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderIcon = (iconName: string) => {
    const iconClass = "h-8 w-8";
    
    switch (iconName) {
      case "calendar":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "medical":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "notification":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case "dashboard":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "document":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case "access":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-dark-500/50 bg-dark-300/95 backdrop-blur-xl shadow-lg"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center group">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-green-300 group-hover:via-green-400 group-hover:to-emerald-400">
                Medi
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:via-blue-400 group-hover:to-cyan-400">
                Core
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-light-200 transition-colors hover:text-green-500"
            >
              Patient Portal
            </Link>
            <button
              onClick={() => setShowPasskeyModal(true)}
              className="text-sm font-medium text-light-200 transition-colors hover:text-green-500"
            >
              Admin Access
            </button>
            <Link
              href="/patient"
              className="rounded-lg bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-600 hover:shadow-lg"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-light-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-dark-500 bg-dark-300 md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-light-200 transition-colors hover:text-green-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Patient Portal
              </Link>
              <button
                onClick={() => {
                  setShowPasskeyModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium text-light-200 transition-colors hover:text-green-500"
              >
                Admin Access
              </button>
              <Link
                href="/patient"
                className="rounded-lg bg-green-500 px-6 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-dark-200 to-dark-300 px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-light-200">
                Next-Generation Healthcare Management
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              Healthcare Made{" "}
              <span className="bg-gradient-to-r from-green-500 via-green-400 to-blue-500 bg-clip-text text-transparent">
                Simple
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 text-xl leading-relaxed text-dark-700"
            >
              Experience seamless healthcare management. Book appointments with top
              doctors, access your medical records securely, and receive instant
              notifications—all in one comprehensive platform.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mb-10 flex flex-wrap gap-4"
            >
              <Link
                href="/patient"
                className="group flex items-center gap-2 rounded-lg bg-green-500 px-8 py-4 font-semibold text-white transition-all hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/30"
              >
                Book Appointment
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <button
                onClick={scrollToFeatures}
                className="rounded-lg border-2 border-dark-500 px-8 py-4 font-semibold text-light-200 transition-all hover:border-green-500 hover:bg-green-500/10"
              >
                Learn More
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-8 border-t border-dark-500 pt-8"
            >
              <div>
                <div className="mb-1 text-3xl font-bold text-green-500">10,000+</div>
                <div className="text-sm text-dark-700">Happy Patients</div>
              </div>
              <div>
                <div className="mb-1 text-3xl font-bold text-green-500">50+</div>
                <div className="text-sm text-dark-700">Expert Doctors</div>
              </div>
              <div>
                <div className="mb-1 text-3xl font-bold text-green-500">24/7</div>
                <div className="text-sm text-dark-700">Support Available</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Appointment Management Icon */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl" />

            {/* Animated Rings */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-[500px] w-[500px] rounded-full border-2 border-green-500/20"
            />
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.05, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute h-[550px] w-[550px] rounded-full border-2 border-blue-500/15"
            />

            {/* Main Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.05 }}
              className="relative z-10 flex h-[450px] w-[400px] items-center justify-center"
            >
              {/* Glass Circle Background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-green-500/30 shadow-2xl" />

              {/* Medical Clipboard Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <svg
                  className="h-56 w-56 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Clipboard Board */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                  {/* Checkmark Lines (Appointments) */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 16h6"
                  />
                </svg>
              </motion.div>

              {/* Floating Mini Icons */}
              {/* Calendar Icon - Top Right */}
              <motion.div
                animate={{
                  x: [0, 10, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-12 -top-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/50"
              >
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>

              {/* Stethoscope Icon - Bottom Left */}
              <motion.div
                animate={{
                  x: [0, -10, 0],
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-8 -left-12 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-xl shadow-green-500/50"
              >
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </motion.div>

              {/* User/Patient Icon - Left */}
              <motion.div
                animate={{
                  x: [0, -8, 0],
                  y: [0, 0, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -left-16 top-32 flex h-18 w-18 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/50"
              >
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </motion.div>

              {/* Notification Bell - Right */}
              <motion.div
                animate={{
                  x: [0, 8, 0],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -right-16 top-40 flex h-18 w-18 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50"
              >
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </motion.div>

              {/* Pulse Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border-4 border-green-500/40"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mx-auto mt-20 max-w-7xl"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex items-center justify-center gap-3 rounded-lg border border-dark-500 bg-dark-400/50 p-4 backdrop-blur-sm">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-light-200">HIPAA Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-lg border border-dark-500 bg-dark-400/50 p-4 backdrop-blur-sm">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-light-200">Secure & Encrypted</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-lg border border-dark-500 bg-dark-400/50 p-4 backdrop-blur-sm">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm font-medium text-light-200">Trusted by 10k+</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-lg border border-dark-500 bg-dark-400/50 p-4 backdrop-blur-sm">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-light-200">Certified Platform</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="bg-dark-300 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-500">
              Platform Features
            </span>
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Everything You Need for Better Healthcare
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-dark-700">
              Our comprehensive platform is designed to streamline healthcare management
              for both patients and providers
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group rounded-2xl border border-dark-500 bg-dark-400/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-dark-400 hover:shadow-xl hover:shadow-green-500/10"
              >
                <div className="mb-6 inline-flex rounded-xl bg-green-500/10 p-4 text-green-500 transition-all group-hover:bg-green-500 group-hover:text-white">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-dark-700">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Doctors Section */}
      <section
        ref={doctorsRef}
        className="bg-dark-200 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate={isDoctorsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-500">
              Our Medical Team
            </span>
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Meet Our Expert Doctors
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-dark-700">
              Board-certified physicians dedicated to providing exceptional care
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isDoctorsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group rounded-2xl border border-dark-500 bg-dark-400/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-dark-400 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white shadow-lg shadow-green-500/30">
                  {doctor.initials}
                </div>
                <h3 className="mb-1 text-lg font-bold text-white">{doctor.name}</h3>
                <p className="mb-2 text-sm text-green-500">{doctor.specialty}</p>
                <p className="mb-4 text-xs text-dark-700">{doctor.experience} Experience</p>
                <div className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-500">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className="bg-dark-300 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate={isTestimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-500">
              Patient Reviews
            </span>
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              What Our Patients Say
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-dark-700">
              Real experiences from real patients
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isTestimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="rounded-2xl border border-dark-500 bg-dark-400/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-dark-400"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-lg leading-relaxed text-dark-700">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-dark-500 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 font-bold text-white">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-dark-700">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqRef}
        className="bg-dark-200 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            animate={isFaqInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-500">
              FAQ
            </span>
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-dark-700">
              Find answers to common questions about our platform
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isFaqInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="overflow-hidden rounded-2xl border border-dark-500 bg-dark-400/50 backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-dark-400/70"
                >
                  <span className="pr-8 text-lg font-bold text-white">
                    {faq.question}
                  </span>
                  <motion.svg
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 leading-relaxed text-dark-700">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="bg-dark-300 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={
              isCtaInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }
            }
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-500 to-blue-600 p-12 text-center shadow-2xl lg:p-16"
          >
            <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-xl text-white/90">
                Join thousands of patients who trust MediCore for their healthcare needs
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/patient"
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-green-600 transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Book Your Appointment
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-green-600"
                >
                  Access Patient Portal
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-500 bg-dark-300 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 md:grid-cols-4">
            {/* Branding */}
            <div className="md:col-span-1">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Medi
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Core
                </span>
              </h2>
              <p className="text-sm leading-relaxed text-dark-700">
                Next-generation healthcare management platform for better patient care
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 font-bold text-white">Product</h3>
              <ul className="space-y-2 text-sm text-dark-700">
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-green-500"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/patient"
                    className="transition-colors hover:text-green-500"
                  >
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowPasskeyModal(true)}
                    className="transition-colors hover:text-green-500"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 font-bold text-white">Company</h3>
              <ul className="space-y-2 text-sm text-dark-700">
                <li>
                  <a href="#" className="transition-colors hover:text-green-500">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-green-500">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-green-500">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 font-bold text-white">Contact</h3>
              <ul className="space-y-2 text-sm text-dark-700">
                <li>support@carepulse.com</li>
                <li>1-800-CAREPULSE</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-500 pt-8">
            <div className="flex items-center justify-center">
              <p className="text-sm text-dark-700">
                © 2025 MediCore. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* PasskeyModal */}
      <PasskeyModal
        isOpen={showPasskeyModal}
        onClose={() => setShowPasskeyModal(false)}
      />
    </>
  );
}
