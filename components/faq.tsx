"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { FAQSchema } from "@/components/structured-data/faq-schema"

export const FAQ = () => {
  const faqData = [
    {
      question: "What makes SR Holding different from other software companies?",
      answer: "SR Holding combines cutting-edge technology expertise with deep industry knowledge. We specialized in custom software development, machine learning integration, blockchain solutions, and modern web applications. Our approach focuses on delivering scalable, secure, and innovative solutions that drive real business value."
    },
    {
      question: "What types of software solutions do you develop?",
      answer: "We develop a comprehensive range of software solutions including custom web applications, mobile apps, enterprise software, AI and machine learning systems, blockchain applications, database solutions, and cloud-based platforms. Each solution is tailored to meet your specific business requirements."
    },
    {
      question: "How long does a typical software development project take?",
      answer: "Project timelines vary based on complexity and scope. Simple web applications typically take 2-4 months, while complex enterprise solutions can take 6-12 months. We provide detailed project timelines during the initial consultation and maintain regular communication throughout the development process."
    },
    {
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes, we offer comprehensive support and maintenance services including bug fixes, security updates, performance optimization, feature enhancements, and 24/7 technical support. Our support packages are designed to keep your software running smoothly and securely."
    },
    {
      question: "What technologies and programming languages do you use?",
      answer: "We work with a wide range of modern technologies including React, Next.js, Node.js, Python, Java, C#, AWS, Azure, Docker, Kubernetes, and more. We choose the best technology stack based on your project requirements, scalability needs, and long-term goals."
    },
    {
      question: "How do you ensure the security of our software?",
      answer: "Security is a top priority in all our projects. We implement industry-standard security practices including secure coding, regular security audits, penetration testing, data encryption, secure authentication, and compliance with security standards like OWASP guidelines."
    }
  ]

  return (
    <section className="bg-black py-24 px-4 sm:px-6 lg:px-8">
      {/* FAQ Schema for SEO */}
      <FAQSchema faqs={faqData} />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Frequently Asked Questions</h2>
            <button className="faq-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                ></path>
              </svg>
              <span className="tooltip">FAQ</span>
            </button>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn more about SR Holding's software development services and technology solutions
          </p>
        </div>

        <Accordion type="single" defaultValue="item-1" collapsible className="max-w-3xl mx-auto w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`} className="border-gray-800 bg-gray-900/50 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <style jsx>{`
        .faq-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background-color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.151);
          position: relative;
        }

        .faq-button:hover {
          animation: jello-vertical 1s both;
        }
        
        .faq-button svg {
          height: 1.5em;
          fill: white;
        }

        @keyframes jello-vertical {
          0% {
            transform: scale3d(1, 1, 1);
          }
          30% {
            transform: scale3d(0.75, 1.25, 1);
          }
          40% {
            transform: scale3d(1.25, 0.75, 1);
          }
          50% {
            transform: scale3d(0.85, 1.15, 1);
          }
          65% {
            transform: scale3d(1.05, 0.95, 1);
          }
          75% {
            transform: scale3d(0.95, 1.05, 1);
          }
          100% {
            transform: scale3d(1, 1, 1);
          }
        }

        .tooltip {
          position: absolute;
          top: -20px;
          opacity: 0;
          background-color: #000000;
          background-image: linear-gradient(147deg, #000000 0%, #ffffff 74%);
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition-duration: 0.2s;
          pointer-events: none;
          letter-spacing: 0.5px;
        }

        .tooltip::before {
          position: absolute;
          content: "";
          width: 10px;
          height: 10px;
          background-color: #ffffff;
          background-size: 1000%;
          background-position: center;
          transform: rotate(45deg);
          bottom: -15%;
          transition-duration: 0.3s;
        }

        .faq-button:hover .tooltip {
          top: -40px;
          opacity: 1;
          transition-duration: 0.3s;
        }
      `}</style>
    </section>
  )
}
