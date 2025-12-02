"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface PageSection {
    id: string;
    section_key: string;
    content: Record<string, string>;
}

export default function EditPageContent() {
    const params = useParams();
    const [sections, setSections] = useState<PageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchContent();
    }, [params]);

    const fetchContent = async () => {
        const slug = params?.slug;
        if (!slug) return;

        const { data, error } = await supabase
            .from("page_contents")
            .select("*")
            .eq("page_slug", slug);

        if (data) setSections(data);
        setLoading(false);
    };

    const handleChange = (sectionIndex: number, key: string, value: string) => {
        const newSections = [...sections];
        newSections[sectionIndex].content = {
            ...newSections[sectionIndex].content,
            [key]: value
        };
        setSections(newSections);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const section of sections) {
                const res = await fetch(`/api/admin/pages/${section.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: section.content,
                        page_slug: params?.slug
                    }),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Failed to update section");
                }
            }
            toast({
                title: "Success",
                description: "Page content updated successfully",
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Error",
                description: "Failed to save content",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold capitalize">{params?.slug} Page Content</h1>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="space-y-8">
                {sections.map((section, index) => (
                    <Card key={section.id}>
                        <CardHeader>
                            <CardTitle className="capitalize">{section.section_key} Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(section.content).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                                    {key.includes("image") ? (
                                        <ImageUpload
                                            value={value as string}
                                            onChange={(url) => handleChange(index, key, url)}
                                        />
                                    ) : (typeof value === 'string' && value.length > 100) ? (
                                        <Textarea
                                            value={value as string}
                                            onChange={(e) => handleChange(index, key, e.target.value)}
                                            rows={4}
                                        />
                                    ) : (
                                        <Input
                                            value={value as string}
                                            onChange={(e) => handleChange(index, key, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}

                {sections.length === 0 && (
                    <div className="text-center text-muted-foreground p-8">
                        No editable content found for this page.
                        <br />
                        Make sure you have run the seed-data.sql script.
                    </div>
                )}
            </div>
        </div>
    );
}
