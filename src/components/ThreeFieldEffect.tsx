
import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, ReactNode } from 'react';
import * as THREE from 'three';

interface ThreeFieldEffectProps {
  isDark: boolean;
  children: ReactNode;
}

export default function ThreeFieldEffect({
  isDark,
  children,
}: ThreeFieldEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setFocused(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    // Canvas sobreposto ao campo, sem alterar o layout.
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '10';
    renderer.domElement.style.display = 'block';

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 50;

    const camera = new THREE.OrthographicCamera(
      0,
      width,
      height,
      0,
      -10,
      10,
    );

    camera.position.z = 5;

    const shape = new THREE.Shape();
    const inset = 3;
    const radius = 13;
    const w = width - inset * 2;
    const h = height - inset * 2;

    shape.moveTo(inset + radius, inset);
    shape.lineTo(inset + w - radius, inset);
    shape.quadraticCurveTo(inset + w, inset, inset + w, inset + radius);
    shape.lineTo(inset + w, inset + h - radius);
    shape.quadraticCurveTo(
      inset + w,
      inset + h,
      inset + w - radius,
      inset + h,
    );
    shape.lineTo(inset + radius, inset + h);
    shape.quadraticCurveTo(
      inset,
      inset + h,
      inset,
      inset + h - radius,
    );
    shape.lineTo(inset, inset + radius);
    shape.quadraticCurveTo(inset, inset, inset + radius, inset);

    const points = shape.getPoints(80);
    points.push(points[0].clone());

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const lineMaterial = new THREE.LineDashedMaterial({
      color: isDark ? 0x67e8f9 : 0x0891b2,
      dashSize: 18,
      gapSize: 10,
      transparent: true,
      opacity: focused ? 0.95 : 0.18,
    });

    const borderLine = new THREE.Line(geometry, lineMaterial);
    borderLine.computeLineDistances();
    scene.add(borderLine);

    const glowMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x22d3ee : 0x06b6d4,
      transparent: true,
      opacity: focused ? 0.55 : 0.06,
    });

    const glowLine = new THREE.Line(geometry, glowMaterial);
    scene.add(glowLine);

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let animationFrame = 0;

    const animate = () => {
      if (!reducedMotion && focused) {
      }

      lineMaterial.opacity = focused ? 0.95 : 0.12;
      glowMaterial.opacity = focused ? 0.45 : 0.04;

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (!newWidth || !newHeight) return;

      renderer.setSize(newWidth, newHeight);

      camera.left = 0;
      camera.right = newWidth;
      camera.top = newHeight;
      camera.bottom = 0;
      camera.updateProjectionMatrix();
    });

    resizeObserver.observe(container);

    renderer.setSize(width, height);
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      geometry.dispose();
      lineMaterial.dispose();
      glowMaterial.dispose();

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [isDark, focused]);

  return (
    <div
      ref={containerRef}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
      className={`relative rounded-xl transition-shadow duration-300 ${
        focused
          ? isDark
            ? 'shadow-[0_0_0_1px_rgba(34,211,238,0.55),0_0_24px_rgba(6,182,212,0.16)]'
            : 'shadow-[0_0_0_1px_rgba(8,145,178,0.45),0_0_22px_rgba(8,145,178,0.12)]'
          : ''
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-0" />
      </div>

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}


