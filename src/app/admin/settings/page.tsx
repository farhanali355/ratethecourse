'use client'

import React from 'react'
import { Settings, Shield, Globe, Bell, CreditCard, ChevronRight } from 'lucide-react'

export default function AdminSettingsPage() {
    const settingsSections = [
        { label: 'General Configuration', desc: 'Manage site title, logo, and global contact information.', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Security & Access', desc: 'Configure admin permissions and authentication settings.', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Notification Rules', desc: 'Set up automated email alerts and push notifications.', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Payment Integration', desc: 'Manage Stripe/PayPal keys and billing cycles.', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    ]

    return (
        <div className="font-montserrat">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white">Global Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Configure platform-wide parameters and integrations.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsSections.map((section, i) => (
                    <button key={i} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between group hover:shadow-lg dark:hover:bg-white/[0.08] transition-all duration-300 text-left">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl ${section.bg} dark:bg-white/10 ${section.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                <section.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-[#0D1B2A] dark:text-white text-lg mb-1">{section.label}</h4>
                                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">{section.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-[#0D1B2A] dark:group-hover:text-white transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    )
}
