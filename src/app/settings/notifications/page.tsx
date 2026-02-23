import { NotificationsContent } from "@/components/settings/NotificationsContent"

export default function NotificationsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow">
                <NotificationsContent />
            </main>
        </div>
    )
}
