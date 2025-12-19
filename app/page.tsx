"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ================= PAGE ROOT ================= */

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >

      {showSplash ? <SplashScreen /> : <LandingPage />}
    </main>
  );
}

/* ================= SPLASH SCREEN ================= */

function SplashScreen() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center fade-in">

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image
            src="/tatini-logo.png"
            alt="Tatini Logo"
            width={180}
            height={180}
            className="opacity-95"
          />
        </div>

        {/* Welcome */}
        <h1
          className="text-[22px] tracking-[0.35em] mb-4 uppercase"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--text)",
          }}
        >
          Welcome to
        </h1>

        {/* Brand */}
        <h2
          className="text-[42px] font-medium tracking-[0.18em] mb-6 glow-tatini"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          TATINI
        </h2>

        {/* Subline */}
        <p
          className="text-[13px] tracking-[0.28em] uppercase"
          style={{
            fontFamily: "var(--font-inter)",
            color: "var(--muted)",
          }}
        >
          Poolside Bar and Kitchen
        </p>

      </div>
    </section>
  );
}

/* ================= LANDING PAGE ================= */

function LandingPage() {
  return (
    <>
      {/* ================= HERO (ARCH – NO FRAME) ================= */}
      <section className="relative w-full px-4 pt-8">

        {/* Floating logo */}
        <div className="absolute top-6 right-6 z-20">
          <img
            src="/tatini-logo.png"
            alt="Tatini logo"
            className="w-12 h-12 object-contain opacity-90"
          />
        </div>

        <div className="relative mx-auto max-w-md arch-reveal">

          <div
            className="relative h-[56vh] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
            style={{
              clipPath: "ellipse(92% 82% at 50% 18%)",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/tatini-hero.mp4"
              poster="/tatini-hero.jpeg"
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/40"></div>

            <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
              <div className="max-w-sm fade-in">

                <h1
                  className="text-[34px] font-medium tracking-[0.22em] mb-6 text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  TATINI
                </h1>

                <div className="h-px w-14 bg-[var(--tatini-gold)] mx-auto mb-7 divider-animate"></div>

                <p
                  className="text-[14px] leading-[1.9] text-gray-200"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  A contemporary dining experience where ambience,
                  flavours, and moments come together.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="px-6 py-24">
        <div className="max-w-md mx-auto space-y-24">

          {[
            {
              title: "Cuisine",
              img: "/images/cuisine.jpeg",
              text: "A thoughtfully curated menu celebrating authentic flavours.",
            },
            {
              title: "Ambience",
              img: "/images/ambience.jpeg",
              text: "An elegant atmosphere designed for memorable evenings.",
            },
            {
              title: "Location",
              img: "/images/location.jpeg",
              text: "Baner, Pune — a serene escape within the city.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="text-center section-reveal"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="mb-7 overflow-hidden rounded-2xl">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-[220px] object-cover"
                />
              </div>

              <h2
                className="text-[20px] font-medium mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {item.title}
              </h2>

              <div className="w-10 h-px bg-[var(--tatini-gold)] mx-auto mb-5"></div>

              <p
                className="text-[14px] leading-[1.85]"
                style={{ color: "var(--muted)" }}
              >
                {item.text}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="pb-12 text-center">
        <p className="text-[11px] tracking-wide" style={{ color: "var(--muted)" }}>
          Crafted with care · Tatini
        </p>
      </footer>
    </>
  );
}
