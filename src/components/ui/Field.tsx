
import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}

export function Field({
  label,
  children,
  hint,
  className = '',
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {children}

      {hint && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:border-sti-teal-400 focus:ring-2 focus:ring-sti-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sti-teal-900';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${inputBase} ${props.className ?? ''}`}
    />
  );
}

export function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputBase} resize-none ${props.className ?? ''}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputBase} appearance-none bg-no-repeat bg-[right_1rem_center] pr-10 ${props.className ?? ''}`}
    >
      {props.children}
    </select>
  );
}