"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConcertDto } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type HomeHeroCarouselProps = {
  concerts: ConcertDto[];
};

const imagePositions = ["object-center", "object-[center_42%]", "object-[center_58%]"];

export function HomeHeroCarousel({ concerts }: HomeHeroCarouselProps) {
  const slides = concerts.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeConcert = slides[activeIndex];
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasMultipleSlides || !isPlaying || reducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6_000);

    return () => window.clearInterval(interval);
  }, [hasMultipleSlides, isPlaying, slides.length]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  const performer = activeConcert?.singers.map((singer) => singer.name).join(", ")
    || activeConcert?.category?.name
    || "Live Event";

  return (
    <section
      aria-label="Featured concerts"
      aria-roledescription="carousel"
      className="relative flex min-h-[35rem] items-center overflow-hidden bg-black px-5 pb-24 pt-14 text-white sm:min-h-[39rem] sm:px-10 lg:min-h-[42rem] lg:px-16"
      data-section="hero"
    >
      <Image
        alt=""
        className={cn(
          "hero-slide-image object-cover",
          imagePositions[activeIndex % imagePositions.length],
        )}
        fill
        key={activeConcert?.id ?? "empty-feature"}
        priority
        sizes="100vw"
        src="/demo-preview.jpg"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/20" />

      {hasMultipleSlides ? (
        <>
          <button
            aria-label="Show previous featured event"
            className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            onClick={showPrevious}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            aria-label="Show next featured event"
            className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            onClick={showNext}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div
        aria-live="polite"
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <div className="hero-slide-content max-w-3xl" key={activeConcert?.id ?? "empty-content"}>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-brand px-3 py-1.5 shadow-lg shadow-brand/30">
              ✦ Featured Event
            </span>
            <span className="text-white/70">
              {slides.length ? activeIndex + 1 : 0} / {slides.length}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {activeConcert?.title ?? "Upcoming concerts"}
          </h1>
          <p className="mt-2 text-xl font-semibold text-white/85 sm:text-2xl">
            {performer}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">
            {activeConcert ? (
              <>
                <span className="flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  {formatDateTime(activeConcert.startsAt)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {activeConcert.venue}
                </span>
                <span className="flex items-center gap-2">
                  <Ticket aria-hidden="true" className="h-4 w-4 text-amber-300" />
                  {activeConcert.availableStock.toLocaleString()} available
                </span>
              </>
            ) : (
              <span>New events will appear here soon.</span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {activeConcert ? (
              <Button asChild className="h-14 rounded-2xl px-8 text-base shadow-lg shadow-brand/30">
                <Link href={`/concerts/${activeConcert.id}`}>Get Tickets</Link>
              </Button>
            ) : null}
            <Button
              asChild
              className="h-14 rounded-2xl border-white/25 bg-white/10 px-7 text-base text-white backdrop-blur hover:bg-white/20"
              variant="outline"
            >
              <Link href="#events">Browse All</Link>
            </Button>
          </div>

          {hasMultipleSlides ? (
            <div className="mt-9 flex items-center gap-2" role="group" aria-label="Choose featured event">
              {slides.map((concert, index) => (
                <button
                  aria-current={activeIndex === index ? "true" : undefined}
                  aria-label={`Show featured event ${index + 1}: ${concert.title}`}
                  className="h-1 rounded-full bg-white/35 transition-all hover:bg-white/60 aria-[current=true]:w-9 aria-[current=true]:bg-brand [&:not([aria-current=true])]:w-5"
                  key={concert.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
              <button
                aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={() => setIsPlaying((playing) => !playing)}
                type="button"
              >
                {isPlaying ? (
                  <Pause aria-hidden="true" className="h-3.5 w-3.5" />
                ) : (
                  <Play aria-hidden="true" className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
