import { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/softwareinfractructure/service-detail-hero"
import { CoreValues } from "@/components/softwareinfractructure/core-values"
import { ServiceDetailProcess } from "@/components/softwareinfractructure/service-detail-process"
import { CaseStudies } from "@/components/softwareinfractructure/case-studies"
import { ServiceDetailCTA } from "@/components/softwareinfractructure/service-detail-cta"

export const metadata: Metadata = {
  title: "Software Infrastructure Solutions - SR Holding",
  description:
    "Enterprise-grade software infrastructure with security-first architecture, zero-trust principles, cloud-native scalability, and resilience & observability.",
  keywords: [
    "software infrastructure",
    "enterprise software",
    "scalable applications",
    "secure software development",
    "cloud-native architecture",
    "DevSecOps",
    "zero-trust security",
    "SR Holding infrastructure",
  ],
  openGraph: {
    title: "Software Infrastructure Solutions - SR Holding",
    description:
      "Build secure, scalable software infrastructure with integrity and innovation. Enterprise-grade solutions for modern businesses.",
    type: "website",
  },
}

export default function SoftwareInfrastructurePage() {
  const serviceData = {
    title: "Software Infrastructure",
    subtitle: "Enterprise-Grade Software Solutions",
    description:
      "We deliver outstanding software solutions for enterprises by building secure, scalable applications with integrity and innovation.",
    icon: "Shield",
    features: [
      "Security by Design with zero-trust architecture",
      "Cloud-native scalability with Kubernetes orchestration",
      "Resilience & observability with real-time monitoring",
      "DevSecOps automation with CI/CD pipelines",
      "Secure enterprise applications at scale",
    ],
    process: [
      {
        step: "01",
        title: "Discovery & Requirements",
        description:
          "We analyze your business needs, security requirements, and infrastructure goals to design the optimal solution architecture.",
      },
      {
        step: "02",
        title: "Architecture Design",
        description:
          "Our team creates a comprehensive infrastructure blueprint with security-first principles, scalability patterns, and observability stack.",
      },
      {
        step: "03",
        title: "Implementation & Testing",
        description:
          "We build and deploy your infrastructure using modern DevOps practices, automated testing, and continuous security scanning.",
      },
      {
        step: "04",
        title: "Monitoring & Optimization",
        description:
          "Continuous monitoring, performance optimization, and 24/7 support ensure your infrastructure remains secure and resilient.",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <ServiceDetailHero service={serviceData} />

      {/* Core Values Section */}
      <CoreValues />

      {/* Process Section */}
      <ServiceDetailProcess service={serviceData} />

      {/* Case Studies Section */}
      <CaseStudies />

      {/* CTA Section */}
      <ServiceDetailCTA service={serviceData} />

      <Footer />
    </div>
  )
}
