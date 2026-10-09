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
  labelClassName?: string;
}

export function Field({
  label,
  children,
  hint,
  className = '',
  labelClassName = '',
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        className={`text-sm font-medium ${labelClassName}`}
        style={{
          color: 'var(--field-label-color)',
        }}
      >
        {label}
      </label>

      {children}

      {hint && (
        <p
          className="text-xs"
          style={{
            color: 'var(--field-hint-color)',
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

const inputBase = [
  'w-full rounded-lg border px-4 py-2.5 text-sm',
  'transition-colors',
  'placeholder:text-slate-400',
  'focus:outline-none focus:border-sti-teal-400',
  'focus:ring-2 focus:ring-sti-teal-100',
].join(' ');

function mergeInputClasses(customClassName?: string) {
  return `${inputBase} ${customClassName ?? ''}`;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={mergeInputClasses(props.className)}
    />
  );
}

export function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${mergeInputClasses(props.className)} resize-none`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${mergeInputClasses(props.className)} appearance-none bg-no-repeat bg-[right_1rem_center] pr-10`}
    >
      {props.children}
    </select>
  );
}