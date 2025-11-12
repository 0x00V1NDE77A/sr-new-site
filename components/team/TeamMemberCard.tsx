"use client";

import React from 'react';
import { Linkedin } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
  overlayLabel: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, overlayLabel }) => {
  return (
    <div className="transition-all duration-500 ease-out transform cursor-pointer group hover:-translate-y-2">
      <div className="relative overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-100 hover:border-black hover:shadow-2xl">
        <div className={`${(member.role && member.role.toLowerCase().includes('chief executive')) || member.name === 'Rusi Russev' ? 'p-2 md:p-3' : ''} aspect-square overflow-hidden bg-gray-50 relative`}>
          <img
            src={member.image}
            alt={member.name}
            className="object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-110"
          />
          {/* Black overlay with team text and LinkedIn */}
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out bg-black bg-opacity-0 group-hover:bg-opacity-70">
            <div className="text-center text-white transition-all duration-500 ease-out transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="mb-4 text-sm font-light tracking-wider uppercase">{overlayLabel}</p>
            </div>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition-all duration-500 ease-out delay-200 transform translate-y-4 bg-white rounded-full shadow-lg opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:shadow-xl hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-6 h-6 text-black" />
              </a>
            )}
          </div>
        </div>
        <div className="relative p-6">
          <h3 className="mb-1 text-xl font-medium tracking-tight text-black transition-all duration-300 transform group-hover:translate-x-1">
            {member.name}
          </h3>
          <p className="mb-4 text-sm font-light tracking-wider text-gray-500 uppercase transition-all duration-300 delay-75 transform group-hover:translate-x-1">
            {member.role}
          </p>
          <p className="text-sm leading-relaxed text-gray-700 transition-all duration-300 delay-150 transform group-hover:translate-x-1">
            {member.bio}
          </p>
          {/* Subtle accent line that grows on hover */}
          <div className="absolute bottom-0 h-px transition-transform duration-500 ease-out origin-left transform scale-x-0 bg-black left-6 right-6 group-hover:scale-x-100"></div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
