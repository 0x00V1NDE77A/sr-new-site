"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface JoinTeamButtonProps {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

const JoinTeamButton: React.FC<JoinTeamButtonProps> = ({ title, description, ctaLabel, href }) => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="opacity-0 animate-fade-in-up">
          <h2 className="mb-6 text-3xl font-light tracking-tight text-black md:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-gray-600">
            {description}
          </p>
          <div className="flex justify-center">
            <Link href={href}>
              <button className="group relative inline-flex items-center px-8 py-4 font-medium tracking-wide text-white transition-all duration-300 ease-out bg-black hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                <span className="mr-3">{ctaLabel}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </button>
            </Link>
          </div>
          <div className="flex justify-center mt-12 space-x-4">
            <div className="w-2 h-2 bg-black rounded-full opacity-30"></div>
            <div className="w-2 h-2 bg-black rounded-full opacity-60"></div>
            <div className="w-2 h-2 bg-black rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinTeamButton;
