"use client";

import { motion } from "framer-motion";

export const HealthcareIllustrationAlt = () => {
  return (
    <svg
      viewBox="0 0 900 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Modern healthcare scene illustration"
    >
      {/* Background soft blobs */}
      <defs>
        <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D2A1F" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#152432" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="shieldG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#24AE7C" />
          <stop offset="100%" stopColor="#79B5EC" />
        </linearGradient>
      </defs>

      <motion.ellipse
        cx="250"
        cy="120"
        rx="220"
        ry="120"
        fill="url(#bgG)"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.ellipse
        cx="700"
        cy="180"
        rx="260"
        ry="140"
        fill="url(#bgG)"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      />

      {/* Isometric ground */}
      <motion.rect
        x="150"
        y="330"
        width="600"
        height="180"
        rx="24"
        fill="#1A1D21"
        stroke="#363A3D"
        strokeWidth="2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      />

      {/* Hospital building */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <rect x="220" y="240" width="240" height="180" rx="12" fill="#131619" stroke="#363A3D" />
        <rect x="255" y="275" width="55" height="40" rx="6" fill="#152432" stroke="#363A3D" />
        <rect x="335" y="275" width="55" height="40" rx="6" fill="#152432" stroke="#363A3D" />
        <rect x="255" y="330" width="55" height="40" rx="6" fill="#152432" stroke="#363A3D" />
        <rect x="335" y="330" width="55" height="40" rx="6" fill="#152432" stroke="#363A3D" />
        <rect x="300" y="360" width="80" height="60" rx="8" fill="#0D0F10" stroke="#363A3D" />
        {/* Hospital cross sign */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <circle cx="340" cy="255" r="14" fill="#24AE7C" />
          <rect x="338" y="247" width="4" height="16" rx="2" fill="#fff" />
          <rect x="332" y="253" width="16" height="4" rx="2" fill="#fff" />
        </motion.g>
      </motion.g>

      {/* Ambulance */}
      <motion.g
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        <rect x="500" y="360" width="160" height="70" rx="10" fill="#E8E9E9" />
        <rect x="500" y="385" width="160" height="45" rx="10" fill="#ABB8C4" />
        <rect x="515" y="370" width="45" height="25" rx="4" fill="#79B5EC" />
        <rect x="570" y="375" width="35" height="20" rx="4" fill="#152432" />
        {/* Red cross */}
        <rect x="615" y="370" width="22" height="8" rx="2" fill="#F24E43" />
        <rect x="622" y="363" width="8" height="22" rx="2" fill="#F24E43" />
        {/* Wheels */}
        <motion.circle cx="540" cy="434" r="12" fill="#1A1D21" animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
        <motion.circle cx="620" cy="434" r="12" fill="#1A1D21" animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      </motion.g>

      {/* Secure shield */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        <path
          d="M705 255c20 8 35 8 55 0 4 60-20 98-55 118-35-20-59-58-55-118 20 8 35 8 55 0z"
          fill="url(#shieldG)"
          opacity="0.9"
        />
        <rect x="725" y="275" width="10" height="30" rx="2" fill="#fff" />
        <rect x="715" y="288" width="30" height="10" rx="2" fill="#fff" />
      </motion.g>

      {/* Calendar */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <rect x="170" y="185" width="120" height="90" rx="10" fill="#0D0F10" stroke="#363A3D" />
        <rect x="170" y="185" width="120" height="25" rx="10" fill="#24AE7C" opacity="0.8" />
        <circle cx="195" cy="215" r="5" fill="#79B5EC" />
        <circle cx="220" cy="215" r="5" fill="#79B5EC" />
        <rect x="195" y="235" width="70" height="8" rx="4" fill="#ABB8C4" />
        <rect x="195" y="253" width="50" height="8" rx="4" fill="#363A3D" />
      </motion.g>

      {/* Animated route line */}
      <motion.path
        d="M210 480 C 300 450, 420 500, 520 470"
        stroke="#24AE7C"
        strokeWidth="3"
        strokeDasharray="6 8"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 0.8 }}
        opacity="0.7"
      />

      {/* Floating icons */}
      <motion.g animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <circle cx="265" cy="165" r="6" fill="#24AE7C" />
      </motion.g>
      <motion.g animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}>
        <circle cx="735" cy="210" r="5" fill="#79B5EC" />
      </motion.g>
      <motion.g animate={{ y: [0, -14, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}>
        <circle cx="640" cy="145" r="4" fill="#F37877" />
      </motion.g>
    </svg>
  );
};
