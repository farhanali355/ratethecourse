import Link from 'next/link'

export default function GuidelinesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">

            <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full font-montserrat text-black">
                <h1 className="text-5xl font-extrabold mb-12 text-black">Review Guidelines</h1>

                <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-800">
                    <p>
                        These are the official posting guidelines ("Site Guidelines") forwww.RTC website, application or other interactive service ("Site"). The Site is owned, operated and/or provided by RTC, LLC ("Rate My Professors," "we," "us," or "our") and these Site Guidelines are a part of, and an Additional Terms under, ourTerms of Use Agreement.
                    </p>
                    <p>
                        RTC is the largest online destination for students to research and RTC, colleges, and universities across the United States. Our mission is to provide a safe forum to share classroom experiences to help fellow students make critical education choices.
                    </p>

                    <div>
                        <h2 className="text-lg font-bold mb-2 text-black mt-8 uppercase">THE SITE/APP</h2>
                        <p className="mb-6">
                            The RTC website RTC and mobile app provide user generated feedback on professors' teaching methods and their respective courses as well as user generated feedback on the lifestyle and facilities of college and university campuses.
                        </p>

                        <p className="mb-4">
                            This Terms of Use Agreement describes your rights and responsibilities relating to the Site that provides an authorized link to this Terms of Use Agreement and is a legally binding agreement between you, on the one hand, and RTC, on the other hand. Additional terms that govern certain products or services (for example, rules of participation in contests and sweepstakes and Site Guidelines) are also applicable if you participate in those products and/or services and are incorporated into these Terms of Use Agreement by reference.
                        </p>
                        <p className="mb-4">
                            There are age and other eligibility requirements for this Site. This Site is governed by and operated under U.S. law.
                        </p>
                        <Link href="#" className="underline font-medium text-black">Read more</Link>
                    </div>
                </div>
            </main>

        </div>
    )
}
