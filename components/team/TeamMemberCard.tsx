"use client";

import React from 'react';
import { Linkedin } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="group cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-2">
      <div className="bg-white border border-gray-100 transition-all duration-500 ease-out hover:border-black hover:shadow-2xl relative overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
          />
          {/* Black overlay with team text and LinkedIn */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-500 ease-out flex flex-col items-center justify-center">
            <div className="text-white text-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              <p className="text-sm font-light tracking-wider uppercase mb-4">Our Team Members</p>
            </div>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-200 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-6 h-6 text-black" />
              </a>
            )}
          </div>
        </div>
        <div className="p-6 relative">
          <h3 className="text-xl font-medium text-black mb-1 tracking-tight transform transition-all duration-300 group-hover:translate-x-1">
            {member.name}
          </h3>
          <p className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wider transform transition-all duration-300 delay-75 group-hover:translate-x-1">
            {member.role}
          </p>
          <p className="text-gray-700 leading-relaxed text-sm transform transition-all duration-300 delay-150 group-hover:translate-x-1">
            {member.bio}
          </p>
          {/* Subtle accent line that grows on hover */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
