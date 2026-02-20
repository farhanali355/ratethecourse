import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SuccessContent } from '@/components/shared/SuccessContent'

export default function SuccessPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header showSearch={true} />
            <main className="flex-grow">
                <SuccessContent />
            </main>
            <Footer />
        </div>
    )
}
