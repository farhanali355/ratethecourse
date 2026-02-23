import { SecurityContent } from "@/components/settings/SecurityContent"

export default function SecurityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow">
                <SecurityContent />
            </main>
        </div>
    )
}
