"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LocalBusinessSchema } from "@/components/structured-data/local-business-schema";

// Simple icons as inline SVGs to avoid external dependencies
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)


const AddressIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

interface ContactDetails {
  phone: string
  email: string
  address?: string
}

interface ContactPageClientProps {
  contactDetails?: ContactDetails
}

export function ContactPageClient({ contactDetails }: ContactPageClientProps) {
  // Default values in case contactDetails is undefined
  // const defaultContactDetails: ContactDetails = {
  //   phone: '+94 11 234 5678',
  //   email: 'info@srholding.lk',
  //   address: 'Sofia, Bulgaria'
  // }
  
  const contactInfo = contactDetails || {
    phone: '+359878908741',
    email: 'hello@srholding.org',
    address: 'Bulgaria, Sofia'
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setIsSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          topic: "",
          message: "",
        })
        setErrors({})
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        console.error("Contact form error:", result);
        if (result.details && result.details.length > 0) {
          // Convert validation errors to field-specific errors
          const fieldErrors: {[key: string]: string} = {}
          result.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: result.error || 'Failed to send message. Please try again.' })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({ general: "Failed to send message. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx>{`
        input, textarea, select {
          color: #000000 !important;
        }
        input::placeholder, textarea::placeholder {
          color: #9CA3AF !important;
        }
      `}</style>
      {/* Local Business Schema for SEO */}
      <LocalBusinessSchema
        name="SR Holding"
        description="Leading software development company specializing in custom applications, AI solutions, blockchain technology, and modern web platforms. Based in Sofia, Bulgaria."
        url="https://sr-redesign-nextjs.vercel.app"
        address={{
          streetAddress: "Sofia",
          addressLocality: "Sofia",
          addressRegion: "Sofia",
          postalCode: "1000",
          addressCountry: "BG"
        }}
        telephone={contactInfo.phone}
        email={contactInfo.email}
        openingHours={[
          "Mo-Su 00:00-23:59"
        ]}
        priceRange="$$"
        sameAs={[
          "https://www.linkedin.com/company/sr-holding",
          "https://twitter.com/srholding",
          "https://www.facebook.com/srholding"
        ]}
      />
      
      <Navbar />
      <div className="min-h-screen font-sans bg-white">
        <div className="container px-4 py-16 mx-auto">
          {/* Contact Us Title */}
          {/* <motion.div 
            className="mb-12 text-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="mb-4 text-4xl font-bold text-black md:text-5xl">
              Contact Us
            </h1>
            <div className="w-24 h-1 mx-auto bg-black"></div>
          </motion.div> */}
          
          <motion.div 
            className="flex flex-col gap-12 lg:flex-row"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column: Information */}
            <div className="lg:w-1/2">
              <motion.div className="mb-8" variants={fadeInUp}>
                <h1 className="p-4 mb-6 text-5xl font-bold leading-tight text-black bg-white rounded-lg shadow-sm md:text-6xl" style={{ color: '#000000', fontWeight: '700' }}>Have a question?</h1>
              </motion.div>
              <motion.div className="mb-8 space-y-4" variants={fadeInUp}>
                <p className="text-lg leading-relaxed text-gray-700">
                  We're here to help! Reach us via form, email, or phone. SR Holding's Customer Care Team is available 24/7 to assist with orders or technology solutions. You'll receive a personalized reply within 24 business hours.
                </p>
              </motion.div>
              <motion.div className="space-y-6" variants={fadeInUp}>
                <motion.div 
                  className="p-4 rounded-lg bg-gray-50"
                  variants={fadeInLeft}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Contact Information</h3>
                  <motion.a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center mb-3 text-gray-800 transition-colors hover:text-blue-600"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MailIcon />
                    <span className="ml-3 text-lg">{contactInfo.email}</span>
                  </motion.a>
                  <motion.a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center mb-3 text-gray-800 transition-colors hover:text-blue-600"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PhoneIcon />
                    <span className="ml-3 text-lg">{contactInfo.phone}</span>
                  </motion.a>
                  {contactInfo.address && (
                    <motion.div 
                      className="flex items-center text-gray-800"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AddressIcon />
                      <span className="ml-3 text-lg">{contactInfo.address}</span>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column: Form */}
            <motion.div 
              className="max-w-2xl mx-auto lg:w-1/2 lg:mx-0"
              variants={fadeInUp}
            >
              {isSuccess && (
                <motion.div 
                  className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Message sent successfully!
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        Thank you for your message! We will get back to you within 24 business hours.
                      </p>
                    </div>
                    <div className="pl-3 ml-auto">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={() => setIsSuccess(false)}
                          className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-3"
                variants={fadeInUp}
              >
                <div className="flex flex-row gap-5">
                  <div className="w-full">
                    <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors text-black ${
                        errors.firstName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                      style={{ color: '#000000' }}
                      onChange={handleChange}
                      value={formData.firstName}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors text-black ${
                        errors.lastName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                      style={{ color: '#000000' }}
                      onChange={handleChange}
                      value={formData.lastName}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none transition-colors text-black ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    style={{ color: '#000000' }}
                    onChange={handleChange}
                    value={formData.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none transition-colors text-black ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    style={{ color: '#000000' }}
                    onChange={handleChange}
                    value={formData.phone}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-700">
                    Select your topic <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="topic"
                    id="topic"
                    required
                    className={`w-full p-3 border bg-white rounded-md focus:ring-2 focus:outline-none transition-colors text-black ${
                      errors.topic 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    style={{ color: '#000000' }}
                    onChange={handleChange}
                    value={formData.topic}
                  >
                    <option value="" disabled>Choose a topic...</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="business-partnership">Business Partnership</option>
                    <option value="career-opportunities">Career Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.topic && (
                    <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
                  )}
                </div>


                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={3}
                    required
                    placeholder="Please describe your inquiry or project requirements..."
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none transition-colors resize-vertical text-black ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    style={{ color: '#000000' }}
                    onChange={handleChange}
                    value={formData.message}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="p-3 border border-red-200 rounded-md bg-red-50">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-bold py-2 px-4 transition-colors duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
