"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Destination {
    id: string;
    title: string;
    location: string;
    pricing: number;
    published_at: string | null;
    categories: {
        name: string;
    } | null;
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("destinations")
                .select("id, title, location, pricing, published_at, categories(name)")
                .order("created_at", { ascending: false });

            if (search) {
                query = query.ilike("title", `%${search}%`);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Cast data to match interface
            const formattedData = (data || []).map(d => ({
                ...d,
                categories: Array.isArray(d.categories) ? d.categories[0] : d.categories
            })) as unknown as Destination[];

            setDestinations(formattedData);
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, [search]);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from("destinations")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setDestinations(destinations.filter((d) => d.id !== id));
            toast({
                title: "Success",
                description: "Destination deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting destination:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete destination",
            });
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Destinations</h1>
                    <p className="text-muted-foreground">Manage your tour destinations and packages.</p>
                </div>
                <Link href="/admin/destinations/new">
                    <Button className="bg-gradient-to-r from-primary to-secondary text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Destination
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Destinations</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search destinations..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Title</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Location</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Category</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Price</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : destinations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No destinations found
                                        </td>
                                    </tr>
                                ) : (
                                    destinations.map((destination) => (
                                        <tr key={destination.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{destination.title}</td>
                                            <td className="py-3 px-4 flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                {destination.location}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                                                    {destination.categories?.name || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(destination.pricing)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${destination.published_at
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {destination.published_at ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/destinations/${destination.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="w-4 h-4 text-gray-500" />
                                                        </Button>
                                                    </Link>
                                                    <DeleteConfirmDialog
                                                        onConfirm={() => handleDelete(destination.id)}
                                                        title={`Delete ${destination.title}?`}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
