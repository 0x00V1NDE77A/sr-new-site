"use client";

import React from "react";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20 bg-white">
      <h2 className="pl-4 mx-auto text-xl font-bold text-black max-w-7xl md:text-5xl">
        Our Software Solutions Portfolio
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const SRHoldingContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"sr-holding-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="max-w-3xl mx-auto text-base text-neutral-600 dark:text-neutral-400 md:text-2xl">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                SR Holding delivers cutting-edge software solutions that transform businesses.
              </span>{" "}
              From custom software development to AI-powered solutions, we build robust applications that drive digital success. Our team of 200+ professionals ensures your projects are delivered with excellence and innovation.
            </p>
            <div className="relative w-full h-full mx-auto md:w-1/2 md:h-1/2">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Software development team working on innovative projects"
                width={500}
                height={500}
                className="object-contain rounded-lg"
                priority={false}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

const data = [
    {
      category: "Custom Software Development",
      title: "Tailored solutions for your business needs.",
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      content: <SRHoldingContent />,
    },
    {
      category: "Machine Learning & AI",
      title: "Intelligent automation and AI-powered solutions.",
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2134&q=80",
      content: <SRHoldingContent />,
    },
    {
      category: "Blockchain Technology",
      title: "Secure, decentralized applications and smart contracts.",
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      content: <SRHoldingContent />,
    },
    {
      category: "Web Application Development",
      title: "Modern, responsive web applications.",
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      content: <SRHoldingContent />,
    },
    {
      category: "Mobile App Development",
      title: "Native and cross-platform mobile applications.",
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      content: <SRHoldingContent />,
    },
    {
      category: "Database & Infrastructure",
      title: "Robust database design and scalable infrastructure.",
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2134&q=80",
      content: <SRHoldingContent />,
    },
  ];