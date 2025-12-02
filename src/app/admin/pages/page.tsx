"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const pages = [
    { name: "Home Page", slug: "home", description: "Main landing page content" },
    { name: "About Us", slug: "about", description: "Company history and team" },
    { name: "Contact", slug: "contact", description: "Contact information and form" },
];

export default function PagesList() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Pages Content</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <Card key={page.slug} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{page.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{page.description}</p>
                            <Link href={`/admin/pages/${page.slug}`}>
                                <Button className="w-full gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit Content
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
