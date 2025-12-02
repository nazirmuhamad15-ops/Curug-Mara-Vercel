"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "new" | "read" | "replied";
    created_at: string;
}

export default function MessagesPage() {
    const supabase = createClientComponentClient();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/messages", {
                cache: "no-store",
                headers: { "Pragma": "no-cache" }
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to fetch messages");

            // Client-side filtering if needed, or just set data
            let filteredData = data || [];
            if (search) {
                const lowerSearch = search.toLowerCase();
                filteredData = filteredData.filter((msg: ContactMessage) =>
                    msg.name.toLowerCase().includes(lowerSearch) ||
                    msg.email.toLowerCase().includes(lowerSearch) ||
                    msg.subject.toLowerCase().includes(lowerSearch)
                );
            }

            setMessages(filteredData);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast({
                title: "Error",
                description: "Failed to fetch messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [search]);

    const updateStatus = async (id: string, status: "new" | "read" | "replied") => {
        try {
            const res = await fetch("/api/admin/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, status } : msg
            ));

            toast({
                title: "Success",
                description: "Message status updated",
            });
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "new":
                return <Badge className="bg-blue-500">New</Badge>;
            case "read":
                return <Badge variant="secondary">Read</Badge>;
            case "replied":
                return <Badge className="bg-green-500">Replied</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Messages</h1>
                    <p className="text-muted-foreground">View and manage contact form submissions</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Inbox</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search messages..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No messages found.</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{msg.name}</span>
                                            <span className="text-sm text-muted-foreground">&lt;{msg.email}&gt;</span>
                                            {getStatusBadge(msg.status)}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(msg.created_at), "MMM d, yyyy HH:mm")}
                                        </div>
                                    </div>

                                    <h3 className="font-medium mb-2">{msg.subject}</h3>
                                    <p className="text-muted-foreground text-sm mb-4 whitespace-pre-wrap">{msg.message}</p>

                                    <div className="flex justify-end gap-2">
                                        <Select
                                            defaultValue={msg.status}
                                            onValueChange={(val: any) => updateStatus(msg.id, val)}
                                        >
                                            <SelectTrigger className="w-[130px] h-8">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">Mark as New</SelectItem>
                                                <SelectItem value="read">Mark as Read</SelectItem>
                                                <SelectItem value="replied">Mark as Replied</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}>
                                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white h-8 px-3 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                Reply
                                            </Badge>
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
