# Technical Specifications: Adventure Curug Mara

## 1. System Architecture

### 1.1 Overview
Adventure Curug Mara is a modern web application designed for booking tours and travel experiences. It utilizes a **Serverless Architecture** leveraging Next.js for the frontend/backend API and Supabase for the database and authentication.

### 1.2 Tech Stack
*   **Frontend Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn UI, Lucide React (Icons)
*   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
*   **Authentication**: NextAuth.js (v4) with Supabase Adapter
*   **Database**: PostgreSQL (via Supabase)
*   **Storage**: Supabase Storage (for images)
*   **AI Integration**: Google Gemini API (`@google/generative-ai`)
*   **Date Handling**: `date-fns`

---

## 2. Database Schema (Supabase/PostgreSQL)

### 2.1 Core Tables

#### `profiles`
*   Extends Supabase Auth users.
*   **Columns**: `id` (UUID, PK), `email`, `role` (enum: 'user', 'admin', 'SuperAdmin'), `full_name`, `avatar_url`.
*   **RLS**: Users read own; Admins read all.

#### `tours`
*   Stores tour packages available for booking.
*   **Columns**: `id` (UUID, PK), `title`, `description`, `price` (Numeric), `duration`, `location`, `max_participants`, `image_url`.
*   **RLS**: Public read; Admin write.

#### `bookings`
*   Records user bookings.
*   **Columns**: `id` (UUID, PK), `user_id` (FK), `destination_id` (FK), `booking_number` (Unique), `start_date`, `end_date`, `participants`, `total_price`, `status` (pending, paid, confirmed, completed, cancelled), `customer_name`, `customer_phone`.
*   **RLS**: Users read/create own; Admins read/write all.

#### `page_contents`
*   Stores dynamic content for frontend pages (CMS-like feature).
*   **Columns**: `id`, `page_slug` (e.g., 'home', 'contact'), `section_key` (e.g., 'hero'), `content` (JSONB).
*   **RLS**: Public read; Admin write.

#### `contact_messages`
*   Stores submissions from the Contact Us form.
*   **Columns**: `id`, `name`, `email`, `subject`, `message`, `status` (new, read, replied).
*   **RLS**: Public insert; Admin read/write.

---

## 3. Key Features & Implementation Details

### 3.1 Authentication & Authorization
*   **Mechanism**: NextAuth.js handles session management.
*   **Middleware**: `middleware.ts` protects `/admin` routes, ensuring only users with `role: 'admin' | 'SuperAdmin'` can access.
*   **Client-Side**: `useSession` hook for UI conditional rendering (e.g., Login vs Logout buttons).

### 3.2 Admin Dashboard
*   **Route**: `/src/app/admin`
*   **Components**:
    *   `AdminSidebar`: Navigation menu.
    *   `DashboardCharts`: Visualizes revenue and booking trends using CSS-based bar charts.
*   **Data Fetching**: Uses `createClientComponentClient` for authenticated Supabase requests.

### 3.3 Dynamic Page Editing (CMS)
*   **Route**: `/admin/pages/[slug]`
*   **Logic**: Fetches JSONB data from `page_contents`. Admin updates fields, and changes are reflected immediately on the public frontend (Home, Contact, About).

### 3.4 AI-Powered Content Generation
*   **Endpoint**: `/api/ai/generate`
*   **Provider**: Google Gemini (Flash model).
*   **Usage**: Generates tour descriptions and marketing copy in the Admin Tour Form.

### 3.5 Booking System
*   **Flow**:
    1.  User clicks "Book Now" on a Tour.
    2.  `BookingModal` opens (checks Auth).
    3.  User fills details (dates, participants).
    4.  POST request to `/api/bookings`.
    5.  Backend validates pricing and creates record.

---

## 4. Security Measures

### 4.1 Row Level Security (RLS)
*   All tables have RLS enabled.
*   Policies explicitly define `SELECT`, `INSERT`, `UPDATE`, `DELETE` permissions based on `auth.uid()` and `profiles.role`.

### 4.2 Environment Variables
*   Sensitive keys (`NEXTAUTH_SECRET`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are stored in `.env.local` and never exposed to the client.

### 4.3 Input Validation
*   Client-side validation using HTML5 attributes and React state.
*   Server-side validation in API routes before database interaction.

---

## 5. Future Scalability Considerations
*   **Payment Gateway**: Webhook integration (e.g., Midtrans/Xendit) to automate `payment_status` updates.
*   **Email Service**: Integration with Resend/SendGrid for transactional emails.
*   **Caching**: Implement Next.js `unstable_cache` or similar strategies for high-traffic public pages (Tours list).
