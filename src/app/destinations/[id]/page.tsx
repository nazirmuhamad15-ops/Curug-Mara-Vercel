import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { MapPin, Clock, Star, CheckCircle, Shield, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/BookingModal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReviewsList } from "@/components/reviews/ReviewsList";

export const revalidate = 0;

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DestinationDetailPage({ params }: PageProps) {
    const { id } = await params;

    const { data: destination } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

    if (!destination) {
        notFound();
    }

    // Use gallery from DB or fallback to main image + placeholders
    const galleryImages = destination.gallery && destination.gallery.length > 0
        ? destination.gallery
        : [
            destination.image_url,
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1000&auto=format&fit=crop",
        ].filter(url => url && url.trim() !== "");

    // Ensure we have at least 5 images for the grid layout
    const images = [...galleryImages, ...Array(5).fill("https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop")].slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                {/* Breadcrumb (Simple) */}
                <div className="text-sm text-gray-500 mb-4">
                    Beranda &gt; Destinasi &gt; <span className="text-gray-900 font-medium">{destination.title}</span>
                </div>

                {/* Photo Grid (Klook Style) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
                    <div className="md:col-span-2 md:row-span-2 relative">
                        <img src={images[0]} alt={destination.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                    <div className="hidden md:block relative">
                        <img src={images[1]} alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                    <div className="hidden md:block relative">
                        <img src={images[2]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                    <div className="hidden md:block relative">
                        <img src={images[3]} alt="Gallery 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                    <div className="hidden md:block relative">
                        <img src={images[4]} alt="Gallery 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors cursor-pointer">
                            <span className="text-white font-medium">+ Lihat Semua Foto</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{destination.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-bold">4.8</span>
                                    <span className="text-gray-400">(50+ Review)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{destination.location || "Curug Mara, Jawa Barat"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{destination.duration || "2 Jam"}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-6">
                                <Badge variant="secondary">Terlaris</Badge>
                                <Badge variant="outline">Konfirmasi Instan</Badge>
                                <Badge variant="outline">Pemandu Lokal</Badge>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <SectionHeader title="Deskripsi Paket" className="mb-4" titleClassName="text-xl" />
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {destination.description}
                                </p>
                            </div>
                        </div>

                        {/* Highlights */}
                        {destination.highlights && destination.highlights.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <SectionHeader title="Highlight" className="mb-4" titleClassName="text-xl" />
                                <ul className="space-y-3">
                                    {destination.highlights.map((highlight: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span className="text-gray-700">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Inclusions */}
                        {destination.inclusions && destination.inclusions.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <SectionHeader title="Termasuk" className="mb-4" titleClassName="text-xl" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {destination.inclusions.map((item: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-700">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Itinerary (Mock) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <SectionHeader title="Itinerary" className="mb-4" titleClassName="text-xl" />
                            <div className="space-y-6 border-l-2 border-gray-200 ml-3 pl-6 relative">
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-gray-900">08:00 - Meeting Point</h4>
                                    <p className="text-gray-600 text-sm mt-1">Berkumpul di Basecamp Curug Mara, briefing keselamatan.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-gray-900">09:00 - Mulai Aktivitas</h4>
                                    <p className="text-gray-600 text-sm mt-1">Trekking menuju lokasi air terjun utama.</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-gray-900">12:00 - Makan Siang</h4>
                                    <p className="text-gray-600 text-sm mt-1">Istirahat dan menikmati makan siang lokal (Nasi Liwet).</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm" />
                                    <h4 className="font-bold text-gray-900">14:00 - Selesai</h4>
                                    <p className="text-gray-600 text-sm mt-1">Kembali ke basecamp, bersih-bersih, dan pembagian file dokumentasi.</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <SectionHeader title="Ulasan Pengunjung" className="mb-6" titleClassName="text-xl" />
                            <ReviewsList destinationId={destination.id} />
                        </div>
                    </div>

                    {/* Sidebar (Sticky Booking Card) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 bg-gray-50 border-b border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Mulai dari</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-primary">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            maximumFractionDigits: 0,
                                        }).format(destination.pricing)}
                                    </span>
                                    <span className="text-gray-500 text-sm">/ pax</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
                                        <Calendar className="w-5 h-5 flex-shrink-0" />
                                        <span>Tersedia setiap hari</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-700 text-sm">
                                        <Shield className="w-5 h-5 flex-shrink-0" />
                                        <span>Jaminan Harga Terbaik</span>
                                    </div>
                                </div>

                                {/* Booking Modal Trigger */}
                                <BookingModal
                                    destinationId={destination.id}
                                    destinationTitle={destination.title}
                                    price={destination.pricing}
                                />

                                {/* WhatsApp Chat Button */}
                                <Button
                                    variant="outline"
                                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                    asChild
                                >
                                    <a
                                        href={`https://wa.me/6283874065238?text=Halo, saya tertarik dengan paket ${destination.title}. Bisa minta info lebih lanjut?`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 fill-current">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        Chat via WhatsApp
                                    </a>
                                </Button>

                                <p className="text-xs text-center text-gray-400">
                                    Tidak dikenakan biaya pemesanan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
