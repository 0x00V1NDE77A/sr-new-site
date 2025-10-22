"use client"
import { InfiniteMovingCards } from "./infinite-moving-cards"

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Our Presence
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
         With strategic hubs across five global regions, SR Holding connects local expertise with international scale.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <InfiniteMovingCards items={companies} direction="left" speed="normal" />
      </div>
    </div>
  )
}

const companies = [
  {
    quote: "",
    name: "European headquarters,software development,Bulgaria",
    title: "Bulgaria",
    logo: "",
  },
  {
    quote: "",
    name: "Technology innovation,fintech services,Germany",
    title: "Germany",
    logo: "",
  },
  {
    quote: "",
    name: "Financial service,payments,regional trade gateway,Dubai(UAE)",
    title: "Dubai (UAE)",
    logo: "",
  },
  {
    quote: "",
    name: "Import/Export hub and fintech coordination,Turkey",
    title: "Turkey",
    logo: "",
  },
  {
    quote: "",
    name: "Asia-Pacific trade and fintech developement center,Hongkong",
    title: "Hongkong ",
    logo: "",
  },
  // {
  //   quote: "",
  //   name: "US Navy",
  //   title: "Government",
  //   logo: "https://logos-world.net/wp-content/uploads/2021/09/US-Navy-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Accenture",
  //   title: "Consulting",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/06/Accenture-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Microsoft",
  //   title: "Technology",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/06/Microsoft-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Google",
  //   title: "Technology",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Apple",
  //   title: "Technology",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Amazon",
  //   title: "E-commerce",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Meta",
  //   title: "Social Media",
  //   logo: "https://logos-world.net/wp-content/uploads/2021/10/Meta-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Tesla",
  //   title: "Automotive",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/09/Tesla-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Netflix",
  //   title: "Entertainment",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
  // },
  // {
  //   quote: "",
  //   name: "Spotify",
  //   title: "Music",
  //   logo: "https://logos-world.net/wp-content/uploads/2020/06/Spotify-Logo.png",
  // },
]