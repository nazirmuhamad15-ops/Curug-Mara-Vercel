"use client";

import { SettingsPage } from "@/components/admin/SettingsPage";

export default function EmailSettings() {
    return (
        <SettingsPage
            title="Email Settings"
            description="Configure SMTP settings for sending system emails."
            category="email"
            fields={[
                {
                    key: "smtp_host",
                    label: "SMTP Host",
                    placeholder: "smtp.gmail.com",
                    description: "Your mail server hostname."
                },
                {
                    key: "smtp_port",
                    label: "SMTP Port",
                    type: "number",
                    placeholder: "587",
                    description: "Common ports: 587 (TLS), 465 (SSL)."
                },
                {
                    key: "smtp_user",
                    label: "SMTP Username",
                    placeholder: "user@example.com",
                    description: "Username for authentication."
                },
                {
                    key: "smtp_from_email",
                    label: "From Email",
                    type: "email",
                    placeholder: "noreply@adventurecurugmara.com",
                    description: "Email address that appears in the 'From' field."
                },
                {
                    key: "smtp_from_name",
                    label: "From Name",
                    placeholder: "Adventure Curug Mara",
                    description: "Name that appears in the 'From' field."
                }
            ]}
        />
    );
}
