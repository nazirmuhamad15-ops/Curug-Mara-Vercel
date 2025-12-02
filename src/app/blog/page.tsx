"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    published_at: string;
    created_at: string;
    image_url?: string; // Assuming we add this later or use placeholder
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog?limit=20");

            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setFeaturedPost(data[0]);
                    setPosts(data.slice(1));
                }
            }
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            fetchPosts();
            return;
        }

        try {
            const res = await fetch(`/api/blog?search=${encodeURIComponent(search)}`);

            if (res.ok) {
                const data = await res.json();
                setFeaturedPost(data[0] || null);
                setPosts(data.slice(1));
            }
        } catch (error) {
            console.error("Error searching blog posts:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-12 px-4 bg-white border-b border-gray-100">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Cerita Petualangan</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Inspirasi, tips, dan cerita seru dari para petualang di Curug Mara.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari artikel..."
                            className="pl-10 pr-20 bg-gray-50 border-gray-200 focus-visible:ring-primary h-12 rounded-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button
                            onClick={handleSearch}
                            className="absolute right-1 top-1 bottom-1 rounded-full px-6"
                        >
                            Cari
                        </Button>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featuredPost && (
                            <div className="mb-16">
                                <SectionHeader title="Artikel Unggulan" className="mb-6" />
                                <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="aspect-[21/9] bg-gray-200 relative">
                                        <img
                                            src={featuredPost.image_url || "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=2000&auto=format&fit=crop"}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
                                            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">
                                                {featuredPost.category || "Petualangan"}
                                            </span>
                                            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-primary-foreground transition-colors">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-gray-200 mb-6 line-clamp-2 text-lg">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(featuredPost.published_at), "dd MMMM yyyy", { locale: id })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Admin
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Recent Posts Grid */}
                        <SectionHeader title="Artikel Terbaru" className="mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full">
                                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                        <img
                                            src={post.image_url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full text-gray-900">
                                                {post.category || "Tips"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(post.published_at), "dd MMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                            Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {posts.length === 0 && !featuredPost && (
                            <div className="text-center py-20 text-gray-500">
                                Belum ada artikel yang ditemukan.
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}
