import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
}

export function SectionHeader({
    title,
    subtitle,
    align = "left",
    className,
    titleClassName,
    subtitleClassName,
}: SectionHeaderProps) {
    const alignmentClasses = {
        left: "text-left",
        center: "text-center mx-auto",
        right: "text-right ml-auto",
    };

    return (
        <div className={cn("mb-8", alignmentClasses[align], className)}>
            <h2 className={cn("text-3xl font-bold tracking-tight mb-2", titleClassName)}>
                {title}
            </h2>
            {subtitle && (
                <p className={cn("text-muted-foreground text-lg", subtitleClassName)}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
