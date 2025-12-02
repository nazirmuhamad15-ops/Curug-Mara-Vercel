"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function PaymentSimulationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session");
    const bookingId = searchParams.get("booking");

    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<"success" | "failed" | null>(null);

    const handlePayment = async (status: "success" | "failed") => {
        setProcessing(true);

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (status === "success" && bookingId) {
            // Update booking status
            const { error } = await supabase
                .from("bookings")
                .update({
                    payment_status: "paid",
                    status: "paid", // Status menjadi 'paid', admin yang akan ubah ke 'confirmed'
                    payment_method: "iPaymu (Simulation)",
                    payment_id: sessionId,
                })
                .eq("id", bookingId);

            if (!error) {
                setResult("success");
                setTimeout(() => {
                    router.push(`/dashboard/bookings?payment=success`);
                }, 2000);
            } else {
                setResult("failed");
            }
        } else {
            setResult("failed");
            setTimeout(() => {
                router.push(`/dashboard/bookings?payment=failed`);
            }, 2000);
        }

        setProcessing(false);
    };

    if (result === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold">Payment Successful!</h2>
                        <p className="text-muted-foreground">
                            Your booking has been confirmed. Redirecting...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (result === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center space-y-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold">Payment Failed</h2>
                        <p className="text-muted-foreground">
                            Something went wrong. Redirecting...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-center">Payment Simulation</CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        Session ID: <span className="font-mono text-xs">{sessionId}</span>
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Simulation Mode</strong><br />
                            This is a test payment page. Choose an outcome to simulate the payment process.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => handlePayment("success")}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Simulate Successful Payment
                                </>
                            )}
                        </Button>

                        <Button
                            className="w-full"
                            variant="destructive"
                            size="lg"
                            onClick={() => handlePayment("failed")}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Simulate Failed Payment
                                </>
                            )}
                        </Button>

                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push("/dashboard/bookings")}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSimulationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentSimulationContent />
        </Suspense>
    );
}
