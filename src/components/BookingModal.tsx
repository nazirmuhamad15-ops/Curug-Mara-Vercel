"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Phone, User, Loader2, CheckCircle, Download } from "lucide-react";
import { generateBookingPDF } from "@/lib/pdf-generator";

interface BookingModalProps {
    destinationId: string;
    destinationTitle: string;
    price?: number;
}

export function BookingModal({
    destinationId,
    destinationTitle,
    price,
}: BookingModalProps) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        start_date: "",
        participants: 1,
        notes: "",
    });

    // Pre-fill name from session
    useEffect(() => {
        if (session?.user?.name) {
            setFormData(prev => ({ ...prev, name: session.user?.name || "" }));
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setLoading(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    destination_id: destinationId,
                    user_email: session.user?.email,
                    payment_method: 'cash', // Force COD
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setSuccessData(data);
                // Reset form
                setFormData({
                    name: session?.user?.name || "",
                    phone: "",
                    start_date: "",
                    participants: 1,
                    notes: "",
                });
            } else {
                const error = await res.json();
                alert(`Gagal memesan: ${error.error || "Terjadi kesalahan"}`);
            }
        } catch (err) {
            console.error("Error submitting booking:", err);
            alert("Terjadi kesalahan saat memesan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTicket = () => {
        if (!successData) return;
        generateBookingPDF({
            booking_number: successData.booking_number,
            customer_name: successData.customer_name,
            destination_title: destinationTitle,
            start_date: successData.start_date,
            participants: successData.participants,
            total_price: successData.total_price,
            status: successData.status,
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSuccessData(null);
    };

    const totalPrice = price ? price * formData.participants : 0;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) handleClose();
            else setOpen(true);
        }}>
            <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    Pesan Sekarang
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
                {successData ? (
                    <div className="py-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Pemesanan Berhasil!</h2>
                            <p className="text-gray-500 mt-2">Kode Booking: {successData.booking_number}</p>
                        </div>
                        <div className="space-y-3">
                            <Link
                                href={`https://wa.me/6283874065238?text=Halo, saya sudah memesan paket wisata dengan Kode Booking: ${successData.booking_number}. Mohon konfirmasinya.`}
                                target="_blank"
                                className="w-full"
                            >
                                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                                    <Phone className="w-4 h-4" />
                                    Hubungi WhatsApp
                                </Button>
                            </Link>
                            <Button onClick={handleDownloadTicket} variant="outline" className="w-full gap-2">
                                <Download className="w-4 h-4" />
                                Download E-Ticket
                            </Button>
                            <Button variant="ghost" onClick={handleClose} className="w-full">
                                Tutup
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-lg">Form Pemesanan</DialogTitle>
                            <DialogDescription className="text-sm">{destinationTitle}</DialogDescription>
                        </DialogHeader>

                        {!session ? (
                            <div className="py-8 text-center space-y-4">
                                <p className="text-muted-foreground">Silakan masuk untuk melanjutkan pemesanan.</p>
                                <div className="flex gap-2 justify-center">
                                    <Link href="/auth/signin" className="w-full">
                                        <Button className="w-full">Masuk</Button>
                                    </Link>
                                    <Link href="/auth/signup" className="w-full">
                                        <Button variant="outline" className="w-full">Daftar</Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Nama Anda"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Nomor WhatsApp
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        placeholder="0812..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Tanggal
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="participants" className="flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Peserta
                                        </Label>
                                        <Input
                                            id="participants"
                                            type="number"
                                            min="1"
                                            value={formData.participants}
                                            onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Permintaan khusus..."
                                    />
                                </div>

                                {price && (
                                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-100">
                                        <span className="text-sm text-gray-600">Total Estimasi</span>
                                        <span className="text-lg font-bold text-primary">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                maximumFractionDigits: 0,
                                            }).format(totalPrice)}
                                        </span>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            "Konfirmasi Pemesanan"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
