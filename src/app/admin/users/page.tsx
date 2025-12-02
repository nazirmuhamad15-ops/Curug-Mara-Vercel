"use client";

import { useEffect, useState } from "react";
import { Search, Filter, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserProfile {
    id: string;
    name: string;
    email: string; // Note: email might be null in profiles if not synced, but our API joins or we added it? Wait, profiles table doesn't have email usually, auth.users does.
    // But my API route for users just selects * from profiles.
    // The make-admin.sql issue showed profiles doesn't have email.
    // I need to fix the API route to join with auth.users or store email in profiles.
    // For now, let's assume profiles has email or we need to fetch it.
    // Actually, in my previous fix for make-admin.sql, I noted profiles doesn't have email.
    // So fetching * from profiles won't get email.
    // I need to update the API route to fetch email from auth.users or just show name/role.
    // But displaying email is crucial.
    // Supabase Admin API `listUsers` is better for this, but I am using `profiles` table.
    // Let's check if I can join or if I should use `supabase.auth.admin.listUsers()`.
    // Using `supabase.auth.admin.listUsers()` is better for user management.
    role: string;
    created_at: string;
}

// I will pause writing this file to fix the API route first.
// But I can write the component assuming the API returns email.
// Let's write the component and then fix the API route to return email.

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [newRole, setNewRole] = useState("");
    const [updating, setUpdating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (roleFilter && roleFilter !== "all") params.append("role", roleFilter);

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setUsers(data);
            } else {
                console.error("Failed to fetch users:", data.error);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter]);

    const handleUpdateRole = async () => {
        if (!selectedUser || !newRole) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                // Update local state
                setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
                setDialogOpen(false);
                alert("User role updated successfully");
            } else {
                const err = await res.json();
                alert(`Failed to update role: ${err.error}`);
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Error updating role");
        } finally {
            setUpdating(false);
        }
    };

    const openRoleDialog = (user: UserProfile) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setDialogOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Users</h1>
                    <p className="text-muted-foreground">Manage registered users and their roles.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle>All Users</CardTitle>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select
                                value={roleFilter}
                                onValueChange={setRoleFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="guide">Guide</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Role</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Joined</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{user.name || "N/A"}</td>
                                            <td className="py-3 px-4 text-muted-foreground">{user.email || "N/A"}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${user.role === "admin"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : user.role === "guide"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "N/A"}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openRoleDialog(user)}
                                                >
                                                    <UserCog className="w-4 h-4 mr-2" />
                                                    Edit Role
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Role</DialogTitle>
                        <DialogDescription>
                            Change the role for {selectedUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Role</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="guide">Guide</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateRole} disabled={updating}>
                            {updating ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
