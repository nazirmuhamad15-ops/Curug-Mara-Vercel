"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, User, Home, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Bookings",
        href: "/dashboard/bookings",
        icon: Calendar,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
];

export function CustomerSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Home className="w-6 h-6" />
                    <span>Curug Mara</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{link.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </Button>
            </div>
        </aside>
    );
}
