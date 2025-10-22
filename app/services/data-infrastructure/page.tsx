import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/services/service-detail-hero"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import { ServiceDetailProcess } from "@/components/services/service-detail-process"
import { ServiceDetailCTA } from "@/components/services/service-detail-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"

export const metadata = {
  title: "Data Infrastructure Services - SR Holding",
  description: "Professional data infrastructure services including data warehousing, ETL/ELT pipelines, real-time analytics, business intelligence, and data visualization.",
  keywords: [
    "data infrastructure",
    "data warehousing",
    "ETL pipelines",
    "real-time analytics",
    "business intelligence",
    "data visualization"
  ],
}

const serviceData = {
  title: "Data Infrastructure",
  subtitle: "Transform raw data into insights",
  description: "Build robust data pipelines and infrastructure that transforms your raw data into actionable insights, enabling data-driven decision making.",
  icon: "Database",
  features: [
    "Data warehousing",
    "ETL/ELT pipelines",
    "Real-time analytics",
    "Business intelligence",
    "Data visualization"
  ],
  detailedFeatures: [
    {
      title: "Data Warehousing",
      description: "Centralized data storage solutions that organize and optimize your data for analysis and reporting.",
      benefits: ["Centralized storage", "Data optimization", "Historical data", "Scalable architecture"]
    },
    {
      title: "ETL/ELT Pipelines",
      description: "Automated data processing pipelines that extract, transform, and load data from various sources.",
      benefits: ["Automated processing", "Data transformation", "Multiple sources", "Real-time updates"]
    },
    {
      title: "Real-time Analytics",
      description: "Live data processing and analysis that provides instant insights and enables real-time decision making.",
      benefits: ["Instant insights", "Real-time decisions", "Live monitoring", "Immediate alerts"]
    },
    {
      title: "Business Intelligence",
      description: "Comprehensive BI solutions that turn your data into actionable business insights and reports.",
      benefits: ["Business insights", "Custom reports", "Dashboard creation", "Performance metrics"]
    },
    {
      title: "Data Visualization",
      description: "Interactive dashboards and visualizations that make complex data easy to understand and act upon.",
      benefits: ["Interactive dashboards", "Visual insights", "User-friendly", "Custom visualizations"]
    }
  ],
  technologies: [
    "AWS", "Google Cloud", "Azure", "Snowflake", "BigQuery", "Redshift", 
    "Apache Kafka", "Apache Spark", "Tableau", "Power BI", "Python", "SQL"
  ],
  process: [
    {
      step: "01",
      title: "Data Assessment & Strategy",
      description: "We analyze your data sources and requirements to design a comprehensive data infrastructure strategy."
    },
    {
      step: "02", 
      title: "Architecture & Pipeline Design",
      description: "We design scalable data architecture and processing pipelines tailored to your needs."
    },
    {
      step: "03",
      title: "Development & Implementation",
      description: "We build and implement your data infrastructure with robust monitoring and security."
    },
    {
      step: "04",
      title: "Analytics & Optimization",
      description: "We set up analytics tools and continuously optimize your data infrastructure performance."
    }
  ]
}

export default function DataInfrastructureService() {
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
