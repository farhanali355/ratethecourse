import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BillingContent } from "@/components/settings/BillingContent"

export default function BillingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header showSearch={true} />
            <main className="flex-grow">
                <BillingContent />
            </main>
            <Footer />
        </div>
    )
}
