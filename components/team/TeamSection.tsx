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
    name: "Sean Isa",
    role: "CGO-Chief Growth Officer",
    bio: "Sean Isa is the Chief Growth Officer of SR Holding, leading strategic growth initiatives and driving business expansion across markets. He focuses on scaling operations and building strategic partnerships to accelerate company growth.",
    image: "/team7.jpg",
    linkedin: "https://www.linkedin.com/in/sean-isa-44445a165/"
  },
  {
    id: 5,
    name: "Carlos Garza",
    role: "Head of US Market Expansion",
    bio: "With a deep understanding of transatlantic business dynamics,he bridges the gap between Europe and the US, driving strategic partnerships and market expansion.",
    image: "/team4.jpg",
    linkedin: ""
  },
  {
    id: 6,
    name: "Anton Georgiev",
    role: "CTO-Chief Technology Officer",
    bio: "Anton Georgiev is the Chief Technology Officer of SR Holding, leading all technology initiatives and overseeing the development of scalable, high-performance solutions. He brings deep expertise in building robust systems from the ground up.",
    image: "/team5.jpeg",
    linkedin: "https://www.linkedin.com/in/anton-georgiev-33b52a194/"
  },
  {
    id: 7,
    name: "Stoyan Tanev",
    role: "Sales Representative",
    bio: "Stoyan Tanev is a Sales Representative at SR Software Holding, bringing a creative edge and strategic mindset shaped by his experience as founder of Nikolov Arts.",
    image: "/team6.jpg",
    linkedin: ""
  },
  
];

const TeamSection: React.FC = () => {
  const totalMembers = teamMembers.length;
  
  return (
    <section className="py-8 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`opacity-0 animate-fade-in-up ${index === 0 ? 'lg:col-span-2' : ''}`}
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
