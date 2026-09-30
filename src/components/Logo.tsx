import React from 'react';
import logoImg from '../logo.png.jpeg';

export default function Logo() {
  return (
    <div className="flex items-center justify-start">
      {/* Exibe a logo oficial com tamanho otimizado e sem textos duplicados */}
      <img 
        src={logoImg} 
        alt="STI Logo" 
        className="h-16 w-auto object-contain" 
      />
    </div>
  );
}
