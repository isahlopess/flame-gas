import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, MapPin, Menu, X, ArrowRight, Zap, Sparkles, Cylinder } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Welcome({
    auth,
}: PageProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { scrollY, scrollYProgress } = useScroll();

    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
    const y = useTransform(scrollY, [0, 300], [0, 100]);

    const cylinderY = useTransform(scrollYProgress, [0, 1], ['0vh', '70vh']);
    const cylinderRotate = useTransform(scrollYProgress, [0, 1], [15, 360]);
    const cylinderScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);
    const cylinderX = useTransform(scrollYProgress, [0, 0.5, 1], ['0vw', '10vw', '-10vw']);

    const [particles, setParticles] = useState<{id: number, left: string, top: string, size: number, delay: number, duration: number, sway: number}[]>([]);

    useEffect(() => {
        setParticles(
            Array.from({ length: 25 }).map((_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: Math.random() * 3 + 2,
                delay: Math.random() * 5,
                duration: Math.random() * 8 + 10,
                sway: Math.random() * 40 - 20,
            }))
        );

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-navy-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-flame-500 selection:text-white">
            <Head title="FlameGás - O seu botijão rápido" />
            <div className="fixed top-0 w-full z-50 px-4 sm:px-6 pt-6 transition-all duration-500">
                <header
                    className={`max-w-6xl mx-auto rounded-full transition-all duration-300 ${
                        isScrolled
                            ? 'py-3 px-6 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/50 dark:border-white/10 text-slate-900 dark:text-white'
                            : 'py-4 px-6 bg-white/5 dark:bg-navy-950/20 backdrop-blur-sm border border-white/10 text-white shadow-xl'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src="/images/fire.png" alt="FlameGás" className="w-9 h-9 object-contain drop-shadow-md" />
                            <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">Flame<span className="text-flame-500">Gás</span></span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                            <a href="#servicos" className={`transition-colors ${isScrolled ? 'hover:text-flame-500' : 'text-white/80 hover:text-white'}`}>Serviços</a>
                            <a href="#como-funciona" className={`transition-colors ${isScrolled ? 'hover:text-flame-500' : 'text-white/80 hover:text-white'}`}>Como Funciona</a>
                            <a href="#planos" className={`transition-colors ${isScrolled ? 'hover:text-flame-500' : 'text-white/80 hover:text-white'}`}>Planos</a>
                            <div className={`w-px h-5 ${isScrolled ? 'bg-slate-200 dark:bg-navy-800' : 'bg-white/20'}`}></div>
                            {auth.user ? (
                                <Link href={route('dashboard')} className={`transition-colors font-semibold ${isScrolled ? 'hover:text-flame-500' : 'text-white'}`}>
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href={route('login')} className={`transition-colors font-semibold ${isScrolled ? 'hover:text-flame-500' : 'text-white'}`}>
                                        Entrar
                                    </Link>
                                    <Link href={route('register')} className="bg-flame-500 text-white px-6 py-2.5 rounded-full hover:bg-flame-600 hover:scale-105 transition-all shadow-lg shadow-flame-500/25 border border-flame-400/50 font-semibold">
                                        Criar Conta
                                    </Link>
                                </div>
                            )}
                        </nav>
                        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </header>
            </div>
            <main>
                <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
                    <div className="absolute inset-0 z-0 bg-navy-950">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/images/bg-gas.jpg')" }}
                        ></div>
                        <div className="absolute inset-0 bg-black/60"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/80 to-navy-950/95 mix-blend-multiply"></div>
                    </div>
                    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute rounded-full bg-flame-400"
                                style={{
                                    left: p.left,
                                    top: p.top,
                                    width: `${p.size}px`,
                                    height: `${p.size}px`,
                                    boxShadow: '0 0 12px 2px rgba(249,115,22,1)'
                                }}
                                animate={{
                                    y: [0, -1000],
                                    opacity: [0, 1, 0],
                                    x: [0, p.sway]
                                }}
                                transition={{
                                    duration: p.duration,
                                    repeat: Infinity,
                                    delay: p.delay,
                                    ease: "linear"
                                }}
                            />
                        ))}
                    </div>
                    <motion.div
                        className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center"
                        style={{ opacity, scale, y }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex justify-center"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-flame-50 text-flame-600 dark:bg-flame-500/10 border border-flame-100 dark:border-flame-500/20 text-sm font-medium mb-8">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flame-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-flame-500"></span>
                                </span>
                                Entrega em até 30 minutos
                            </span>
                        </motion.div>
                        <motion.h1
                            className="text-5xl sm:text-6xl md:text-8xl font-heading font-extrabold tracking-tight mb-8 leading-[1.1] text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        >
                            O botijão que
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">
                                move sua casa.
                            </span>
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Esqueça a espera e a complicação. Peça seu botijão de gás com um toque, acompanhe em tempo real e receba antes de terminar o café.
                        </motion.p>
                        <motion.div
                            className="glass max-w-2xl mx-auto rounded-2xl sm:rounded-full p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl relative z-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="flex-1 flex items-center gap-3 px-4 w-full h-14">
                                <MapPin className="text-flame-500 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Digite seu endereço ou CEP..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-base"
                                />
                            </div>
                            <button className="w-full sm:w-auto bg-flame-500 hover:bg-flame-600 text-white px-8 h-14 rounded-xl sm:rounded-full font-medium transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-flame-500/40">
                                Verificar Entrega
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                        <motion.div
                            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-flame-500" />
                                <span>Maior Duração</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-flame-500" />
                                <span>Rastreio em Tempo Real</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-flame-500" />
                                <span>Qualidade Garantida</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
                <section className="relative z-20 -mt-16 sm:-mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="glass bg-white/80 dark:bg-navy-900/80 rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/60 dark:border-white/10"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-4 md:pt-0">
                                <div className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-2">+10k</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Famílias Atendidas</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0">
                                <div className="text-4xl sm:text-5xl font-heading font-extrabold text-flame-500 mb-2">30<span className="text-2xl sm:text-3xl">m</span></div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Entrega Expressa</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0">
                                <div className="flex items-center gap-1 mb-2">
                                    <div className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">4.9</div>
                                    <span className="text-amber-500 text-3xl">★</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avaliações Positivas</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0">
                                <div className="text-4xl sm:text-5xl font-heading font-extrabold text-amber-500 mb-2">100%</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Gás com Peso Certo</div>
                            </div>
                        </div>
                    </motion.div>
                </section>
                <div className="h-[20vh] bg-slate-50 dark:bg-navy-950"></div>
            </main>
        </div>
    );
}
