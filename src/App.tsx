/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform
} from "motion/react";
import Lenis from "lenis";

// ─── SECTION 3: PORTAL VIDEO SECTION ────────────────────────────────────────
// Three lines — all same size, scroll-driven animation
const PORTAL_LINES = ["Welcome", "to the", "new age"];

// Ease-out-quad
function easeOutQuad(t: number) { return 1 - (1 - t) * (1 - t); }

function PortalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });

  // Spring physics for buttery smooth scrolling that never feels jarring.
  // Stiffness and damping can be tweaked to adjust speed/bounciness.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section = sectionRef.current;
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const vh = window.innerHeight;
          const entered = (vh - rect.top) / vh; // 0 to 1 as it enters viewport

          if (cardRef.current) {
            const raw = Math.max(0, Math.min(1, (entered - 0.45) / 0.45));
            const t = easeOutQuad(raw);
            cardRef.current.style.opacity = String(t);
            cardRef.current.style.transform =
              `translate(-50%, -50%) translateY(${(1 - t) * 26}px) scale(${0.93 + t * 0.07})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="portal-section" id="portal-section">
      {/* ── Solid dark base — blocks fixed background.mp4 from showing through ── */}
      <div className="portal-bg-block" />

      {/* ── Looping portal video ── */}
      <video
        className="portal-video"
        src="/portal.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Subtle dark vignette overlay ── */}
      <div className="portal-overlay" />

      {/* ── Top fade — blends from section 2's dark background ── */}
      <div className="portal-top-fade" />

      {/* ── "Welcome / to the / new age" — uniform size, top-left ── */}
      <div className="portal-header" aria-label="Welcome to the new age">
        {PORTAL_LINES.map((text, i) => {
          // Zero-lag direct mapping to scroll wheel, but spread over 55% of the section to keep it slow
          const start = 0.15 + i * 0.1;
          const end = start + 0.55;
          const y = useTransform(scrollYProgress, [start, end], [110, 0]);
          const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

          return (
            <motion.span
              key={text}
              className="portal-header-word"
              style={{ y, opacity }}
            >
              {text}
            </motion.span>
          );
        })}
      </div>

      {/* ── Tracking container for perfect 16:9 object-fit: cover anchoring ── */}
      <div className="tracking-container">
        {/* ── Portal circle container (anchors the Teleport button) ── */}
        <div className="portal-circle">
          {/* ── Glassmorphic "Teleport" card — on the circular portal animation ── */}
          <a
            ref={cardRef}
            href="https://attendtrack-6icy.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="portal-card"
            id="portal-teleport-card"
            aria-label="Open AttendTrack portal"
            style={{ willChange: "opacity, transform" }}
          >
            <span className="portal-card-text">Teleport</span>
          </a>
        </div>
      </div>
    </div>
  );
}

interface FeatureBlock {
  id: number;
  title: string;
  intro: string;
  points: string[];
  imageId: string;
  isStrong?: boolean;
}

const features: FeatureBlock[] = [
  {
    id: 1,
    title: "Unified Triple-Role Ecosystem",
    intro: "Attend Track is built on a seamless role-based architecture that serves as a unified platform for the entire institution:",
    points: [
      "Students: Monitor attendance, view schedules, and submit leave requests.",
      "Lecturers: Manage attendance, publish notices, and review requests.",
      "Administrators: Oversee users, course assignments, and system operations.",
    ],
    imageId: "1WZDWogGpCevDZpY48Vrdzb04cWQ8lALR",
    isStrong: false,
  },
  {
    id: 2,
    title: "Interactive Digital Attendance Grid",
    intro: "A fast and responsive attendance management interface replaces traditional paper registers:",
    points: [
      "Quick Recording: Lecturers can record, edit, and review attendance in seconds.",
      "Visual Statuses: Intuitive indicators for Present, Absent, Late, and Excused.",
      "Live Updates: Automatically calculates overall attendance statistics.",
    ],
    imageId: "11ielrguD2XUL-NF3hrTFupQGjn_RCy-X",
    isStrong: true,
  },
  {
    id: 3,
    title: "Dynamic Leave & Absence Management",
    intro: "Digitally coordinate and streamline the leave submission and approval process:",
    points: [
      "Easy Submission: Students submit leave requests with supporting documents.",
      "Instant Alerts: Lecturers and admins receive real-time notifications.",
      "Smooth Review: Easily verify class schedules to approve or reject applications.",
    ],
    imageId: "1n130pjAPsoeAMYDFmljg_ssf7WfUZcFT",
    isStrong: false,
  },
  {
    id: 4,
    title: "Live Schedule & Timetable Coordination",
    intro: "An intelligent timetable system keeps students and lecturers synchronized with real-time schedules:",
    points: [
      "Dynamic Adaptability: Timetables automatically adjust based on enrolled courses.",
      "Perfect Sync: Keeps all campus members aligned on upcoming lectures.",
      "Clear Access: Clean, accessible schedules on any device, anywhere.",
    ],
    imageId: "1kIEYiemM890ZogdBrdbiQEKe-vJKOVnn",
    isStrong: true,
  },
  {
    id: 5,
    title: "Automated System-Wide Announcements",
    intro: "A centralized announcement system enables instant broadcasting of important campus updates:",
    points: [
      "Immediate Delivery: Broadcast changes directly to target user dashboards.",
      "Critical Topics: Instantly share class cancellations, venue shifts, or exam alerts.",
      "Reliable Reach: Ensure all institutional notices are prominently visible.",
    ],
    imageId: "1EynYQVO-W_BgzAXrlbGEzsOK29dEZtar",
    isStrong: false,
  },
  {
    id: 6,
    title: "Bulk Data Import & Administrative Controls",
    intro: "Comprehensive tools designed to maximize administrative efficiency and system oversight:",
    points: [
      "Rapid Onboarding: Import students, lecturers, courses, and timetables via CSV/Excel.",
      "Complete Records: Efficiently create, edit, and manage institutional records.",
      "System Integrity: Secure, centralized control over roles and course mappings.",
    ],
    imageId: "1dbAcU35TUfPRDDhWcBLq5gVVAgN-MIxB",
    isStrong: true,
  },
  {
    id: 7,
    title: "Immersive Futuristic Visual Design",
    intro: "Attend Track delivers a sleek, modern workspace inspired by premium glassmorphism:",
    points: [
      "Modern Aesthetics: Eye-safe dark themes paired with rich glassmorphism accents.",
      "Polished Usability: Smooth animations and elegant typography for effortless navigation.",
      "Professional Workspace: Tailored interface details designed to elevate everyday productivity.",
    ],
    imageId: "1jP_qpmBDAHRWJkgGs0WAd-aYfllPkuxc",
    isStrong: false,
  },
];

// Stagger reduced: 0.05s per child instead of 0.1s
const textContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

// Durations halved: 0.3s fast reveal
const textItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
};

const FeatureBlockCard: React.FC<{ feature: FeatureBlock; idx: number }> = ({ feature, idx }) => {
  const isEven = idx % 2 === 1;
  const glassClass = feature.isStrong ? "liquid-glass-strong" : "liquid-glass";
  const imageUrl = `https://lh3.googleusercontent.com/d/${feature.imageId}`;

  // ── NO per-card useScroll/useSpring/useTransform ──────────────────────────
  // Those 7×2 springs were the primary lag source. We use a single
  // whileInView trigger with GPU-only opacity + translateY instead.

  return (
    <motion.section
      id={`feature-block-${feature.id}`}
      className={`${glassClass} w-full flex flex-col md:flex-row items-center gap-8 lg:gap-16 p-6 sm:p-8 md:p-12`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      // once:true stops re-triggering on scroll-back, saving intersection recalcs
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      // CSS hover — zero JS overhead, composited on GPU
      style={{ cursor: "default" }}
    >
      <div
        id={`media-container-${feature.id}`}
        className={`w-full md:w-[48%] flex items-center justify-center rounded-2xl overflow-hidden ${isEven ? "md:order-2" : "md:order-1"}`}
        style={{ transition: "transform 0.3s ease", transformOrigin: "center" }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.012)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img
          id={`feature-image-${feature.id}`}
          src={imageUrl}
          alt={feature.title}
          referrerPolicy="no-referrer"
          className="w-full h-auto max-h-[300px] sm:max-h-[340px] md:max-h-[380px] lg:max-h-[440px] object-contain rounded-xl select-none"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";
          }}
        />
      </div>

      <motion.div
        id={`content-container-${feature.id}`}
        className={`w-full md:w-[52%] flex flex-col justify-center text-left ${isEven ? "md:order-1" : "md:order-2"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={textContainerVariants}
      >
        <motion.h2
          id={`title-${feature.id}`}
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
          variants={textItemVariants}
        >
          {feature.title}
        </motion.h2>
        <motion.p
          id={`intro-${feature.id}`}
          className="text-[#EAEAEA] text-sm sm:text-base md:text-lg leading-relaxed font-normal opacity-90 mb-4"
          variants={textItemVariants}
        >
          {feature.intro}
        </motion.p>
        <motion.ul
          id={`points-list-${feature.id}`}
          className="space-y-3"
          variants={textContainerVariants}
        >
          {feature.points.map((point, pIdx) => {
            const colonIndex = point.indexOf(":");
            if (colonIndex !== -1) {
              const label = point.substring(0, colonIndex);
              const text = point.substring(colonIndex + 1);
              return (
                <motion.li
                  key={pIdx}
                  id={`point-${feature.id}-${pIdx}`}
                  className="text-sm sm:text-base text-white/80 flex items-start gap-2 leading-relaxed"
                  variants={textItemVariants}
                >
                  <span className="text-white/40 mt-1.5 shrink-0 select-none">•</span>
                  <span>
                    <strong className="text-white font-medium">{label}:</strong>
                    {text}
                  </span>
                </motion.li>
              );
            }
            return (
              <motion.li
                key={pIdx}
                id={`point-${feature.id}-${pIdx}`}
                className="text-sm sm:text-base text-white/80 flex items-start gap-2 leading-relaxed"
                variants={textItemVariants}
              >
                <span className="text-white/40 mt-1.5 shrink-0 select-none">•</span>
                <span>{point}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.div>
    </motion.section>
  );
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 164;
// How many extra viewport-heights of scroll space the animation occupies.
// e.g. 500 means the body gets 500vh of scroll space just for the animation.
// After scrolling past this, Section 2 appears.
const ANIMATION_SCROLL_VH = 500;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // scrollSpacerRef marks the end of the animation zone
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [framesReady, setFramesReady] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ─── LENIS SMOOTH SCROLLING ──────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Run a temporary loop just for Lenis until startTick takes over
    let tempRafId: number;
    function tempRaf(time: number) {
      if (!isLoadedRef.current) {
        lenis.raf(time);
        tempRafId = requestAnimationFrame(tempRaf);
      }
    }
    tempRafId = requestAnimationFrame(tempRaf);

    return () => {
      cancelAnimationFrame(tempRafId);
      lenis.destroy();
    };
  }, []);

  const currentProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isLoadedRef = useRef(false);
  const lastScrollYRef = useRef(-1);

  // ─── DRAW FRAME ──────────────────────────────────────────────────────────────
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clamped = Math.min(1, Math.max(0, progress));
    const frameIdx = Math.floor(clamped * (TOTAL_FRAMES - 1));
    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // DPR capped at 1 — no retina scaling on canvas.
    // Halves canvas pixel count = 2× faster drawImage on hi-DPI screens.
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const x = cw / 2 - (img.naturalWidth / 2) * scale;
    const y = ch / 2 - (img.naturalHeight / 2) * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, []);

  const drawLoadingScreen = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    // Draw first frame if available so the laptop animation is visible from the start.
    // Only fall back to a minimal dark background if no frames have loaded yet.
    const firstFrame = imagesRef.current[0];
    if (firstFrame && firstFrame.complete && firstFrame.naturalWidth > 0) {
      const scale = Math.max(cw / firstFrame.naturalWidth, ch / firstFrame.naturalHeight);
      const x = cw / 2 - (firstFrame.naturalWidth / 2) * scale;
      const y = ch / 2 - (firstFrame.naturalHeight / 2) * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(firstFrame, x, y, firstFrame.naturalWidth * scale, firstFrame.naturalHeight * scale);
    } else {
      // Very first moments before any frame loads — transparent so page bg shows
      ctx.clearRect(0, 0, cw, ch);
    }

    // Thin progress bar at the bottom — unobtrusive
    if (progress < 1) {
      const barH = 2;
      const by = ch - barH;
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(0, by, cw, barH);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(0, by, cw * progress, barH);
    }
  }, []);

  // ─── CANVAS RESIZE ───────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Cap DPR at 1 — no retina overdraw. The image quality loss is imperceptible
    // but the GPU savings are massive (4× fewer pixels on Retina screens).
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    // No DPR transform needed when DPR=1
    if (isLoadedRef.current) {
      drawFrame(currentProgressRef.current);
    } else {
      drawLoadingScreen(0); // Only called initially on mount, progress handled in preload
    }
  }, [drawFrame, drawLoadingScreen]);

  // ─── INIT CANVAS ─────────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ─── FRAME PRELOADING — img.decode() ensures GPU-ready frames ────────────────
  useEffect(() => {
    let loaded = 0;

    const onFrameReady = (img: HTMLImageElement, idx: number) => {
      imagesRef.current[idx] = img;
      loaded++;
      const p = loaded / TOTAL_FRAMES;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
      drawLoadingScreen(p);
      if (loaded === TOTAL_FRAMES) {
        isLoadedRef.current = true;
        setFramesReady(true);
        drawFrame(currentProgressRef.current);
        startTick();
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(5, "0");
      img.src = `/frames/frames${num}.jpg`;
      const idx = i - 1;
      img.onload = () => {
        if (typeof img.decode === "function") {
          img.decode().then(() => onFrameReady(img, idx)).catch(() => onFrameReady(img, idx));
        } else {
          onFrameReady(img, idx);
        }
      };
      img.onerror = () => { loaded++; if (loaded === TOTAL_FRAMES) { isLoadedRef.current = true; setFramesReady(true); startTick(); } };
    }
  }, [drawFrame, drawLoadingScreen]);

  const canvasVisibleRef = useRef(true);

  // ─── TEXT OVERLAY — scroll-driven via direct DOM mutation ────────────────────
  const updateTextOverlay = useCallback((p: number) => {
    const overlay = textOverlayRef.current;
    if (!overlay) return;
    const line1 = overlay.children[0] as HTMLElement | undefined;
    const line2 = overlay.children[1] as HTMLElement | undefined;
    if (!line1 || !line2) return;
    // Lines fade out over the first 30% of scroll progress.
    // Line 2 lags 4% behind line 1 for a staggered cinematic exit.
    line1.style.opacity = `${Math.max(0, 1 - p / 0.30)}`;
    line1.style.transform = `translateY(${-p * 110}px)`;
    const p2 = Math.max(0, p - 0.04);
    line2.style.opacity = `${Math.max(0, 1 - p2 / 0.30)}`;
    line2.style.transform = `translateY(${-p2 * 110}px)`;
  }, []);

  // ─── SCROLL HANDLER — DIRECT frame draw, no lerp ─────────────────────────────
  const handleScroll = useCallback(() => {
    const spacer = scrollSpacerRef.current;
    if (!spacer) return;
    const spacerBottom = spacer.getBoundingClientRect().bottom + window.scrollY;
    const animationZoneEnd = spacerBottom - window.innerHeight;
    const scrollY = window.scrollY;
    const p = animationZoneEnd > 0 ? Math.min(1, Math.max(0, scrollY / animationZoneEnd)) : 0;

    currentProgressRef.current = p;

    // Immediate direct draw — no lerp lag, perfectly tracks scroll position.
    // img.decode() during preload ensures drawImage is a ~0.1ms GPU blit.
    if (isLoadedRef.current && canvasVisibleRef.current) {
      drawFrame(p);
    }

    updateTextOverlay(p);

    const pastAnimation = scrollY >= animationZoneEnd;
    if (canvasVisibleRef.current === pastAnimation) {
      canvasVisibleRef.current = !pastAnimation;
      setCanvasVisible(!pastAnimation);
    }
  }, [drawFrame, updateTextOverlay]);

  // ─── RAF TICK — drives both fade-in and scroll tracking ──────────────────────
  const startTick = useCallback(() => {
    const tick = (time: number) => {
      // 1. Initial fade-in overlay
      if (canvasVisibleRef.current && fadeOpacityRef.current < 1) {
        fadeOpacityRef.current += 0.05;
        if (fadeOpacityRef.current > 1) fadeOpacityRef.current = 1;
        
        // Redraw the underlying frame so the overlay doesn't compound into solid black
        drawFrame(currentProgressRef.current);
        
        if (fadeOpacityRef.current < 1) {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.save();
              ctx.globalAlpha = 1 - fadeOpacityRef.current;
              ctx.fillStyle = "#050508";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.restore();
            }
          }
        }
      }
      
      // Sync Lenis before reading scrollY to guarantee 100% sync
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      
      // 2. High-performance scroll tracking (runs on compositor frame)
      const currentScrollY = window.scrollY;
      if (currentScrollY !== lastScrollYRef.current) {
        lastScrollYRef.current = currentScrollY;
        handleScroll();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    
    // Initial call
    handleScroll();
    rafRef.current = requestAnimationFrame(tick);
  }, [handleScroll]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full text-white selection:bg-white/20 selection:text-white overflow-x-hidden antialiased"
    >
      {/* ── FIXED CANVAS — covers viewport during animation ───────────────────
          position: fixed, full-viewport, z-index 20.
          Hidden via pointer-events + opacity once past animation zone.
          This matches the original app.js approach exactly.
      ─────────────────────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          display: "block",
          zIndex: 20,
          pointerEvents: "none",
          opacity: canvasVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* ── SECTION 1 TEXT: "Stay Present / Stay Ahead" ──────────────────────
          Fixed, centered in viewport, z-index 21 (above canvas, below buttons).
          All animation is driven by updateTextOverlay() via direct DOM mutation
          in handleScroll — zero React re-renders, runs at native scroll speed.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          zIndex: 21,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: canvasVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <div
          ref={textOverlayRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.08em",
            marginTop: "-10vh",
          }}
        >
          {/* Line 1 — driven by direct DOM in updateTextOverlay */}
          <div
            style={{
              willChange: "transform, opacity",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#ffffff",
              textShadow: "0 2px 48px rgba(0,0,0,0.7), 0 0 80px rgba(255,255,255,0.06)",
              userSelect: "none",
            }}
          >
            Stay Present
          </div>

          {/* Line 2 — lags 4% behind line 1 for staggered cinematic exit */}
          <div
            style={{
              willChange: "transform, opacity",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "rgba(255,255,255,0.55)",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
              userSelect: "none",
            }}
          >
            Stay Ahead.
          </div>
        </div>
      </div>

      {/* ── SECTION 1 NAV BUTTONS — GitHub & Live ────────────────────────────
          Fixed top-right, sit above the canvas (z-index 25).
          Fade in/out with the canvas so they disappear when Section 2 appears.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "28px",
          zIndex: 25,
          display: "flex",
          gap: "12px",
          alignItems: "center",
          opacity: canvasVisible ? 1 : 0,
          pointerEvents: canvasVisible ? "auto" : "none",
          transition: "opacity 0.6s ease",
        }}
      >
        {/* GitHub Button */}
        <a
          href="https://github.com/Steveroger77/Attendtrack-website"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-glass-btn"
        >
          {/* GitHub SVG icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>

        {/* Live Button */}
        <a
          href="https://attendtrack-6icy.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-glass-btn"
        >
          Live
        </a>
      </div>

      {/* ── LOADING PROGRESS BAR (top of screen, non-blocking) ───────────────── */}
      <AnimatePresence>
        {!framesReady && (
          <motion.div
            key="prog"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              height: "2px",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <motion.div
              ref={progressBarRef}
              style={{
                height: "100%",
                background: "rgba(255,255,255,0.8)",
                transform: "scaleX(0)",
                transformOrigin: "left",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECTION 1 SCROLL SPACE ────────────────────────────────────────────
          This div creates the scroll room for the animation.
          ANIMATION_SCROLL_VH of height = that many vh of scrolling before
          Section 2 appears. The canvas is fixed so it doesn't actually move —
          only the scroll position changes, which drives the frame selection.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        ref={scrollSpacerRef}
        style={{ height: `${ANIMATION_SCROLL_VH}vh` }}
        aria-hidden="true"
      />

      {/* ── FIXED BACKGROUND VIDEO — behind canvas ────────────────────────────
          z-index 1. Shown only during Section 2 (behind the glass cards).
      ─────────────────────────────────────────────────────────────────────── */}
      <video
        id="background-video"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          objectFit: "cover",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── SECTION 2: FEATURE CARDS ─────────────────────────────────────────
          Immediately follows the scroll spacer.
          Transparent background → fixed video shows through the glass cards.
          z-index 10 (above video, below canvas while canvas is visible).
      ─────────────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, background: "transparent" }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-24 md:py-32 flex flex-col gap-12 sm:gap-16 md:gap-24">

          {/* ── SECTION HEADER CARD ─────────────────────────────────────────── */}
          <div
            className="liquid-glass w-full text-center"
            style={{ padding: "40px 48px 36px" }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "14px",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              What we offer
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 700,
                fontFamily: "var(--font-display, sans-serif)",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              AttendTrack Features
            </h2>
            <p
              style={{
                marginTop: "16px",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.55)",
                maxWidth: "520px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.65,
              }}
            >
              Everything your institution needs to manage attendance, schedules, and communication — in one unified platform.
            </p>
          </div>

          {features.map((feature, idx) => (
            <FeatureBlockCard key={feature.id} feature={feature} idx={idx} />
          ))}
        </main>
      </div>

      {/* ── SECTION 3: PORTAL VIDEO ─────────────────────────────────────────
          background: '#050508' on the wrapper ensures the fixed background.mp4
          (z-index 1) can NEVER bleed through this section.
      ─────────────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 30, background: "transparent" }}>
        <PortalSection />
      </div>
    </div>
  );
}
