"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
    booking: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ booking, open, onOpenChange }: PaymentModalProps) {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Payment Confirmation</DialogTitle>
                    <DialogDescription>
                        You are about to pay for booking <strong>{booking.booking_number}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Total Tagihan</span>
                        <span className="text-xl font-bold text-primary">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0
                            }).format(booking.total_price)}
                        </span>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50 text-blue-800 text-sm">
                        <p className="font-semibold mb-1">Metode Pembayaran: Bayar di Tempat</p>
                        <p>Silakan lakukan pembayaran tunai saat Anda tiba di lokasi wisata.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="w-full">
                        Saya Mengerti
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
