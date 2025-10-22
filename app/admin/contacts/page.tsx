"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, Mail, Phone, Calendar, User, Filter, Search, Eye, CheckCircle, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Contact {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  topic: string
  message: string
  status: 'new' | 'read' | 'replied' | 'closed'
  createdAt: string
  updatedAt: string
  adminNotes?: string
  repliedAt?: string
  repliedBy?: string
}

interface ContactStats {
  total: number
  new: number
  read: number
  replied: number
  closed: number
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<ContactStats>({ total: 0, new: 0, read: 0, replied: 0, closed: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/admin')
      return
    }
  }, [session, status, router])

  // Fetch contacts
  const fetchContacts = async (page: number = 1, status?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (status && status !== 'all') {
        params.append('status', status)
      }
      
      const response = await fetch(`/api/admin/contacts?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setContacts(data.data.contacts)
        setStats(data.data.stats)
        setTotalPages(data.data.pagination.pages)
        setCurrentPage(page)
      } else {
        toast.error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  // Update contact status
  const updateContactStatus = async (contactId: string, status: string, adminNotes?: string) => {
    try {
      setUpdateLoading(true)
      
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes,
          repliedBy: session?.user?.email
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Contact status updated successfully')
        fetchContacts(currentPage, statusFilter)
        setSelectedContact(null)
      } else {
        toast.error('Failed to update contact status')
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact status')
    } finally {
      setUpdateLoading(false)
    }
  }

  // Delete contact
  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return
    }

    try {
      setDeleteLoading(true)
      
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Contact deleted successfully')
        fetchContacts(currentPage, statusFilter)
        setSelectedContact(null)
      } else {
        toast.error('Failed to delete contact')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Load contacts on component mount
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchContacts()
    }
  }, [session])

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    
    const icons = {
      new: <Clock className="w-3 h-3" />,
      read: <Eye className="w-3 h-3" />,
      replied: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    )
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
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-gray-600">Manage customer inquiries and support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.read}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value)
          fetchContacts(1, value)
        }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <Card key={contact._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {contact.firstName} {contact.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(contact.status)}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteContact(contact._id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                        <DialogDescription>
                          Submitted on {new Date(contact.createdAt).toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedContact && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Name</label>
                              <p className="text-sm text-gray-600">
                                {selectedContact.firstName} {selectedContact.lastName}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <p className="text-sm text-gray-600">{selectedContact.email}</p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Inquiry Type</label>
                            <p className="text-sm text-gray-600 capitalize">{selectedContact.topic}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Message</label>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                              {selectedContact.message}
                            </p>
                          </div>
                          
                          {selectedContact.adminNotes && (
                            <div>
                              <label className="text-sm font-medium">Admin Notes</label>
                              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                                {selectedContact.adminNotes}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => updateContactStatus(selectedContact._id, 'read')}
                              disabled={updateLoading || deleteLoading}
                              variant="outline"
                            >
                              Mark as Read
                            </Button>
                            <Button
                              onClick={() => updateContactStatus(selectedContact._id, 'replied')}
                              disabled={updateLoading || deleteLoading}
                              variant="outline"
                            >
                              Mark as Replied
                            </Button>
                            <Button
                              onClick={() => updateContactStatus(selectedContact._id, 'closed')}
                              disabled={updateLoading || deleteLoading}
                              variant="outline"
                            >
                              Close
                            </Button>
                            <Button
                              onClick={() => deleteContact(selectedContact._id)}
                              disabled={updateLoading || deleteLoading}
                              variant="destructive"
                            >
                              {deleteLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">
                {contact.message}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  <span className="capitalize">{contact.topic}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => fetchContacts(currentPage - 1, statusFilter)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => fetchContacts(currentPage + 1, statusFilter)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
