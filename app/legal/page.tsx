import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import { LegalDownloadButton } from '@/components/legal-download-button'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'Legal - Privacy Policy, Terms & Conditions, Cookie Policy - SR Holding',
    defaultDescription: 'Read SR Holding\'s privacy policy, terms and conditions, and cookie policy. Learn how we protect your data and use Vercel, Meta Pixel, Bunny security, and Formspree.',
    defaultKeywords: 'privacy policy, terms and conditions, cookie policy, data protection, SR Holding legal'
  }, '/legal')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'Legal - Privacy Policy, Terms & Conditions, Cookie Policy - SR Holding',
      description: 'Read SR Holding\'s privacy policy, terms and conditions, and cookie policy.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'Legal - Privacy Policy, Terms & Conditions, Cookie Policy - SR Holding',
      description: 'Read SR Holding\'s privacy policy, terms and conditions, and cookie policy.',
    },
  }
}

export default function LegalPage() {
  return (
    <div className="min-h-screen text-black bg-white">
      <div className="max-w-4xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-black">Legal Information</h1>
          <p className="mb-6 text-lg text-gray-600">
            Privacy Policy, Terms & Conditions, and Cookie Policy
          </p>
          <LegalDownloadButton />
        </div>

        <div className="space-y-16">
          {/* Privacy Policy */}
          <section>
            <h2 className="mb-6 text-3xl font-bold text-black">Privacy Policy</h2>
            <div className="prose prose-lg max-w-none text-black [&>*]:text-black [&>h3]:text-black [&>p]:text-black [&>li]:text-black [&>strong]:text-black">
              <p className="mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
              
              <h3 className="mb-4 text-xl font-semibold text-black">Information We Collect</h3>
              <p className="mb-4">
                SR Holding collects information you provide directly to us, such as when you create an account, 
                contact us, or use our services. This may include your name, email address, phone number, 
                and any other information you choose to provide.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">How We Use Your Information</h3>
              <ul className="pl-6 mb-4 list-disc">
                <li>To provide, maintain, and improve our services</li>
                <li>To communicate with you about our services</li>
                <li>To process transactions and send related information</li>
                <li>To send technical notices and support messages</li>
                <li>To respond to your comments and questions</li>
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">Third-Party Services</h3>
              <p className="mb-4">
                We use the following third-party services to enhance our website and services:
              </p>
              <ul className="pl-6 mb-4 list-disc">
                <li><strong>Vercel:</strong> We use Vercel for hosting and deployment of our website</li>
                <li><strong>Meta Pixel:</strong> We use Meta Pixel for advertising and analytics to understand user behavior and improve our marketing efforts</li>
                <li><strong>Bunny Security:</strong> We use Bunny for enhanced security and content delivery</li>
                <li><strong>Formspree:</strong> All form submissions are processed through Formspree for secure data handling</li>
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">Data Security</h3>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">Your Rights</h3>
              <p className="mb-4">
                You have the right to access, update, or delete your personal information. You may also 
                opt out of certain communications from us. To exercise these rights, please contact us 
                at hello@srholding.org.
              </p>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section>
            <h2 className="mb-6 text-3xl font-bold text-black">Terms and Conditions</h2>
            <div className="prose prose-lg max-w-none text-black [&>*]:text-black [&>h3]:text-black [&>p]:text-black [&>li]:text-black [&>strong]:text-black">
              <p className="mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">Acceptance of Terms</h3>
              <p className="mb-4">
                By accessing and using SR Holding's website and services, you accept and agree to be bound 
                by the terms and provision of this agreement.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">Use License</h3>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials on SR Holding's 
                website for personal, non-commercial transitory viewing only. This is the grant of a license, 
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="pl-6 mb-4 list-disc">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">Service Availability</h3>
              <p className="mb-4">
                SR Holding reserves the right to modify or discontinue the service (or any part thereof) 
                temporarily or permanently with or without notice. We shall not be liable to you or to 
                any third party for any modification, price change, suspension, or discontinuance of the service.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">Limitation of Liability</h3>
              <p className="mb-4">
                In no event shall SR Holding, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your use of the service.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">Governing Law</h3>
              <p className="mb-4">
                These terms shall be interpreted and governed by the laws of the United Arab Emirates, 
                without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          {/* Cookie Policy */}
          <section>
            <h2 className="mb-6 text-3xl font-bold text-black">Cookie Policy</h2>
            <div className="prose prose-lg max-w-none text-black [&>*]:text-black [&>h3]:text-black [&>p]:text-black [&>li]:text-black [&>strong]:text-black">
              <p className="mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">What Are Cookies</h3>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit a website. They are widely used to make websites work more efficiently and to provide 
                information to website owners.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">How We Use Cookies</h3>
              <p className="mb-4">
                SR Holding uses cookies for the following purposes:
              </p>
              <ul className="pl-6 mb-4 list-disc">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> We use Meta Pixel to analyze website traffic and user behavior</li>
                <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website</li>
                <li><strong>Security Cookies:</strong> Enhanced security through Bunny's content delivery network</li>
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">Third-Party Cookies</h3>
              <p className="mb-4">
                Our website may contain cookies from third-party services:
              </p>
              <ul className="pl-6 mb-4 list-disc">
                <li><strong>Meta Pixel:</strong> Used for advertising and analytics purposes</li>
                <li><strong>Vercel:</strong> Platform-specific cookies for hosting and performance</li>
                <li><strong>Bunny:</strong> Security and content delivery cookies</li>
                <li><strong>Formspree:</strong> Cookies related to form submission and processing</li>
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">Managing Cookies</h3>
              <p className="mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are 
                already on your computer and you can set most browsers to prevent them from being placed. 
                If you do this, however, you may have to manually adjust some preferences every time you 
                visit a site and some services and functionalities may not work.
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">Contact Us</h3>
              <p className="mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact 
                us at hello@srholding.org.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="p-8 rounded-lg bg-gray-50">
            <h2 className="mb-4 text-2xl font-bold text-black">Contact Information</h2>
            <div className="text-black">
              <p className="mb-2 text-black">
                <strong className="text-black">SR SOFTWARE HOLDING FZ LLC</strong>
              </p>
              <p className="mb-2 text-black">1034 Al Wasl Rd, Dubai, United Arab Emirates</p>
              <p className="mb-2 text-black">Email: hello@srholding.org</p>
              <p className="mb-2 text-black">Phone: +359878908741</p>
              <p className="mt-4 text-sm text-black">
                For any questions regarding our privacy policy, terms and conditions, or cookie policy, 
                please don't hesitate to contact us.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
