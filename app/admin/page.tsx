'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Tag, FolderOpen, Plus, Users, Eye } from 'lucide-react';
import Link from 'next/link';

interface BlogStats {
  totalBlogs: number;
  totalTags: number;
  totalCategories: number;
  publishedBlogs: number;
  draftBlogs: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<BlogStats>({
    totalBlogs: 0,
    totalTags: 0,
    totalCategories: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogsRes, tagsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/blogs'),
          fetch('/api/admin/tags'),
          fetch('/api/admin/categories'),
        ]);

        const [blogs, tags, categories] = await Promise.all([
          blogsRes.json(),
          tagsRes.json(),
          categoriesRes.json(),
        ]);

        const publishedBlogs = blogs.blogs?.filter((blog: any) => blog.published)?.length || 0;
        const draftBlogs = blogs.blogs?.filter((blog: any) => !blog.published)?.length || 0;

        setStats({
          totalBlogs: blogs.blogs?.length || 0,
          totalTags: tags.tags?.length || 0,
          totalCategories: categories.categories?.length || 0,
          publishedBlogs,
          draftBlogs,
        });
      } catch (error) {
        console.error('Failed to fetch blog stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="w-20 h-4 rounded bg-muted"></div>
                <div className="w-4 h-4 rounded bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="w-16 h-8 mb-2 rounded bg-muted"></div>
                <div className="w-24 h-3 rounded bg-muted"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your blog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedBlogs} published, {stats.draftBlogs} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Published Blogs</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedBlogs}</div>
            <p className="text-xs text-muted-foreground">
              Live on your website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Tag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTags}</div>
            <p className="text-xs text-muted-foreground">
              Available for categorization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Blog categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>Manage your blog posts and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="justify-start w-full">
              <Link href="/admin/blog">
                <FileText className="w-4 h-4 mr-2" />
                View All Blogs
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start w-full">
              <Link href="/admin/blog/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Blog
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Organization</CardTitle>
            <CardDescription>Organize your content with tags and categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="justify-start w-full">
              <Link href="/admin/blog/categories">
                <FolderOpen className="w-4 h-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start w-full">
              <Link href="/admin/blog/tags">
                <Tag className="w-4 h-4 mr-2" />
                Manage Tags
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your admin settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="justify-start w-full">
              <Link href="/admin/settings/change-password">
                <Users className="w-4 h-4 mr-2" />
                Change Password
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}