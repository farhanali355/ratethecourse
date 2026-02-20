import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SecurityContent } from "@/components/settings/SecurityContent"

export default function SecurityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header showSearch={true} />
            <main className="flex-grow">
                <SecurityContent />
            </main>
            <Footer />
        </div>
    )
}
