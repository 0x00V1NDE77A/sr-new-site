export function FAQLoadingSkeleton() {
  return (
    <section className="px-4 py-24 bg-black sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-white md:text-5xl">Frequently Asked Questions</h2>
            <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse"></div>
          </div>
          <div className="h-6 max-w-2xl mx-auto bg-gray-800 rounded animate-pulse"></div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 border-gray-800 rounded-lg bg-gray-900/50">
              <div className="h-6 mb-2 bg-gray-800 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}