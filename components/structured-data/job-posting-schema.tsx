interface JobPostingSchemaProps {
  title: string
  description: string
  datePosted: string
  validThrough: string
  employmentType: string
  hiringOrganization: {
    name: string
    url: string
    logo?: string
  }
  jobLocation: {
    address: {
      streetAddress?: string
      addressLocality: string
      addressRegion?: string
      postalCode?: string
      addressCountry: string
    }
  }
  baseSalary?: {
    currency: string
    value: {
      minValue: number
      maxValue: number
    }
  }
  workHours?: string
  benefits?: string[]
  qualifications?: string[]
  responsibilities?: string[]
  skills?: string[]
  educationRequirements?: string
  experienceRequirements?: string
}

export function JobPostingSchema({
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  hiringOrganization,
  jobLocation,
  baseSalary,
  workHours,
  benefits,
  qualifications,
  responsibilities,
  skills,
  educationRequirements,
  experienceRequirements
}: JobPostingSchemaProps) {
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    validThrough,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: hiringOrganization.name,
      url: hiringOrganization.url,
      ...(hiringOrganization.logo && { logo: hiringOrganization.logo })
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...jobLocation.address
      }
    },
    ...(baseSalary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: baseSalary.currency,
        value: {
          "@type": "QuantitativeValue",
          minValue: baseSalary.value.minValue,
          maxValue: baseSalary.value.maxValue,
          unitText: "YEAR"
        }
      }
    }),
    ...(workHours && { workHours }),
    ...(benefits && { benefits }),
    ...(qualifications && { qualifications }),
    ...(responsibilities && { responsibilities }),
    ...(skills && { skills }),
    ...(educationRequirements && { educationRequirements }),
    ...(experienceRequirements && { experienceRequirements })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
    />
  )
}
