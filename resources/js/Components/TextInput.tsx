import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
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

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition-all duration-200 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 dark:border-navy-800 dark:bg-navy-950/50 dark:text-slate-100 dark:focus:border-flame-500 ' +
                className
            }
            ref={localRef}
        />
    );
});
