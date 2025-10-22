"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ContactDetails {
  _id?: string
  phone: string
  email: string
  address?: string
  updatedAt: string
  updatedBy: string
}

export default function AdminContactDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    phone: '',
    email: '',
    address: '',
    updatedAt: '',
    updatedBy: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/admin')
      return
    }
  }, [session, status, router])

  // Fetch contact details
  const fetchContactDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact-details')
      const data = await response.json()
      
      if (data.success) {
        setContactDetails(data.data)
      } else {
        toast.error('Failed to fetch contact details')
      }
    } catch (error) {
      console.error('Error fetching contact details:', error)
      toast.error('Failed to fetch contact details')
    } finally {
      setLoading(false)
    }
  }

  // Update contact details
  const handleSave = async () => {
    try {
      setSaving(true)
      setValidationErrors({})
      
      const response = await fetch('/api/admin/contact-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: contactDetails.phone,
          email: contactDetails.email,
          address: contactDetails.address
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Contact details updated successfully')
        setContactDetails(data.data)
      } else {
        if (data.details && Array.isArray(data.details)) {
          const errors: {[key: string]: string} = {}
          data.details.forEach((detail: any) => {
            errors[detail.field] = detail.message
          })
          setValidationErrors(errors)
        } else {
          toast.error('Failed to update contact details')
        }
      }
    } catch (error) {
      console.error('Error updating contact details:', error)
      toast.error('Failed to update contact details')
    } finally {
      setSaving(false)
    }
  }

  // Load contact details on component mount
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchContactDetails()
    }
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    setContactDetails(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Details Management</h1>
          <p className="text-gray-600">Manage company contact information displayed on the website</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Update the contact details that appear on the website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                value={contactDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+94 11 234 5678"
                className={validationErrors.phone ? 'border-red-500' : ''}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@srholding.lk"
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Textarea
                id="address"
                value={contactDetails.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Sofia, Bulgaria"
                rows={4}
                className={validationErrors.address ? 'border-red-500' : ''}
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
              )}
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How the contact details will appear on the website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Phone className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm text-gray-300">Phone</p>
                  <p className="font-medium text-white">{contactDetails.phone || 'No phone number'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm text-gray-300">Email</p>
                  <p className="font-medium text-white">{contactDetails.email || 'No email address'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                <MapPin className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">Address</p>
                  <p className="font-medium text-white whitespace-pre-line">
                    {contactDetails.address || 'No address'}
                  </p>
                </div>
              </div>
            </div>

            {contactDetails.updatedAt && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(contactDetails.updatedAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Updated by: {contactDetails.updatedBy}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
