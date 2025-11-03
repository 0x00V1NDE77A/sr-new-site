"use client";

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 relative overflow-hidden pt-20 md:pt-8">
      {/* Animated background element */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"></div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4 opacity-0 animate-fade-in-down">
            Our Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-300">
            Meet the talented individuals who make our vision a reality
          </p>
          {/* Decorative line */}
          <div className="w-24 h-px bg-black mx-auto mt-8 transform scale-x-0 animate-scale-x animation-delay-600"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
