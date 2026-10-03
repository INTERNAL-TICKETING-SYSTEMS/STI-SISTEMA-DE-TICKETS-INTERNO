
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
    dashboard: 'h-12 w-auto max-w-[260px]',
    full: 'h-12 w-auto max-w-[260px]',
    compact: 'h-10 w-auto max-w-[180px]',
    login: 'h-20 w-auto max-w-[400px]',
  }[variant];

  return (
    <img
      src={logoSti}
      alt="STI — Sistema de Tickets Interno"
      className={`block shrink-0 object-contain ${sizeClass} ${
        light ? 'brightness-110' : ''
      } ${className}`}
      {...rest}
    />
  );
}