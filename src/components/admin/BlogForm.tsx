"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Loader2, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface BlogFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string;
    published: boolean;
}

interface BlogFormProps {
    initialData?: BlogFormData & { id?: string };
    isEditing?: boolean;
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(initialData?.content || "");
    const [generatingAI, setGeneratingAI] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
        defaultValues: initialData || {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            category: "",
            image_url: "",
            published: false,
        },
    });

    const title = watch("title");
    const published = watch("published");

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEditing && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setValue("slug", slug);
        }
    }, [title, isEditing, setValue]);

    const generateContent = async () => {
        if (!title) {
            alert("Please enter a title first");
            return;
        }

        setGeneratingAI(true);
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: title,
                    type: "blog"
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setContent(data.content);
            } else {
                alert(data.error || "Failed to generate content");
            }
        } catch (error) {
            console.error("Error generating content:", error);
            alert("Failed to generate content");
        } finally {
            setGeneratingAI(false);
        }
    };

    const onSubmit = async (data: BlogFormData) => {
        setLoading(true);
        console.log("BlogForm: Starting submission", { data, content, isEditing });
        try {
            // Remove 'published' field as it doesn't exist in database
            const { published, ...dataWithoutPublished } = data;

            const payload = {
                ...dataWithoutPublished,
                content,
                published_at: published ? new Date().toISOString() : null,
            };
            console.log("BlogForm: Payload prepared", payload);

            if (isEditing && initialData?.id) {
                // Update
                console.log("BlogForm: Updating blog post", initialData.id);
                const res = await fetch(`/api/admin/blog/${initialData.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                console.log("BlogForm: Update response status", res.status);
                if (res.ok) {
                    console.log("BlogForm: Update successful, redirecting");
                    router.push("/admin/blog");
                    router.refresh();
                } else {
                    const error = await res.json();
                    console.error("BlogForm: Update failed", error);
                    throw new Error(error.error);
                }
            } else {
                // Create
                console.log("BlogForm: Creating new blog post");
                const res = await fetch("/api/admin/blog", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                console.log("BlogForm: Create response status", res.status);
                if (res.ok) {
                    const result = await res.json();
                    console.log("BlogForm: Create successful", result);
                    router.push("/admin/blog");
                    router.refresh();
                } else {
                    const error = await res.json();
                    console.error("BlogForm: Create failed", error);
                    throw new Error(error.error);
                }
            }
        } catch (error) {
            console.error("BlogForm: Error saving blog post:", error);
            alert("Failed to save blog post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {isEditing ? "Edit Blog Post" : "New Blog Post"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={loading} className="gap-2">
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {published ? "Publish" : "Save Draft"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    {...register("title", { required: "Title is required" })}
                                    placeholder="Enter blog post title..."
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    {...register("slug", { required: "Slug is required" })}
                                    placeholder="blog-post-slug"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    {...register("excerpt")}
                                    placeholder="Brief summary for preview..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Content</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={generateContent}
                                        disabled={generatingAI}
                                        className="gap-2"
                                    >
                                        {generatingAI ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        Generate with AI
                                    </Button>
                                </div>
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Write your blog post content here..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg">Settings</h3>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    {...register("category")}
                                    placeholder="e.g. Travel Tips"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Featured Image URL</Label>
                                <Input
                                    id="image_url"
                                    {...register("image_url")}
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter a direct image URL. Upload feature coming soon.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 pt-4 border-t">
                                <Checkbox
                                    id="published"
                                    checked={published}
                                    onCheckedChange={(checked) => setValue("published", checked as boolean)}
                                />
                                <Label htmlFor="published">Publish immediately</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
