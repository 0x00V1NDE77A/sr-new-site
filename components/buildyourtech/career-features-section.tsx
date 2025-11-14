"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout, Pointer, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TabContent {
  badge: string
  title: string
  description: string
  buttonText: string
  imageSrc: string
  imageAlt: string
}

interface Tab {
  value: string
  icon: React.ReactNode
  label: string
  content: TabContent
}

interface CareerFeaturesProps {
  badge?: string
  heading?: string
  description?: string
  tabs?: Tab[]
}

const CareerFeaturesSection = ({
  badge = "Build Your Tech Career",
  heading = "Shape the Future of Technology and Fintech",
  description = "Join a global team of innovators and builders. We're looking for talented engineers, designers, and visionaries.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Innovation First",
      content: {
        badge: "Emerging Technologies",
        title: "Work on cutting-edge AI, blockchain, and fintech solutions.",
        description:
          "Be at the forefront of emerging technologies. Work on AI solutions that impact millions of people globally, build blockchain infrastructure, and develop fintech platforms that transform industries.",
        buttonText: "Explore Opportunities",
        imageSrc:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
        imageAlt: "Team innovation and collaboration",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Global Reach",
      content: {
        badge: "Worldwide Impact",
        title: "Collaborate with teams across 25+ countries on world-class projects.",
        description:
          "Join 500+ talented professionals from diverse backgrounds and cultures. Collaborate with teams across Bulgaria, Germany, Dubai, and beyond. Work on projects that shape industries and help millions of users globally.",
        buttonText: "View Open Positions",
        imageSrc:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        imageAlt: "Global team collaboration",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Career Growth",
      content: {
        badge: "Professional Development",
        title: "Continuous learning, mentorship, and clear career progression.",
        description:
          "We offer an environment where exceptional tech talent can build lasting careers. Continuous learning, mentorship programs, and clear career progression opportunities. Work at SR Holding means being at the forefront of emerging technologies and setting industry standards.",
        buttonText: "Learn More",
        imageSrc:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
        imageAlt: "Career growth and development",
      },
    },
  ],
}: CareerFeaturesProps) => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 uppercase tracking-wide">
            {badge}
          </Badge>
          <h2 className="max-w-3xl text-3xl font-bold md:text-5xl leading-tight">
            {heading}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10 bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white/60 backdrop-blur border border-white/10 bg-white/5 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-lg transition-all duration-300 hover:text-white hover:bg-white/20 active:scale-95"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-10 max-w-screen-xl rounded-3xl bg-white/5 p-6 lg:p-16 border border-white/10 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-16 lg:grid-cols-2"
              >
                <div className="flex flex-col gap-5">
                  <Badge variant="outline" className="w-fit bg-white/15 text-white border-white/20">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-bold lg:text-5xl leading-tight">
                    {tab.content.title}
                  </h3>
                  <p className="text-white/75 lg:text-lg leading-relaxed">
                    {tab.content.description}
                  </p>
                  <Button className="mt-2.5 w-fit gap-2" size="lg" variant="secondary">
                    {tab.content.buttonText}
                  </Button>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-2xl w-full h-auto shadow-2xl border border-white/15"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  )
}

export { CareerFeaturesSection }