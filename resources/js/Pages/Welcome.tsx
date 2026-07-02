import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Flame, MapPin, Menu, X, ArrowRight, Zap, Sparkles, Cylinder, Home, Factory, Wrench } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import CursorGlow from '@/Components/CursorGlow';
import MagneticWrapper from '@/Components/MagneticWrapper';
import TiltWrapper from '@/Components/TiltWrapper';
import FloatingWhatsApp from '@/Components/FloatingWhatsApp';
import AnimatedCounter from '@/Components/AnimatedCounter';
import RevealText from '@/Components/RevealText';
import UserDropdown from '@/Components/UserDropdown';
import { CartProvider, useCart } from '@/Contexts/CartContext';
import CartButton from '@/Components/Cart/CartButton';
import CartDrawer from '@/Components/Cart/CartDrawer';
import CheckoutModal from '@/Components/Cart/CheckoutModal';
import NotificationBell from '@/Components/NotificationBell';
import RatingModal from '@/Components/RatingModal';
import { usePage } from '@inertiajs/react';

function WelcomeContent({
    auth,
}: PageProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { addItem, setCartOpen } = useCart();
    const { notifications } = usePage<any>().props;

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
            id: 1,
            icon: "fa-solid fa-house",
            title: "Para sua Casa",
            subtitle: "O fogão sempre aceso",
            description: "Garantimos o peso certo e a qualidade. Entrega expressa, instalação segura e sem dor de cabeça.",
            color: "text-flame-500",
            bgColor: "bg-flame-500",
            bgGradient: "from-flame-400 to-amber-500 dark:from-flame-600 dark:to-orange-800",
            cta: "Adicionar P13 - R$ 115,00",
            image: "/images/residential.png",
            price: 115.00,
            productName: "Botijão de Gás P13 (13kg)",
            category: "Gás Residencial"
        },
        {
            id: 2,
            icon: "fa-solid fa-industry",
            title: "Para seu Negócio",
            subtitle: "O fogo não pode apagar",
            description: "Fornecemos cilindros P45 com reposição programada. Você foca em vender, e a gente cuida da sua energia.",
            color: "text-amber-500",
            bgColor: "bg-amber-500",
            bgGradient: "from-amber-400 to-yellow-500 dark:from-amber-600 dark:to-yellow-800",
            cta: "Adicionar P45 - R$ 410,00",
            image: "/images/commercial.png",
            price: 410.00,
            productName: "Cilindro de Gás P45 (45kg)",
            category: "Gás Comercial"
        },
        {
            id: 3,
            icon: "fa-solid fa-glass-water",
            title: "Água Mineral",
            subtitle: "Saúde e hidratação",
            description: "Galões de 20L das melhores fontes da região. Entregamos junto com o seu gás ou separadamente.",
            color: "text-blue-500",
            bgColor: "bg-blue-500",
            bgGradient: "from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-700",
            cta: "Adicionar Galão 20L - R$ 15,00",
            image: "/images/water_gallon.png",
            price: 15.00,
            productName: "Galão de Água Mineral (20L)",
            category: "Água"
        },
        {
            id: 4,
            icon: "fa-solid fa-wrench",
            title: "Acessórios",
            subtitle: "Segurança em primeiro lugar",
            description: "Mangueiras, registros e válvulas certificados pelo Inmetro. Troque a cada 5 anos para sua segurança.",
            color: "text-emerald-500",
            bgColor: "bg-emerald-500",
            bgGradient: "from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-800",
            cta: "Adicionar Kit Segurança - R$ 45,00",
            image: "/images/tech.png",
            price: 45.00,
            productName: "Kit Registro + Mangueira Inmetro",
            category: "Acessórios"
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

    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const testimonials = [
        { name: "João Carlos", role: "Dono de Restaurante", text: "A entrega mais rápida que já vi. Quando acaba o gás no meio do almoço, o app salva a nossa vida!", rating: 4.8, avatar: "https://ui-avatars.com/api/?name=Joao+Carlos&background=f97316&color=fff", highlight: false },
        { name: "Maria Silva", role: "Cliente Residencial", text: "Maravilhoso. Consigo ver o caminhão chegando no mapa igual Uber. Acabou a ansiedade de ficar esperando na porta, não troco por nada. O entregador foi super educado.", rating: 5, avatar: "https://ui-avatars.com/api/?name=Maria+Silva&background=0f172a&color=fff", highlight: true },
        { name: "Pedro Henrique", role: "Síndico", text: "Instalação super segura e técnica. Os rapazes vêm uniformizados e testam tudo antes de ir embora. Recomendo para todos os condomínios da região.", rating: 4.9, avatar: "https://ui-avatars.com/api/?name=Pedro+Henrique&background=3b82f6&color=fff", highlight: false },
        { name: "Ana Beatriz", role: "Cliente Residencial", text: "Preço justo e o gás dura muito mais do que das outras marcas que eu comprava. Recomendo sempre.", rating: 5, avatar: "https://ui-avatars.com/api/?name=Ana+Beatriz&background=f59e0b&color=fff", highlight: false },
        { name: "Carlos Eduardo", role: "Dono de Padaria", text: "Parceria de anos! O atendimento corporativo é nota 10, nunca deixaram meu comércio na mão. O sistema de comodato é excelente e a manutenção impecável.", rating: 5, avatar: "https://ui-avatars.com/api/?name=Carlos+Eduardo&background=64748b&color=fff", highlight: false },
        { name: "Juliana Costa", role: "Mãe de Família", text: "Poder parcelar o botijão no cartão direto no app foi um divisor de águas aqui em casa. Muito prático!", rating: 4.5, avatar: "https://ui-avatars.com/api/?name=Juliana+Costa&background=10b981&color=fff", highlight: false },
        { name: "Roberto Alves", role: "Padeiro", text: "Gás de excelente qualidade. Nossos fornos mantêm a temperatura constante o dia todo. O atendimento via WhatsApp é super ágil.", rating: 5, avatar: "https://ui-avatars.com/api/?name=Roberto+Alves&background=8b5cf6&color=fff", highlight: false },
        { name: "Fernanda Lima", role: "Cliente Residencial", text: "Amei a experiência! O aplicativo é muito fácil de usar e ainda ganhei desconto na primeira compra. Fidelizada com sucesso.", rating: 4.8, avatar: "https://ui-avatars.com/api/?name=Fernanda+Lima&background=ec4899&color=fff", highlight: false },
        { name: "Lucas Mendes", role: "Gerente de Condomínio", text: "Fizemos um contrato para o condomínio inteiro e foi a melhor escolha. Os relatórios mensais de consumo são muito detalhados e o preço é imbatível.", rating: 5, avatar: "https://ui-avatars.com/api/?name=Lucas+Mendes&background=14b8a6&color=fff", highlight: true },
        { name: "Camila Rocha", role: "Chef de Cozinha", text: "No restaurante, precisamos de chamas fortes e constantes. Desde que mudamos para a FlameGás, nosso tempo de preparo melhorou muito.", rating: 4.9, avatar: "https://ui-avatars.com/api/?name=Camila+Rocha&background=f43f5e&color=fff", highlight: false },
        { name: "Sérgio Moraes", role: "Aposentado", text: "Antigamente eu tinha que carregar o botijão nas costas. Agora o rapaz vem, instala e ainda faz o teste do sabão. Serviço nota mil.", rating: 5, avatar: "https://ui-avatars.com/api/?name=Sergio+Moraes&background=0ea5e9&color=fff", highlight: false },
        { name: "Amanda Souza", role: "Estudante", text: "Rachei o gás com minhas amigas da república e pagamos com PIX direto no aplicativo. Super rápido e o entregador chegou em 20 minutos!", rating: 4.7, avatar: "https://ui-avatars.com/api/?name=Amanda+Souza&background=84cc16&color=fff", highlight: false },
    ];

    const faqs = [
        { question: "Como funciona a garantia do peso certo?", answer: "Nossos botijões passam por uma dupla checagem de pesagem digital antes de sair da base, e você pode conferir o lacre de inviolabilidade ao receber.", icon: "fa-solid fa-weight-scale", color: "text-blue-500", bg: "bg-blue-500/10" },
        { question: "Em quanto tempo meu gás chega?", answer: "Nosso sistema roteiriza o entregador mais próximo via GPS. O tempo médio na região atendida é de 15 a 30 minutos!", icon: "fa-solid fa-stopwatch", color: "text-flame-500", bg: "bg-flame-500/10" },
        { question: "Quais as formas de pagamento?", answer: "Aceitamos PIX, Cartões de Crédito/Débito (na maquininha) e dinheiro. Tudo no momento da entrega.", icon: "fa-solid fa-credit-card", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { question: "Vocês fazem a instalação?", answer: "Sim! A instalação é gratuita. Nossos técnicos certificados trocam o botijão, testam vazamentos e só vão embora quando o fogo acender em segurança.", icon: "fa-solid fa-wrench", color: "text-amber-500", bg: "bg-amber-500/10" },
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
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-flame-500 to-amber-500 z-[110] transform origin-left"
                style={{ scaleX: scrollYProgress }}
            />
            <CursorGlow />
            <FloatingWhatsApp phoneNumber="5567999999999" accountName="FlameGás" avatar="/images/logo-icon.svg" />
            <CartDrawer />
            <CheckoutModal />
            <RatingModal />
            <Head title="FlameGás - O seu botijão rápido" />
            <div className="fixed top-0 w-full z-50 px-4 sm:px-6 pt-4 sm:pt-6 transition-all duration-500">
                <header
                    className={`max-w-6xl mx-auto rounded-2xl sm:rounded-full transition-all duration-500 ${
                        isScrolled
                            ? 'py-3 px-4 sm:px-6 bg-white/70 dark:bg-navy-950/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 dark:border-white/10'
                            : 'py-4 px-4 sm:px-6 bg-transparent border border-transparent'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <img src="/images/fire.png" alt="FlameGás" className="w-8 h-8 object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                            <span className={`font-heading uppercase transition-colors duration-300 hidden sm:block text-3xl ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white drop-shadow-sm'}`}>
                                <span className="font-medium tracking-tight">FLAME</span><span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
                            {['Serviços', 'Como Funciona', 'Planos'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    className={`relative group px-4 py-2 rounded-full transition-colors ${
                                        isScrolled
                                            ? 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {item}
                                    <span className="absolute inset-x-4 bottom-1.5 h-0.5 bg-flame-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full opacity-0 group-hover:opacity-100"></span>
                                </a>
                            ))}
                            <div className={`w-px h-6 mx-2 ${isScrolled ? 'bg-slate-200 dark:bg-navy-800' : 'bg-white/20'}`}></div>
                            {auth.user ? (
                                <UserDropdown user={auth.user} isScrolled={isScrolled} />
                            ) : (
                                <div className="flex items-center gap-2 pl-2">
                                    <Link
                                        href={route('login')}
                                        className={`px-4 py-2 rounded-full transition-colors font-semibold ${isScrolled ? 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
                                    >
                                        Entrar
                                    </Link>
                                    <MagneticWrapper>
                                        <Link
                                            href={route('register')}
                                            className="block bg-flame-500 text-white px-6 py-2.5 rounded-full hover:bg-flame-600 transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] border border-flame-400/50 hover:border-flame-400 font-bold tracking-wide text-sm"
                                        >
                                            Criar Conta
                                        </Link>
                                    </MagneticWrapper>
                                </div>
                            )}
                            <div className={`w-px h-6 mx-2 ${isScrolled ? 'bg-slate-200 dark:bg-navy-800' : 'bg-white/20'}`}></div>
                            {auth.user && <NotificationBell isScrolled={isScrolled} notifications={notifications} />}
                            <CartButton isScrolled={isScrolled} />
                        </nav>
                        <button
                            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isScrolled
                                    ? 'bg-slate-100 dark:bg-navy-900 text-slate-900 dark:text-white'
                                    : 'bg-white/10 text-white backdrop-blur-md'
                            }`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </header>
            </div>
            <main>
                <section className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden pt-20 z-0">
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
                        style={{ opacity, scale }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex justify-center mb-8"
                            style={{ y: useTransform(scrollY, [0, 500], [0, -150]) }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium backdrop-blur-md shadow-2xl relative overflow-hidden group cursor-default">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                                <span className="text-flame-500 text-lg">🔥</span>
                                <span>
                                    <strong className="text-white">
                                        {typeof window !== 'undefined' ? Math.floor(Math.random() * (60 - 30 + 1) + 30) : 47} pedidos
                                    </strong> realizados na última hora
                                </span>
                            </div>
                        </motion.div>
                        <motion.h1
                            className="text-5xl sm:text-6xl md:text-8xl font-heading font-extrabold tracking-tight mb-8 leading-[1.1] text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
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
                            style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }}
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
                            <MagneticWrapper className="w-full sm:w-auto">
                                <button className="w-full bg-flame-500 hover:bg-flame-600 text-white px-8 h-14 rounded-xl sm:rounded-full font-medium transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-flame-500/40">
                                    Verificar Entrega
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </MagneticWrapper>
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
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-4 md:pt-0 group cursor-default relative">
                                <div className="text-4xl sm:text-6xl font-heading font-extrabold text-slate-900 dark:text-white mb-2 transition-transform group-hover:-translate-y-1">
                                    <AnimatedCounter value={10} prefix="+" suffix="k" />
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Famílias Atendidas</div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                    Nos últimos 5 anos na região
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0 group cursor-default relative">
                                <div className="text-4xl sm:text-6xl font-heading font-extrabold text-flame-500 mb-2 transition-transform group-hover:-translate-y-1">
                                    <AnimatedCounter value={30} suffix="m" />
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Entrega Expressa</div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-flame-500 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                    Média calculada estatisticamente
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0 group cursor-default relative">
                                <div className="flex items-center gap-1 mb-2 transition-transform group-hover:-translate-y-1">
                                    <div className="text-4xl sm:text-6xl font-heading font-extrabold text-slate-900 dark:text-white">
                                        <AnimatedCounter value={4.9} decimals={1} />
                                    </div>
                                    <span className="text-amber-500 text-3xl sm:text-5xl">★</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avaliações Positivas</div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-amber-500 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                    Baseado em 2.847 notas
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0 group cursor-default relative">
                                <div className="text-4xl sm:text-6xl font-heading font-extrabold text-amber-500 mb-2 transition-transform group-hover:-translate-y-1">
                                    <AnimatedCounter value={100} suffix="%" />
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Gás com Peso Certo</div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-amber-500 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                    Aferido pelo INMETRO
                                </div>
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
                            <RevealText
                                className="text-4xl sm:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                                words={['Gás', 'na', 'medida', 'certa.', <div className="w-full h-0 sm:hidden"></div>, <span className="text-flame-500">Sem</span>, <span className="text-flame-500">enrolação.</span>]}
                            />
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
                                if (relativeIndex === 3) offset = -1;
                                else if (relativeIndex === 2) offset = 2;

                                const isActive = offset === 0;
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
                                            x: `${offset === 2 ? 0 : offset * 75}%`,
                                            scale: isActive ? 1 : (offset === 2 ? 0.7 : 0.85),
                                            opacity: isActive ? 1 : (offset === 2 ? 0 : 0.4),
                                            zIndex: isActive ? 10 : (offset === 2 ? 1 : 5),
                                            rotateY: offset === -1 ? 15 : offset === 1 ? -15 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <div className="w-full h-full rounded-[2rem] bg-white dark:bg-navy-900 border-8 border-slate-200 dark:border-navy-800 p-4 shadow-2xl flex flex-col relative transition-all duration-300 hover:shadow-flame-500/20">
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
                                                    loading="lazy"
                                                    className="w-full h-full object-cover relative z-10"
                                                    animate={{ scale: isActive ? 1.05 : 1 }}
                                                    transition={{ scale: { duration: 0.5 } }}
                                                />
                                            </div>
                                            <div className="mt-5 px-2 flex flex-col gap-4 shrink-0">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{service.subtitle}</p>
                                                    <p className="text-[15px] sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (!isActive) return;
                                                        addItem({
                                                            id: service.id,
                                                            name: service.productName,
                                                            price: service.price,
                                                            image: service.image,
                                                            category: service.category,
                                                        });
                                                        setCartOpen(true);
                                                    }}
                                                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${service.bgColor} ${isActive ? 'hover:scale-[1.02] opacity-100 cursor-pointer' : 'opacity-0 cursor-default pointer-events-none'}`}
                                                >
                                                    {service.cta}
                                                    <i className="fa-solid fa-cart-plus text-lg ml-2"></i>
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
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all border border-slate-300 dark:border-navy-700 hover:bg-white dark:hover:bg-navy-900 text-slate-900 dark:text-white hover:shadow-lg"
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
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all border border-slate-300 dark:border-navy-700 hover:bg-white dark:hover:bg-navy-900 text-slate-900 dark:text-white hover:shadow-lg"
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
                                <RevealText
                                    className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-12"
                                    words={['O', 'Caminho', 'do', <span className="text-flame-500">Gás</span>]}
                                />
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
                                        loading="lazy"
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
                <section id="avaliacoes" className="py-24 relative bg-slate-50 dark:bg-[#0a0f1c] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <div className="text-center mb-16">
                            <RevealText
                                className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-6"
                                words={['Quem', 'aprova,', <span className="text-flame-500">comprova.</span>]}
                            />
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Milhares de fogões acesos e famílias tranquilas todos os dias. Não acredite apenas em nós, veja a quantidade absurda de clientes satisfeitos.</p>
                        </div>
                    </div>
                    <div className="relative w-full max-w-7xl mx-auto h-[600px] overflow-hidden flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 dark:from-[#0a0f1c] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1c] to-transparent z-10 pointer-events-none"></div>
                        <div className="w-full md:w-1/3 flex flex-col overflow-hidden relative">
                            <motion.div
                                className="flex flex-col gap-6 absolute w-full"
                                animate={{ y: ["0%", "-50%"] }}
                                transition={{ ease: "linear", duration: 35, repeat: Infinity }}
                            >
                                {[...testimonials.slice(0, 4), ...testimonials.slice(0, 4)].map((testimonial, idx) => (
                                    <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-navy-900/40 border border-slate-200 dark:border-white/5 shadow-sm">
                                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                                            {Array.from({length: Math.floor(testimonial.rating)}).map((_, i) => (
                                                <i key={i} className="fa-solid fa-star"></i>
                                            ))}
                                            {testimonial.rating % 1 !== 0 && <i className="fa-solid fa-star-half-stroke"></i>}
                                        </div>
                                        <p className="text-sm italic mb-6 text-slate-600 dark:text-slate-300">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <img src={testimonial.avatar} alt={testimonial.name} loading="lazy" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                                    {testimonial.name} <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                                                </h4>
                                                <p className="text-[10px] text-slate-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                        <div className="hidden md:flex w-1/3 flex-col overflow-hidden relative">
                            <motion.div
                                className="flex flex-col gap-6 absolute w-full"
                                animate={{ y: ["-50%", "0%"] }}
                                transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                            >
                                {[...testimonials.slice(4, 8), ...testimonials.slice(4, 8)].map((testimonial, idx) => (
                                    <div key={idx} className={`p-6 rounded-3xl border shadow-sm ${testimonial.highlight ? 'bg-slate-900 dark:bg-navy-950 border-flame-500/40' : 'bg-white dark:bg-navy-900/40 border-slate-200 dark:border-white/5'}`}>
                                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                                            {Array.from({length: Math.floor(testimonial.rating)}).map((_, i) => (
                                                <i key={i} className="fa-solid fa-star"></i>
                                            ))}
                                            {testimonial.rating % 1 !== 0 && <i className="fa-solid fa-star-half-stroke"></i>}
                                        </div>
                                        <p className={`text-sm italic mb-6 ${testimonial.highlight ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <img src={testimonial.avatar} alt={testimonial.name} loading="lazy" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h4 className={`text-sm font-bold flex items-center gap-1 ${testimonial.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                    {testimonial.name} <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                                                </h4>
                                                <p className={`text-[10px] ${testimonial.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                        <div className="hidden lg:flex w-1/3 flex-col overflow-hidden relative">
                            <motion.div
                                className="flex flex-col gap-6 absolute w-full"
                                animate={{ y: ["0%", "-50%"] }}
                                transition={{ ease: "linear", duration: 45, repeat: Infinity }}
                            >
                                {[...testimonials.slice(8, 12), ...testimonials.slice(8, 12)].map((testimonial, idx) => (
                                    <div key={idx} className={`p-6 rounded-3xl border shadow-sm ${testimonial.highlight ? 'bg-slate-900 dark:bg-navy-950 border-flame-500/40' : 'bg-white dark:bg-navy-900/40 border-slate-200 dark:border-white/5'}`}>
                                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                                            {Array.from({length: Math.floor(testimonial.rating)}).map((_, i) => (
                                                <i key={i} className="fa-solid fa-star"></i>
                                            ))}
                                            {testimonial.rating % 1 !== 0 && <i className="fa-solid fa-star-half-stroke"></i>}
                                        </div>
                                        <p className={`text-sm italic mb-6 ${testimonial.highlight ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <img src={testimonial.avatar} alt={testimonial.name} loading="lazy" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h4 className={`text-sm font-bold flex items-center gap-1 ${testimonial.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                    {testimonial.name} <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                                                </h4>
                                                <p className={`text-[10px] ${testimonial.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section id="faq" className="py-32 relative bg-white dark:bg-[#060a13] overflow-hidden border-t border-slate-200 dark:border-white/5">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-flame-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-5/12">
                                <RevealText
                                    className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-6 justify-start"
                                    words={['Dúvidas', <span className="text-flame-500">Frequentes</span>]}
                                />
                                <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
                                    Transparência é o nosso combustível. Reunimos as perguntas mais comuns para que você peça seu gás com total tranquilidade.
                                </p>
                                <div className="hidden lg:block relative w-full aspect-square rounded-full border border-slate-200 dark:border-white/10 p-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-flame-500/5 to-transparent rounded-full m-8"></div>
                                    <div className="w-full h-full bg-slate-50 dark:bg-navy-950 rounded-full shadow-2xl flex items-center justify-center border border-slate-200 dark:border-white/5 relative">
                                        <i className="fa-solid fa-clipboard-question text-[12rem] text-slate-200 dark:text-slate-800"></i>
                                        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute -top-4 right-10 w-16 h-16 bg-white dark:bg-navy-900 text-blue-500 rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(59,130,246,0.2)] border border-blue-500/20">
                                            <i className="fa-solid fa-weight-scale text-2xl"></i>
                                        </motion.div>
                                        <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }} className="absolute bottom-10 -left-6 w-16 h-16 bg-white dark:bg-navy-900 text-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(16,185,129,0.2)] border border-emerald-500/20">
                                            <i className="fa-solid fa-credit-card text-2xl"></i>
                                        </motion.div>
                                        <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }} className="absolute -bottom-2 right-4 w-16 h-16 bg-white dark:bg-navy-900 text-amber-500 rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(245,158,11,0.2)] border border-amber-500/20">
                                            <i className="fa-solid fa-fire text-2xl"></i>
                                        </motion.div>
                                        <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 6, repeat: Infinity, delay: 1.5 }} className="absolute top-1/4 -left-4 w-12 h-12 bg-white dark:bg-navy-900 text-flame-500 rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(249,115,22,0.2)] border border-flame-500/20">
                                            <i className="fa-solid fa-stopwatch text-xl"></i>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-7/12">
                                <div className="space-y-4">
                                    {faqs.map((faq, idx) => {
                                        const isOpen = activeFaq === idx;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => setActiveFaq(isOpen ? null : idx)}
                                                className={`group relative overflow-hidden rounded-[2rem] cursor-pointer transition-all duration-300 ${isOpen ? 'bg-slate-50 dark:bg-navy-950 shadow-lg' : 'bg-white dark:bg-navy-900/40 border border-slate-200 dark:border-white/5 hover:border-flame-500/30 shadow-sm hover:shadow-md'}`}
                                            >
                                                <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors duration-300 ${isOpen ? 'bg-flame-500' : 'bg-transparent group-hover:bg-flame-500/30'}`}></div>
                                                <div className="px-6 py-6 sm:px-8 sm:py-8 ml-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex gap-4 sm:gap-6 items-start">
                                                            <div className={`mt-1 shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? faq.bg + ' scale-110' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                                <i className={`${faq.icon} text-xl ${isOpen ? faq.color : 'text-slate-400'}`}></i>
                                                            </div>
                                                            <div>
                                                                <h3 className={`text-lg sm:text-xl font-bold leading-tight transition-colors ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-flame-500'}`}>
                                                                    {faq.question}
                                                                </h3>
                                                                <AnimatePresence>
                                                                    {isOpen && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                                                                {faq.answer}
                                                                            </p>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                        <motion.div
                                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${isOpen ? 'border-flame-500 text-flame-500 bg-white dark:bg-navy-900 shadow-md' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}
                                                        >
                                                            <i className={`fa-solid fa-chevron-down text-sm`}></i>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="cta" className="relative pt-32 bg-[#020617] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMWUyOTNiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMEw2MCA2MCIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-32">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                            <div className="w-full lg:w-1/2">
                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest mb-8">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    Emergência Culinária
                                </div>
                                <RevealText
                                    className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-white mb-8 leading-[0.9] tracking-tighter justify-start"
                                    words={['GÁS', <br className="hidden sm:block" />, <span className="text-slate-600">ACABOU?</span>]}
                                />
                                <p className="text-xl sm:text-2xl text-slate-400 max-w-lg leading-relaxed font-light mb-10">
                                    Não perca sua receita. Nossa rede inteligente conecta você ao entregador mais rápido da região em poucos cliques.
                                </p>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-bolt text-amber-500"></i> Rapidez
                                    </div>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-shield-halved text-blue-500"></i> Segurança
                                    </div>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-star text-flame-500"></i> 4.9/5 Avaliações
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#25D366] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                                <div className="relative w-full max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50">
                                    <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 mb-8 relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent"></div>
                                        <motion.div animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute w-16 h-16 border border-emerald-500/40 rounded-full"></motion.div>
                                        <motion.div animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }} className="absolute w-16 h-16 border border-emerald-500/40 rounded-full"></motion.div>
                                        <div className="relative w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] z-10 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full absolute animate-ping"></div>
                                        </div>
                                        <motion.div animate={{ x: [-60, -20], y: [50, 15] }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} className="absolute z-10">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200">
                                                <i className="fa-solid fa-truck text-emerald-600 text-xs"></i>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <p className="text-slate-400 text-sm font-medium mb-1">Motorista a caminho</p>
                                            <p className="text-4xl font-black text-white tracking-tight">15 <span className="text-xl text-slate-500 font-medium">min</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-sm font-medium mb-1">Pagamento</p>
                                            <p className="text-white font-bold flex items-center gap-2 justify-end"><i className="fa-brands fa-pix text-emerald-400"></i> PIX / Cartão</p>
                                        </div>
                                    </div>
                                    <MagneticWrapper className="w-full">
                                        <button className="w-full relative group overflow-hidden bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl p-5 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(37,211,102,0.3)]">
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <i className="fa-brands fa-whatsapp text-2xl relative z-10"></i>
                                            <span className="font-bold text-lg tracking-wide relative z-10">Chamar no WhatsApp</span>
                                        </button>
                                    </MagneticWrapper>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="relative border-t border-white/10 pt-16 pb-8 bg-black/50 backdrop-blur-lg">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-flame-500 to-transparent opacity-70"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
                            <div className="col-span-1 md:col-span-5 lg:col-span-5">
                                <div className="flex items-center gap-2 mb-6">
                                    <img src="/images/fire.png" alt="Logo FlameGás" loading="lazy" className="w-10 h-10 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                                    <span className="text-3xl font-heading font-extrabold text-white tracking-tight">
                                        Flame<span className="text-flame-500">Gás</span>
                                    </span>
                                </div>
                                <p className="text-slate-400 text-base max-w-md leading-relaxed">
                                    Revolucionando a entrega de gás de cozinha. Mais velocidade, segurança e transparência para a sua família ou negócio. A chama que não te deixa na mão.
                                </p>
                            </div>
                            <div className="col-span-1 md:col-span-3 lg:col-span-3">
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Links Rápidos</h4>
                                <ul className="space-y-4 text-slate-400">
                                    <li><a href="#servicos" className="hover:text-flame-400 transition-colors flex items-center gap-2 group"><i className="fa-solid fa-chevron-right text-xs text-flame-500/50 group-hover:text-flame-500 transition-colors"></i> Serviços</a></li>
                                    <li><a href="#como-funciona" className="hover:text-flame-400 transition-colors flex items-center gap-2 group"><i className="fa-solid fa-chevron-right text-xs text-flame-500/50 group-hover:text-flame-500 transition-colors"></i> Como Funciona</a></li>
                                    <li><a href="#faq" className="hover:text-flame-400 transition-colors flex items-center gap-2 group"><i className="fa-solid fa-chevron-right text-xs text-flame-500/50 group-hover:text-flame-500 transition-colors"></i> Dúvidas</a></li>
                                </ul>
                            </div>
                            <div className="col-span-1 md:col-span-4 lg:col-span-4">
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Central de Atendimento</h4>
                                <ul className="space-y-4 text-slate-400">
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-flame-500 shrink-0">
                                            <i className="fa-brands fa-whatsapp text-lg"></i>
                                        </div>
                                        <span>(11) 99999-9999</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-flame-500 shrink-0">
                                            <i className="fa-solid fa-phone text-sm"></i>
                                        </div>
                                        <span>0800 123 4567</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-flame-500 shrink-0">
                                            <i className="fa-solid fa-envelope text-sm"></i>
                                        </div>
                                        <span>contato@flamegas.com.br</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                            <p className="text-slate-500 text-sm">
                                © 2026 FlameGás. Todos os direitos reservados. CNPJ: 00.000.000/0001-00.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all hover:scale-110 shadow-lg">
                                    <i className="fa-brands fa-instagram text-lg"></i>
                                </a>
                                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all hover:scale-110 shadow-lg">
                                    <i className="fa-brands fa-facebook-f text-lg"></i>
                                </a>
                                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white hover:border-transparent transition-all hover:scale-110 shadow-lg">
                                    <i className="fa-brands fa-tiktok text-lg"></i>
                                </a>
                            </div>
                        </div>
                    </footer>
                </section>
            </main>
        </div>
    );
}

export default function Welcome(props: PageProps) {
    return (
        <CartProvider>
            <WelcomeContent {...props} />
        </CartProvider>
    );
}
