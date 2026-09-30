import { ImgHTMLAttributes } from 'react';
import logoImg from '../logo.png.jpeg';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'full' | 'compact' | string;
  light?: boolean;
}

export default function Logo({
  variant,
  light,
  className = 'h-16',
  ...rest
}: LogoProps) {
  const sizeClass =
    variant === 'full'
      ? 'h-28'
      : variant === 'compact'
        ? 'h-10'
        : className;

  return (
    <div className="flex items-center justify-start">
      <img
        src={logoImg}
        alt="STI — Sistema de Tickets Interno"
        className={`${sizeClass} w-auto object-contain ${
          light ? 'brightness-110' : ''
        }`.trim()}
        {...rest}
      />
    </div>
  );
}