import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
    ReactNode
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        icon,
        rightElement,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean; icon?: ReactNode; rightElement?: ReactNode },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const inputElement = (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border border-slate-300 bg-white py-3 text-slate-900 shadow-sm transition-all duration-300 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 dark:border-navy-800 dark:bg-navy-950/50 dark:text-slate-100 dark:focus:border-flame-500 w-full ' +
                (icon ? 'pl-11 pr-4 ' : 'px-4 ') +
                (rightElement ? 'pr-11 ' : '') +
                className
            }
            ref={localRef}
        />
    );
    if (icon || rightElement) {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        {icon}
                    </div>
                )}
                {inputElement}
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        );
    }
    return inputElement;
});
