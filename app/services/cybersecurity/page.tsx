import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/services/service-detail-hero"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import { ServiceDetailProcess } from "@/components/services/service-detail-process"
import { ServiceDetailCTA } from "@/components/services/service-detail-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"

export const metadata = {
  title: "Cybersecurity Services - SR Holding",
  description: "Professional cybersecurity services including security audits & assessments, penetration testing, compliance management, incident response, and security training.",
  keywords: [
    "cybersecurity",
    "security audits",
    "penetration testing",
    "compliance management",
    "incident response",
    "security training"
  ],
}

const serviceData = {
  title: "Cybersecurity",
  subtitle: "Enterprise-grade security solutions",
  description: "Protect your data, systems, and reputation with comprehensive cybersecurity solutions designed to meet enterprise-grade security standards.",
  icon: "Shield",
  features: [
    "Security audits & assessments",
    "Penetration testing",
    "Compliance management",
    "Incident response",
    "Security training"
  ],
  detailedFeatures: [
    {
      title: "Security Audits & Assessments",
      description: "Comprehensive security evaluations that identify vulnerabilities and provide actionable recommendations.",
      benefits: ["Vulnerability identification", "Risk assessment", "Compliance review", "Actionable recommendations"]
    },
    {
      title: "Penetration Testing",
      description: "Simulated cyber attacks to test your security defenses and identify potential weaknesses.",
      benefits: ["Real-world testing", "Vulnerability discovery", "Security validation", "Risk mitigation"]
    },
    {
      title: "Compliance Management",
      description: "Ensure your organization meets industry standards and regulatory requirements for data protection.",
      benefits: ["Regulatory compliance", "Industry standards", "Documentation", "Audit preparation"]
    },
    {
      title: "Incident Response",
      description: "Rapid response and recovery services to minimize damage from security incidents and breaches.",
      benefits: ["Rapid response", "Damage minimization", "Recovery planning", "Forensic analysis"]
    },
    {
      title: "Security Training",
      description: "Comprehensive security awareness training to educate your team on best practices and threats.",
      benefits: ["Security awareness", "Best practices", "Threat education", "Team empowerment"]
    }
  ],
  technologies: [
    "Nessus", "Metasploit", "Burp Suite", "OWASP", "NIST", "ISO 27001", 
    "SOC 2", "GDPR", "HIPAA", "SIEM", "Firewalls", "VPN"
  ],
  process: [
    {
      step: "01",
      title: "Security Assessment",
      description: "We conduct comprehensive security assessments to understand your current security posture."
    },
    {
      step: "02", 
      title: "Vulnerability Analysis",
      description: "We identify and analyze security vulnerabilities through testing and assessment."
    },
    {
      step: "03",
      title: "Security Implementation",
      description: "We implement security measures and solutions to protect your systems and data."
    },
    {
      step: "04",
      title: "Monitoring & Maintenance",
      description: "We provide ongoing security monitoring, maintenance, and incident response support."
    }
  ]
}

export default function CybersecurityService() {
  return (
    <div className="bg-black">
      <Suspense>
        <SEOSection />
      </Suspense>
      
      <Navbar />
      <ServiceDetailHero service={serviceData} />
      <ServiceDetailContent service={serviceData} />
      <ServiceDetailProcess service={serviceData} />
      <ServiceDetailCTA service={serviceData} />
      <Footer />
    </div>
  )
}
