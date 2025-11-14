"use client"

import React from "react"
import Image from "next/image"
import { GridPattern } from "@/components/ui/grid-pattern"

type Testimonial = {
  name: string
  role: string
  image: string
  company: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "SR Holding is built by doers. We ship fast, solve real problems, and grow people into leaders.",
    name: "Rusi Russev",
    role: "CEO - Chief Executive Officer",
    company: "SR Holding",
    image: "/images/executive-2.png",
  },
  {
    quote:
      "Operational excellence is our backbone. We scale systems, teams, and processes without losing speed.",
    name: "Slavi Kolev",
    role: "COO - Chief Operating Officer",
    company: "SR Holding",
    image: "/images/executive-1.jpeg",
  },
  {
    quote:
      "We build long-term partnerships by delivering outcomes, not promises. Sales here means solving real problems.",
    name: "Marin Nikolov",
    role: "CSO - Chief Sales Officer",
    company: "SR Holding",
    image: "/team3.png",
  },
  {
    quote:
      "From market strategy to execution, we move with precision. The impact of our fintech solutions is tangible and global.",
    name: "Carlos Garza",
    role: "Head of US Market Expansion",
    company: "SR Holding",
    image: "/team4.jpg",
  },
  {
    quote:
      "We ship resilient systems and enable teams to move faster with confidence—technology is our leverage.",
    name: "Anton Georgiev",
    role: "CTO - Chief Technology Officer",
    company: "SR Holding",
    image: "/team5.jpeg",
  },
  {
    quote:
      "Trust and autonomy define our culture. We listen, act, and deliver value for our customers every day.",
    name: "Stoyan Tanev",
    role: "Sales Representative",
    company: "SR Holding",
    image: "/team6.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative w-full pt-10 pb-20 px-4 bg-black">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2 text-center">
          <div className="inline-block mx-auto rounded-md border border-white/10 bg-black px-4 py-2">
            <h2 className="text-base md:text-lg font-semibold leading-tight text-white">
              From Our <span className="block">Team</span>
            </h2>
          </div>
          <p className="text-white/70 text-sm md:text-base lg:text-lg">
            Hear directly from SR Holding team members about building global fintech and technology products.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(({ name, role, company, quote, image }, index) => (
            <div
              key={index}
              className="border-white/25 relative grid grid-cols-[auto_1fr] gap-x-3 overflow-hidden border border-dashed p-4 bg-black/50 transition-all duration-500 opacity-0 translate-y-2 will-change-transform [animation:fadeInUp_0.6s_ease-out_forwards] [animation-delay:var(--delay)]"
              style={{ ['--delay' as any]: `${index * 100 + 100}ms` }}
            >
              <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
                <div className="from-white/5 to-white/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
                  <GridPattern
                    width={25}
                    height={25}
                    x={-12}
                    y={4}
                    strokeDasharray="3"
                    className="stroke-white/20 absolute inset-0 h-full w-full mix-blend-overlay"
                  />
                </div>
              </div>
              <div className="h-12 w-12 md:h-12 md:w-12 rounded-full overflow-hidden bg-white ring-1 ring-white/10 shrink-0 relative">
                <Image
                  alt={name}
                  src={image}
                  fill
                  sizes="48px"
                  className="object-cover object-center"
                  priority={false}
                />
              </div>
              <div>
                <div className="-mt-0.5 -space-y-0.5">
                  <p className="text-sm md:text-base text-white">{name}</p>
                  <span className="text-white/70 block text-[11px] font-light tracking-tight">
                    {role} at {company}
                  </span>
                </div>
                <blockquote className="mt-3">
                  <p className="text-white text-sm font-light tracking-wide">{quote}</p>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}