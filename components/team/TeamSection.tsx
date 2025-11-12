"use client";

import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import { TeamMember } from './types';

interface TeamSectionProps {
  members: TeamMember[];
  overlayLabel: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ members, overlayLabel }) => {
  return (
    <section className="py-8 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member, index) => (
            <div
              key={member.id}
              className={`opacity-0 animate-fade-in-up ${index === 0 ? 'lg:col-span-2' : ''}`}
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <TeamMemberCard member={member} overlayLabel={overlayLabel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
