"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Service {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
}

const services: Service[] = [
  {
    title: "Web Development",
    subtitle: "Modern, scalable web applications",
    description: "We create high-performance web applications built with cutting-edge technologies. Our solutions prioritize user experience, scalability, and maintainability.",
    features: [
      "React & Next.js applications",
      "TypeScript development", 
      "API design & integration",
      "Performance optimization",
      "Responsive design"
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mobile Development",
    subtitle: "Native & cross-platform apps",
    description: "Build powerful mobile experiences that users love. From native iOS and Android to cross-platform solutions using React Native.",
    features: [
      "React Native development",
      "iOS & Android native",
      "App Store deployment",
      "Push notifications",
      "Offline-first architecture"
    ],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "AI Integration",
    subtitle: "Intelligence-driven solutions",
    description: "Integrate AI capabilities into your applications. From machine learning models to natural language processing and computer vision.",
    features: [
      "Machine learning models",
      "Natural language processing",
      "Computer vision systems",
      "Predictive analytics",
      "AI-powered automation"
    ],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Data Engineering",
    subtitle: "Scalable data infrastructure",
    description: "Transform raw data into actionable insights with robust data pipelines, warehouses, and analytics platforms.",
    features: [
      "Data pipeline development",
      "Real-time analytics",
      "Data warehouse design",
      "ETL/ELT processes",
      "Business intelligence"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Security Solutions",
    subtitle: "Enterprise security & compliance",
    description: "Comprehensive security solutions to protect your applications, data, and infrastructure from modern threats.",
    features: [
      "Security audits",
      "Penetration testing",
      "Compliance frameworks",
      "Identity management",
      "Threat monitoring"
    ],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Content */}
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="font-mono text-3xl font-bold tracking-tight text-black">
              {service.title}
            </h3>
            <p className="mt-1 text-lg text-gray-700">
              {service.subtitle}
            </p>
          </div>
          
          <p className="text-lg leading-relaxed text-gray-600">
            {service.description}
          </p>
        </div>

        <div className="space-y-3">
          {service.features.map((feature, featureIndex) => (
            <div 
              key={featureIndex}
              className="flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
              <span className="text-gray-700 transition-colors duration-200 group-hover:text-black">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <motion.button
          className="inline-flex items-center gap-2 px-8 py-4 font-medium text-white transition-all duration-300 bg-black border-2 border-black hover:bg-white hover:text-black group"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>

      {/* Image */}
      <div className="flex-1 max-w-lg">
        <motion.div 
          className="relative overflow-hidden border-2 border-black"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={service.image}
            alt={service.title}
            width={600}
            height={400}
            className="object-cover w-full transition-all duration-500 h-80 grayscale hover:grayscale-0"
          />
          <div className="absolute inset-0 transition-opacity duration-300 bg-black opacity-0 hover:opacity-10" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function ServicesGrid() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-20 lg:py-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="mb-20 text-center lg:mb-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-black" />
              <div className="w-2 h-2 bg-black" />
              <div className="w-16 h-px bg-black" />
            </div>
            
            <motion.h1 
              className="mb-8 font-mono text-4xl font-bold tracking-tighter text-black sm:text-5xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our Services
            </motion.h1>
            
            <motion.p 
              className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 lg:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We build digital solutions that drive business growth through 
              innovative technology and exceptional user experiences.
            </motion.p>
          </motion.div>

          {/* Services */}
          <div className="space-y-24 lg:space-y-32">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="py-16 mt-24 text-center border-2 border-black lg:mt-32"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-mono text-3xl font-bold text-black lg:text-4xl">
              Ready to start your project?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600">
              Let's discuss how we can help bring your vision to life with our expertise.
            </p>
            <motion.button
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-medium text-white transition-all duration-300 bg-black border-2 border-black hover:bg-white hover:text-black group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}