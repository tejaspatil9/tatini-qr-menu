"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ================= PAGE ROOT ================= */

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className="min-h-screen"
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/splash-water.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay for mobile sunlight readability */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 fade-in">
        <Image
          src="/tatini-logo.png"
          alt="Tatini Logo"
          width={160}
          height={160}
          priority
          className="mx-auto mb-8"
        />

        <h1 className="text-[14px] tracking-[0.35em] uppercase mb-3 text-gray-200">
          Welcome to
        </h1>

        <h2 className="text-[42px] tracking-[0.22em] text-white glow-water">
          TATINI
        </h2>

        <p className="mt-4 text-[13px] tracking-[0.25em] uppercase text-gray-300">
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
      {/* ================= HERO ================= */}
      <section className="relative w-full px-4 pt-8">
        <div className="absolute top-6 right-6 z-20">
          <Image
            src="/tatini-logo.png"
            alt="Tatini logo"
            width={44}
            height={44}
            className="opacity-90"
          />
        </div>

        <div className="relative mx-auto max-w-md">
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />

            <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
              <div className="max-w-sm">
                <h1 className="text-[34px] tracking-[0.22em] mb-6 text-white">
                  TATINI
                </h1>

                <div className="h-px w-14 bg-[var(--tatini-gold)] mx-auto mb-6" />

                <p className="text-[14px] leading-[1.9] text-gray-200">
                  A contemporary dining experience where ambience, flavours,
                  and moments come together.
                </p>

                <div className="mt-7 flex justify-center">
                  <Link
                    href="/menu"
                    className="px-8 py-3 rounded-full bg-white/95 text-black text-sm font-medium shadow-md"
                  >
                    View Menu →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TEXT SECTIONS ================= */}
      <section className="px-6 py-24">
        <div className="max-w-md mx-auto space-y-20 text-center">
          {[
            {
              title: "Cuisine",
              text: "A thoughtfully curated menu celebrating authentic flavours.",
            },
            {
              title: "Ambience",
              text: "An elegant atmosphere designed for memorable evenings.",
            },
            {
              title: "Location",
              text: "Baner, Pune — a serene escape within the city.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="text-[20px] mb-4">
                {item.title}
              </h2>

              <div className="w-10 h-px bg-[var(--tatini-gold)] mx-auto mb-5" />

              <p className="text-[14px] leading-[1.9] text-[var(--muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= IMAGE GALLERY ================= */}
      <section className="pb-24">
        <div className="flex gap-4 overflow-x-auto px-6">
          {[
            "/gallery/food-1.jpeg",
            "/gallery/ambience-1.jpeg",
            "/gallery/food-2.jpeg",
            "/gallery/pool-1.jpeg",
          ].map((img) => (
            <div
              key={img}
              className="relative w-[260px] h-[180px] flex-shrink-0 rounded-2xl overflow-hidden"
            >
              <Image
                src={img}
                alt="Tatini Gallery"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="pb-12 text-center space-y-3">
        <p className="text-[11px] tracking-wide text-[var(--muted)]">
          Crafted with care · Tatini
        </p>

        {/* Table OS branding */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <img
            src="/tableos-icon.png"
            alt="Table OS"
            className="w-4 h-4 opacity-80"
          />
          <span>
            Powered by <span className="font-medium">Table OS</span>
          </span>
        </div>

        <a
          href="mailto:tableoswork@gmail.com"
          className="text-[11px] text-gray-400 underline"
        >
          tableoswork@gmail.com
        </a>
      </footer>
    </>
  );
}
