import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, MapPin, Menu, X, ArrowRight, Zap, Sparkles, Cylinder, Home, Factory, Wrench } from 'lucide-react';
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

    const [activeService, setActiveService] = useState(0);

    const servicesData = [
        {
            id: 0,
            icon: "fa-solid fa-house",
            title: "Para sua Casa",
            subtitle: "O fogão sempre aceso",
            description: "Garantimos o peso certo e a qualidade. Entrega expressa, instalação segura e sem dor de cabeça.",
            color: "text-flame-500",
            bgColor: "bg-flame-500",
            bgGradient: "from-flame-400 to-amber-500 dark:from-flame-600 dark:to-orange-800",
            cta: "Pedir P13 Agora",
            image: "/images/residential.png"
        },
        {
            id: 1,
            icon: "fa-solid fa-industry",
            title: "Para seu Negócio",
            subtitle: "O fogo não pode apagar",
            description: "Fornecemos cilindros P45 com reposição programada. Você foca em vender, e a gente cuida da sua energia.",
            color: "text-amber-500",
            bgColor: "bg-amber-500",
            bgGradient: "from-amber-400 to-yellow-500 dark:from-amber-600 dark:to-yellow-800",
            cta: "Cotação Comercial",
            image: "/images/commercial.png"
        },
        {
            id: 2,
            icon: "fa-solid fa-wrench",
            title: "Assistência Técnica",
            subtitle: "Segurança em primeiro lugar",
            description: "Nossa equipe certificada resolve vazamentos, troca válvulas e faz manutenção preventiva da sua rede.",
            color: "text-blue-500",
            bgColor: "bg-blue-500",
            bgGradient: "from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-800",
            cta: "Agendar Visita",
            image: "/images/tech.png"
        }
    ];

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
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-flame-900/60"></div>
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
                        className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center mt-10"
                        style={{ opacity, scale, y }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex justify-center"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-flame-500/20 border border-flame-500/30 text-white text-sm font-medium mb-8 backdrop-blur-sm">
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
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/60 outline-none text-base"
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
                <section id="servicos" className="py-24 sm:py-32 relative z-10 bg-slate-50 dark:bg-navy-950 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.h2
                                className="text-4xl sm:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Gás na medida certa. <br/><span className="text-flame-500">Sem enrolação.</span>
                            </motion.h2>
                            <motion.p
                                className="text-lg text-slate-600 dark:text-slate-400"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Arraste para o lado ou clique nos cards para descobrir a solução perfeita para você. Da panela do almoço em família até a chapa quente do seu restaurante.
                            </motion.p>
                        </div>
                        <div className="relative w-full h-[700px] flex items-center justify-center perspective-1000 mt-10">
                            {servicesData.map((service, index) => {
                                let relativeIndex = (index - activeService) % servicesData.length;
                                if (relativeIndex < 0) relativeIndex += servicesData.length;
                                let offset = relativeIndex;
                                if (offset === 2) offset = -1;

                                const isActive = offset === 0;
                                const isVisible = true;
                                return (
                                    <motion.div
                                        key={service.id}
                                        className={`absolute w-full max-w-[360px] sm:max-w-[420px] h-[550px] sm:h-[650px] cursor-pointer touch-none ${isActive ? 'pointer-events-auto' : 'pointer-events-auto'}`}
                                        onClick={() => !isActive && setActiveService(activeService + offset)}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.2}
                                        onDragEnd={(e, { offset: dragOffset, velocity }) => {
                                            const swipe = dragOffset.x;
                                            if (swipe < -50) {
                                                setActiveService(activeService + 1);
                                            } else if (swipe > 50) {
                                                setActiveService(activeService - 1);
                                            }
                                        }}
                                        initial={false}
                                        animate={{
                                            x: `${offset * 75}%`,
                                            scale: isActive ? 1 : 0.85,
                                            opacity: isActive ? 1 : 0.4,
                                            zIndex: isActive ? 10 : 5,
                                            rotateY: offset === -1 ? 15 : offset === 1 ? -15 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <div className="w-full h-full rounded-[2rem] bg-white dark:bg-navy-900 border-8 border-slate-200 dark:border-navy-800 p-4 shadow-2xl flex flex-col relative transition-all duration-300">
                                            <div className="flex justify-between items-center px-2 py-3 border-b-2 border-slate-100 dark:border-navy-800 mb-4 shrink-0">
                                                <h3 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                    {service.title}
                                                </h3>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-navy-950 ${service.color}`}>
                                                    <i className={`${service.icon} text-[15px]`}></i>
                                                </div>
                                            </div>
                                            <div className={`relative flex-1 rounded-xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center bg-gradient-to-br ${service.bgGradient} p-4 border border-white/20`}>
                                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] opacity-[0.1] mix-blend-overlay"></div>
                                                <motion.img
                                                    src={service.image}
                                                    alt={service.title}
                                                    className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)] relative z-10"
                                                    animate={{ scale: isActive ? 1.05 : 1, y: isActive ? [0, -5, 0] : 0 }}
                                                    transition={{
                                                        scale: { duration: 0.5 },
                                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-5 px-2 flex flex-col gap-4 shrink-0">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{service.subtitle}</p>
                                                    <p className="text-[15px] sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <button className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${service.bgColor} ${isActive ? 'hover:scale-[1.02] opacity-100 cursor-pointer' : 'opacity-0 cursor-default pointer-events-none'}`}>
                                                    {service.cta}
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-12">
                            <button
                                onClick={() => setActiveService(activeService - 1)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-slate-300 dark:border-navy-700 hover:bg-white dark:hover:bg-navy-900 text-slate-900 dark:text-white hover:shadow-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <div className="flex items-center gap-2">
                                {servicesData.map((_, idx) => {
                                    const activeMod = ((activeService % servicesData.length) + servicesData.length) % servicesData.length;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveService(activeService + (idx - activeMod))}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${activeMod === idx ? 'w-8 bg-flame-500' : 'w-2.5 bg-slate-300 dark:bg-navy-700 hover:bg-slate-400'}`}
                                        />
                                    )
                                })}
                            </div>
                            <button
                                onClick={() => setActiveService(activeService + 1)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-slate-300 dark:border-navy-700 hover:bg-white dark:hover:bg-navy-900 text-slate-900 dark:text-white hover:shadow-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
