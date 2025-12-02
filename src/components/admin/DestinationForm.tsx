"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Loader2, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

interface Category {
    id: string;
    name: string;
}

interface DestinationFormData {
    title: string;
    slug: string;
    description: string;
    content: string;
    pricing: number;
    duration_days: number;
    max_participants: number;
    difficulty: "easy" | "moderate" | "hard";
    category_id: string;
    location: string;
    image_url: string;
    featured: boolean;
}

interface DestinationFormProps {
    initialData?: DestinationFormData & { id?: string };
    isEditing?: boolean;
}

export function DestinationForm({ initialData, isEditing = false }: DestinationFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DestinationFormData>({
        defaultValues: initialData || {
            title: "",
            slug: "",
            description: "",
            content: "",
            pricing: 0,
            duration_days: 1,
            max_participants: 15,
            difficulty: "easy",
            category_id: "",
            location: "",
            image_url: "",
            featured: false,
        },
    });

    const title = watch("title");
    const location = watch("location");

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

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from("categories").select("id, name");
            if (data) setCategories(data);
        }
        fetchCategories();
    }, []);

    const generateDescription = async () => {
        if (!title) {
            alert("Please enter a title first");
            return;
        }

        setGeneratingAI(true);
        try {
            const prompt = `${title}${location ? ` located in ${location}` : ""}`;
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    type: "destination"
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setValue("description", data.content);
            } else {
                alert(data.error || "Failed to generate description");
            }
        } catch (error) {
            console.error("Error generating description:", error);
            alert("Failed to generate description");
        } finally {
            setGeneratingAI(false);
        }
    };

    const { data: session } = useSession();

    const onSubmit = async (data: DestinationFormData) => {
        setLoading(true);
        console.log("Submitting form data:", data);
        try {
            if (!session?.accessToken) {
                alert("You must be logged in to perform this action");
                setLoading(false);
                return;
            }

            // Create authenticated client
            const supabaseAuth = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    auth: {
                        persistSession: false,
                    },
                    global: {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    },
                }
            );

            if (!data.category_id) {
                alert("Please select a category");
                setLoading(false);
                return;
            }

            const formattedData = {
                ...data,
                pricing: Number(data.pricing),
                category_id: data.category_id || null,
            };
            console.log("Formatted data for Supabase:", formattedData);
            console.log("isEditing:", isEditing);
            console.log("initialData:", initialData);

            if (isEditing && initialData?.id) {
                console.log("Updating destination with ID:", initialData.id);
                const { data: updatedData, error } = await supabaseAuth
                    .from("destinations")
                    .update({
                        ...formattedData,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", initialData.id)
                    .select();

                console.log("Update result:", { updatedData, error });

                if (error) throw error;
            } else {
                console.log("Inserting new destination");
                const { data: insertedData, error } = await supabaseAuth
                    .from("destinations")
                    .insert({
                        ...formattedData,
                        published_at: new Date().toISOString(),
                    })
                    .select();

                console.log("Insert result:", { insertedData, error });

                if (error) throw error;
            }

            console.log("Operation successful, navigating...");
            router.refresh();
            router.push("/admin/destinations");
        } catch (error: any) {
            console.error("Error saving destination:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));

            if (error.code === 'PGRST303' || error.message?.includes('JWT expired')) {
                alert("Your session has expired. Please log out and log in again to save your changes.");
                // Optional: router.push('/auth/signin'); 
            } else {
                alert(`Failed to save destination: ${error.message || "Unknown error"}`);
            }
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
                        {isEditing ? "Edit Destination" : "New Destination"}
                    </h1>
                </div>
                <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    {...register("title", { required: "Title is required" })}
                                    placeholder="e.g. Hidden Paradise in Curug Mara"
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
                                    placeholder="e.g. hidden-paradise-curug-mara"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="description">Short Description</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={generateDescription}
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
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="Brief summary for cards..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Full Content</Label>
                                <Textarea
                                    id="content"
                                    {...register("content")}
                                    placeholder="Detailed description of the destination..."
                                    rows={10}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg">Location & Media</h3>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    {...register("location")}
                                    placeholder="e.g. Subang, West Java"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Cover Image URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="image_url"
                                        {...register("image_url")}
                                        placeholder="https://..."
                                    />
                                    <input
                                        type="file"
                                        id="image_upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setUploading(true);
                                            try {
                                                const fileExt = file.name.split('.').pop();
                                                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                                                const filePath = `${fileName}`;

                                                // Create auth client for upload
                                                const supabaseUpload = createClient(
                                                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                                                    {
                                                        global: {
                                                            headers: {
                                                                Authorization: `Bearer ${session?.accessToken}`,
                                                            },
                                                        },
                                                    }
                                                );

                                                const { error: uploadError } = await supabaseUpload.storage
                                                    .from('destination-images')
                                                    .upload(filePath, file);

                                                if (uploadError) throw uploadError;

                                                const { data } = supabaseUpload.storage
                                                    .from('destination-images')
                                                    .getPublicUrl(filePath);

                                                setValue("image_url", data.publicUrl);
                                            } catch (error: any) {
                                                console.error("Upload error:", error);
                                                alert("Error uploading image: " + error.message);
                                            } finally {
                                                setUploading(false);
                                                // Reset input
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => document.getElementById("image_upload")?.click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enter a direct image URL or upload via Media Library.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg">Details</h3>

                            <div className="space-y-2">
                                <Label htmlFor="pricing">Price (IDR)</Label>
                                <Input
                                    id="pricing"
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => ["-", "e", "E"].includes(e.key) && e.preventDefault()}
                                    {...register("pricing", { required: true, min: 0, valueAsNumber: true })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (Days)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        onKeyDown={(e) => ["-", "e", "E", "."].includes(e.key) && e.preventDefault()}
                                        {...register("duration_days", { min: 1 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="participants">Max People</Label>
                                    <Input
                                        id="participants"
                                        type="number"
                                        min="1"
                                        onKeyDown={(e) => ["-", "e", "E", "."].includes(e.key) && e.preventDefault()}
                                        {...register("max_participants", { min: 1 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select
                                    onValueChange={(value) => setValue("difficulty", value as any)}
                                    defaultValue={initialData?.difficulty || "easy"}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="moderate">Moderate</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    onValueChange={(value) => setValue("category_id", value)}
                                    defaultValue={initialData?.category_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-4 border-t">
                                <Checkbox
                                    id="featured"
                                    checked={watch("featured")}
                                    onCheckedChange={(checked) => setValue("featured", checked as boolean)}
                                />
                                <Label htmlFor="featured">Featured destination</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
