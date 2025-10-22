'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  FolderOpen,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useBlogApi } from '@/lib/hooks/use-blog-api';

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: any[];
  excerpt: string;
  heroImage?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  publishedAt?: Date;
  status: "draft" | "published" | "archived";
  featured: boolean;
  category: string;
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export default function BlogPage() {
  const { fetchBlogs, deleteBlog, loading, error } = useBlogApi();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetchBlogs({
          page: pagination.page,
          limit: pagination.limit
        });
        if (response?.blogs) {
          setBlogs(response.blogs);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || 0,
            pages: response.pagination?.pages || 0
          }));
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      }
    };

    loadBlogs();
  }, [fetchBlogs, pagination.page, pagination.limit]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        console.error('Failed to delete blog:', err);
      }
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'published') return blog.status === 'published';
    if (filter === 'draft') return blog.status === 'draft';
    return true;
  });

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No date';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-3 w-1/2 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 w-full bg-muted rounded mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-6 w-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-destructive">Error loading blogs</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            New Blog Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogs.filter(b => b.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogs.filter(b => b.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({blogs.length})
        </Button>
        <Button
          variant={filter === 'published' ? 'default' : 'outline'}
          onClick={() => setFilter('published')}
        >
          Published ({blogs.filter(b => b.status === 'published').length})
        </Button>
        <Button
          variant={filter === 'draft' ? 'default' : 'outline'}
          onClick={() => setFilter('draft')}
        >
          Drafts ({blogs.filter(b => b.status === 'draft').length})
        </Button>
      </div>

      {/* Blog List */}
      {filteredBlogs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "You haven't created any blog posts yet."
                  : `No ${filter} blog posts found.`
                }
              </p>
              <Button asChild>
                <Link href="/admin/blog/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Blog
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Card key={blog._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(blog.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {blog.excerpt || 'No excerpt available'}
                  </p>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Category */}
                  {blog.category && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <FolderOpen className="w-2 h-2 mr-1" />
                        {blog.category}
                      </Badge>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href={`/admin/blog/${blog._id}/edit`}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href={`/post/${blog.slug}`} target="_blank">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(blog._id || '')}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  {pagination.page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {/* First page */}
                  {pagination.page > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink 
                          onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {pagination.page > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}
                  
                  {/* Page numbers around current page */}
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.pages, pagination.page - 2 + i))
                    if (pageNum < 1 || pageNum > pagination.pages) return null
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          isActive={pageNum === pagination.page}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  {/* Last page */}
                  {pagination.page < pagination.pages - 2 && (
                    <>
                      {pagination.page < pagination.pages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink 
                          onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                          className="cursor-pointer"
                        >
                          {pagination.pages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  {pagination.page < pagination.pages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

