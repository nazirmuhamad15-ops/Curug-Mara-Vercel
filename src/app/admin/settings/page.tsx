"use client";

import { SettingsPage } from "@/components/admin/SettingsPage";

export default function GeneralSettings() {
    return (
        <SettingsPage
            title="General Settings"
            description="Manage your site configuration and preferences"
            category="general"
            fields={[
                {
                    key: "site_name",
                    label: "Site Name",
                    type: "text",
                    placeholder: "Adventure Curug Mara",
                    description: "The name of your website as it appears in the header and title."
                },
                {
                    key: "site_description",
                    label: "Site Description",
                    type: "textarea",
                    placeholder: "Discover the magic of Indonesia's hidden waterfalls...",
                    description: "A short description of your website for SEO and footer."
                },
                {
                    key: "contact_email",
                    label: "Contact Email",
                    type: "email",
                    placeholder: "info@curugmara.com",
                    description: "Public contact email address."
                },
                {
                    key: "contact_phone",
                    label: "Contact Phone",
                    type: "text",
                    placeholder: "+62 123 4567 890",
                    description: "Public contact phone number."
                }
            ]}
        />
    );
}

