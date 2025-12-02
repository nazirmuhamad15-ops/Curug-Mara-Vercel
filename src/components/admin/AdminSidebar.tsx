"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    Users,
    Settings,
    FileText,
    Image,
    LogOut,
    Monitor,
    Mail,
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: MapPin, label: "Destinations", href: "/admin/destinations" },
    { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
    { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
    { icon: Monitor, label: "Pages", href: "/admin/pages" },
    { icon: Mail, label: "Messages", href: "/admin/messages" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Image, label: "Media", href: "/admin/media" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Admin Panel</h1>
                        <p className="text-xs text-muted-foreground">Curug Mara</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href || "#"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
