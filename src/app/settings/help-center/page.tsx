import { HelpCenterContent } from "@/components/settings/HelpCenterContent"

export default function HelpCenterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow">
                <HelpCenterContent />
            </main>
        </div>
    )
}
