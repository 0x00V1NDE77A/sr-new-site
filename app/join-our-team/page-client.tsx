"use client"

import type React from "react"
import Image from "next/image"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { LiquidButton } from "@/components/animate-ui/buttons/liquid"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  ArrowRight,
  Users,
  Rocket,
  Heart,
  Code,
  Coffee,
  Globe,
  ChevronDown,
  Mail,
  MapPin,
  Zap,
  Target,
  Award,
  TrendingUp,
} from "lucide-react"
import { useRef, useState } from "react"

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs",
  },
  {
    icon: Rocket,
    title: "Growth Opportunities",
    description: "Continuous learning budget, conference attendance, and career development paths",
  },
  {
    icon: Coffee,
    title: "Work-Life Balance",
    description: "Flexible hours, remote work options, and unlimited PTO policy",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Work on products used by millions worldwide and make a real difference",
  },
]

const features = [
  {
    icon: Zap,
    title: "Innovation First",
    description: "Work with cutting-edge technologies and push the boundaries of what's possible",
    stats: "50+ Patents Filed",
  },
  {
    icon: Target,
    title: "Mission Driven",
    description: "Every line of code contributes to solving real-world problems at scale",
    stats: "10M+ Users Impacted",
  },
  {
    icon: Award,
    title: "Excellence Recognized",
    description: "Industry-leading team recognized for technical innovation and leadership",
    stats: "15+ Awards Won",
  },
  {
    icon: TrendingUp,
    title: "Rapid Growth",
    description: "Join a fast-growing company with unlimited potential and opportunities",
    stats: "300% Growth YoY",
  },
]

const testimonials = [
  {
    name: "Rusi Russev",
    role: "CEO-Chief Executive Officer",
    quote: "I don’t guess. I engineer.",
    avatar: "/images/executive-2.png",
  },
  {
    name: "Slavi Kolev",
    role: "COO-Chief Operating Officer",
    quote: "People talk about scaling. I talk about taking over.",
    avatar: "/images/executive-1.jpeg",
  },
  {
    name: "Marin Nikolov",
    role: "CSO-Chief Sales Officer",
    quote:"Sell the vision, not the product - people buy belief and emotion.",
    avatar: "/team3.png",
  },
  {
    name: "Carlos Garza",
    role: "Head of US Market Expansion",
    quote:"My job is simple: translate ambition across borders and turn global vision into local dominance",
    avatar: "/team4.jpg",
  },
  {
    name: "Anton Georgiev",
    role: "Senior Full-Stack Developer",
    quote:"I don’t lower targets. I increase actions, follow process, and make the right calls when it counts.",
    avatar: "/team5.jpeg",
  },
  {
    name: "Stoyan Tanev",
    role: "Sales Representative",
    quote:"I don't just close deals- I build relationships that turn bold ideas into real-world success stories.",
    avatar: "/team6.jpg",
  },
]

const openPositions = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Build scalable web applications using React, Node.js, and modern cloud technologies.",
    salary: "$120k - $180k",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote / New York",
    type: "Full-time",
    description: "Design intuitive user experiences for our next-generation software products.",
    salary: "$100k - $150k",
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote / Austin",
    type: "Full-time",
    description: "Manage and scale our cloud infrastructure to support millions of users.",
    salary: "$110k - $160k",
  },
]

export default function JoinTeamPageClient() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section - Black Background */}
      <section ref={heroRef} className="relative flex items-center min-h-screen overflow-hidden text-white bg-black">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black"
          style={{ y: heroY }}
        />

        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <img
             src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Software Development Team"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div className="relative z-10 w-full px-4 sm:px-6" style={{ opacity: heroOpacity }}>
          <motion.div
            className="max-w-4xl pl-8 ml-8 -mt-16 text-left"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-8 border rounded-full bg-white/10 backdrop-blur-xl border-white/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Users className="w-5 h-5" />
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                We're Hiring
              </motion.span>
            </motion.div>

            <motion.h1
              className="mb-8 text-6xl font-bold leading-none tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {"Join Our".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.6 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                className="block text-transparent bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {"Revolution".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.08, duration: 0.6 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </motion.h1>

            <motion.p
              className="max-w-3xl mb-12 text-xl leading-relaxed lg:text-2xl text-white/80 text-pretty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              {"Be part of a team that's reshaping the future of technology. Where innovation meets passion, and every idea has the power to change the world."
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2 + i * 0.03, duration: 0.4 }}
                    className="inline-block mr-1"
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.p>

            <motion.div
              className="flex flex-col items-start gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.8 }}
            >
              <LiquidButton
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-full hover:bg-white/90 group"
                style={{ color: '#f5f5f5', backgroundColor: 'white' }}
              >
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </LiquidButton>

              <LiquidButton
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg text-white bg-transparent rounded-full border-white/30 hover:bg-white/10"
              >
                Learn About Our Culture
              </LiquidButton>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute transform -translate-x-1/2 bottom-8 left-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </section>

      <section className="py-20 text-black bg-white lg:py-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="mb-6 text-5xl font-bold lg:text-7xl text-balance"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {"Why Choose ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.03, duration: 0.5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {"SR Holdings".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + i * 0.05, duration: 0.5 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.div
                  className="absolute left-0 w-full h-1 bg-black -bottom-2"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                />
              </motion.span>
              {"?".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4 + i * 0.05, duration: 0.5 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              className="max-w-3xl mx-auto text-xl text-gray-600 text-pretty"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {"We're not just building software—we're crafting the future. Join a team where your ideas matter and your growth is unlimited."
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.02, duration: 0.4 }}
                    className="inline-block mr-1"
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 mb-20 md:grid-cols-2 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  className="group"
                >
                  <Card className="relative h-full p-8 overflow-hidden transition-all duration-500 bg-white border-gray-200 hover:shadow-2xl hover:border-black/20">
                    <motion.div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-gray-50 to-transparent group-hover:opacity-100" />
                    <div className="relative z-10">
                      <motion.div
                        className="flex items-center justify-center w-16 h-16 mb-6 bg-black rounded-2xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-black">{feature.title}</h3>
                        <motion.span
                          className="px-3 py-1 font-mono text-sm text-gray-600 bg-gray-100 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                        >
                          {feature.stats}
                        </motion.span>
                      </div>
                      <p className="leading-relaxed text-gray-600">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3
              className="mb-12 text-3xl font-bold text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {"What We Offer".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="p-6 text-center transition-colors duration-300 rounded-2xl hover:bg-gray-50"
                  >
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-black/10 rounded-xl"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-6 h-6 text-black" />
                    </motion.div>
                    <h4 className="mb-2 font-semibold">{benefit.title}</h4>
                    <p className="text-sm leading-relaxed text-gray-600">{benefit.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Black Background */}
      <section className="py-20 text-white bg-black lg:py-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="mb-6 text-4xl font-bold lg:text-6xl text-balance"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {"Hear From Our ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <motion.span
                className="text-transparent bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {"Team".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h2>
            <p className="max-w-3xl mx-auto text-xl text-white/80 text-pretty">
              Discover what makes SR Holdings an extraordinary place to work through the voices of our team members.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="p-8 mb-8 bg-white/5 border-white/10 backdrop-blur-xl lg:p-12">
                  <blockquote className="mb-8 text-2xl italic font-light leading-relaxed lg:text-3xl text-white/90">
                    "{testimonials[selectedTestimonial].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <Image
                      src={testimonials[selectedTestimonial].avatar || "/placeholder.svg"}
                      alt={testimonials[selectedTestimonial].name}
                      width={128}
                      height={128}
                      quality={95}
                      className="object-cover w-16 h-16 border-2 rounded-full border-white/20"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="text-left">
                      <div className="text-lg font-semibold">{testimonials[selectedTestimonial].name}</div>
                      <div className="text-white/60">{testimonials[selectedTestimonial].role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === selectedTestimonial ? "bg-white" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-black bg-white lg:py-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="mb-6 text-5xl font-bold lg:text-7xl text-balance"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {"Open ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {"Positions".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.div
                  className="absolute left-0 w-full h-1 bg-black -bottom-2"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                />
              </motion.span>
            </motion.h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 text-pretty">
              Find your perfect role and start your journey with us. We're always looking for exceptional talent.
            </p>
          </motion.div>

                     <div className="space-y-6">
             {openPositions.map((position, index) => (
               <motion.div
                 key={position.title}
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1, duration: 0.8 }}
                 className="group"
               >
                 <Card className="relative p-6 overflow-hidden transition-all duration-500 bg-white border-gray-200 lg:p-8 hover:shadow-2xl hover:border-black/20">
                   <motion.div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-gray-50 to-transparent group-hover:opacity-100" />
                   <div className="relative z-10">
                     <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                       <div className="flex-1">
                         <div className="flex flex-wrap items-center gap-3 mb-3">
                           <h3 className="text-2xl font-bold text-black">{position.title}</h3>
                           <span className="px-3 py-1 text-sm font-medium text-black rounded-full bg-black/10">
                             {position.type}
                           </span>
                           <span className="px-3 py-1 text-sm font-medium text-green-600 rounded-full bg-green-100">
                             {position.salary}
                           </span>
                         </div>
                         <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600">
                           <div className="flex items-center gap-2">
                             <Code className="w-4 h-4 text-gray-500" />
                             <span>{position.department}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-gray-500" />
                             <span>{position.location}</span>
                           </div>
                         </div>
                         <p className="leading-relaxed text-gray-700">{position.description}</p>
                       </div>
                       <motion.div
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                       >
                         <LiquidButton className="px-6 py-3 text-white bg-black rounded-full hover:bg-gray-800">
                           Apply Now
                           <ArrowRight className="w-4 h-4 ml-2" />
                         </LiquidButton>
                       </motion.div>
                     </div>
                   </div>
                 </Card>
               </motion.div>
             ))}
           </div>

                     <motion.div
             className="mt-12 text-center"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
             <p className="mb-6 text-gray-600">Don't see the perfect role? We'd still love to hear from you.</p>
             <LiquidButton
               size="lg"
               className="px-8 py-3 text-white bg-black rounded-full hover:bg-black/90"
             >
               Send Us Your Resume
             </LiquidButton>
           </motion.div>
        </div>
      </section>

      <section className="py-20 text-white bg-black lg:py-32">
        <div className="max-w-4xl px-4 mx-auto sm:px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="mb-6 text-5xl font-bold lg:text-7xl text-balance"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {"Ready to ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <motion.span
                className="text-transparent bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {"Start".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
              {"?".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 + i * 0.05, duration: 0.5 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              className="max-w-2xl mx-auto text-xl text-white/80 text-pretty"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Take the first step towards an extraordinary career. We can't wait to meet you.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="relative p-8 overflow-hidden bg-white/5 border-white/10 backdrop-blur-xl lg:p-12">
              <motion.div
                className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/5 to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <div className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 text-white transition-all duration-300 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
                        placeholder="Your full name"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 text-white transition-all duration-300 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
                        placeholder="your.email@example.com"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 text-white transition-all duration-300 border rounded-lg resize-none bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
                      placeholder="Tell us about yourself and why you'd like to join our team..."
                      required
                    />
                  </motion.div>
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                      <LiquidButton
                        type="submit"
                        size="lg"
                        className="px-12 py-4 text-lg font-semibold text-black bg-white rounded-full hover:bg-white/90"
                      >
                        Send Message
                        <Mail className="w-5 h-5 ml-2" />
                      </LiquidButton>
                    </motion.div>
                  </motion.div>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

