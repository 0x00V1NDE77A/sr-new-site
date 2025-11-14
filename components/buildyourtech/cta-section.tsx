"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section id="cta" className="relative w-full py-24 px-6 overflow-hidden bg-white text-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">Ready to Build Your Infrastructure?</h2>
        <p className="text-lg mb-8 text-black/80 max-w-2xl mx-auto leading-relaxed">
          Partner with SR Holding to build enterprise-grade software infrastructure. Let's transform your vision into reality.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 shadow-lg hover:shadow-xl transition-all group"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="border-black text-black hover:bg-black/5 transition-all"
            >
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}