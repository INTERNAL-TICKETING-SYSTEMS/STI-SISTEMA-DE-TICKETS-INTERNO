import { ImgHTMLAttributes } from 'react';
import logoImg from '../logo.png.jpeg';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'full' | 'compact' | string;
  light?: boolean;
}

export default function Logo({ variant, light, className = 'h-16', ...rest }: LogoProps) {
  return (
    <div className="flex items-center justify-start">
      <img
        src={logoImg}
        alt="STI Logo"
        className={`${className} w-auto object-contain ${light ? 'brightness-110' : ''}`.trim()}
        {...rest}
      />
    </div>
  );
}