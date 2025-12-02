"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteConfirmDialogProps {
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
    trigger?: React.ReactNode;
    // Controlled mode props
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    loading?: boolean;
}

export function DeleteConfirmDialog({
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the item.",
    trigger,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    loading: externalLoading,
}: DeleteConfirmDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);

    // Use controlled or uncontrolled state
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? (controlledOnOpenChange || (() => { })) : setInternalOpen;
    const loading = externalLoading !== undefined ? externalLoading : internalLoading;

    const handleConfirm = async () => {
        if (!isControlled) setInternalLoading(true);
        try {
            await onConfirm();
            setOpen(false);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            if (!isControlled) setInternalLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
