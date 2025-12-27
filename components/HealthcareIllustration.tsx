"use client";

import { motion } from "framer-motion";

export const HealthcareIllustration = () => {
  return (
    <svg
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Main Container - Medical Dashboard */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Large Medical Card/Window */}
        <motion.rect
          x="150"
          y="150"
          width="500"
          height="500"
          rx="30"
          fill="url(#cardGradient)"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Heart Monitor Display */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <rect x="200" y="200" width="400" height="150" rx="15" fill="#0D0F10" opacity="0.6" />
          
          {/* Animated Heartbeat Line */}
          <motion.path
            d="M220 275 L280 275 L300 240 L320 310 L340 275 L400 275 L420 260 L440 290 L460 275 L580 275"
            stroke="#24AE7C"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
          
          {/* Heart Rate Text */}
          <motion.text
            x="220"
            y="235"
            fill="#24AE7C"
            fontSize="18"
            fontWeight="600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Heart Rate: 72 BPM
          </motion.text>
        </motion.g>

        {/* Medical Stats Cards */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Card 1 - Appointments */}
          <rect x="200" y="380" width="170" height="100" rx="12" fill="#24AE7C" opacity="0.2" />
          <motion.circle
            cx="240"
            cy="415"
            r="18"
            fill="#24AE7C"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M235 410 L245 420 L255 405" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="270" y="420" fill="#E8E9E9" fontSize="16" fontWeight="600">Appointments</text>
          <text x="270" y="445" fill="#ABB8C4" fontSize="24" fontWeight="bold">247</text>

          {/* Card 2 - Patients */}
          <rect x="390" y="380" width="170" height="100" rx="12" fill="#79B5EC" opacity="0.2" />
          <motion.circle
            cx="430"
            cy="415"
            r="18"
            fill="#79B5EC"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <circle cx="430" cy="410" r="6" fill="white" />
          <path d="M430 418 Q420 428 420 432 L440 432 Q440 428 430 418" fill="white" />
          <text x="460" y="420" fill="#E8E9E9" fontSize="16" fontWeight="600">Patients</text>
          <text x="460" y="445" fill="#ABB8C4" fontSize="24" fontWeight="bold">1.2k+</text>
        </motion.g>

        {/* Medical Icons Floating */}
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Pill Icon */}
          <ellipse cx="250" cy="550" rx="25" ry="12" fill="#F37877" opacity="0.8" />
          <ellipse cx="250" cy="538" rx="25" ry="12" fill="#3E1716" opacity="0.8" />
        </motion.g>

        <motion.g
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          {/* Syringe Icon */}
          <rect x="510" y="540" width="40" height="8" rx="4" fill="#79B5EC" opacity="0.8" />
          <rect x="545" y="535" width="15" height="18" rx="2" fill="#152432" opacity="0.8" />
          <circle cx="552.5" cy="544" r="3" fill="#E8E9E9" />
        </motion.g>

        {/* Medical Cross Badge */}
        <motion.g
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <circle cx="400" cy="140" r="35" fill="#24AE7C" />
          <rect x="392.5" y="125" width="15" height="30" rx="2" fill="white" />
          <rect x="385" y="132.5" width="30" height="15" rx="2" fill="white" />
        </motion.g>
      </motion.g>

      {/* Floating Particles */}
      <motion.circle
        cx="120"
        cy="250"
        r="4"
        fill="#24AE7C"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="680"
        cy="300"
        r="5"
        fill="#79B5EC"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.circle
        cx="100"
        cy="550"
        r="3"
        fill="#F37877"
        animate={{ 
          y: [0, -25, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.circle
        cx="700"
        cy="600"
        r="4"
        fill="#24AE7C"
        animate={{ 
          y: [0, -35, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1D21" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#131619" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
