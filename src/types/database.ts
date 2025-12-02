export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string
                    role: 'customer' | 'guide' | 'admin'
                    about: string | null
                    username: string | null
                    avatar_url: string | null
                    phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name: string
                    role?: 'customer' | 'guide' | 'admin'
                    about?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    role?: 'customer' | 'guide' | 'admin'
                    about?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            destinations: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    content: string | null
                    pricing: number
                    duration_days: number
                    max_participants: number
                    difficulty: 'easy' | 'moderate' | 'hard' | null
                    category_id: string | null
                    location: string | null
                    image_url: string | null
                    images: Json | null
                    featured: boolean | null
                    published_at: string | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    content?: string | null
                    pricing: number
                    duration_days?: number
                    max_participants?: number
                    difficulty?: 'easy' | 'moderate' | 'hard' | null
                    category_id?: string | null
                    location?: string | null
                    image_url?: string | null
                    images?: Json | null
                    featured?: boolean | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    content?: string | null
                    pricing?: number
                    duration_days?: number
                    max_participants?: number
                    difficulty?: 'easy' | 'moderate' | 'hard' | null
                    category_id?: string | null
                    location?: string | null
                    image_url?: string | null
                    images?: Json | null
                    featured?: boolean | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
            }
            bookings: {
                Row: {
                    id: string
                    user_id: string
                    destination_id: string | null
                    booking_number: string
                    start_date: string
                    end_date: string
                    participants: number
                    total_price: number
                    status: 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled'
                    payment_status: 'unpaid' | 'paid' | 'refunded'
                    payment_method: string | null
                    payment_id: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    destination_id?: string | null
                    booking_number: string
                    start_date: string
                    end_date: string
                    participants?: number
                    total_price: number
                    status?: 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled'
                    payment_status?: 'unpaid' | 'paid' | 'refunded'
                    payment_method?: string | null
                    payment_id?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    destination_id?: string | null
                    booking_number?: string
                    start_date?: string
                    end_date?: string
                    participants?: number
                    total_price?: number
                    status?: 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled'
                    payment_status?: 'unpaid' | 'paid' | 'refunded'
                    payment_method?: string | null
                    payment_id?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            },
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string
                    message?: string
                    status?: string
                    created_at?: string
                }
            }
        }
    }
}
