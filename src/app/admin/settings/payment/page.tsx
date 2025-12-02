"use client";

import { SettingsPage } from "@/components/admin/SettingsPage";

export default function PaymentSettings() {
    return (
        <SettingsPage
            title="Payment Settings"
            description="Configure iPaymu payment gateway integration."
            category="payment"
            fields={[
                {
                    key: "ipaymu_api_key",
                    label: "iPaymu API Key",
                    type: "password",
                    placeholder: "Your API Key",
                    description: "Get this from your iPaymu dashboard."
                },
                {
                    key: "ipaymu_va",
                    label: "Virtual Account Number",
                    placeholder: "117900...",
                    description: "Your iPaymu Virtual Account number."
                },
                {
                    key: "ipaymu_production",
                    label: "Production Mode",
                    placeholder: "false",
                    description: "Set to 'true' for live transactions, 'false' for sandbox."
                }
            ]}
        />
    );
}
