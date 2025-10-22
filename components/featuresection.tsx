"use client";

import { cn } from "../lib/utils";
import {
  Settings,
  Cloud,
  DollarSign,
  Zap,
  Heart,
  HelpCircle,
  Route,
  Terminal,
  Code,
  Database,
  Shield,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Custom Software Development",
      description:
        "Tailored software solutions built specifically for your business needs and requirements.",
      icon: <Code className="w-6 h-6" />,
    },
    {
      title: "Machine Learning & AI",
      description:
        "Intelligent automation and AI-powered solutions that learn and adapt to your business processes.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Blockchain Technology",
      description:
        "Secure, decentralized applications and smart contracts for transparent business operations.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Web Application Development",
      description:
        "Modern, responsive web applications that provide seamless user experiences across all devices.",
      icon: <Cloud className="w-6 h-6" />,
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile applications for iOS and Android platforms.",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      title: "Database & Infrastructure",
      description:
        "Robust database design and scalable infrastructure solutions for enterprise applications.",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "24/7 Technical Support",
      description:
        "Round-the-clock technical support and maintenance for all our software solutions.",
      icon: <HelpCircle className="w-6 h-6" />,
    },
    {
      title: "Enterprise Integration",
      description:
        "Seamless integration with existing enterprise systems and third-party applications.",
      icon: <Route className="w-6 h-6" />,
    },
  ];

  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Software Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale your software applications with confidence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 gap-0">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-gray-200 cursor-pointer transition-all duration-300 overflow-hidden",
        (index === 0 || index === 4) && "lg:border-l border-gray-200",
        index < 4 && "lg:border-b border-gray-200",
        "hover:shadow-lg hover:-translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clean hover background */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition-all duration-300 absolute inset-0 h-full w-full bg-gray-50 pointer-events-none" />
      
      {/* Icon with subtle animation */}
      <div className="mb-6 relative z-10 px-10">
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300",
          "bg-gray-100 text-gray-600",
          "group-hover/feature:bg-gray-900 group-hover/feature:text-white group-hover/feature:scale-110"
        )}>
          {icon}
        </div>
      </div>

      {/* Title with clean accent */}
      <div className="text-lg font-bold mb-3 relative z-10 px-10">
        <div className={cn(
          "absolute left-0 inset-y-0 w-1 rounded-tr-full rounded-br-full transition-all duration-300",
          "bg-gray-200",
          "group-hover/feature:bg-gray-900",
          "h-6 group-hover/feature:h-8"
        )} />
        <span className={cn(
          "group-hover/feature:translate-x-2 transition-all duration-300 inline-block",
          "text-gray-900 break-words"
        )}>
          {title}
        </span>
      </div>

      {/* Description */}
      <p className={cn(
        "text-sm relative z-10 px-10 transition-all duration-300",
        "text-gray-600",
        "group-hover/feature:text-gray-700",
        "break-words"
      )}>
        {description}
      </p>

      {/* Clean indicator dot */}
      <div className="absolute top-4 right-4 z-10">
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          "bg-gray-300",
          "group-hover/feature:bg-gray-900",
          "group-hover/feature:w-3 group-hover/feature:h-3"
        )} />
      </div>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/feature:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  );
};