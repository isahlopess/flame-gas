import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl bg-flame-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-flame-600 hover:shadow-lg hover:shadow-flame-500/30 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:ring-offset-2 active:scale-95 dark:focus:ring-offset-navy-950 ${
                    disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none active:scale-100'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
