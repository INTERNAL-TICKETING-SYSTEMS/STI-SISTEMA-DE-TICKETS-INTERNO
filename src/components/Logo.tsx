
import type { ImgHTMLAttributes } from 'react';
import logoSti from '../logo-sti.png';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'dashboard' | 'full' | 'compact';
}

export default function Logo({
  variant = 'full',
  className = '',
  ...rest
}: LogoProps) {
  const sizeClass = {
    dashboard: 'w-full max-w-[760px]',
    full: 'w-full max-w-[420px]',
    compact: 'w-full max-w-[300px]',
  }[variant];

  return (
    <img
      src={logoSti}
      alt="STI — Sistema de Tickets Interno"
      className={`${sizeClass} h-auto object-contain ${className}`}
      {...rest}
    />
  );
}