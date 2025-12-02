"use client";

import { SettingsPage } from "@/components/admin/SettingsPage";

export default function SeoSettings() {
    return (
        <SettingsPage
            title="SEO Settings"
            description="Configure default meta tags for search engine optimization."
            category="seo"
            fields={[
                {
                    key: "meta_title",
                    label: "Default Meta Title",
                    placeholder: "Adventure Curug Mara - Waterfall Tours",
                    description: "Default title tag for pages without specific titles."
                },
                {
                    key: "meta_description",
                    label: "Meta Description",
                    type: "textarea",
                    placeholder: "Discover breathtaking waterfalls...",
                    description: "Default description for search results."
                },
                {
                    key: "meta_keywords",
                    label: "Keywords",
                    type: "textarea",
                    placeholder: "waterfall, tour, travel, indonesia",
                    description: "Comma-separated keywords for SEO."
                }
            ]}
        />
    );
}
