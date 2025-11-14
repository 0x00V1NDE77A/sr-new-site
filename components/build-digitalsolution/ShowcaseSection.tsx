"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

const showcases = [
  {
    title: "Contact Kiosk App",
    category: "Interactive Kiosk",
    description:
      "Touch‑friendly kiosk for capturing visitor details and form submissions with reliable offline‑first UX.",
    image: "/contact-kiosk.jpg",
    href: "https://kiosk-form-submission.vercel.app/",
  },
  {
    title: "Luna Park Website",
    category: "Marketing Website",
    description:
      "Multilingual amusement park site featuring attractions, events, ticket info, and responsive design.",
    image: "/luna.jpg",
    href: "https://luna-park.vercel.app/en",
  },
  {
    title: "Vitamin Aqua Bulgaria",
    category: "Brand Experience",
    description:
      "Interactive brand website showcasing the Vitamin Aqua product line, flavors, and nutrition details.",
    image: "/acqa.jpg",
    href: "https://www.vitaminaqua.bg/",
  },
];

export default function ShowcaseSection() {
  return (
    <section className="w-full pt-6 pb-12">
      <div className="mb-12 text-center animate-[fadeInUp_0.6s_ease-out_1]">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Our Digital Solutions
        </h2>
        <p className="mx-auto max-w-2xl text-base text-white/70">
          Explore our portfolio of innovative digital products that transform businesses and enhance user experiences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {showcases.map((showcase, index) => (
          <a
            key={index}
            href={showcase.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:shadow-xl hover:border-black/20 animate-[fadeInUp_0.6s_ease-out_1]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <Image
                src={showcase.image}
                alt={showcase.title}
                fill
                priority={index === 0}
                className={`transition-all duration-500 group-hover:scale-110 ${
                  index === 1 ? "object-contain" : "object-cover"
                }`}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-6">
              <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-black/50">
                {showcase.category}
              </span>
              <h3 className="mb-3 text-xl font-bold text-black">{showcase.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-black/70">
                {showcase.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-black transition-colors duration-300 group-hover:text-black/70">
                <span>View project</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
