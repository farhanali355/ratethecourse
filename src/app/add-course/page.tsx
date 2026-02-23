import { AddCourseView } from '@/components/features/AddCourseView'

export const dynamic = 'force-dynamic'

export default function AddCoursePage() {

    return (
        <div className="min-h-screen flex flex-col bg-white">

            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full font-montserrat text-black">
                <AddCourseView />
            </main>

        </div>
    )
}
