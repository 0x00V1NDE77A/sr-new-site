"use client";

import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import { TeamMember } from './types';

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Rusi Russev",
    role: "CEO-Chief Executive Officer",
    bio: "Rusi is the Chief Executive Officer of SR Holdings, where he leads all technical operations and oversees the full development team. He turns complex ideas into working, scalable systems — fast.",
    image: "/images/executive-2.png",
    linkedin: "https://www.linkedin.com/in/rusirussev"
  },
  {
    id: 2,
    name: "Slavi Kolev",
    role: "COO-Chief Operating Officer",
    bio: "Slavi Kolev is the Chief Operating Officer of SR Holding, a fast-scaling tech group delivering high-impact software across automotive, hospitality, fintech. He leads strategy, product vision, and key partnerships",
    image: "/images/executive-1.jpeg",
    linkedin: "https://www.linkedin.com/in/slavi-kolev-939284350/"
  },
  {
    id: 3,
    name: "Marin Nikolov",
    role: "CSO-Chief Sales Officer",
    bio: "Marin Nikolov is the Chief Sales Officer at SR Software Holding, bringing a creative edge and strategic mindset shaped by his experience as founder of Nikolov Arts.",
    image: "/team3.png",
    linkedin: "https://www.linkedin.com/in/marin-nikolov-3095a7200/"
  },
  {
    id: 4,
    name: "Carlos Garza",
    role: "Head of US Market Expansion",
    bio: "With a deep understanding of transatlantic business dynamics,he bridges the gap between Europe and the US, driving strategic partnerships and market expansion.",
    image: "/team4.jpg",
    linkedin: ""
  },
  {
    id: 5,
    name: "Anton Georgiev",
    role: "Senior Full-Stack Developer",
    bio: "Anton Georgiev - Senior Full-Stack Developer Anton Georgiev is a Senior Full-Stack Developer with deep expertise in building scalable, high-performance web applications from the ground up.",
    image: "/team5.jpeg",
    linkedin: "https://www.linkedin.com/in/anton-georgiev-33b52a194/"
  },
  {
    id: 6,
    name: "Stoyan Tanev",
    role: "Sales Representative",
    bio: "Stoyan Tanev is a Sales Representative at SR Software Holding, bringing a creative edge and strategic mindset shaped by his experience as founder of Nikolov Arts.",
    image: "/team6.jpg",
    linkedin: ""
  },
  
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
