"use client";

import { Bell, Check, Heart, LoaderCircle, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDemoInstallment } from "@/lib/currency";
import { useCommerce } from "@/providers/CommerceProvider";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

function productIsAvailable(product: Product) {
  return (
    product.demoStock.state !== "unavailable" &&
    product.demoStock.state !== "in-production" &&
    product.productionStatus !== "Temporariamente indisponível" &&
    product.productionStatus !== "Nova remessa em produção"
  );
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const {
    addToCart,
    favorites,
    openProductNotification,
    toggleFavorite,
  } = useCommerce();
  const { toast } = useToast();
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "Padrão");
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState("");
  const isFavorite = favorites.includes(product.id);
  const available = productIsAvailable(product);
  const currentPrice = product.salePrice ?? product.price;

  function handleQuickBuy() {
    if (!available) {
      openProductNotification(product);
      return;
    }

    if (product.sizes.length > 0 && !quickBuyOpen) {
      setQuickBuyOpen(true);
      return;
    }

    confirmAdd();
  }

  function confirmAdd() {
    if (product.sizes.length > 0 && !selectedSize) {
      setFeedback("Escolha um tamanho antes de adicionar.");
      return;
    }

    setIsAdding(true);
    setFeedback("");
    window.setTimeout(() => {
      const added = addToCart(product, {
        size: selectedSize || undefined,
        color: selectedColor,
      });
      setIsAdding(false);
      if (added) {
        const message = `${product.name} foi adicionado ao carrinho.`;
        setFeedback(message);
        setQuickBuyOpen(false);
        toast(message, { variant: "success" });
      }
    }, 280);
  }

  const actionLabel = !available
    ? product.productionStatus === "Nova remessa em produção"
      ? "Ver nova remessa"
      : "Avise-me quando voltar"
    : quickBuyOpen
      ? "Confirmar no carrinho"
      : "Compra rápida";

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Image
          className="product-card__image product-card__image--primary"
          src={product.images[0]}
          alt={`Imagem demonstrativa de ${product.name}`}
          fill
          priority={priority}
          sizes="(max-width: 479px) 82vw, (max-width: 899px) 44vw, 310px"
        />
        {product.images[1] ? (
          <Image
            className="product-card__image product-card__image--secondary"
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 479px) 82vw, (max-width: 899px) 44vw, 310px"
          />
        ) : null}
        <span className="status-stamp">{product.badge ?? product.productionStatus}</span>
        <button
          className={`favorite-button${isFavorite ? " favorite-button--active" : ""}`}
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`}
          onClick={() => {
            toggleFavorite(product.id);
            toast(isFavorite ? "Removido dos favoritos." : "Salvo nos favoritos.", {
              variant: "success",
            });
          }}
        >
          <Heart aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <span className="product-card__demo">Imagem demonstrativa</span>
      </div>

      <div className="product-card__body">
        <p className="product-card__meta">{product.category} / {product.collection}</p>
        <h3>{product.name}</h3>
        <p className="product-card__description">{product.shortDescription}</p>

        {product.rating && product.reviewCount > 0 ? (
          <p className="product-rating" aria-label={`${product.rating} de 5, ${product.reviewCount} avaliações`}>
            <Star aria-hidden="true" fill="currentColor" /> {product.rating} ({product.reviewCount})
          </p>
        ) : null}

        <div className="product-card__price-row">
          <div>
            {product.salePrice ? <del>{formatCurrency(product.price)}</del> : null}
            <strong>{formatCurrency(currentPrice)}</strong>
            <small>{formatDemoInstallment(currentPrice, 3)}</small>
          </div>
          <div className="product-swatches" aria-label="Cores disponíveis">
            {product.colors.map((color) => (
              <span
                key={color.name}
                className="product-swatch"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <p className="product-card__lead-time">
          <Check aria-hidden="true" />
          <span><strong>{product.productionStatus}.</strong> {product.productionLeadTime}</span>
        </p>

        {quickBuyOpen && available ? (
          <div className="quick-buy" aria-label={`Escolher variações de ${product.name}`}>
            {product.sizes.length > 0 ? (
              <fieldset>
                <legend>Tamanho</legend>
                <div className="option-row">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "option-chip option-chip--active" : "option-chip"}
                      type="button"
                      aria-pressed={selectedSize === size}
                      onClick={() => {
                        setSelectedSize(size);
                        setFeedback("");
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}
            {product.colors.length > 1 ? (
              <label>
                Cor
                <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
                  {product.colors.map((color) => (
                    <option key={color.name} value={color.name}>{color.name}</option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        ) : null}

        <button
          className="button button--product"
          type="button"
          onClick={handleQuickBuy}
          aria-busy={isAdding}
        >
          {isAdding ? (
            <><LoaderCircle className="spin" aria-hidden="true" /> Adicionando...</>
          ) : available ? (
            <><ShoppingBag aria-hidden="true" /> {actionLabel}</>
          ) : (
            <><Bell aria-hidden="true" /> {actionLabel}</>
          )}
        </button>
        {quickBuyOpen ? (
          <button className="text-button" type="button" onClick={() => setQuickBuyOpen(false)}>
            Cancelar seleção
          </button>
        ) : null}
        <p className="product-card__feedback" aria-live="polite">{feedback}</p>
      </div>
    </article>
  );
}
