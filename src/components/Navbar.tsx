"use client";

import Link from "next/link";
import { Mountain, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const isPending = status === "loading";
    const [branding, setBranding] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        const fetchBranding = async () => {
            const { data } = await supabase
                .from("settings")
                .select("key, value")
                .eq("category", "branding");

            if (data) {
                const settings = data.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value;
                    return acc;
                }, {});
                setBranding(settings);
            }
        };
        fetchBranding();
    }, []);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const menuItems = [
        { name: "Beranda", href: "/" },
        { name: "Destinasi", href: "/destinations" },
        { name: "Blog", href: "/blog" },
        { name: "Tentang Kami", href: "/about" },
        { name: "Kontak", href: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {branding.logo && branding.logo.trim() !== "" ? (
                            <img src={branding.logo} alt="Logo" className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <Mountain className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {branding.site_name || "Curug Mara"}
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-primary transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* User Menu */}
                        {isPending ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary">
                                    Dashboard
                                </Link>
                                {(session.user?.role === "admin" || session.user?.role === "superadmin") && (
                                    <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-primary">
                                        Admin
                                    </Link>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user?.image || ""} />
                                            <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleSignOut}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Link href="/auth/signin">
                                <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all">
                                    Masuk
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Mobile User Menu */}
                        {session ? (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
                                <div className="flex items-center justify-between w-full">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-700 font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard Saya
                                    </Link>
                                    <button onClick={handleSignOut} className="text-sm text-red-600 font-medium">
                                        Log out
                                    </button>
                                </div>
                                {(session.user?.role === "admin" || session.user?.role === "superadmin") && (
                                    <Link
                                        href="/admin"
                                        className="text-gray-700 font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4">
                                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                                    <button className="w-full px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-center">
                                        Masuk
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
