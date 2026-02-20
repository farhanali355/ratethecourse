import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HelpCenterContent } from "@/components/settings/HelpCenterContent"

export default function HelpCenterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header showSearch={true} />
            <main className="flex-grow">
                <HelpCenterContent />
            </main>
            <Footer />
        </div>
    )
}
