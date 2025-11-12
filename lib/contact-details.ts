import { unstable_cache } from 'next/cache'
import { getDatabase } from '@/lib/mongodb'
import type { IContactDetails } from '@/lib/models/contact-details'

type ContactDetailsDocument = {
  _id?: { toString(): string }
  phone?: string
  email?: string
  address?: string
  businessHours?: string
  priceRange?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  updatedAt?: Date | string
  updatedBy?: string
}

function normalizeContactDetails(doc: ContactDetailsDocument): IContactDetails {
  return {
    _id: doc._id?.toString(),
    phone: doc.phone ?? '',
    email: doc.email ?? '',
    address: doc.address ?? undefined,
    businessHours: doc.businessHours ?? undefined,
    priceRange: doc.priceRange ?? undefined,
    socialLinks: doc.socialLinks ?? undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(0),
    updatedBy: doc.updatedBy ?? '',
  }
}

export async function fetchContactDetailsFromDb(): Promise<IContactDetails | null> {
  const db = await getDatabase()
  const contactDetails = await db.collection<ContactDetailsDocument>('contactDetails').findOne({})
  return contactDetails ? normalizeContactDetails(contactDetails) : null
}

const getContactDetailsCached = unstable_cache(
  fetchContactDetailsFromDb,
  ['contact-details'],
  { revalidate: 3600 },
)

export async function getContactDetails(options?: { fresh?: boolean }): Promise<IContactDetails | null> {
  if (options?.fresh) {
    return fetchContactDetailsFromDb()
  }
  return getContactDetailsCached()
}

export function serializeContactDetails(details: IContactDetails | null) {
  if (!details) {
    return null
  }

  return {
    ...details,
    updatedAt: details.updatedAt instanceof Date ? details.updatedAt.toISOString() : new Date(details.updatedAt).toISOString(),
  }
}

