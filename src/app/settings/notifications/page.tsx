import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { NotificationsContent } from "@/components/settings/NotificationsContent"

export default function NotificationsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header showSearch={true} />
            <main className="flex-grow">
                <NotificationsContent />
            </main>
            <Footer />
        </div>
    )
}
