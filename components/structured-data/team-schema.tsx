import { PersonSchema } from './person-schema'

interface TeamMember {
  name: string
  jobTitle: string
  description: string
  image?: string
  email?: string
  knowsAbout?: string[]
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
}

interface TeamSchemaProps {
  organizationName: string
  organizationUrl: string
  teamMembers: TeamMember[]
}

export function TeamSchema({ organizationName, organizationUrl, teamMembers }: TeamSchemaProps) {
  return (
    <>
      {teamMembers.map((member, index) => (
        <PersonSchema
          key={index}
          name={member.name}
          jobTitle={member.jobTitle}
          description={member.description}
          image={member.image}
          email={member.email}
          address={member.address}
          worksFor={{
            name: organizationName,
            url: organizationUrl
          }}
          knowsAbout={member.knowsAbout}
          hasOccupation={{
            name: member.jobTitle,
            description: member.description
          }}
        />
      ))}
    </>
  )
}
