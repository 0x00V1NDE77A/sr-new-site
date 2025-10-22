import { JoinTeamJobSchema } from './job-schema'
import JoinTeamPageClient from './page-client'

export default function JoinTeamPage() {
  return (
    <>
      {/* Job Posting structured data for SEO */}
      <JoinTeamJobSchema />
      
      {/* Client component with all the animations and interactions */}
      <JoinTeamPageClient />
    </>
  )
}
