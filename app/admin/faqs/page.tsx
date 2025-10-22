"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { HelpCircle, Plus, Edit, Trash2, Save, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'

interface FAQ {
  _id: string
  question: string
  answer: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export default function AdminFAQsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [saving, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
    isActive: true
  })

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/admin')
      return
    }
  }, [session, status, router])

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/faqs')
      const data = await response.json()
      
      if (data.success) {
        setFaqs(data.data.faqs)
      } else {
        toast.error('Failed to fetch FAQs')
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      toast.error('Failed to fetch FAQs')
    } finally {
      setLoading(false)
    }
  }

  // Create FAQ
  const handleCreateFAQ = async () => {
    try {
      setSaving(true)
      setValidationErrors({})
      
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('FAQ created successfully')
        setShowCreateDialog(false)
        resetForm()
        fetchFAQs()
      } else {
        if (data.details && Array.isArray(data.details)) {
          const errors: {[key: string]: string} = {}
          data.details.forEach((detail: any) => {
            errors[detail.field] = detail.message
          })
          setValidationErrors(errors)
        } else {
          toast.error('Failed to create FAQ')
        }
      }
    } catch (error) {
      console.error('Error creating FAQ:', error)
      toast.error('Failed to create FAQ')
    } finally {
      setSaving(false)
    }
  }

  // Update FAQ
  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return
    
    try {
      setSaving(true)
      setValidationErrors({})
      
      const response = await fetch(`/api/admin/faqs/${editingFAQ._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('FAQ updated successfully')
        setEditingFAQ(null)
        resetForm()
        fetchFAQs()
      } else {
        if (data.details && Array.isArray(data.details)) {
          const errors: {[key: string]: string} = {}
          data.details.forEach((detail: any) => {
            errors[detail.field] = detail.message
          })
          setValidationErrors(errors)
        } else {
          toast.error('Failed to update FAQ')
        }
      }
    } catch (error) {
      console.error('Error updating FAQ:', error)
      toast.error('Failed to update FAQ')
    } finally {
      setSaving(false)
    }
  }

  // Delete FAQ
  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    
    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('FAQ deleted successfully')
        fetchFAQs()
      } else {
        toast.error('Failed to delete FAQ')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ')
    }
  }

  // Toggle FAQ status
  const handleToggleStatus = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/admin/faqs/${faq._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !faq.isActive
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`FAQ ${!faq.isActive ? 'activated' : 'deactivated'} successfully`)
        fetchFAQs()
      } else {
        toast.error('Failed to update FAQ status')
      }
    } catch (error) {
      console.error('Error updating FAQ status:', error)
      toast.error('Failed to update FAQ status')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      order: 0,
      isActive: true
    })
    setValidationErrors({})
  }

  // Edit FAQ
  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive
    })
  }

  // Load FAQs on component mount
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchFAQs()
    }
  }, [session])

  // Get next available order number
  const getNextOrder = () => {
    if (faqs.length === 0) return 1
    const maxOrder = Math.max(...faqs.map(faq => faq.order))
    return maxOrder + 1
  }

  // Filter FAQs
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions for your website</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New FAQ</DialogTitle>
              <DialogDescription>
                Add a new frequently asked question to your website
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter the question..."
                  className={validationErrors.question ? 'border-red-500' : ''}
                />
                {validationErrors.question && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.question}</p>
                )}
              </div>

              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter the answer..."
                  rows={4}
                  className={validationErrors.answer ? 'border-red-500' : ''}
                />
                {validationErrors.answer && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.answer}</p>
                )}
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <div className="flex space-x-2">
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0 (auto-increment)"
                    className={validationErrors.order ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, order: getNextOrder() }))}
                  >
                    Next ({getNextOrder()})
                  </Button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter 0 for auto-increment, or specific number to insert at that position
                </p>
                {validationErrors.order && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.order}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active (visible on website)</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFAQ} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create FAQ
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <Input
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <Card key={faq._id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      #{faq.order}
                    </Badge>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    {faq.answer.length > 150 
                      ? `${faq.answer.substring(0, 150)}...` 
                      : faq.answer
                    }
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={faq.isActive ? "default" : "secondary"}>
                    {faq.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>Created: {new Date(faq.createdAt).toLocaleDateString()} • By: {faq.createdBy}</p>
                  <p>Updated: {new Date(faq.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(faq)}
                  >
                    {faq.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFAQ(faq)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFAQ(faq._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingFAQ} onOpenChange={() => setEditingFAQ(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the frequently asked question
            </DialogDescription>
          </DialogHeader>
          
          {editingFAQ && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-question">Question</Label>
                <Input
                  id="edit-question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter the question..."
                  className={validationErrors.question ? 'border-red-500' : ''}
                />
                {validationErrors.question && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.question}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-answer">Answer</Label>
                <Textarea
                  id="edit-answer"
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter the answer..."
                  rows={4}
                  className={validationErrors.answer ? 'border-red-500' : ''}
                />
                {validationErrors.answer && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.answer}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0 (auto-increment)"
                  className={validationErrors.order ? 'border-red-500' : ''}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Change order to reorder FAQs. Other FAQs will automatically adjust.
                </p>
                {validationErrors.order && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.order}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="edit-isActive">Active (visible on website)</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingFAQ(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateFAQ} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update FAQ
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}