import { ReactNode } from "react";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <CustomerSidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
