"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps {
    children: ReactNode;
    className?: string;
}

export function GlassContainer({ children, className }: GlassContainerProps) {
    return (
        <div
            className={cn(
                "bg-white/95 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl",
                className
            )}
        >
            {children}
        </div>
    );
}
