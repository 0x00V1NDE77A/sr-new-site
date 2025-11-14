"use client"

import { Gallery4 } from "@/components/ui/gallery4"

export const CaseStudies = () => {
  const items = [
    {
      id: "security-by-design",
      title: "Security by Design Implementation",
      description: "Built enterprise-grade software infrastructure with security-first architecture, zero-trust principles, and end-to-end encryption ensuring data protection at every layer.",
      href: "/case-studies/security-by-design",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "cloud-native-scalability",
      title: "Cloud-Native Scalability Solutions",
      description: "Delivered auto-scaling cloud infrastructure with Kubernetes orchestration, enabling elastic resource allocation and cloud-native patterns that grow with business demands.",
      href: "/case-studies/cloud-native-scalability",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjR8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "resilience-observability",
      title: "Resilience & Observability Platform",
      description: "Implemented comprehensive monitoring, logging, and observability stack with Prometheus, Grafana, and OpenTelemetry for high availability and real-time insights.",
      href: "/case-studies/resilience-observability",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "devsecops-automation",
      title: "DevSecOps Automation Pipeline",
      description: "Created fully automated CI/CD pipelines with Infrastructure as Code, security scanning, and compliance checks reducing deployment time and vulnerabilities by 80%.",
      href: "/case-studies/devsecops-automation",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "secure-enterprise-apps",
      title: "Secure Enterprise Applications",
      description: "Developed mission-critical applications with integrity and innovation, ensuring secure, scalable solutions that drive business growth and operational excellence.",
      href: "/case-studies/secure-enterprise-apps",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "future-ready-infrastructure",
      title: "Future-Ready Infrastructure",
      description: "Engineered next-generation software infrastructure with cutting-edge technologies, ensuring scalability, security, and innovation for long-term business success.",
      href: "/case-studies/future-ready-infrastructure",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
  ]

  return (
    <Gallery4 
      title="Case Studies" 
      description="How we help enterprises scale securely" 
      items={items} 
    />
  )
}

export default CaseStudies