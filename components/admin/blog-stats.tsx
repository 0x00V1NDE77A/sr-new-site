'use client';

import { useEffect, useState } from 'react';
import { FileText, Tag, FolderOpen } from 'lucide-react';

interface BlogStats {
  totalBlogs: number;
  totalTags: number;
  totalCategories: number;
}

export function BlogStats() {
  const [stats, setStats] = useState<BlogStats>({
    totalBlogs: 0,
    totalTags: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use public endpoints for stats that don't require authentication
        const [blogsRes, tagsRes, categoriesRes] = await Promise.all([
          fetch('/api/blogs?limit=1000'), // Public blogs endpoint
          fetch('/api/tags'), // Public tags endpoint
          fetch('/api/categories'), // Public categories endpoint
        ]);

        let blogs = { blogs: [] };
        let tags = { tags: [] };
        let categories = { categories: [] };

        if (blogsRes.ok) {
          blogs = await blogsRes.json();
        }
        
        if (tagsRes.ok) {
          tags = await tagsRes.json();
        }
        
        if (categoriesRes.ok) {
          categories = await categoriesRes.json();
        }

        setStats({
          totalBlogs: blogs.blogs?.length || 0,
          totalTags: tags.tags?.length || 0,
          totalCategories: categories.categories?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch blog stats:', error);
        // Set default values on error
        setStats({
          totalBlogs: 0,
          totalTags: 0,
          totalCategories: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex items-center gap-2 p-2">
          <FileText className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Loading...</span>
        </div>
        <div className="flex items-center gap-2 p-2">
          <Tag className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Loading...</span>
        </div>
        <div className="flex items-center gap-2 p-2">
          <FolderOpen className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-2">
        <FileText className="w-4 h-4" />
        <span className="text-sm">Total Blogs</span>
        <span className="ml-auto text-sm text-muted-foreground">{stats.totalBlogs}</span>
      </div>
      <div className="flex items-center gap-2 p-2">
        <Tag className="w-4 h-4" />
        <span className="text-sm">Total Tags</span>
        <span className="ml-auto text-sm text-muted-foreground">{stats.totalTags}</span>
      </div>
      <div className="flex items-center gap-2 p-2">
        <FolderOpen className="w-4 h-4" />
        <span className="text-sm">Categories</span>
        <span className="ml-auto text-sm text-muted-foreground">{stats.totalCategories}</span>
      </div>
    </>
  );
}

