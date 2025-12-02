"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Edit, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    published_at: string | null;
    created_at: string;
    profiles: {
        name: string;
    } | null;
}

export default function BlogPostsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/blog?${params.toString()}`);

            if (res.ok) {
                const data = await res.json();
                const formattedData = (data || []).map((p: any) => ({
                    ...p,
                    profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
                }));
                setPosts(formattedData);
            } else {
                console.error("Failed to fetch blog posts:", res.statusText);
            }
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [search, statusFilter]);

    const handleDelete = async () => {
        if (!deleteId) return;
        console.log("Deleting blog post:", deleteId);
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/blog/${deleteId}`, {
                method: "DELETE",
            });

            console.log("Delete response status:", res.status);
            if (res.ok) {
                console.log("Delete successful");
                setPosts(posts.filter(p => p.id !== deleteId));
                setDeleteId(null);
            } else {
                const error = await res.json();
                console.error("Delete failed:", error);
                alert(`Failed to delete blog post: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error deleting blog post:", error);
            alert("Error deleting blog post");
        } finally {
            setDeleting(false);
        }
    };

    const getStatusBadge = (post: BlogPost) => {
        if (post.published_at) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Published</span>;
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Draft</span>;
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage blog posts and articles.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Blog Post
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle>All Blog Posts</CardTitle>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search posts..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Posts</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Title</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Author</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Category</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Date</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No blog posts found
                                        </td>
                                    </tr>
                                ) : (
                                    posts.map((post) => (
                                        <tr key={post.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{post.title}</div>
                                                {post.excerpt && (
                                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                                        {post.excerpt}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm">{post.profiles?.name || "Unknown"}</td>
                                            <td className="py-3 px-4 text-sm capitalize">{post.category || "-"}</td>
                                            <td className="py-3 px-4">{getStatusBadge(post)}</td>
                                            <td className="py-3 px-4 text-sm">
                                                {format(new Date(post.created_at), "MMM d, yyyy")}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/blog/${post.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteId(post.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Blog Post"
                description="Are you sure you want to delete this blog post? This action cannot be undone."
            />
        </div>
    );
}
