"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Loader2, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface TourFormData {
    title: string;
    description: string;
    price: number;
    duration: string;
    location: string;
    max_participants: number;
    rating: number;
    reviews: number;
    image_url: string;
}

interface TourFormProps {
    initialData?: TourFormData & { id?: string };
    isEditing?: boolean;
}

export function TourForm({ initialData, isEditing = false }: TourFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TourFormData>({
        defaultValues: initialData || {
            title: "",
            description: "",
            price: 0,
            duration: "1 Day",
            location: "",
            max_participants: 10,
            rating: 5.0,
            reviews: 0,
            image_url: "",
        },
    });

    const title = watch("title");

    const generateDescription = async () => {
        if (!title) {
            toast({
                title: "Error",
                description: "Please enter a title first",
                variant: "destructive",
            });
            return;
        }

        setGeneratingAI(true);
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: title,
                    type: "destination", // Reusing destination type for now as it fits tours well
                }),
            });

            const data = await res.json();
            if (data.content) {
                setValue("description", data.content);
                toast({
                    title: "Success",
                    description: "Description generated successfully",
                });
            }
        } catch (error) {
            console.error("AI Generation error:", error);
            toast({
                title: "Error",
                description: "Failed to generate description",
                variant: "destructive",
            });
        } finally {
            setGeneratingAI(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `tours/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("images")
                .getPublicUrl(filePath);

            setValue("image_url", publicUrl);
            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: TourFormData) => {
        setLoading(true);
        try {
            if (isEditing && initialData?.id) {
                const { error } = await supabase
                    .from("tours")
                    .update(data)
                    .eq("id", initialData.id);
                if (error) throw error;
                toast({
                    title: "Success",
                    description: "Tour updated successfully",
                });
            } else {
                const { error } = await supabase
                    .from("tours")
                    .insert([data]);
                if (error) throw error;
                toast({
                    title: "Success",
                    description: "Tour created successfully",
                });
            }
            router.push("/admin/tours");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving tour:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to save tour",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tours
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isEditing ? "Update Tour" : "Create Tour"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Tour Title</Label>
                                <Input
                                    id="title"
                                    {...register("title", { required: "Title is required" })}
                                    placeholder="e.g., 3-Day Waterfall Adventure"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="description">Description</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={generateDescription}
                                        disabled={generatingAI || !title}
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
                                    rows={10}
                                    placeholder="Detailed description of the tour..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        {...register("location")}
                                        placeholder="e.g., West Java, Indonesia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        {...register("duration")}
                                        placeholder="e.g., 3 Days / 2 Nights"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (IDR)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    {...register("price", { valueAsNumber: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_participants">Max Participants</Label>
                                <Input
                                    id="max_participants"
                                    type="number"
                                    {...register("max_participants", { valueAsNumber: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (0-5)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    {...register("rating", { valueAsNumber: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reviews">Review Count</Label>
                                <Input
                                    id="reviews"
                                    type="number"
                                    {...register("reviews", { valueAsNumber: true })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <Label>Cover Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center py-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Uploading...</span>
                                    </div>
                                ) : watch("image_url") ? (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                        <img
                                            src={watch("image_url")}
                                            alt="Cover"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">
                                            Click to upload image
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
