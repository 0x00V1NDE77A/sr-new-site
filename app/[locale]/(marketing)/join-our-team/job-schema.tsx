import { JobPostingSchema } from '@/components/structured-data/job-posting-schema'

type JobSchemaEntry = {
  id: string
  title: string
  schema: {
    description: string
    datePosted: string
    validThrough: string
    employmentType: string
    jobLocation: {
      addressLocality: string
      addressRegion: string
      addressCountry: string
    }
    baseSalary: {
      currency: string
      minValue: number
      maxValue: number
    }
    workHours: string
    benefits: string[]
    qualifications: string[]
    responsibilities: string[]
    skills: string[]
    educationRequirements: string
    experienceRequirements: string
  }
}

interface JoinTeamJobSchemaProps {
  jobs: JobSchemaEntry[]
}

export function JoinTeamJobSchema({ jobs }: JoinTeamJobSchemaProps) {
  return (
    <>
      {jobs.map((job) => (
        <JobPostingSchema
          key={job.id}
          title={job.title}
          description={job.schema.description}
          datePosted={job.schema.datePosted}
          validThrough={job.schema.validThrough}
          employmentType={job.schema.employmentType}
          hiringOrganization={{
            name: 'SR Holding',
            url: 'https://sr-redesign-nextjs.vercel.app',
            logo: 'https://sr-redesign-nextjs.vercel.app/logo.png',
          }}
          jobLocation={{
            address: {
              addressLocality: job.schema.jobLocation.addressLocality,
              addressRegion: job.schema.jobLocation.addressRegion,
              addressCountry: job.schema.jobLocation.addressCountry,
            },
          }}
          baseSalary={{
            currency: job.schema.baseSalary.currency,
            value: {
              minValue: job.schema.baseSalary.minValue,
              maxValue: job.schema.baseSalary.maxValue,
            },
          }}
          workHours={job.schema.workHours}
          benefits={job.schema.benefits}
          qualifications={job.schema.qualifications}
          responsibilities={job.schema.responsibilities}
          skills={job.schema.skills}
          educationRequirements={job.schema.educationRequirements}
          experienceRequirements={job.schema.experienceRequirements}
        />
      ))}
    </>
  )
}
