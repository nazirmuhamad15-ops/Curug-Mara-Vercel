"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassContainer } from "@/components/GlassContainer";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category: string | null;
    published_at: string;
    created_at: string;
}

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog/${slug}`);
            const data = await res.json();

            if (res.ok) {
                setPost(data);
            } else {
                setError(data.error || "Post not found");
            }
        } catch (err) {
            setError("Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Loading...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <GlassContainer className="p-12 text-center">
                        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Link href="/blog">
                            <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all">
                                Back to Blog
                            </button>
                        </Link>
                    </GlassContainer>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Link href="/blog">
                        <button className="flex items-center gap-2 text-primary hover:underline mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </button>
                    </Link>

                    <GlassContainer className="p-8 md:p-12">
                        {post.category && (
                            <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-semibold mb-4">
                                {post.category}
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
                            </div>
                            <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </GlassContainer>
                </div>
            </section>

            <Footer />
        </div>
    );
}
