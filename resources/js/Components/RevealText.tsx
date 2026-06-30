import { motion, Variants } from 'framer-motion';

interface RevealTextProps {
    words: (string | React.ReactNode)[];
    className?: string;
}

export default function RevealText({ words, className = '' }: RevealTextProps) {
    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className={`flex flex-wrap justify-center ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="inline-block mr-2 last:mr-0">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
