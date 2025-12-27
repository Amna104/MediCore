"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { PasskeyModal } from "@/components/PasskeyModal";
import { CustomCursor } from "@/components/CustomCursor";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const featuresRef = useRef(null);
  const doctorsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);
  
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isDoctorsInView = useInView(doctorsRef, { once: true, amount: 0.2 });
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const isFaqInView = useInView(faqRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-200 via-dark-300 to-dark-400">
      <CustomCursor />
      {showPasskeyModal && <PasskeyModal onClose={() => setShowPasskeyModal(false)} />}
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 z-50 w-full border-b"
        initial={{ y: -100 }}
        animate={{ 
          y: 0,
          backgroundColor: scrolled ? "rgba(13, 15, 16, 0.95)" : "rgba(13, 15, 16, 0.8)",
          borderColor: scrolled ? "rgba(54, 58, 61, 1)" : "rgba(54, 58, 61, 0.5)"
        }}
        transition={{ duration: 0.3 }}
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/assets/icons/logo-full.svg"
                  height={32}
                  width={160}
                  alt="CarePulse"
                  className="h-8 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/dashboard"
                className="text-14-medium text-dark-700 hover:text-light-200 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => setShowPasskeyModal(true)}
                className="text-14-medium text-dark-700 hover:text-light-200 transition-colors cursor-pointer"
              >
                Admin
              </button>
              <Link
                href="/patient"
                className="shad-primary-btn rounded-full px-6 py-2 text-14-medium hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(36,174,124,0.1),transparent_50%)]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(121,181,236,0.1),transparent_50%)]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? '#24AE7C' : '#79B5EC',
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              opacity: 0.4
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
          />
        ))}
        
        <div className="relative mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-green-600 rounded-full px-4 py-2"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-12-semibold text-light-200">
                  Next-Generation Healthcare Management
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-light-200 leading-tight"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                Healthcare Made
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  {" "}Simple
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-18-regular text-dark-700 max-w-xl"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Book appointments with top doctors, manage your medical records, and get instant SMS confirmations—all in one seamless platform.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link
                  href="/patient"
                  className="shad-primary-btn rounded-full px-8 py-4 text-16-semibold text-center hover:scale-105 transition-transform"
                >
                  Book Appointment
                </Link>
                <Link
                  href="#features"
                  className="shad-gray-btn rounded-full px-8 py-4 text-16-semibold text-center hover:scale-105 transition-transform"
                >
                  Learn More
                </Link>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-8 pt-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeInUp}>
                  <p className="text-24-bold text-light-200">10k+</p>
                  <p className="text-14-regular text-dark-700">Happy Patients</p>
                </motion.div>
                <div className="h-12 w-px bg-dark-500" />
                <motion.div variants={fadeInUp}>
                  <p className="text-24-bold text-light-200">50+</p>
                  <p className="text-14-regular text-dark-700">Expert Doctors</p>
                </motion.div>
                <div className="h-12 w-px bg-dark-500" />
                <motion.div variants={fadeInUp}>
                  <p className="text-24-bold text-light-200">24/7</p>
                  <p className="text-14-regular text-dark-700">Support</p>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/images/onboarding-img.png"
                  height={600}
                  width={600}
                  alt="Healthcare Professional"
                  className="relative rounded-3xl shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-8 bg-dark-300/50" ref={featuresRef}>
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-36-bold text-light-200">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-18-regular text-dark-700 max-w-2xl mx-auto">
              A comprehensive platform designed to simplify healthcare management for patients and administrators.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div 
              className="group p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/10"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-24-bold text-light-200 mb-3">Easy Appointment Booking</h3>
              <p className="text-16-regular text-dark-700">
                Schedule appointments with your preferred doctors at your convenience. Book multiple appointments hassle-free.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="group p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-24-bold text-light-200 mb-3">Medical Records</h3>
              <p className="text-16-regular text-dark-700">
                Securely store and access your medical history, prescriptions, and documents anytime, anywhere.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="group p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/10"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-24-bold text-light-200 mb-3">SMS Notifications</h3>
              <p className="text-16-regular text-dark-700">
                Get instant SMS confirmations and reminders for your appointments. Never miss an appointment again.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="group p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-24-bold text-light-200 mb-3">Admin Dashboard</h3>
              <p className="text-16-regular text-dark-700">
                Powerful admin tools to manage appointments, schedule confirmations, and handle cancellations efficiently.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              className="group p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/10"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-24-bold text-light-200 mb-3">Secure File Upload</h3>
              <p className="text-16-regular text-dark-700">
                Upload medical documents, insurance cards, and identification securely with Appwrite storage.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              className="group p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-24-bold text-light-200 mb-3">Fully Responsive</h3>
              <p className="text-16-regular text-dark-700">
                Access CarePulse on any device—desktop, tablet, or mobile. Seamless experience across all screen sizes.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 px-6 lg:px-8" ref={doctorsRef}>
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isDoctorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-36-bold text-light-200">Meet Our Expert Doctors</h2>
            <p className="text-18-regular text-dark-700 max-w-2xl mx-auto">
              Our team of experienced healthcare professionals is here to provide you with the best care possible.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={isDoctorsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {[
              { name: "Dr. John Green", specialty: "Cardiologist", initials: "JG", bgColor: "bg-green-600" },
              { name: "Dr. Leila Cameron", specialty: "Pediatrician", initials: "LC", bgColor: "bg-blue-600" },
              { name: "Dr. David Livingston", specialty: "Orthopedic", initials: "DL", bgColor: "bg-green-600" },
              { name: "Dr. Evan Peter", specialty: "Neurologist", initials: "EP", bgColor: "bg-blue-600" },
              { name: "Dr. Jane Powell", specialty: "Dermatologist", initials: "JP", bgColor: "bg-green-600" },
              { name: "Dr. Alex Ramirez", specialty: "General Practice", initials: "AR", bgColor: "bg-blue-600" },
              { name: "Dr. Jasmine Lee", specialty: "Ophthalmologist", initials: "JL", bgColor: "bg-green-600" },
              { name: "Dr. Alyana Cruz", specialty: "Gynecologist", initials: "AC", bgColor: "bg-blue-600" },
            ].map((doctor, index) => (
              <motion.div
                key={index}
                className="group relative p-6 rounded-2xl bg-dark-400 border border-dark-500 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/10"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="flex flex-col items-center">
                  {/* Avatar Circle */}
                  <motion.div 
                    className={`w-32 h-32 rounded-full ${doctor.bgColor} flex items-center justify-center mb-4 group-hover:shadow-2xl transition-shadow`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: '2.5rem' }}>{doctor.initials}</span>
                  </motion.div>
                  
                  {/* Doctor Info */}
                  <div className="text-center">
                    <h3 className="text-18-bold text-light-200 mb-1">{doctor.name}</h3>
                    <p className="text-14-regular text-dark-700 mb-3">{doctor.specialty}</p>
                    
                    {/* Medical Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-300 border border-dark-500">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-12-regular text-dark-700">Verified</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-dark-300/50" ref={howItWorksRef}>
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-36-bold text-light-200">How It Works</h2>
            <p className="text-18-regular text-dark-700 max-w-2xl mx-auto">
              Get started with CarePulse in just a few simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            animate={isHowItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Step 1 */}
            <motion.div 
              className="relative text-center"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="mx-auto w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-32-bold text-white">1</span>
              </motion.div>
              <h3 className="text-20-bold text-light-200 mb-3">Register</h3>
              <p className="text-14-regular text-dark-700">
                Create your account with basic information in under 2 minutes
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="relative text-center"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div 
                className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-32-bold text-white">2</span>
              </motion.div>
              <h3 className="text-20-bold text-light-200 mb-3">Book Appointment</h3>
              <p className="text-14-regular text-dark-700">
                Choose your preferred doctor and select a convenient time slot
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="relative text-center"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="mx-auto w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-32-bold text-white">3</span>
              </motion.div>
              <h3 className="text-20-bold text-light-200 mb-3">Get Confirmation</h3>
              <p className="text-14-regular text-dark-700">
                Receive instant SMS confirmation with appointment details
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              className="relative text-center"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div 
                className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-32-bold text-white">4</span>
              </motion.div>
              <h3 className="text-20-bold text-light-200 mb-3">Visit Doctor</h3>
              <p className="text-14-regular text-dark-700">
                Attend your appointment and receive quality healthcare
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-8" ref={testimonialsRef}>
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-36-bold text-light-200">What Our Patients Say</h2>
            <p className="text-18-regular text-dark-700 max-w-2xl mx-auto">
              Trusted by thousands of patients for quality healthcare
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={isTestimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Testimonial 1 */}
            <motion.div 
              className="p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-green-500 transition-all"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-16-regular text-dark-700 mb-6">
                "CarePulse made booking appointments so easy! The SMS reminders are a lifesaver. I never miss my check-ups anymore."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-18-bold text-white">SA</span>
                </div>
                <div>
                  <p className="text-16-semibold text-light-200">Sarah Anderson</p>
                  <p className="text-14-regular text-dark-700">Regular Patient</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              className="p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-blue-500 transition-all"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-16-regular text-dark-700 mb-6">
                "The doctors are professional and caring. The entire platform is user-friendly. Highly recommend CarePulse!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-18-bold text-white">MJ</span>
                </div>
                <div>
                  <p className="text-16-semibold text-light-200">Michael Johnson</p>
                  <p className="text-14-regular text-dark-700">IT Professional</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              className="p-8 rounded-2xl bg-dark-400 border border-dark-500 hover:border-green-500 transition-all"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-16-regular text-dark-700 mb-6">
                "As a busy mom, CarePulse has been a game-changer. Quick bookings, great doctors, and excellent care for my whole family."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-18-bold text-white">EP</span>
                </div>
                <div>
                  <p className="text-16-semibold text-light-200">Emily Parker</p>
                  <p className="text-14-regular text-dark-700">Mother of Two</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-8 bg-dark-300/50" ref={faqRef}>
        <div className="mx-auto max-w-4xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-36-bold text-light-200">Frequently Asked Questions</h2>
            <p className="text-18-regular text-dark-700 max-w-2xl mx-auto">
              Find answers to common questions about CarePulse
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate={isFaqInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {[
              {
                question: "How do I book an appointment?",
                answer: "Simply register on our platform, browse available doctors, select your preferred time slot, and confirm your booking. You'll receive an instant SMS confirmation."
              },
              {
                question: "Is my medical information secure?",
                answer: "Absolutely! We use industry-standard encryption and secure storage with Appwrite. Your data is protected and complies with healthcare privacy regulations."
              },
              {
                question: "Do you accept insurance?",
                answer: "Yes, we work with most major insurance providers. Please provide your insurance information during registration, and we'll verify coverage."
              },
              {
                question: "What if I need emergency care?",
                answer: "For medical emergencies, please call 911 or visit your nearest emergency room immediately. CarePulse is designed for scheduled appointments and non-emergency care."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="rounded-xl bg-dark-400 border border-dark-500 overflow-hidden"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-dark-300 transition-colors"
                >
                  <span className="text-18-bold text-light-200">{faq.question}</span>
                  <motion.svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5">
                    <p className="text-16-regular text-dark-700">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8" ref={ctaRef}>
        <div className="mx-auto max-w-5xl">
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-blue-600 p-12 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isCtaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="absolute inset-0 bg-[url('/assets/images/appointments-bg.png')] opacity-10 mix-blend-overlay"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="relative z-10 text-center space-y-6"
              initial="hidden"
              animate={isCtaInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-36-bold text-white"
                variants={fadeInUp}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-18-regular text-white/90 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Join thousands of patients who trust CarePulse for their healthcare needs. Book your first appointment today.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link
                  href="/patient"
                  className="inline-block bg-white text-green-500 rounded-full px-8 py-4 text-16-semibold hover:bg-light-200 hover:scale-105 transition-all"
                >
                  Book Your Appointment
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-500 py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <Image
                  src="/assets/icons/logo-full.svg"
                  height={32}
                  width={160}
                  alt="CarePulse"
                  className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>
              <p className="text-14-regular text-dark-700">
                Next-generation healthcare management platform for patients and providers.
              </p>
            </div>
            
            <div>
              <h4 className="text-16-semibold text-light-200 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-14-regular text-dark-700 hover:text-green-500 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/patient" className="text-14-regular text-dark-700 hover:text-green-500 transition-colors">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setShowPasskeyModal(true)}
                    className="text-14-regular text-dark-700 hover:text-green-500 transition-colors cursor-pointer"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-16-semibold text-light-200 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-14-regular text-dark-700 hover:text-green-500 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-14-regular text-dark-700 hover:text-green-500 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-14-regular text-dark-700 hover:text-green-500 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-16-semibold text-light-200 mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-dark-400 text-dark-700 rounded-full px-3 py-1 text-12-regular">
                  Next.js
                </span>
                <span className="inline-block bg-dark-400 text-dark-700 rounded-full px-3 py-1 text-12-regular">
                  TypeScript
                </span>
                <span className="inline-block bg-dark-400 text-dark-700 rounded-full px-3 py-1 text-12-regular">
                  Tailwind
                </span>
                <span className="inline-block bg-dark-400 text-dark-700 rounded-full px-3 py-1 text-12-regular">
                  Appwrite
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-500 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-14-regular text-dark-700">
              © 2024 CarePulse. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-dark-700 hover:text-green-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-dark-700 hover:text-green-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-dark-700 hover:text-green-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
