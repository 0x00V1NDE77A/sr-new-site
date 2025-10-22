// FAQ Model - Type Definitions Only

export interface IFAQ {
  _id?: string
  question: string
  answer: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface FAQSubmission {
  question: string
  answer: string
  order: number
  isActive: boolean
}