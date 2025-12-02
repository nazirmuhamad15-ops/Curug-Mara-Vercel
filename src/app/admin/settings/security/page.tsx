"use client";

import { SettingsPage } from "@/components/admin/SettingsPage";

export default function SecuritySettings() {
    return (
        <SettingsPage
            title="Security Settings"
            description="Configure security policies and access controls."
            category="security"
            fields={[
                {
                    key: "min_password_length",
                    label: "Minimum Password Length",
                    type: "number",
                    placeholder: "8",
                    description: "Minimum characters required for new passwords."
                },
                {
                    key: "require_email_verification",
                    label: "Require Email Verification",
                    placeholder: "true",
                    description: "Whether users must verify email before logging in (true/false)."
                },
                {
                    key: "session_timeout",
                    label: "Session Timeout (seconds)",
                    type: "number",
                    placeholder: "3600",
                    description: "How long before an inactive session expires."
                }
            ]}
        />
    );
}
