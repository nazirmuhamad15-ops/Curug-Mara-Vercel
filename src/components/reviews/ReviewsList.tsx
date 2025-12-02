"use client";

import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
        name: string;
        avatar_url: string | null;
    };
}

interface ReviewsListProps {
    destinationId: string;
}

export function ReviewsList({ destinationId }: ReviewsListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch(`/api/reviews?destination_id=${destinationId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [destinationId]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Belum ada ulasan untuk destinasi ini.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={review.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                                <User className="w-4 h-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900">{review.profiles?.name || "Pengguna"}</h4>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(review.created_at), "d MMM yyyy")}
                                </span>
                            </div>
                            <div className="flex items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
