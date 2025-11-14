"use client";

import Image from "next/image";

export default function CoreValueStatsHero() {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-white">
        {/* Top content */}
        <div className="grid gap-10 p-12 md:p-16 lg:p-20 lg:grid-cols-2 items-start">
          <div className="mt-4 md:mt-6">
            <h1 className="display-font text-2xl md:text-3xl font-bold tracking-tight text-black">
              Build Digital Solutions
            </h1>
            <p className="mt-4 text-black/70 text-base md:text-lg leading-relaxed">
              We build digital solutions with an extensive range of tools and technologies they need to
              transform and grow their businesses through custom software development.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-black/10 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-black/20">
                <div className="text-2xl font-bold text-black">584+</div>
                <div className="text-xs text-black/60 mt-1">Projects Delivered</div>
              </div>
              <div className="rounded-xl border border-black/10 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-black/20">
                <div className="text-2xl font-bold text-black">25</div>
                <div className="text-xs text-black/60 mt-1">Global Hubs</div>
              </div>
              <div className="rounded-xl border border-black/10 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-black/20">
                <div className="text-2xl font-bold text-black">24/7</div>
                <div className="text-xs text-black/60 mt-1">Support</div>
              </div>
            </div>
          </div>

          {/* Media collage */}
          <div className="grid grid-cols-3 gap-3 -mt-4 md:-mt-6">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-xl border border-black/10 bg-gray-100 relative aspect-[16/9] md:aspect-[4/3]">
              <Image
                src="/builddigitalsolution1.jpg"
                alt="Company image"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-black/10 bg-gray-100 relative aspect-[16/10]">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
                alt="Company team and workspace"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 32vw, 50vw"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-black/10 bg-gray-100 relative aspect-[16/10]">
              <Image
                src="/builddigitalsolution2.jpg"
                alt="Company image"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 32vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
