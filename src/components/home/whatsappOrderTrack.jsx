'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BoxLinear, BusLinear } from 'solar-icon-set';
import { motion } from 'framer-motion';

export default function WhatsAppOrderTracker() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleTrack = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/track?id=${encodeURIComponent(query.trim())}`);
    };

    const steps = [
        {
            number: '01',
            title: 'WhatsApp us the model & size',
            description: 'We confirm availability',
        },
        {
            number: '02',
            title: 'We share price + delivery',
            description: 'Bank transfer / COD',
        },
        {
            number: '03',
            title: 'Track with Order ID',
            description: 'We update via WhatsApp',
        },
    ];

    return (
        <section className="my-12 sm:my-16 mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-[#FAF9F5] dark:bg-zinc-900/90 rounded-[2.5rem] border border-black/[0.05] dark:border-zinc-800 shadow-xl shadow-amber-900/[0.03] dark:shadow-black/40 p-6 sm:p-10 lg:p-14"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left Column: Track Form & Info */}
                    <div className="lg:col-span-8 flex flex-col items-start text-left">
                        {/* Top Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D5C6A9] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 text-[#9E7736] dark:text-[#D9B26D] text-[11px] font-bold tracking-[0.18em] uppercase mb-6 shadow-2xs">
                            <BoxLinear className="w-3.5 h-3.5 text-[#C29B53]" />
                            <span>WHATSAPP ORDER TRACKING</span>
                        </div>

                        {/* Main Heading */}
                        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-zinc-900 dark:text-zinc-50 leading-[1.18] tracking-tight">
                            Track your order —{' '}
                            <span className="text-[#C29B53] dark:text-[#D9B26D] font-serif">
                                ordered via WhatsApp?
                            </span>{' '}
                            Track here.
                        </h2>

                        {/* Description */}
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed mt-4 mb-8 max-w-xl font-normal">
                            Enter your Order ID (LG-XXXX) or WhatsApp number used for ordering. We’ll pull the latest status from our boutique.
                        </p>

                        {/* Tracking Form */}
                        <form onSubmit={handleTrack} className="w-full max-w-xl">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Order ID e.g. LG-2847 or +94 77 XXX XXXX"
                                    className="flex-1 bg-white dark:bg-zinc-800/90 border border-zinc-200/90 dark:border-zinc-700 rounded-full px-6 py-3.5 sm:py-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#C29B53]/40 shadow-2xs transition-all"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full px-8 py-3.5 sm:py-4 font-semibold text-sm text-white bg-gradient-to-r from-[#C29B53] via-[#B58D4B] to-[#9E7736] hover:brightness-105 active:scale-[0.98] shadow-lg shadow-[#B58D4B]/25 transition-all duration-200 cursor-pointer whitespace-nowrap"
                                >
                                    Track Order
                                </button>
                            </div>
                        </form>

                        {/* Bottom Meta Highlights */}
                        <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C29B53]" />
                                <span>No account needed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BusLinear className="w-4 h-4 text-[#C29B53]" />
                                <span>Island-wide in 24-48h</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: How It Works Card */}
                    <div className="lg:col-span-4 w-full">
                        <div className="bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xs rounded-[24px] p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/80 shadow-2xs">
                            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-6">
                                HOW IT WORKS
                            </h3>

                            <div className="flex flex-col gap-6">
                                {steps.map((step) => (
                                    <div key={step.number} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#C29B53] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-0.5">
                                            {step.number}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base leading-snug">
                                                {step.title}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
