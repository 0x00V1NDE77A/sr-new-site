"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { FAQSchema } from "@/components/structured-data/faq-schema"
import { useTranslations } from "next-intl"

interface FAQItem {
  question: string
  answer: string
}

interface FAQClientProps {
  faqs: FAQItem[]
}

export const FAQClient = ({ faqs }: FAQClientProps) => {
  const t = useTranslations("FAQ")

  if (!faqs || faqs.length === 0) {
    return null
  }
  
  return (
    <section className="px-4 py-24 bg-white sm:px-6 lg:px-8">
      <FAQSchema faqs={faqs} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-black md:text-5xl">{t("title")}</h2>
            <button className="faq-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                ></path>
              </svg>
              <span className="tooltip">{t("iconLabel")}</span>
            </button>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <Accordion type="single" defaultValue="item-1" collapsible className="w-full max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`} className="px-6 border-gray-200 rounded-lg bg-gray-50">
              <AccordionTrigger className="text-left text-black hover:text-black">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-black mb-4">{t("ctaTitle")}</h3>
            <p className="text-gray-600 mb-8">
              {t("ctaDescription")}
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
            >
              {t("contactCta")}
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
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
          background-color: #000000;
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
