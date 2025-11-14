"use client";

// Minimal, logo-wall style section commonly used across modern sites
// Renders our stack in uniform tiles that adapt nicely across breakpoints

// Curated core stack (15 items) provided by user
const TOOLS = [
  "React.js",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Node.js",
  "Express.js",
  "NestJS",
  "Django",
  "Laravel",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
];

export default function Technologies() {
  return (
    <section className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Technologies We Use</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Modern, proven tools to ship secure, scalable, and maintainable products.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 grid-rows-2 gap-3">
        {TOOLS.slice(0, 15).map((name) => (
          <div
            key={name}
            className="group h-12 rounded-lg border border-black/10 bg-white px-3 text-xs font-medium text-black/80 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-black/15"
          >
            <span className="transition-colors duration-300 group-hover:text-black">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
