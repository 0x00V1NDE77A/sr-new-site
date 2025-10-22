// Contact Details Model - Type Definitions Only

export interface IContactDetails {
  _id?: string
  phone: string
  email: string
  address?: string
  // Additional fields for LocalBusiness schema
  businessHours?: string
  priceRange?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  updatedAt: Date
  updatedBy: string
}