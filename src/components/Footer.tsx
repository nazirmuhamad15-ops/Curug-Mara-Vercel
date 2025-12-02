"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Adventure Curug Mara
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Temukan keajaiban air terjun tersembunyi dan keindahan alam Indonesia.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Tautan Cepat</h4>
                        <ul className="space-y-2">
                            <li><Link href="/destinations" className="text-gray-400 hover:text-primary transition-colors">Destinasi</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">Bantuan</h4>
                        <ul className="space-y-2">
                            <li><Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Kontak</Link></li>
                            <li><Link href="/legal/privacy" className="text-gray-400 hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
                            <li><Link href="/legal/terms" className="text-gray-400 hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>Curug Mara, Jawa Barat, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <span>+62 123 4567 890</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <span>info@curugmara.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Adventure Curug Mara. Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}
