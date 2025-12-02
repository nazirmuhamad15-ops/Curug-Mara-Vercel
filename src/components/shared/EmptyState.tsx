import { LucideIcon, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    title = "No data found",
    description = "There are no items to display at the moment.",
    icon: Icon = PackageOpen,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/50">
            <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                {description}
            </p>

            {actionLabel && (
                <>
                    {actionHref ? (
                        <Button asChild>
                            <Link href={actionHref}>{actionLabel}</Link>
                        </Button>
                    ) : onAction ? (
                        <Button onClick={onAction}>{actionLabel}</Button>
                    ) : null}
                </>
            )}
        </div>
    );
}
