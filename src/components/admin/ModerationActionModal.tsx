'use client'

import React, { useState } from 'react'
import { X, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

interface ModerationActionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (data: { status: 'approved' | 'rejected', note: string }) => void
    title: string
    itemName: string
    type: 'course' | 'review'
}

export default function ModerationActionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    type
}: ModerationActionModalProps) {
    const [note, setNote] = useState('')
    const [action, setAction] = useState<'approved' | 'rejected' | null>(null)

    if (!isOpen) return null

    const handleConfirm = () => {
        if (!action) return
        onConfirm({ status: action, note })
        setNote('')
        setAction(null)
    }

    const rejectionReasons = [
        "Inaccurate Information",
        "Spam / Low Quality",
        "Inappropriate Content",
        "Duplicate Submission",
        "Off-topic / Irrelevant"
    ]

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-montserrat">
            <div className="absolute inset-0 bg-[#0D1B2A]/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white dark:bg-[#0D1B2A] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-white/5">
                <div className="px-8 py-6 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-[#FBFCFD] dark:bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-black text-[#0D1B2A] dark:text-white">{title}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Moderating: {itemName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-400 dark:text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Action Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setAction('approved')}
                            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${action === 'approved'
                                ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                                : 'border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:border-gray-100 dark:hover:border-white/10'
                                }`}
                        >
                            <CheckCircle2 className={`w-8 h-8 ${action === 'approved' ? 'text-green-500' : 'text-gray-300 dark:text-gray-700'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${action === 'approved' ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>Approve</span>
                        </button>

                        <button
                            onClick={() => setAction('rejected')}
                            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${action === 'rejected'
                                ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                                : 'border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:border-gray-100 dark:hover:border-white/10'
                                }`}
                        >
                            <XCircle className={`w-8 h-8 ${action === 'rejected' ? 'text-red-500' : 'text-gray-300 dark:text-gray-700'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${action === 'rejected' ? 'text-red-700 dark:text-red-400' : 'text-gray-400 dark:text-gray-600'}`}>Reject</span>
                        </button>
                    </div>

                    {action === 'rejected' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Quick Rejection Reasons</p>
                                <div className="flex flex-wrap gap-2">
                                    {rejectionReasons.map(reason => (
                                        <button
                                            key={reason}
                                            onClick={() => setNote(reason)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${note === reason
                                                ? 'bg-[#0D1B2A] dark:bg-white text-white dark:text-[#0D1B2A] border-[#0D1B2A] dark:border-white'
                                                : 'bg-white dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                                                }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Detailed Reason / Note to User</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-medium dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20 transition-all resize-none"
                                    placeholder="Explain why this content was rejected..."
                                />
                            </div>
                        </div>
                    )}

                    {action === 'approved' && (
                        <div className="bg-green-50/50 dark:bg-green-500/10 p-6 rounded-2xl border border-green-100 dark:border-green-500/20 flex gap-4 animate-in fade-in duration-300">
                            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                            <div>
                                <p className="text-sm font-black text-green-800 dark:text-green-400">Ready to Publish</p>
                                <p className="text-xs text-green-600 dark:text-green-400/60 font-medium mt-1">This content will be instantly visible to all users on the platform.</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!action}
                            onClick={handleConfirm}
                            className={`flex-[2] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${!action
                                ? 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-700 cursor-not-allowed shadow-none'
                                : action === 'approved'
                                    ? 'bg-[#0D1B2A] dark:bg-[#0088EE] text-white hover:bg-black dark:hover:bg-[#0077DD]'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                        >
                            Confirm Decision
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
