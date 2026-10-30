/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform
} from "motion/react";
import Lenis from "lenis";

// ─── SECTION 3: PORTAL VIDEO SECTION ────────────────────────────────────────
const PORTAL_LINES = ["Welcome", "to the", "new age"];

const PortalHeaderWord: React.FC<{
  text: string;
  index: number;
  progress: any;
}> = ({ text, index, progress }) => {
  const start = 0.15 + index * 0.1;
  const end = start + 0.55;
  const y = useTransform(progress, [start, end], [110, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span className="portal-header-word" style={{ y, opacity }}>
      {text}
    </motion.span>
  );
}

function PortalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const cardProgress = useTransform(scrollYProgress, [0.45, 0.9], [0, 1]);
  const cardOpacity = useTransform(cardProgress, [0, 1], [0, 1]);
  const cardScale = useTransform(cardProgress, [0, 1], [0.93, 1]);
  const cardY = useTransform(cardProgress, [0, 1], [26, 0]);

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
        preload="auto"
      />

      {/* ── Subtle dark vignette overlay ── */}
      <div className="portal-overlay" />

      {/* ── Top fade — blends from section 2's dark background ── */}
      <div className="portal-top-fade" />

      {/* ── "Welcome / to the / new age" — uniform size, top-left ── */}
      <div className="portal-header" aria-label="Welcome to the new age">
        {PORTAL_LINES.map((text, i) => (
          <PortalHeaderWord
            key={text}
            text={text}
            index={i}
            progress={scrollYProgress}
          />
        ))}
      </div>

      {/* ── Tracking container for perfect 16:9 object-fit: cover anchoring ── */}
      <div className="tracking-container">
        {/* ── Portal circle container (anchors the Teleport button) ── */}
        <div className="portal-circle">
          {/* ── Glassmorphic "Teleport" card — on the circular portal animation ── */}
          <motion.a
            href="https://attendtrack-6icy.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="portal-card"
            id="portal-teleport-card"
            aria-label="Open AttendTrack portal"
            style={{
              opacity: cardOpacity,
              scale: cardScale,
              y: cardY,
              willChange: "opacity, transform",
            }}
          >
            <span className="portal-card-text">Teleport</span>
          </motion.a>
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

  return (
    <motion.section
      id={`feature-block-${feature.id}`}
      className={`${glassClass} w-full flex flex-col md:flex-row items-center gap-8 lg:gap-16 p-6 sm:p-8 md:p-12`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{ cursor: "default" }}
    >
      <div
        id={`media-container-${feature.id}`}
        className={`w-full md:w-[48%] flex items-center justify-center rounded-2xl overflow-hidden ${isEven ? "md:order-2" : "md:order-1"}`}
        style={{ transition: "transform 0.3s ease", transformOrigin: "center" }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.012)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <picture className="w-full flex items-center justify-center">
          <source srcSet={`/features/feature-${feature.id}.webp`} type="image/webp" />
          <img
            id={`feature-image-${feature.id}`}
            src={`/features/feature-${feature.id}.png`}
            alt={feature.title}
            className="w-full h-auto max-h-[300px] sm:max-h-[340px] md:max-h-[380px] lg:max-h-[440px] object-contain rounded-xl select-none"
            loading="lazy"
            decoding="async"
          />
        </picture>
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
};

// ─── CONFIG ─────────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 164;
// Extra viewport-heights of scroll space for the frame animation.
const ANIMATION_SCROLL_VH = 500;

// Instant synchronous WebP detection
const SUPPORTS_WEBP = (() => {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return c.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  } catch {
    return false;
  }
})();

function getFrameSrc(frameIdx: number) {
  const num = String(frameIdx + 1).padStart(5, "0");
  const ext = SUPPORTS_WEBP ? "webp" : "jpg";
  return `/frames/frames${num}.${ext}`;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [framesReady, setFramesReady] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isLoadedRef = useRef(false);
  const animationZoneEndRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  // ─── DRAW FRAME (WITH CLOSEST LOADED FRAME FALLBACK) ────────────────────────
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clamped = Math.min(1, Math.max(0, progress));
    const targetIdx = Math.floor(clamped * (TOTAL_FRAMES - 1));

    // Try exact target frame, or find nearest available loaded frame
    let img = imagesRef.current[targetIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = targetIdx - offset;
        if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev]!.naturalWidth > 0) {
          img = imagesRef.current[prev];
          break;
        }
        const next = targetIdx + offset;
        if (next < TOTAL_FRAMES && imagesRef.current[next]?.complete && imagesRef.current[next]!.naturalWidth > 0) {
          img = imagesRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

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

    const firstFrame = imagesRef.current[0];
    if (firstFrame && firstFrame.complete && firstFrame.naturalWidth > 0) {
      const scale = Math.max(cw / firstFrame.naturalWidth, ch / firstFrame.naturalHeight);
      const x = cw / 2 - (firstFrame.naturalWidth / 2) * scale;
      const y = ch / 2 - (firstFrame.naturalHeight / 2) * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(firstFrame, x, y, firstFrame.naturalWidth * scale, firstFrame.naturalHeight * scale);
    } else {
      ctx.clearRect(0, 0, cw, ch);
    }

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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cache animation zone end based on viewport height — eliminates layout thrashing!
    animationZoneEndRef.current = (window.innerHeight * ANIMATION_SCROLL_VH) / 100 - window.innerHeight;

    if (lenisRef.current) {
      lenisRef.current.resize();
    }

    if (isLoadedRef.current) {
      drawFrame(currentProgressRef.current);
    } else {
      drawLoadingScreen(0);
    }
  }, [drawFrame, drawLoadingScreen]);

  // ─── INIT CANVAS ─────────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const canvasVisibleRef = useRef(true);

  // ─── TEXT OVERLAY — scroll-driven via direct DOM mutation ────────────────────
  const updateTextOverlay = useCallback((p: number) => {
    const overlay = textOverlayRef.current;
    if (!overlay) return;
    const line1 = overlay.children[0] as HTMLElement | undefined;
    const line2 = overlay.children[1] as HTMLElement | undefined;
    if (!line1 || !line2) return;

    line1.style.opacity = `${Math.max(0, 1 - p / 0.30)}`;
    line1.style.transform = `translateY(${-p * 110}px)`;
    const p2 = Math.max(0, p - 0.04);
    line2.style.opacity = `${Math.max(0, 1 - p2 / 0.30)}`;
    line2.style.transform = `translateY(${-p2 * 110}px)`;
  }, []);

  // ─── SCROLL HANDLER — ZERO LAYOUT REFLOW, DIRECT MATH ────────────────────────
  const handleScroll = useCallback((scrollPos?: number) => {
    const scrollY = typeof scrollPos === "number" ? scrollPos : window.scrollY;
    const animationZoneEnd = animationZoneEndRef.current || ((window.innerHeight * ANIMATION_SCROLL_VH) / 100 - window.innerHeight);
    const p = animationZoneEnd > 0 ? Math.min(1, Math.max(0, scrollY / animationZoneEnd)) : 0;

    currentProgressRef.current = p;

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

  // ─── LENIS BUTTERY SMOOTH SCROLLING ──────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    lenis.on("scroll", (e: { scroll: number }) => {
      handleScroll(e.scroll);
    });

    const onNativeScroll = () => {
      handleScroll();
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onNativeScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [handleScroll]);

  // ─── RAF TICK — drives initial fade-in overlay ───────────────────────────────
  const startTick = useCallback(() => {
    const tick = () => {
      if (canvasVisibleRef.current && fadeOpacityRef.current < 1) {
        fadeOpacityRef.current += 0.05;
        if (fadeOpacityRef.current > 1) fadeOpacityRef.current = 1;

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
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    handleScroll();
    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame, handleScroll]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─── PROGRESSIVE TIERED PRELOADING (FASTEST STARTUP & SMOOTHEST PLAYBACK) ─────
  useEffect(() => {
    let loadedCount = 0;
    const total = TOTAL_FRAMES;

    const onFrameReady = (img: HTMLImageElement, idx: number) => {
      imagesRef.current[idx] = img;
      loadedCount++;
      const p = loadedCount / total;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }

      // Unblock and show site immediately as soon as frame 0 is ready
      if (idx === 0 && !isLoadedRef.current) {
        isLoadedRef.current = true;
        setFramesReady(true);
        drawFrame(currentProgressRef.current);
        startTick();
      }

      if (!isLoadedRef.current) {
        drawLoadingScreen(p);
      }

      // If this newly loaded frame is right where the user is looking, redraw immediately
      const currentTarget = Math.floor(currentProgressRef.current * (total - 1));
      if (Math.abs(idx - currentTarget) <= 2 && isLoadedRef.current && canvasVisibleRef.current) {
        drawFrame(currentProgressRef.current);
      }
    };

    // 1. Immediately prioritize and load the very first frame
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    firstImg.onload = () => {
      onFrameReady(firstImg, 0);
      startTieredLoading();
    };
    firstImg.onerror = () => {
      loadedCount++;
      if (!isLoadedRef.current) {
        isLoadedRef.current = true;
        setFramesReady(true);
        startTick();
      }
      startTieredLoading();
    };

    function startTieredLoading() {
      // Build prioritized queue:
      // Tier 1: Keyframe anchors every 8 frames (instant full range coverage in ~200ms)
      // Tier 2: Midpoints every 4 frames
      // Tier 3: All remaining frames in sequence
      const queued = new Set<number>([0]);
      const queue: number[] = [];

      // Tier 1: Keyframes
      for (let i = 0; i < total; i += 8) {
        if (!queued.has(i)) {
          queued.add(i);
          queue.push(i);
        }
      }
      if (!queued.has(total - 1)) {
        queued.add(total - 1);
        queue.push(total - 1);
      }

      // Tier 2: Midpoints
      for (let i = 4; i < total; i += 8) {
        if (!queued.has(i)) {
          queued.add(i);
          queue.push(i);
        }
      }

      // Tier 3: Remainder
      for (let i = 1; i < total; i++) {
        if (!queued.has(i)) {
          queued.add(i);
          queue.push(i);
        }
      }

      // Concurrency-controlled loader (max 6 parallel requests)
      // Keeps browser connection pool open for videos and UI assets
      const MAX_CONCURRENT = 6;
      let activeRequests = 0;

      function pumpQueue() {
        while (activeRequests < MAX_CONCURRENT && queue.length > 0) {
          const idx = queue.shift()!;
          activeRequests++;
          const img = new Image();
          img.src = getFrameSrc(idx);
          img.onload = () => {
            activeRequests--;
            onFrameReady(img, idx);
            pumpQueue();
          };
          img.onerror = () => {
            activeRequests--;
            loadedCount++;
            pumpQueue();
          };
        }
      }

      pumpQueue();
    }
  }, [drawFrame, drawLoadingScreen, startTick]);

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full text-white selection:bg-white/20 selection:text-white overflow-x-hidden antialiased"
    >
      {/* ── FIXED CANVAS — covers viewport during animation ─────────────────── */}
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

      {/* ── SECTION 1 TEXT: "Stay Present / Stay Ahead" ────────────────────── */}
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

      {/* ── SECTION 1 NAV BUTTONS — GitHub & Live ──────────────────────────── */}
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
        <a
          href="https://github.com/Steveroger77/Attendtrack-website"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-glass-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>

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

      {/* ── SECTION 1 SCROLL SPACE ──────────────────────────────────────────── */}
      <div
        ref={scrollSpacerRef}
        style={{ height: `${ANIMATION_SCROLL_VH}vh` }}
        aria-hidden="true"
      />

      {/* ── FIXED BACKGROUND VIDEO — behind canvas ──────────────────────────── */}
      <video
        id="background-video"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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

      {/* ── SECTION 2: FEATURE CARDS ───────────────────────────────────────── */}
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

      {/* ── SECTION 3: PORTAL VIDEO ───────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 30, background: "transparent" }}>
        <PortalSection />
      </div>
    </div>
  );
}
