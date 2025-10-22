"use client";

import { motion } from "framer-motion";
import { TypingText } from "@/components/ui/typing-text";

export function HeroSectionOne() {
  return (
    <div className="bg-black">
      <div className="bg-black relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
    
     
        <div className="px-4 py-10 md:py-20">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="text-2xl font-bold text-white md:text-4xl lg:text-7xl dark:text-slate-300">
              <TypingText
                text="Build with SR Holding"
                duration={150}
                delay={500}
                inView={true}
                inViewOnce={true}
                cursor={true}
                loop={false}
                holdDelay={2000}
                cursorClassName="bg-white dark:bg-slate-300"
                className="text-white dark:text-slate-300"
              />
            </h1>
          </div>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-400 dark:text-neutral-300"
          >
            With our cutting-edge software development expertise, you can launch your custom applications in weeks, not months. 
            We see technology not just as a product, but as infrastructure—a foundation for modern economies.
             That’s why SR Holding invests heavily in digital architecture, cybersecurity integration, and scalable platforms that support the global economy.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Start Project
            </button>
            <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
              Contact Us
            </button>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
            }}
            className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
              <img
                src="https://assets.aceternity.com/pro/aceternity-landing.webp"
                alt="Software development preview"
                className="aspect-[16/9] h-auto w-full object-cover"
                height={1000}
                width={1000}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

