import { SettingsContent } from '@/components/settings/SettingsContent'

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow">
                <SettingsContent />
            </main>
        </div>
    )
}
