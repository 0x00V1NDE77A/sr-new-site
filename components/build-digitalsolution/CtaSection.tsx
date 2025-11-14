"use client";

import { ArrowRight } from "lucide-react";

export default function DigitalSolutionsCta() {
  return (
    <section className="w-full py-12">
      <div className="relative overflow-hidden rounded-2xl bg-white p-12 text-black md:p-16 animate-[fadeInUp_0.6s_ease-out_1]">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Build with SR Holding
          </h2>
          <p className="mb-8 text-lg text-black/70 md:text-xl">
            Tell us about your goals. We'll propose an approach, a roadmap, and the team to make it happen.
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-black/90 hover:shadow-2xl hover:scale-105"
          >
            Start a project
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
