import { BillingContent } from "@/components/settings/BillingContent"

export default function BillingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow">
                <BillingContent />
            </main>
        </div>
    )
}
