"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CoreValueStatsHero from "@/components/build-digitalsolution/CoreValueStatsHero";
import ShowcaseSection from "@/components/build-digitalsolution/ShowcaseSection";
import Technologies from "@/components/build-digitalsolution/Technologies";
import DigitalSolutionsCta from "@/components/build-digitalsolution/CtaSection";

export default function BuildDigitalSolutionsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-24 space-y-16">
        <CoreValueStatsHero />
        <Technologies />
        <ShowcaseSection />
        <DigitalSolutionsCta />
      </main>

      <Footer />
    </div>
  );
}
