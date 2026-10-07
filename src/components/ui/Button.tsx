
import { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-sti-teal-500 text-white hover:bg-sti-teal-600 active:bg-sti-teal-700 shadow-sm',

  secondary:
    'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:active:bg-slate-600',

  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',

  danger:
    'border border-red-200 bg-white text-red-600 hover:bg-red-50 active:bg-red-100 dark:border-red-900 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 rounded-lg px-3.5 text-sm gap-1.5',
  md: 'h-11 rounded-lg px-5 text-sm gap-2',
  lg: 'h-12 rounded-xl px-6 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sti-teal-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}