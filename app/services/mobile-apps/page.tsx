import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/services/service-detail-hero"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import { ServiceDetailProcess } from "@/components/services/service-detail-process"
import { ServiceDetailCTA } from "@/components/services/service-detail-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"

export const metadata = {
  title: "Mobile App Development Services - SR Holding",
  description: "Professional mobile app development services including iOS & Android development, React Native & Flutter, app store optimization, push notifications, and offline functionality.",
  keywords: [
    "mobile app development",
    "iOS development",
    "Android development",
    "React Native",
    "Flutter",
    "app store optimization",
    "push notifications"
  ],
}

const serviceData = {
  title: "Mobile Apps",
  subtitle: "Native and cross-platform applications",
  description: "From iOS to Android, we develop native and cross-platform mobile applications that engage users and drive business growth with seamless performance.",
  icon: "Smartphone",
  features: [
    "iOS & Android development",
    "React Native & Flutter",
    "App store optimization",
    "Push notifications",
    "Offline functionality"
  ],
  detailedFeatures: [
    {
      title: "iOS & Android Development",
      description: "Native mobile applications built specifically for iOS and Android platforms with platform-specific optimizations.",
      benefits: ["Native performance", "Platform-specific UI", "App Store compliance", "Device integration"]
    },
    {
      title: "React Native & Flutter",
      description: "Cross-platform mobile applications that work seamlessly on both iOS and Android with a single codebase.",
      benefits: ["Code reusability", "Faster development", "Consistent UI", "Cost-effective"]
    },
    {
      title: "App Store Optimization",
      description: "Strategic optimization to improve your app's visibility and ranking in app stores.",
      benefits: ["Keyword optimization", "Visual assets", "User reviews", "Performance metrics"]
    },
    {
      title: "Push Notifications",
      description: "Engage users with targeted push notifications to increase retention and drive user actions.",
      benefits: ["User engagement", "Retention boost", "Personalized messaging", "Analytics tracking"]
    },
    {
      title: "Offline Functionality",
      description: "Applications that work seamlessly even without internet connectivity for better user experience.",
      benefits: ["Offline data sync", "Cached content", "Background updates", "User convenience"]
    }
  ],
  technologies: [
    "React Native", "Flutter", "Swift", "Kotlin", "Java", "Objective-C", 
    "Firebase", "AWS", "Google Play Console", "App Store Connect", "Xcode", "Android Studio"
  ],
  process: [
    {
      step: "01",
      title: "Discovery & Strategy",
      description: "We analyze your requirements, define app features, and create a comprehensive development strategy."
    },
    {
      step: "02", 
      title: "Design & Prototyping",
      description: "Our team creates wireframes, mockups, and interactive prototypes for your mobile application."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build your mobile app using modern technologies with rigorous testing across devices."
    },
    {
      step: "04",
      title: "Launch & Maintenance",
      description: "We deploy your app to app stores and provide ongoing maintenance, updates, and support."
    }
  ]
}

export default function MobileAppsService() {
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
