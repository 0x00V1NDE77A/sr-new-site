// Contact Model - Type Definitions Only

export interface IContact {
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  topic: string
  message: string
  status: 'new' | 'read' | 'replied' | 'closed'
  createdAt: Date
  updatedAt: Date
  adminNotes?: string
  repliedAt?: Date
  repliedBy?: string
}

export interface ContactSubmission {
  firstName: string
  lastName: string
  email: string
  phone?: string
  topic: string
  message: string
}