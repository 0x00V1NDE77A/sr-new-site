'use client'

import { Download } from 'lucide-react'

export function LegalDownloadButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-colors duration-200 bg-black border border-transparent rounded-md shadow-sm no-print hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
    >
      <Download className="w-5 h-5 mr-2" />
      Download PDF
    </button>
  )
}
