"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { ImageUpload } from "@/components/admin/ImageUpload";

interface SettingField {
    key: string;
    label: string;
    type?: "text" | "password" | "number" | "email" | "url" | "textarea" | "image";
    placeholder?: string;
    description?: string;
}

interface SettingsPageProps {
    title: string;
    description: string;
    category: string;
    fields: SettingField[];
}

export function SettingsPage({ title, description, category, fields }: SettingsPageProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, any>>({});
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, [category]);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`/api/settings?category=${category}`);
            const data = await res.json();
            if (res.ok) {
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, settings }),
            });

            if (!res.ok) throw new Error("Failed to save settings");

            toast({
                title: "Settings saved",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                            <Label htmlFor={field.key}>{field.label}</Label>
                            {field.type === "textarea" ? (
                                <textarea
                                    id={field.key}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={settings[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            ) : field.type === "image" ? (
                                <ImageUpload
                                    value={settings[field.key] || ""}
                                    onChange={(url) => handleChange(field.key, url)}
                                />
                            ) : (
                                <Input
                                    id={field.key}
                                    type={field.type || "text"}
                                    value={settings[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            )}
                            {field.description && (
                                <p className="text-xs text-muted-foreground">{field.description}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} className="gap-2">
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
