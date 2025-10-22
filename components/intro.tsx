export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 text-foreground">
        Blog.
      </h1>
      <h2 className="text-center md:text-left text-lg mt-5 md:pl-8 text-muted-foreground">
        Latest insights and updates from SR Holding on software development, 
        technology trends, and industry best practices.
      </h2>
    </section>
  );
}
