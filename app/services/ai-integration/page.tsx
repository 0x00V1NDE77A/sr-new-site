import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/services/service-detail-hero"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import { ServiceDetailProcess } from "@/components/services/service-detail-process"
import { ServiceDetailCTA } from "@/components/services/service-detail-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"

export const metadata = {
  title: "AI Integration Services - SR Holding",
  description: "Professional AI integration services including machine learning models, natural language processing, computer vision, predictive analytics, and chatbots & virtual assistants.",
  keywords: [
    "AI integration",
    "machine learning",
    "natural language processing",
    "computer vision",
    "predictive analytics",
    "chatbots",
    "virtual assistants"
  ],
}

const serviceData = {
  title: "AI Integration",
  subtitle: "Smart solutions powered by AI",
  description: "Leverage the power of artificial intelligence to automate processes, gain insights, and create intelligent solutions that adapt and learn from your data.",
  icon: "Brain",
  features: [
    "Machine learning models",
    "Natural language processing",
    "Computer vision",
    "Predictive analytics",
    "Chatbots & virtual assistants"
  ],
  detailedFeatures: [
    {
      title: "Machine Learning Models",
      description: "Custom ML models that learn from your data to make predictions and automate decision-making processes.",
      benefits: ["Data-driven insights", "Automated decisions", "Pattern recognition", "Continuous learning"]
    },
    {
      title: "Natural Language Processing",
      description: "AI-powered text analysis and language understanding for better user interactions and content processing.",
      benefits: ["Text analysis", "Sentiment analysis", "Language translation", "Content generation"]
    },
    {
      title: "Computer Vision",
      description: "Image and video analysis capabilities that enable visual recognition and automated visual processing.",
      benefits: ["Image recognition", "Object detection", "Video analysis", "Visual automation"]
    },
    {
      title: "Predictive Analytics",
      description: "Advanced analytics that predict future trends and behaviors based on historical data patterns.",
      benefits: ["Future predictions", "Risk assessment", "Trend analysis", "Business forecasting"]
    },
    {
      title: "Chatbots & Virtual Assistants",
      description: "Intelligent conversational agents that provide 24/7 customer support and automated assistance.",
      benefits: ["24/7 availability", "Instant responses", "Cost reduction", "Improved customer experience"]
    }
  ],
  technologies: [
    "Python", "TensorFlow", "PyTorch", "OpenAI", "Hugging Face", "AWS AI", 
    "Google AI", "Azure AI", "NVIDIA", "Docker", "Kubernetes", "REST APIs"
  ],
  process: [
    {
      step: "01",
      title: "AI Strategy & Planning",
      description: "We analyze your data and requirements to develop a comprehensive AI integration strategy."
    },
    {
      step: "02", 
      title: "Data Preparation & Model Design",
      description: "We prepare your data and design custom AI models tailored to your specific needs."
    },
    {
      step: "03",
      title: "Development & Training",
      description: "We develop and train AI models using cutting-edge technologies and best practices."
    },
    {
      step: "04",
      title: "Integration & Optimization",
      description: "We integrate AI solutions into your systems and continuously optimize performance."
    }
  ]
}

export default function AIIntegrationService() {
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
