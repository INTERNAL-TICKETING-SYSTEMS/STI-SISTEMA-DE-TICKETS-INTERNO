import type { ImgHTMLAttributes } from 'react';
import logoSti from '../logo-sti.png';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'dashboard' | 'full' | 'compact' | 'login';
  light?: boolean;
}

export default function Logo({
  variant = 'full',
  light = false,
  className = '',
  ...rest
}: LogoProps) {
  const sizeClass = {
    dashboard: 'w-auto max-w-[260px] max-h-14 h-auto object-contain brightness-110 h-8',
    full: 'w-auto max-w-[260px] max-h-14',
    compact: 'w-auto max-w-[180px] max-h-10',
    login: 'w-auto max-w-[400px] max-h-24',
  }[variant];

  return (
    <img
      src={logoSti}
      alt="STI — Sistema de Tickets Interno"
      className={`${sizeClass} object-contain ${light ? 'brightness-110' : ''
        } ${className}`}
      {...rest}
    />
  );
}
