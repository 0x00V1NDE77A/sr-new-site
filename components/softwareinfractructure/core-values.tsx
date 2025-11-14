"use client"

import { Shield, Server, Rocket, Sparkles } from "lucide-react"
import type { CoreValue } from "@/components/softwareinfractructure/types"

export const CoreValues = () => {
  const values: CoreValue[] = [
    { title: "Security", desc: "Protecting data and systems with zero-trust and continuous monitoring.", Icon: Shield },
    { title: "Scalability", desc: "Cloud-native patterns that scale elastically and reliably.", Icon: Server },
    { title: "Integrity", desc: "Transparent delivery and responsible engineering standards.", Icon: Rocket },
    { title: "Innovation", desc: "Modern architectures and AI-driven capabilities.", Icon: Sparkles },
  ]

  const sectionId = "core-values-heading"
  return (
    <section className="py-20 bg-white" aria-labelledby={sectionId} role="region">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id={sectionId} className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-black">Our Core Values</h2>
          <p className="mt-4 text-lg text-gray-600" aria-label="Core values subtitle">Principles that guide every solution we deliver</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ title, desc, Icon }) => (
            <article
              key={title}
              className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-gray-300 focus-within:ring-2 focus-within:ring-black/10"
              aria-label={`Value: ${title}`}
              title={`Value: ${title}`}
            >
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-gray-900 group-hover:text-white" aria-hidden="true">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-black">{title}</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoreValues