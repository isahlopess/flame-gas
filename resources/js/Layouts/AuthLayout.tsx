import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }: PropsWithChildren<{ title: string, subtitle?: string }>) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-navy-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-flame-500 selection:text-white p-4">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/images/bg-login.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-[2px]"></div>
                <motion.div
                    className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-flame-600/30 blur-[120px] pointer-events-none"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-amber-500/20 blur-[150px] pointer-events-none"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <filter id="authNoise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#authNoise)" />
                    </svg>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 120, duration: 0.8 }}
                className="relative z-10 w-full max-w-[500px] bg-white/95 dark:bg-navy-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
            >
                <div className="flex justify-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <motion.img
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            src="/images/fire.png"
                            alt="Logo"
                            className="w-10 h-10 drop-shadow-md"
                        />
                        <span className="font-black tracking-tighter text-3xl uppercase text-slate-900 dark:text-white">
                            FLAME<span className="text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                        </span>
                    </Link>
                </div>
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mb-3"
                    >
                        {title}
                    </motion.h2>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-500 dark:text-slate-400 text-sm sm:text-base px-2"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    );
}
