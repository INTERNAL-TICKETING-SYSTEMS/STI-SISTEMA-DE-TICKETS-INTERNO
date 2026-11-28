import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LoginThreeBackgroundProps {
  isDark: boolean;
}

export default function LoginThreeBackground({
  isDark,
}: LoginThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.appendChild(renderer.domElement);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const lineColor = isDark ? 0x2dd4bf : 0x0891b2;
    const glowColor = isDark ? 0x5eead4 : 0x06b6d4;

    // Curva centralizada para atravessar o painel inteiro.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.5, -1.35, -0.8),
      new THREE.Vector3(-2.3, -0.75, 0.1),
      new THREE.Vector3(-1.0, -1.55, -0.4),
      new THREE.Vector3(0.45, -1.15, 0.2),
      new THREE.Vector3(1.9, -0.65, -0.5),
      new THREE.Vector3(3.5, -1.25, -0.8),
    ]);

    // Linha principal, fina e discreta.
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(180),
    );
    geometries.push(lineGeometry);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: isDark ? 0.42 : 0.30,
    });
    materials.push(lineMaterial);


    // Pontos fixos que marcam o caminho.
    const nodeGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    geometries.push(nodeGeometry);

    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: isDark ? 0.65 : 0.48,
    });
    materials.push(nodeMaterial);

    [0.16, 0.39, 0.63, 0.86].forEach((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(curve.getPointAt(position));
      scene.add(node);
    });


    // Halo externo e núcleo do ponto luminoso.
    const haloGeometry = new THREE.SphereGeometry(0.14, 20, 20);
    geometries.push(haloGeometry);

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: isDark ? 0.16 : 0.12,
    });
    materials.push(haloMaterial);

    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    scene.add(halo);

    const coreGeometry = new THREE.SphereGeometry(0.055, 20, 20);
    geometries.push(coreGeometry);

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xccfbf1 : 0xecfeff,
    });
    materials.push(coreMaterial);

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Poucas partículas estáticas, apenas para profundidade.
    const particleCount = 32;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 7.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3),
    );
    geometries.push(particleGeometry);

    const particleMaterial = new THREE.PointsMaterial({
      color: lineColor,
      size: 0.025,
      transparent: true,
      opacity: isDark ? 0.20 : 0.13,
      sizeAttenuation: true,
    });
    materials.push(particleMaterial);

    scene.add(new THREE.Points(particleGeometry, particleMaterial));

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let frameId = 0;
    let progress = 0.05;

    const render = () => {
      renderer.render(scene, camera);
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!reducedMotion) {
        // Movimento contínuo da esquerda para a direita.
        progress += 0.0014;
        if (progress >= 1) progress = 0;

        const point = curve.getPointAt(progress);
        core.position.copy(point);
        halo.position.copy(point);

      } else {
        const point = curve.getPointAt(0.5);
        core.position.copy(point);
        halo.position.copy(point);
      }

      render();
    };

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      render();
    });

    resizeObserver.observe(container);

    renderer.setSize(
      container.clientWidth || 400,
      container.clientHeight || 600,
    );

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}



