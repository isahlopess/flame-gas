import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Flame, MapPin, Menu, X, ArrowRight, Zap, Sparkles, Cylinder, Home, Factory, Wrench } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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

    const stepsRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: stepsProgress } = useScroll({
        target: stepsRef,
        offset: ["start start", "end end"]
    });

    const [activeStep, setActiveStep] = useState(0);

    useMotionValueEvent(stepsProgress, "change", (latest) => {
        if (latest < 0.33) setActiveStep(0);
        else if (latest < 0.66) setActiveStep(1);
        else setActiveStep(2);
    });

    const stepsData = [
        {
            title: "Pedido Digital Rápido",
            description: "Esqueça as ligações demoradas. Peça seu gás com apenas 2 cliques pelo nosso app ou site, escolhendo o melhor horário para você.",
            icon: "fa-solid fa-mobile-screen",
            image: "/images/step1_order_v2_1782420244865.png",
            color: "text-flame-500",
            bg: "bg-flame-500"
        },
        {
            title: "Rastreamento em Tempo Real",
            description: "Acompanhe o trajeto do nosso veículo até a sua porta. Saiba exatamente a hora que o seu gás vai chegar, sem surpresas.",
            icon: "fa-solid fa-truck-fast",
            image: "/images/step2_track_v2_1782420261903.png",
            color: "text-amber-500",
            bg: "bg-amber-500"
        },
        {
            title: "Instalação Segura",
            description: "Nossos técnicos são certificados e realizam a instalação completa, testando vazamentos para garantir a máxima segurança da sua família.",
            icon: "fa-solid fa-shield-halved",
            image: "/images/step3_install_v2_1782420280992.png",
            color: "text-blue-500",
            bg: "bg-blue-500"
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
                <section id="servicos" className="py-24 sm:py-32 relative z-10 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
                        <svg className="relative block w-full h-[60px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-navy-950"></path>
                        </svg>
                    </div>
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
                                            <div className={`relative flex-1 rounded-xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center bg-gradient-to-br ${service.bgGradient} border border-white/20`}>
                                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] opacity-[0.1] mix-blend-overlay z-0"></div>
                                                <motion.img
                                                    src={service.image}
                                                    alt={service.title}
                                                    className="w-full h-full object-cover relative z-10"
                                                    animate={{ scale: isActive ? 1.05 : 1 }}
                                                    transition={{
                                                        scale: { duration: 0.5 }
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
                <section ref={stepsRef} id="como-funciona" className="relative bg-slate-900 dark:bg-navy-950 h-[300vh]">
                    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-30">
                        <svg className="relative block w-full h-[50px] sm:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-slate-100 dark:fill-slate-900 opacity-25"></path>
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" className="fill-slate-100 dark:fill-slate-900 opacity-50"></path>
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-slate-100 dark:fill-slate-900"></path>
                        </svg>
                    </div>
                    <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-slate-900 dark:bg-navy-950 z-20">
                            <div className="max-w-xl w-full">
                                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-12">
                                    O Caminho do <span className="text-flame-500">Gás</span>
                                </h2>
                                <div className="space-y-12 relative">
                                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-800 dark:bg-navy-800 z-0 hidden sm:block"></div>
                                    {stepsData.map((step, idx) => {
                                        const isActive = activeStep === idx;
                                        return (
                                            <div key={idx} className={`relative z-10 flex gap-6 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-2' : 'opacity-30 translate-x-0'}`}>
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isActive ? step.bg + ' text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-slate-800 text-slate-500'}`}>
                                                    <i className={`${step.icon} text-lg`}></i>
                                                </div>
                                                <div>
                                                    <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                                        {step.title}
                                                    </h3>
                                                    <p className={`text-base leading-relaxed transition-colors duration-500 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-slate-950 flex items-center justify-center overflow-hidden border-t md:border-t-0 md:border-l border-slate-800/50">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] opacity-[0.15] mix-blend-overlay"></div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="relative z-10 w-full h-full flex items-center justify-center"
                                >
                                    <motion.img
                                        src={stepsData[activeStep].image}
                                        alt={stepsData[activeStep].title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>
                            <motion.div
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-700 ${stepsData[activeStep].bg}`}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
