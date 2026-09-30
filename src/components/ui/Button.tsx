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
    'bg-white text-sti-navy-800 border border-slate-200 hover:border-sti-navy-300 hover:bg-slate-50 active:bg-slate-100',
  ghost:
    'bg-transparent text-sti-navy-700 hover:bg-sti-navy-50 active:bg-sti-navy-100',
  danger:
    'bg-white text-red-600 border border-red-200 hover:bg-red-50 active:bg-red-100',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
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
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sti-teal-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
