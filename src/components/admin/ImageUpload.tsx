"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/media", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.url) {
                onChange(data.url);
            } else {
                console.error("Upload failed:", data.error);
                alert(`Upload failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-4 w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={disabled || uploading}
            />

            {!value ? (
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-dashed border-2 flex flex-col gap-2 hover:bg-gray-50"
                >
                    {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                        <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : "Click to upload image"}
                    </span>
                </Button>
            ) : (
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-gray-100">
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || uploading}
                        >
                            <Upload className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onChange("")}
                            disabled={disabled || uploading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
