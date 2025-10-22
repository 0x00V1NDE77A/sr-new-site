"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { FileText, Eye, MessageCircle, TrendingUp } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  status: "draft" | "published" | "scheduled"
  featured: boolean
  categories: string[]
  tags: string[]
  publishedDate: string
  views: number
  comments: number
}

interface BlogStatsProps {
  posts: BlogPost[]
}

export function BlogStats({ posts }: BlogStatsProps) {
  // Calculate stats
  const totalPosts = posts.length
  const publishedPosts = posts.filter((p) => p.status === "published").length
  const draftPosts = posts.filter((p) => p.status === "draft").length
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length
  const featuredPosts = posts.filter((p) => p.featured).length
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)

  // Status distribution data
  const statusData = [
    { name: "Published", value: publishedPosts, color: "#10b981" },
    { name: "Draft", value: draftPosts, color: "#6b7280" },
    { name: "Scheduled", value: scheduledPosts, color: "#f59e0b" },
  ]

  // Category distribution
  const categoryStats = posts.reduce(
    (acc, post) => {
      post.categories.forEach((category) => {
        acc[category] = (acc[category] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(categoryStats).map(([name, count]) => ({
    name,
    count,
  }))

  // Monthly posts data (mock data for demo)
  const monthlyData = [
    { month: "Jan", posts: 8, views: 2400 },
    { month: "Feb", posts: 12, views: 3200 },
    { month: "Mar", posts: 6, views: 1800 },
    { month: "Apr", posts: 15, views: 4100 },
    { month: "May", posts: 10, views: 2800 },
    { month: "Jun", posts: 14, views: 3600 },
  ]

  // Top performing posts
  const topPosts = [...posts]
    .filter((p) => p.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published, {draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {publishedPosts > 0 ? Math.round(totalViews / publishedPosts) : 0} per post
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {publishedPosts > 0 ? Math.round(totalComments / publishedPosts) : 0} per post
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Featured Posts</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredPosts}</div>
            <p className="text-xs text-muted-foreground">
              {totalPosts > 0 ? Math.round((featuredPosts / totalPosts) * 100) : 0}% of all posts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Post Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Post Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                  <Progress value={totalPosts > 0 ? (item.value / totalPosts) * 100 : 0} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="posts" stroke="#8b5cf6" name="Posts" />
                <Line type="monotone" dataKey="views" stroke="#10b981" name="Views" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{post.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString()} views
                      <MessageCircle className="w-3 h-3 ml-2" />
                      {post.comments} comments
                    </div>
                  </div>
                  {post.featured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
