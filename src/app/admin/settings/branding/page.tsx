"use client";

import { SettingsPage } from "@/components/admin/SettingsPage";

export default function BrandingSettings() {
    return (
        <SettingsPage
            title="Branding Settings"
            description="Manage your website's identity, logo, and colors."
            category="branding"
            fields={[
                {
                    key: "site_name",
                    label: "Site Name",
                    placeholder: "Adventure Curug Mara",
                    description: "The name of your website as it appears in the header and title."
                },
                {
                    key: "site_tagline",
                    label: "Tagline",
                    placeholder: "Explore Hidden Waterfalls",
                    description: "A short catchy phrase describing your business."
                },
                {
                    key: "site_logo",
                    label: "Logo",
                    type: "image",
                    placeholder: "https://...",
                    description: "Direct URL to your logo image."
                },
                {
                    key: "primary_color",
                    label: "Primary Color",
                    type: "text",
                    placeholder: "#10b981",
                    description: "Hex color code for your brand's primary color."
                }
            ]}
        />
    );
}
