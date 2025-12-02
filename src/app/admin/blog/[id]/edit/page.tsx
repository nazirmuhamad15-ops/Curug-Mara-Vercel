"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { Loader2 } from "lucide-react";

export default function EditBlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/admin/blog/${params.id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data);
                } else {
                    console.error("Error fetching blog post:", data.error);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Blog post not found</h1>
            </div>
        );
    }

    return <BlogForm initialData={{ ...post, published: !!post.published_at }} isEditing />;
}
