"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface ProductCarouselProps {
  products: Product[];
  label: string;
}

export function ProductCarousel({ products, label }: ProductCarouselProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0 });
  const [position, setPosition] = useState(0);

  const updatePosition = useCallback(() => {
    const rail = railRef.current;
    const firstCard = rail?.querySelector<HTMLElement>("li");
    if (!rail || !firstCard) {
      setPosition(0);
      return;
    }
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || "0");
    setPosition(Math.min(products.length - 1, Math.max(0, Math.round(rail.scrollLeft / (firstCard.offsetWidth + gap)))));
  }, [products.length]);

  useEffect(() => {
    updatePosition();
  }, [products, updatePosition]);

  function scroll(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(280, rail.clientWidth * 0.78), behavior: "smooth" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scroll(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scroll(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }
    if (event.key === "End") {
      event.preventDefault();
      railRef.current?.scrollTo({ left: railRef.current.scrollWidth, behavior: "smooth" });
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragState.current = { active: true, startX: event.clientX, startScroll: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.classList.add("is-dragging");
  }

  function handlePointerMove(event: PointerEvent<HTMLUListElement>) {
    const rail = railRef.current;
    if (!rail || !dragState.current.active) return;
    rail.scrollLeft = dragState.current.startScroll - (event.clientX - dragState.current.startX);
  }

  function endDrag(event: PointerEvent<HTMLUListElement>) {
    const rail = railRef.current;
    if (!rail || !dragState.current.active) return;
    dragState.current.active = false;
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    rail.classList.remove("is-dragging");
    updatePosition();
  }

  if (products.length === 0) {
    return (
      <div className="empty-state" role="status">
        <strong>Nenhuma peça encontrada.</strong>
        <p>Remova o filtro ou tente outra categoria.</p>
      </div>
    );
  }

  return (
    <div className="product-carousel">
      <ul
        ref={railRef}
        className="product-carousel__rail"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={updatePosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} priority={index < 2} />
          </li>
        ))}
      </ul>
      <div className="product-carousel__controls">
        <button className="icon-button" type="button" onClick={() => scroll(-1)} aria-label="Produtos anteriores">
          <ArrowLeft aria-hidden="true" />
        </button>
        <span aria-live="polite">{position + 1} / {products.length}</span>
        <button className="icon-button" type="button" onClick={() => scroll(1)} aria-label="Próximos produtos">
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
