import { JobPostingSchema } from '@/components/structured-data/job-posting-schema'

export function JoinTeamJobSchema() {
  const jobPostings = [
    {
      title: "Senior Full Stack Developer",
      description: "Build scalable web applications using React, Node.js, and modern cloud technologies. Work with a talented team to create innovative software solutions that impact millions of users worldwide.",
      datePosted: "2024-01-15",
      validThrough: "2024-12-31",
      employmentType: "FULL_TIME",
      hiringOrganization: {
        name: "SR Holding",
        url: "https://sr-redesign-nextjs.vercel.app",
        logo: "https://sr-redesign-nextjs.vercel.app/logo.png"
      },
      jobLocation: {
        address: {
          addressLocality: "San Francisco",
          addressRegion: "CA",
          addressCountry: "US"
        }
      },
      baseSalary: {
        currency: "USD",
        value: {
          minValue: 120000,
          maxValue: 180000
        }
      },
      workHours: "40 hours per week",
      benefits: [
        "Comprehensive health insurance",
        "Mental health support",
        "Wellness programs",
        "Continuous learning budget",
        "Conference attendance",
        "Career development paths",
        "Flexible hours",
        "Remote work options",
        "Unlimited PTO policy"
      ],
      qualifications: [
        "Bachelor's degree in Computer Science or related field",
        "5+ years of full-stack development experience",
        "Strong proficiency in React, Node.js, and TypeScript",
        "Experience with cloud platforms (AWS, Azure, or GCP)",
        "Knowledge of modern development practices and tools"
      ],
      responsibilities: [
        "Design and develop scalable web applications",
        "Collaborate with cross-functional teams",
        "Write clean, maintainable, and efficient code",
        "Participate in code reviews and technical discussions",
        "Mentor junior developers"
      ],
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL"],
      educationRequirements: "Bachelor's degree in Computer Science or related field",
      experienceRequirements: "5+ years of full-stack development experience"
    },
    {
      title: "Product Designer",
      description: "Design intuitive user experiences for our next-generation software products. Work closely with engineering and product teams to create beautiful, functional interfaces that users love.",
      datePosted: "2024-01-15",
      validThrough: "2024-12-31",
      employmentType: "FULL_TIME",
      hiringOrganization: {
        name: "SR Holding",
        url: "https://sr-redesign-nextjs.vercel.app",
        logo: "https://sr-redesign-nextjs.vercel.app/logo.png"
      },
      jobLocation: {
        address: {
          addressLocality: "New York",
          addressRegion: "NY",
          addressCountry: "US"
        }
      },
      baseSalary: {
        currency: "USD",
        value: {
          minValue: 100000,
          maxValue: 150000
        }
      },
      workHours: "40 hours per week",
      benefits: [
        "Comprehensive health insurance",
        "Mental health support",
        "Wellness programs",
        "Continuous learning budget",
        "Conference attendance",
        "Career development paths",
        "Flexible hours",
        "Remote work options",
        "Unlimited PTO policy"
      ],
      qualifications: [
        "Bachelor's degree in Design or related field",
        "3+ years of product design experience",
        "Proficiency in Figma, Sketch, or Adobe Creative Suite",
        "Strong portfolio demonstrating UX/UI design skills",
        "Experience with user research and testing"
      ],
      responsibilities: [
        "Design user interfaces and experiences",
        "Conduct user research and usability testing",
        "Create wireframes, prototypes, and design systems",
        "Collaborate with product and engineering teams",
        "Present design concepts to stakeholders"
      ],
      skills: ["Figma", "Sketch", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems", "HTML", "CSS"],
      educationRequirements: "Bachelor's degree in Design or related field",
      experienceRequirements: "3+ years of product design experience"
    },
    {
      title: "DevOps Engineer",
      description: "Manage and scale our cloud infrastructure to support millions of users. Implement CI/CD pipelines, monitor system performance, and ensure high availability of our services.",
      datePosted: "2024-01-15",
      validThrough: "2024-12-31",
      employmentType: "FULL_TIME",
      hiringOrganization: {
        name: "SR Holding",
        url: "https://sr-redesign-nextjs.vercel.app",
        logo: "https://sr-redesign-nextjs.vercel.app/logo.png"
      },
      jobLocation: {
        address: {
          addressLocality: "Austin",
          addressRegion: "TX",
          addressCountry: "US"
        }
      },
      baseSalary: {
        currency: "USD",
        value: {
          minValue: 110000,
          maxValue: 160000
        }
      },
      workHours: "40 hours per week",
      benefits: [
        "Comprehensive health insurance",
        "Mental health support",
        "Wellness programs",
        "Continuous learning budget",
        "Conference attendance",
        "Career development paths",
        "Flexible hours",
        "Remote work options",
        "Unlimited PTO policy"
      ],
      qualifications: [
        "Bachelor's degree in Computer Science or related field",
        "4+ years of DevOps or infrastructure experience",
        "Strong experience with AWS, Docker, and Kubernetes",
        "Knowledge of CI/CD pipelines and automation tools",
        "Experience with monitoring and logging systems"
      ],
      responsibilities: [
        "Manage cloud infrastructure and services",
        "Implement and maintain CI/CD pipelines",
        "Monitor system performance and availability",
        "Automate deployment and scaling processes",
        "Ensure security and compliance standards"
      ],
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Monitoring", "Linux", "Python", "Bash"],
      educationRequirements: "Bachelor's degree in Computer Science or related field",
      experienceRequirements: "4+ years of DevOps or infrastructure experience"
    }
  ]

  return (
    <>
      {jobPostings.map((job, index) => (
        <JobPostingSchema
          key={index}
          title={job.title}
          description={job.description}
          datePosted={job.datePosted}
          validThrough={job.validThrough}
          employmentType={job.employmentType}
          hiringOrganization={job.hiringOrganization}
          jobLocation={job.jobLocation}
          baseSalary={job.baseSalary}
          workHours={job.workHours}
          benefits={job.benefits}
          qualifications={job.qualifications}
          responsibilities={job.responsibilities}
          skills={job.skills}
          educationRequirements={job.educationRequirements}
          experienceRequirements={job.experienceRequirements}
        />
      ))}
    </>
  )
}
