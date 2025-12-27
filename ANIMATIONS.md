# 🎬 CarePulse Landing Page Animations

This document outlines all the animations implemented in the CarePulse healthcare management platform.

## 📦 Dependencies

- **framer-motion**: Advanced animation library for React
- **tailwindcss-animate**: Tailwind CSS animation utilities

## 🎨 Animation Types

### 1. **Navigation Bar Animations**

#### Scroll-Based Background
- Smooth transition from transparent to solid background on scroll
- Border opacity changes based on scroll position
- Slides down from top on initial load

#### Logo & Navigation Items
- Fade in from left (logo)
- Fade in from right (navigation items)
- Hover scale effect on "Get Started" button

```typescript
<motion.nav 
  initial={{ y: -100 }}
  animate={{ 
    y: 0,
    backgroundColor: scrolled ? "rgba(13, 15, 16, 0.95)" : "rgba(13, 15, 16, 0.8)"
  }}
/>
```

### 2. **Hero Section Animations**

#### Stagger Container
All hero content appears with staggered timing (0.1s delay between children)

#### Badge Animation
- Fade up animation
- Pulsing dot indicator

#### Heading & Text
- Sequential fade-up animations
- Gradient text with background clip

#### CTA Buttons
- Fade up with delay
- Hover scale (1.05x)

#### Stats Counter
- Staggered appearance
- Individual fade-up for each stat

#### Hero Image
- Fade in from right
- Animated gradient glow background (8s loop)
- Hover effects: scale (1.02x) and rotate (1deg)

```typescript
<motion.div
  whileHover={{ scale: 1.02, rotate: 1 }}
  transition={{ duration: 0.3 }}
>
```

### 3. **Features Section Animations**

#### Section Header
- Fade in + translate Y on scroll into view
- Triggers at 20% visibility

#### Feature Cards Grid
- Stagger container (0.1s between cards)
- Scale-in animation (0.8 to 1.0)
- Hover effects:
  - Lift up (y: -5px)
  - Border color change
  - Icon scale (1.1x)
  - Glow shadow effect

```typescript
<motion.div
  variants={scaleIn}
  whileHover={{ y: -5 }}
>
```

### 4. **Doctors Section Animations**

#### Section Header
- Fade in + translate Y on scroll

#### Doctor Cards
- Grid with stagger animation
- Scale-in effect (0.8 to 1.0)
- Hover effects:
  - Lift up (y: -8px)
  - Image scale (1.1x)
  - Border glow

```typescript
<motion.div
  variants={scaleIn}
  whileHover={{ y: -8 }}
>
  <Image className="group-hover:scale-110" />
</motion.div>
```

### 5. **CTA Section Animations**

#### Container
- Scale + fade on scroll into view (0.95 to 1.0)
- Triggers at 50% visibility

#### Background Pattern
- Animated background position (20s loop)

#### Content
- Stagger container for all text elements
- Sequential fade-up animations
- Button hover: scale (1.05x)

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
/>
```

## 🎯 Animation Variants

### fadeInUp
```typescript
{
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

### fadeInLeft
```typescript
{
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
}
```

### fadeInRight
```typescript
{
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
}
```

### scaleIn
```typescript
{
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}
```

### staggerContainer
```typescript
{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

## 🎭 Tailwind CSS Animations

Custom keyframes added to `tailwind.config.ts`:

- **fade-in**: Fade + slight Y translation
- **fade-in-up**: Fade + larger Y translation  
- **slide-in-right**: Fade + X translation from right
- **slide-in-left**: Fade + X translation from left
- **scale-in**: Fade + scale transform
- **float**: Continuous up/down motion
- **glow**: Pulsing box shadow effect

## 🔧 Scroll Triggers

Using Framer Motion's `useInView` hook:

```typescript
const isFeaturesInView = useInView(featuresRef, { 
  once: true,  // Animate only once
  amount: 0.2  // Trigger at 20% visibility
});
```

## ⚡ Performance Optimizations

1. **Once animations**: Most scroll-triggered animations run only once (`once: true`)
2. **Hardware acceleration**: Using transform properties (translateX/Y, scale, rotate)
3. **Reduced motion support**: All animations respect `prefers-reduced-motion`
4. **Optimized re-renders**: Using `useRef` for scroll detection

## 🎨 Hover Effects Summary

| Element | Effect |
|---------|---------|
| Buttons | Scale 1.05x |
| Feature Cards | Lift -5px, border glow, icon scale 1.1x |
| Doctor Cards | Lift -8px, image scale 1.1x |
| Hero Image | Scale 1.02x, rotate 1deg |
| Links | Color transition |

## 🚀 Usage

The landing page is fully animated and responsive. All animations are:
- ✅ Mobile-friendly
- ✅ Performance-optimized
- ✅ Accessibility-compliant
- ✅ Browser-compatible

Visit `http://localhost:3000` to see all animations in action!
