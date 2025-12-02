"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Settings, Palette, Search, Mail, CreditCard, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const settingsTabs = [
    {
        name: "General",
        href: "/admin/settings",
        icon: Settings,
        description: "Site name, description, and contact info"
    },
    {
        name: "Branding",
        href: "/admin/settings/branding",
        icon: Palette,
        description: "Logo, colors, and brand identity"
    },
    {
        name: "SEO",
        href: "/admin/settings/seo",
        icon: Search,
        description: "Meta tags and search optimization"
    },
    {
        name: "Email",
        href: "/admin/settings/email",
        icon: Mail,
        description: "SMTP and email configuration"
    },
    {
        name: "Payment",
        href: "/admin/settings/payment",
        icon: CreditCard,
        description: "iPaymu payment gateway"
    },
    {
        name: "Security",
        href: "/admin/settings/security",
        icon: Shield,
        description: "Password policy and security"
    },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-6 h-6" />
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>
                <p className="text-muted-foreground">
                    Manage your application settings and configuration
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <nav className="space-y-1">
                            {settingsTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = pathname === tab.href;

                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        className={`
                      flex items-start gap-3 p-3 rounded-lg transition-colors
                      ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted"
                                            }
                    `}
                                    >
                                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium">{tab.name}</div>
                                            <div className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                                {tab.description}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </Card>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
