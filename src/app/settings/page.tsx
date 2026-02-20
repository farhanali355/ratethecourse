import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SettingsContent } from '@/components/settings/SettingsContent'

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                <SettingsContent />
            </main>
            <Footer />
        </div>
    )
}
