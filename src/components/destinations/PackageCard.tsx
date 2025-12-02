import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PackageCardProps {
    id: string;
    title: string;
    image_url: string;
    price: number;
    duration: string;
    location: string;
    rating?: number;
    reviews?: number;
    featured?: boolean;
    className?: string;
}

export function PackageCard({
    id,
    title,
    image_url,
    price,
    duration,
    location,
    rating = 4.8,
    reviews = 0,
    featured = false,
    className,
}: PackageCardProps) {
    return (
        <Link href={`/destinations/${id}`}>
            <Card className={cn("group h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300", className)}>
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={image_url || "/placeholder-tour.jpg"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                            Best Seller
                        </Badge>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center text-white text-xs gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{location}</span>
                        </div>
                    </div>
                </div>

                <CardContent className="p-4">
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-medium">{rating}</span>
                        <span className="text-muted-foreground">({reviews > 0 ? reviews : 'New'})</span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{duration}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <p className="text-xs text-muted-foreground">Mulai dari</p>
                            <p className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                }).format(price)}
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                            Detail <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
