'use client'

import React, { useState } from 'react'
import { Check, X, Star, Plus, Minus, ArrowUpRight } from 'lucide-react'

export default function BlueOceanReviewPage() {
  const [activeTab, setActiveTab] = useState<'group' | 'one-on-one'>('group');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the cost of Blue Ocean Program?",
      answer: "The cost of Blue Ocean Program is $5,000"
    },
    {
      question: "Is Blue Ocean Program Worth It?",
      answer: "Yes, Blue Ocean Program offers significant guidance and value for new or experienced students in ecommerce."
    },
    {
      question: "Who Owns Blue Ocean Program?",
      answer: "Blue Ocean Program is owned and operated by Romas."
    },
    {
      question: "Is Blue Ocean Program Guaranteed To Work?",
      answer: "Although there is no money back guarantee, this is one of the best options for beginners looking to get into ecom."
    }
  ];

  const CircleScore = ({ score }: { score: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 10) * circumference;

    return (
      <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
        <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#F59E0B"
            strokeWidth="9"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[26px] font-black text-[#F59E0B] leading-none">{score}</span>
          <span className="text-[11px] text-gray-400 font-bold mt-0.5">/ 10</span>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 font-montserrat pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        
        {/* Title Section */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 font-montserrat tracking-tight">
          Blue Ocean Program Review: Is Romas Mentorship Worth It?
        </h1>
        <p className="text-black text-sm font-medium mb-8">
          By Romas · Updated 2026
        </p>

        {/* Quick Verdict Box */}
        <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <CircleScore score={5} />
          <div>
            <h3 className="text-[#92400E] font-bold text-lg mb-1.5">Quick Verdict: Mixed</h3>
            <p className="text-[#4B5563] font-medium leading-relaxed text-sm md:text-base">
              Solid course content and small group format, but the 10-week access limit, high price, and limited direct access to Andy make it a tough sell — especially for beginners.
            </p>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Overview</h2>
          <div className="space-y-6 text-lg text-black leading-relaxed">
            <p>
              The Blue Ocean Program is an ecommerce online education program that helps beginners launch and scale online stores through google ads.
            </p>
            <p>
              With Romas’ online presence growing on Youtube, Instagram and other social media platforms, so is his program Blue Ocean. Which leads a lot of people to question if Blue Ocean is worth it or just another scam?
            </p>
            <p>
              This review will break down what the program offers, price, pros and cons, and whether it's a good investment.
            </p>
          </div>
        </div>

        {/* Programs & Pricing Tabs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6 font-montserrat tracking-tight">Programs & Pricing</h2>
          
          {/* Tabs Container */}
          <div className="flex p-1 bg-white border border-[#E5EFFF] rounded-xl mb-4 max-w-full">
            <button 
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-3 text-center font-bold text-sm tracking-tight transition-all duration-300 rounded-lg ${
                activeTab === 'group' ? 'bg-[#E5EFFF] text-[#0088EE] border border-[#0088EE]' : 'bg-white text-gray-400'
              }`}
            >
              Group Call
            </button>
            <button 
              onClick={() => setActiveTab('one-on-one')}
              className={`flex-1 py-3 text-center font-bold text-sm tracking-tight transition-all duration-300 rounded-lg ${
                activeTab === 'one-on-one' ? 'bg-[#E5EFFF] text-[#0088EE] border border-[#0088EE]' : 'bg-white text-gray-400'
              }`}
            >
              One-on-One
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="border-[2.5px] border-[#3B82F6] rounded-2xl bg-white shadow-sm overflow-hidden">
             <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-1">
                   <div>
                      <h3 className="text-[26px] font-bold text-black leading-tight">
                        {activeTab === 'group' ? 'Group Call Program' : 'Blue Ocean Program'}
                      </h3>
                      <p className="text-gray-400 font-medium text-sm mt-0.5">
                        {activeTab === 'group' ? '10 Weeks' : '3 MONTHS'}
                      </p>
                   </div>
                   <div className="text-[35px] font-bold text-[#3B82F6] leading-none">
                     {activeTab === 'group' ? '$2,500' : '$5,000'}
                   </div>
                </div>

                <ul className="space-y-4 mt-10">
                  {[
                    { text: activeTab === 'group' ? "4 weekly group calls (8-20 students)" : "1 weekly group call (50 students)", included: true },
                    { text: activeTab === 'group' ? "A-Z video modules on Skool" : "Video course modules on Whop (9h)", included: true },
                    { text: activeTab === 'group' ? "Discord community access (220 students)" : "Lifetime Discord access (250 students)", included: true },
                    { text: activeTab === 'group' ? "One-on-one onboarding call with Andy" : "One-on-one onboarding call", included: true },
                    { text: activeTab === 'group' ? "Weekly 1-on-1 coaching calls" : "One-on-one calls bi-weekly (6 total)", included: activeTab === 'one-on-one' },
                    { text: activeTab === 'group' ? "24/7 chat access to a coach" : "Daily 24/7 one-on-one chat", included: activeTab === 'one-on-one' },
                    { text: "Roma's personal phone number", included: activeTab === 'one-on-one' },
                    { text: "Done-for-you store setup", included: false },
                  ].map((item, i) => (
                    <li key={i} className={`flex items-start gap-4 text-base md:text-lg ${item.included ? 'text-gray-900 font-medium' : 'text-gray-300 font-medium'}`}>
                       <div className="shrink-0 mt-0.5">
                         {item.included ? (
                           <div className="bg-[#22C55E] rounded-[4px] p-0.5 mt-1.5 md:mt-1">
                             <Check className="w-3.5 h-3.5 text-white stroke-[4.5]" />
                           </div>
                         ) : (
                           <div className="flex items-center justify-center w-5 h-5 mt-1.5 md:mt-1 ">
                             <X className="w-5 h-5 text-red-500 stroke-[3]" />
                           </div>
                         )}
                       </div>
                       <span className="leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
             </div>

             <div className="px-8 pb-8 pt-6">
                <p className="text-[13px] text-black font-medium italic opacity-80">
                  Note: After {activeTab === 'group' ? '10 weeks' : '3 months'}, you lose access to calls. Video modules and Discord remain.
                </p>
             </div>
          </div>
        </div>

        {/* Pros & Cons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Pros & Cons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-100 bg-green-50/20 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
               <h4 className="text-green-700 font-bold text-lg mb-6 flex items-center gap-2">
                 <Check className="w-5 h-5" /> Pros
               </h4>
               <ul className="space-y-4">
                 {[
                   "One-on-One Mentoring From Romas",
                   "Video Course Modules",
                   "Weekly Group Call",
                   "Lifetime Discord Community Access"
                 ].map(pro => (
                   <li key={pro} className="flex items-center gap-3 text-black font-semibold">
                      <Check className="w-4 h-4 text-green-500" /> {pro}
                   </li>
                 ))}
               </ul>
            </div>
            <div className="border border-red-100 bg-red-50/20 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
               <h4 className="text-red-700 font-bold text-lg mb-6 flex items-center gap-2">
                 <X className="w-5 h-5" /> Cons
               </h4>
               <ul className="space-y-4">
                 {[
                   "Limited to 6 One-on-One Calls",
                   "High Price"
                 ].map(con => (
                   <li key={con} className="flex items-center gap-3 text-black font-semibold">
                      <X className="w-4 h-4 text-red-500" /> {con}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>

        {/* Real User Feedback */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6 font-montserrat tracking-tight">Real User Feedback</h2>
          <div className="bg-[#F8F9FF] border border-[#E5EFFF] rounded-xl relative overflow-hidden flex flex-col p-6 md:p-8">
             {/* Left Accent Bar */}
             <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#6366F1]"></div>
             
             <div className="flex flex-col gap-4">
                <span className="text-[#6366F1] font-bold text-sm">
                  From ratethecourses.com
                </span>
                
                <p className="text-[#2D3036] text-lg font-medium leading-relaxed italic">
                  “I learned a lot from Romas. His program was exactly what I was looking for. There aren't much courses out there where the owner actually interacts with the students and helps them, but Romas is very active and helped me answer every question in detail. I was able to contact him through text on his personal phone number for any quick questions. I was able to make back my investment in about 4 months of joining...”
                </p>
                
                <div className="flex gap-1.5 mt-2">
                   {[...Array(5)].map((_, i) => (
                     <Star 
                       key={i} 
                       className={`w-5 h-5 ${i < 5 ? 'fill-[#FFB800] text-[#FFB800]' : 'text-[#E5EFFF] fill-none'}`} 
                       strokeWidth={1.5}
                     />
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Final Verdict Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-black mb-6 font-montserrat tracking-tight pb-2 border-b border-gray-100">Final Verdict</h2>
          
          <div className="bg-[#FFF8F4] rounded-2xl p-6 md:p-8">
            {/* Score Boxes Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100/50 text-center flex flex-col items-center">
                  <span className="text-[28px] font-black text-[#D92D20] mb-0.5">9/10</span>
                  <span className="text-[13px] font-medium text-gray-400">Value</span>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100/50 text-center flex flex-col items-center">
                  <span className="text-[28px] font-black text-[#D92D20] mb-0.5">7/10</span>
                  <span className="text-[13px] font-medium text-gray-400">Beginner-Friendly</span>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100/50 text-center flex flex-col items-center">
                  <span className="text-[28px] font-black text-[#D92D20] mb-1">10/10</span>
                  <span className="text-[13px] font-medium text-gray-400">Support</span>
               </div>
            </div>

            <div className="text-[#344054] text-base md:text-lg leading-relaxed font-medium">
              <p>
                <strong className="text-gray-900 font-bold">Highly recommended for most.</strong> The Blue Ocean Program is one of the few programs that is actually being run the way it should be. Instead of handing off the work to other coaches, unlike other course owners, Romas is the coach teaching his students and is one of the main reasons this program is worth it.
              </p>
              <p className="mt-4">
                As well as the added benefit of students having Romas’ personal phone number for any additional questions. After the three months, The Blue Ocean Program still allows their students to stay on the discord and have access to the group calls, which is the least a program owner can do after being paid thousands by their students.
              </p>
              <p className="mt-4">
                The minimal downside is the program only offers six one-on-one calls that are spread across the three month span. This may be enough for some students who already have experience, but possibly not enough guidance for someone entirely new to e-commerce.
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-16">
          {["Online Course", "Entrepreneurship", "Mentorship Program", "Business Education", "Course Review"].map(tag => (
            <span key={tag} className="bg-gray-100 text-black px-4 py-1.5 rounded-full text-sm font-bold font-montserrat">
              {tag}
            </span>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="pt-16 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-black mb-8 font-montserrat">FAQ</h2>
          <div className="space-y-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left py-4 px-2 group"
                >
                  <h4 className="text-xl font-bold text-black font-montserrat group-hover:text-[#0088EE] transition-colors pr-8">
                    {faq.question}
                  </h4>
                  <div className="shrink-0 text-gray-400 group-hover:text-black transition-colors">
                    {openFaq === index ? (
                      <Minus className="w-5 h-5 transition-transform" />
                    ) : (
                      <Plus className="w-5 h-5 transition-transform" />
                    )}
                  </div>
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'grid-rows-[1fr] opacity-100 pt-2 pb-4' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden px-2">
                    <p className="text-lg text-gray-600 font-montserrat leading-relaxed">
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
