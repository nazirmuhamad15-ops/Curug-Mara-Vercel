"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Copy, Check, Image as ImageIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

interface MediaFile {
    name: string;
    url: string;
    created_at?: string;
    metadata?: {
        size?: number;
        mimetype?: string;
    };
}

export default function MediaPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleteFile, setDeleteFile] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/media");
            const data = await res.json();

            if (res.ok) {
                setFiles(data);
            } else {
                console.error("Failed to fetch media files:", data.error);
            }
        } catch (error) {
            console.error("Error fetching media files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

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

            if (res.ok) {
                fetchFiles();
            } else {
                const error = await res.json();
                alert(`Upload failed: ${error.error}`);
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

    const handleDelete = async () => {
        if (!deleteFile) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/media/${deleteFile}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setFiles(files.filter(f => f.name !== deleteFile));
                setDeleteFile(null);
            } else {
                alert("Failed to delete file");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Error deleting file");
        } finally {
            setDeleting(false);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "Unknown size";
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    const isImage = (filename: string) => {
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Media Library</h1>
                    <p className="text-muted-foreground">Upload and manage media files.</p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : "Upload File"}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Files ({files.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : files.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No files uploaded yet</p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="mt-4"
                            >
                                Upload your first file
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {files.map((file) => (
                                <div
                                    key={file.name}
                                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                        {isImage(file.name) ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <File className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="p-3 space-y-2">
                                        <p className="text-sm font-medium truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.metadata?.size)}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => copyToClipboard(file.url)}
                                            >
                                                {copiedUrl === file.url ? (
                                                    <Check className="w-3 h-3" />
                                                ) : (
                                                    <Copy className="w-3 h-3" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteFile(file.name)}
                                            >
                                                <Trash2 className="w-3 h-3 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={!!deleteFile}
                onOpenChange={(open) => !open && setDeleteFile(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete File"
                description="Are you sure you want to delete this file? This action cannot be undone."
            />
        </div>
    );
}
