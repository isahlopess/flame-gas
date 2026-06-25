import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-transparent px-5 py-2 text-sm font-medium text-slate-700 transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:border-navy-800 dark:text-slate-300 dark:hover:border-navy-700 dark:hover:bg-navy-900 dark:focus:ring-offset-navy-950 ${
                    disabled && 'hover:scale-100 hover:bg-transparent dark:hover:bg-transparent active:scale-100'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
