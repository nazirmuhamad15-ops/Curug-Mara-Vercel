"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassContainer } from "@/components/GlassContainer";
import { Mail, ArrowLeft, CheckCircle, Mountain } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
            }
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Mountain className="w-7 h-7 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Lupa Password?</h1>
                    <p className="text-muted-foreground">
                        Masukkan email Anda dan kami akan mengirimkan link reset password
                    </p>
                </div>

                <GlassContainer className="p-8">
                    {success ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Email Terkirim!</h2>
                                <p className="text-muted-foreground text-sm">
                                    Kami telah mengirimkan link reset password ke <strong>{email}</strong>.
                                    Silakan cek inbox atau folder spam Anda.
                                </p>
                            </div>
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke halaman login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Mengirim..." : "Kirim Link Reset Password"}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/auth/signin"
                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke halaman login
                                </Link>
                            </div>
                        </form>
                    )}
                </GlassContainer>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Belum punya akun?{" "}
                    <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}
