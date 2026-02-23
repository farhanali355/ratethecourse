import { SuccessContent } from '@/components/shared/SuccessContent'

export default function SuccessPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-grow">
                <SuccessContent />
            </main>
        </div>
    )
}
