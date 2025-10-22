import { OrganizationSchema } from "@/components/structured-data/organization-schema"
import { WebsiteSchema } from "@/components/structured-data/website-schema"
import { SoftwareApplicationSchema } from "@/components/structured-data/software-application-schema"
import { ServiceSchema } from "@/components/structured-data/service-schema"
import { ReviewSchema } from "@/components/structured-data/review-schema"

export function SEOSection() {
	// Static SEO values - no database calls for instant loading
	const siteName = "SR Holding"
	const siteDescription = "Leading software development company"
	const siteUrl = "https://sr-redesign-nextjs.vercel.app"

	return (
		<>
			<OrganizationSchema
				name={siteName}
				description="Leading software development company specializing in custom applications, AI solutions, blockchain technology, and modern web platforms. Based in Sofia, Bulgaria."
				url={siteUrl}
				address={{
					streetAddress: "Sofia",
					addressLocality: "Sofia",
					addressRegion: "Sofia",
					postalCode: "1000",
					addressCountry: "BG",
				}}
				contactPoint={{
					telephone: "+359878908741",
					contactType: "customer service",
					email: "hello@srholding.org",
				}}
				sameAs={[
					"https://www.linkedin.com/company/sr-holding",
					"https://twitter.com/srholding",
					"https://www.facebook.com/srholding",
				]}
			/>

			<WebsiteSchema
				name={siteName}
				description={siteDescription}
				url={siteUrl}
				potentialAction={{
					target: `${siteUrl}/search?q={search_term_string}`,
					queryInput: "required name=search_term_string",
				}}
				publisher={{
					name: siteName,
					logo: `${siteUrl}/logo.png`,
				}}
			/>

			<SoftwareApplicationSchema
				name="SR Holding Software Solutions"
				description="Comprehensive software development platform offering custom applications, AI solutions, blockchain technology, and modern web platforms for businesses worldwide."
				applicationCategory="BusinessApplication"
				operatingSystem={["Web", "Windows", "macOS", "Linux", "iOS", "Android"]}
				softwareVersion="2.0"
				datePublished="2024-01-01"
				dateModified={new Date().toISOString().split('T')[0]}
				author={{
					name: siteName,
					url: siteUrl
				}}
				publisher={{
					name: siteName,
					url: siteUrl
				}}
				offers={{
					price: "Contact for pricing",
					priceCurrency: "USD",
					availability: "https://schema.org/InStock"
				}}
				screenshot={`${siteUrl}/logo.png`}
				softwareRequirements="Modern web browser, Internet connection"
				memoryRequirements="Minimum 4GB RAM recommended"
				storageRequirements="Variable based on project requirements"
				processorRequirements="Multi-core processor recommended"
			/>

			<ServiceSchema
				name="Software Development Services"
				description="Professional software development services including custom applications, AI solutions, blockchain development, and modern web platforms."
				provider={{
					name: siteName,
					url: siteUrl
				}}
				serviceType="Software Development"
				areaServed="Worldwide"
				availableChannel={{
					serviceUrl: `${siteUrl}/contact`,
					serviceName: "Contact Form"
				}}
				offers={{
					price: "Contact for pricing",
					priceCurrency: "USD",
					availability: "https://schema.org/InStock"
				}}
				category="Technology Services"
				audience={{
					audienceType: "Businesses and Organizations"
				}}
				hasOfferCatalog={{
					name: "Software Development Services",
					itemListElement: [
						{
							item: {
								name: "Web Development",
								description: "Responsive and scalable web applications"
							}
						},
						{
							item: {
								name: "Mobile Apps",
								description: "Native and cross-platform applications"
							}
						},
						{
							item: {
								name: "AI Integration",
								description: "Smart solutions powered by AI"
							}
						},
						{
							item: {
								name: "Data Infrastructure",
								description: "Transform raw data into insights"
							}
						},
						{
							item: {
								name: "Cybersecurity",
								description: "Enterprise-grade security solutions"
							}
						}
					]
				}}
			/>

			<ReviewSchema
				reviews={[
					{
						author: {
							name: "John Smith",
							url: "https://linkedin.com/in/johnsmith"
						},
						reviewRating: {
							ratingValue: 5,
							bestRating: 5,
							worstRating: 1
						},
						reviewBody: "SR Holding delivered an exceptional software solution that exceeded our expectations. Their team's expertise in AI and blockchain technology is unmatched.",
						datePublished: "2024-01-15",
						itemReviewed: {
							name: "Software Development Services",
							description: "Custom software development and AI solutions"
						}
					},
					{
						author: {
							name: "Sarah Johnson",
							url: "https://linkedin.com/in/sarahjohnson"
						},
						reviewRating: {
							ratingValue: 5,
							bestRating: 5,
							worstRating: 1
						},
						reviewBody: "Outstanding work! The team at SR Holding transformed our business with their innovative web platform. Highly recommended for any technology project.",
						datePublished: "2024-02-20",
						itemReviewed: {
							name: "Web Development Services",
							description: "Modern web platform development"
						}
					},
					{
						author: {
							name: "Michael Chen",
							url: "https://linkedin.com/in/michaelchen"
						},
						reviewRating: {
							ratingValue: 5,
							bestRating: 5,
							worstRating: 1
						},
						reviewBody: "Professional, reliable, and innovative. SR Holding's blockchain solutions helped us stay ahead of the competition. Excellent communication throughout the project.",
						datePublished: "2024-03-10",
						itemReviewed: {
							name: "Blockchain Development",
							description: "Blockchain and cryptocurrency solutions"
						}
					}
				]}
				aggregateRating={{
					ratingValue: 5,
					reviewCount: 3,
					bestRating: 5,
					worstRating: 1
				}}
			/>
		</>
	)
}
