'use client'

import React from 'react'
import { Check, X, Star, Plus, Minus } from 'lucide-react'

// Mock metadata - in a real app this would come from a data file or CMS
const metadata = {
  title: "Is Saamir Mithwani’s Course Brandify Worth It? 2026 Review",
  description: "An honest review of Saamir Mithwani’s Online Education Course “Brandify”. Pricing, pros, cons, real user feedback, and whether the program is worth it.",
  slug: "/reviews/saamir-mithwani-brandify-review",
}

export default function BrandifyReviewPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "What is the cost to join Brandify?",
      answer: "The cost of Brandify is $5,000."
    },
    {
      question: "Is Brandify worth it?",
      answer: "Brandify is not very beginner friendly but could be helpful to more experienced ecomers."
    },
    {
      question: "Who owns Brandify?",
      answer: "Saamir Mithwani is the owner of Brandify."
    },
    {
      question: "Is it guaranteed to work?",
      answer: "There is no guarantee that joining Brandify will get you the skills or the profit you are looking for. The only way for it to work will come from the work you put into it."
    }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-montserrat pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">

        {/* Breadcrumbs/Category */}
        <div className="text-[12px] font-bold text-black tracking-[0.2em] mb-4 uppercase font-montserrat">
          DROPSHIPPING · COURSE REVIEW · 2026
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-8 leading-tight font-montserrat">
          Is Saamir Mithwani’s Course Brandify Worth It? 2026 Review
        </h1>

        {/* Post Metadata */}
        <div className="flex flex-wrap gap-4 text-[15px] text-black mb-12 border-b border-gray-100 pb-8">
          <span className="text-[#0088EE] font-semibold font-montserrat">Online Course</span>
          <span className="font-montserrat">Entrepreneurship</span>
          <span className="font-montserrat">Mentorship Program</span>
          <span className="font-semibold text-black font-montserrat">$5,000</span>
          <span className="font-montserrat">Updated March 2026</span>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl leading-relaxed text-black mb-6 font-montserrat">
            Brandify is an e-commerce online education program that helps beginners launch and scale online stores.
          </p>
          <p className="text-lg leading-relaxed text-black mb-6 font-montserrat">
            In addition to Saamir Mithwani’s social media presence growing, so is his online education program Brandify. Which is leading to a lot of people wondering whether Brandify is legit or just another scam?
          </p>
          <p className="text-lg leading-relaxed text-black font-montserrat">
            This review will break down a few things: what the course offers, price, pros and cons, and whether it's a good investment.
          </p>
        </div>

        {/* What Is Included */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 font-montserrat">What Is Included In Brandify?</h2>
          <p className="text-lg text-black mb-6 font-montserrat">Brandify includes the following:</p>
          <ul className="space-y-4 mb-8">
            {[
              "4 Month Access",
              "1 Weekly Group Call (20-30 students)",
              "1 Weekly Pod Call (1-3 students)",
              "Ticket Support Chat",
              "A-Z Video Course Modules",
              "Access to Discord Community (800 students)"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-lg text-black font-montserrat">
                <span className="text-[#0088EE] font-semibold">0{index + 1}</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#0088EE] text-black italic font-montserrat">
            The Group Call, Pod Calls and Chat Support will be with other coaches on the Brandify Team. There is no form of access to Saamir included within the program.
            After your 4 months of access are complete, you will no longer have access to the Group Calls, Pod Calls, or the Support Chat. Although, your access to the Video Course Modules and the Discord Community will stay intact.
            You will then be offered the option to extend your monthly access for a price.
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-16 text-center py-12 border-y border-gray-100">
          <div className="text-sm font-bold text-black tracking-widest uppercase mb-2 font-montserrat">CURRENT ENROLLMENT PRICE</div>
          <div className="text-6xl md:text-[40px] font-bold text-black mb-4 font-montserrat">$5,000</div>
          <p className="text-black max-w-[500px] text-[16px] mx-auto font-montserrat">
            Price may vary based on enrollment period, promotions, or payment plan options.
          </p>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-bold text-[#00AA66] tracking-widest uppercase mb-6 flex items-center gap-2">
              PROS
            </h3>
            <ul className="space-y-4">
              {[
                "Video Course Access",
                "Smaller Sized Group & Pod Calls",
                "Access to Ticket Support Chat",
                "2 Weekly Calls"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-lg text-black font-montserrat">
                  <Check className="w-5 h-5 text-[#00AA66]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EE4444] tracking-widest uppercase mb-6 flex items-center gap-2">
              CONS
            </h3>
            <ul className="space-y-4">
              {[
                "Limited 4 Month Access",
                "No One On One Support",
                "Course Owner Is Not Involved"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-lg text-black">
                  <X className="w-5 h-5 text-[#EE4444]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Feedback */}
        <div className="mb-16 bg-[#FFF9F2] p-8 md:p-12 rounded-2xl border border-[#FFE7CC]">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#FFAA00] text-[#FFAA00]" />
            ))}
            <Star className="w-5 h-5 text-[#FFAA00]" />
          </div>
          <p className="text-[13px] font-bold text-black mb-4 tracking-widest uppercase font-montserrat">VERIFIED REVIEW · RATETHECOURSES.COM</p>
          <blockquote className="text-xl italic text-black leading-relaxed font-montserrat">
            “I joined Saamir’s course last year and it was decent but not worth the $5,000 I invested. The Group Calls were hard to get your questions across as they’re were like 40 other people on there as well and maxed to an hour limit as well. When I joined I assumed that Saamir would be the one in charge of the Group Calls and Pod Calls, but it was my mistake for not asking. After my 4 months were done, I then lost the option to join the calls. I still had access to the Discord Community but that is only so much help as theres over 500 people on there. I am disappointed and feel I got scammed for the fact my questions through the chat would sometimes take a day or two to get a response and the answers weren't that helpful as they were short or bland answers.”
          </blockquote>
        </div>

        {/* Final Verdict */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-6">Is Saamir Mithwani’s Course Brandify Worth It? Final Verdict:</h2>
          <div className="prose prose-lg max-w-none text-black leading-relaxed mb-8">
            <p className="font-montserrat font-medium">
              The way Brandify operates by having other coaches run the program and not by Saamir himself is the ultimate red flag. When there are course owners that are too busy to give their students the attention that they deserve, after investing thousands into their course, it shows a lot about the program.
            </p>
          </div>
          <div className="bg-[#E6F4FF] p-8 rounded-xl border-l-8 border-[#0088EE] mb-8">
            <p className="text-lg text-black font-medium leading-relaxed font-montserrat">
              If the course owner actually cared about their program’s reputation and the results that their students get, they would be the ones on the calls with their students. This is a perfect example of why one should make sure to do their own research before joining any type of online education program.
            </p>
          </div>
          <p className="text-lg text-black leading-relaxed mb-6 font-montserrat">
            For the beginners joining- 4 months and 32 calls is realistically not enough time to build a successful brand. If you are joining with years of experience under your belt, this program may be enough for you and worth the time and money.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-16 pt-8 border-t border-gray-100">
          {["Online Course", "Entrepreneurship", "Mentorship Program", "Business Education", "Course Review"].map(tag => (
            <span key={tag} className="bg-gray-100 text-black px-4 py-1.5 rounded-full text-sm font-medium font-montserrat">
              {tag}
            </span>
          ))}
        </div>

        {/* Internal Links */}
        {/* <div className="mb-16">
          <h3 className="text-xl font-bold text-black mb-6">Internal Links</h3>
          <ul className="space-y-3 underline text-[#0088EE] font-medium">
            <li><a href="#">Best Online Business Mentorships</a></li>
            <li><a href="#">High-Ticket Sales Training Reviews</a></li>
            <li><a href="#">Jung Lab Accelerator Alternatives</a></li>
          </ul>
        </div> */}

        <div className="pt-16 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-black mb-8 font-montserrat">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left py-4 group"
                >
                  <h4 className="text-xl font-bold text-black font-montserrat group-hover:text-[#0088EE] transition-colors pr-8">
                    {faq.question}
                  </h4>
                  <div className="shrink-0 text-black">
                    {openFaq === index ? (
                      <Minus className="w-6 h-6" />
                    ) : (
                      <Plus className="w-6 h-6 " />
                    )}
                  </div>
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'grid-rows-[1fr] opacity-100 pt-2 pb-4' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-lg text-black font-montserrat leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
