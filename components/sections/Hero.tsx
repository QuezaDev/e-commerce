"use client";

import { ArrowDownRight, ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type PointerEvent } from "react";

function HeroShirtArt({ decorative = false }: { decorative?: boolean }) {
  return (
    <svg
      className="hero-shirt-svg"
      viewBox="0 0 520 620"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Camiseta demonstrativa com arte original em preto e branco"}
    >
      <path
        className="shirt-shadow"
        d="M165 72 90 112 27 231l80 48 45-58-18 319c83 35 169 35 252 0l-18-319 45 58 80-48-63-119-75-40c-23 53-167 53-190 0Z"
      />
      <path
        className="shirt-body"
        d="M153 58 80 99 16 222l85 51 45-62-19 339c88 39 178 39 266 0l-19-339 45 62 85-51-64-123-73-41c-31 63-183 63-214 0Z"
      />
      <path className="shirt-collar" d="M153 58c26 92 188 92 214 0l-48-27c-17 51-101 51-118 0Z" />
      <g className="shirt-print">
        <path d="m260 157 19 44 48 4-37 31 12 47-42-25-42 25 12-47-37-31 48-4Z" />
        <path d="M169 308c57-42 125-42 182 0l-18 94c-49 35-97 35-146 0Z" />
        <path d="M183 335h154M192 369h136" />
        <text x="260" y="352" textAnchor="middle">LOKO</text>
        <path d="m181 426-38 58 59-28-6 65 46-47 18 61 18-61 46 47-6-65 59 28-38-58" />
      </g>
      <g className="shirt-register" aria-hidden="true">
        <path d="M102 120h30M117 105v30M388 120h30M403 105v30M102 505h30M117 490v30M388 505h30M403 490v30" />
      </g>
    </svg>
  );
}

export function Hero() {
  const artworkRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 20 });
  const { scrollYProgress } = useScroll({
    target: artworkRef,
    offset: ["start end", "end start"],
  });
  const artworkY = useTransform(scrollYProgress, [0, 1], [-12, 22]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section className="hero section-anchor" id="inicio" aria-labelledby="hero-title">
      <div className="hero__background-word" aria-hidden="true">LOKO</div>
      <div className="hero__grid shell">
        <motion.div
          className="hero__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="editorial-kicker"><span>[01]</span> Roupa, tinta &amp; arquibancada</p>
          <h1 id="hero-title">
            <span>OLD SCHOOL</span>
            <span className="hero-title-outline">NA PELE.</span>
            <span>CORINTHIANS</span>
            <span>NO PEITO.</span>
          </h1>
          <p className="hero__lead">
            Peças exclusivas, produzidas de corinthiano para corinthiano.
          </p>
          <div className="hero__actions">
            <a className="button button--solid" href="#produtos">
              Ver produtos <ArrowDownRight aria-hidden="true" />
            </a>
            <a className="button button--outline" href="#colecoes">
              Conhecer a coleção <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <p className="hero__note">Marca independente • Conteúdo demonstrativo</p>
        </motion.div>

        <motion.div
          ref={artworkRef}
          className="hero-art"
          style={{ y: reduceMotion ? 0 : artworkY }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-art__stripe" aria-hidden="true" />
          <div className="hero-art__seal" aria-hidden="true">
            <span>OLD SCHOOL • CULTURA URBANA •</span>
            <strong>NS</strong>
          </div>
          <motion.div className="hero-art__shirt" style={{ x: reduceMotion ? 0 : smoothX, y: reduceMotion ? 0 : smoothY }}>
            <HeroShirtArt />
          </motion.div>
          <motion.div
            className="hero-art__fragment hero-art__fragment--one"
            aria-hidden="true"
            style={{ x: reduceMotion ? 0 : smoothX }}
          >
            <HeroShirtArt decorative />
          </motion.div>
          <motion.div
            className="hero-art__fragment hero-art__fragment--two"
            aria-hidden="true"
            style={{ x: reduceMotion ? 0 : smoothY }}
          >
            <HeroShirtArt decorative />
          </motion.div>
          <span className="hero-art__caption">Arte autoral demonstrativa / 2026</span>
        </motion.div>
      </div>
    </section>
  );
}
