import type { ImgHTMLAttributes } from 'react';
import logoSti from '../logo-sti.png';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'dashboard' | 'full' | 'compact';
  light?: boolean;
}

export default function Logo({
  variant = 'full',
  light = false,
  className = '',
  ...rest
}: LogoProps) {
  const sizeClass = {
    dashboard: 'w-auto max-w-[340px] max-h-16',
    full: 'w-auto max-w-[260px] max-h-14',
    compact: 'w-auto max-w-[180px] max-h-10',
  }[variant];

  return (
    <img
      src={logoSti}
      alt="STI — Sistema de Tickets Interno"
      className={`${sizeClass} h-auto object-contain ${light ? 'brightness-110' : ''} ${className}`}
      {...rest}
    />
  );
}
