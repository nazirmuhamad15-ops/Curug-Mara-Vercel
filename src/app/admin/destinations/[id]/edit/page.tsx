"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { useToast } from "@/components/ui/use-toast";

interface DestinationData {
    id: string;
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

export default function EditDestinationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [initialData, setInitialData] = useState<DestinationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/admin/destinations/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch destination");
                }

                setInitialData({
                    ...data,
                    // Provide default values for missing columns
                    duration_days: data.duration_days || 1,
                    max_participants: data.max_participants || 15,
                    difficulty: data.difficulty || "easy",
                } as DestinationData);
            } catch (err: any) {
                console.error("Error fetching destination:", err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `Failed to load destination: ${err.message || "Unknown error"}`,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id, toast]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading destination...</p>
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="p-8">
                <p className="text-red-500">Destination not found.</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
            <DestinationForm
                initialData={initialData}
                isEditing={true}
            />
        </div>
    );
}
