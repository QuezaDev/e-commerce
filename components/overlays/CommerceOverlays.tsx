"use client";

import {
  ArrowRight,
  Heart,
  Minus,
  PackageSearch,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState, type FormEvent } from "react";

import { Overlay } from "@/components/ui/Overlay";
import { useToast } from "@/components/ui/Toast";
import { content } from "@/content/pt-BR";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { productMatchesQuery } from "@/lib/search";
import { useCommerce } from "@/providers/CommerceProvider";
import type { Product } from "@/types/product";

function ProductThumb({ product }: { product: Product }) {
  return (
    <div className="overlay-product__thumb">
      <Image src={product.images[0]} alt="" fill sizes="88px" />
    </div>
  );
}

function MobileMenu() {
  const { activeOverlay, closeOverlay, openOverlay } = useCommerce();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const links = [
    ["Início", "#inicio"],
    ["Produtos", "#produtos"],
    ["Coleções", "#colecoes"],
    ["Sobre", "#sobre"],
    ["Quiz", "#quiz"],
    ["Perguntas frequentes", "#faq"],
  ] as const;

  return (
    <Overlay
      open={activeOverlay === "menu"}
      onClose={closeOverlay}
      ariaLabel="Menu principal"
      size="full"
      className="mobile-menu-panel"
      initialFocusRef={firstLinkRef}
    >
      <div className="mobile-menu__brand"><strong>Coringão Loko</strong><span>by Never Surrender Tattoo</span></div>
      <nav className="mobile-menu__nav" aria-label="Navegação mobile">
        {links.map(([label, href], index) => (
          <a key={href} ref={index === 0 ? firstLinkRef : undefined} href={href} onClick={closeOverlay}>
            <span>0{index + 1}</span>{label}<ArrowRight aria-hidden="true" />
          </a>
        ))}
        <button type="button" onClick={() => openOverlay("search")}>
          <span>07</span>Buscar produtos<Search aria-hidden="true" />
        </button>
        <button type="button" onClick={() => openOverlay("favorites")}>
          <span>08</span>Favoritos<Heart aria-hidden="true" />
        </button>
        <button type="button" onClick={() => openOverlay("tracking")}>
          <span>09</span>Rastrear pedido<PackageSearch aria-hidden="true" />
        </button>
      </nav>
      <p className="mobile-menu__note">Marca independente • Conteúdo demonstrativo</p>
    </Overlay>
  );
}

function SearchDialog() {
  const { activeOverlay, closeOverlay } = useCommerce();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(
    () => products.filter((product) => productMatchesQuery(product, query)).slice(0, 7),
    [query],
  );

  function handleClose() {
    setQuery("");
    closeOverlay();
  }

  return (
    <Overlay
      open={activeOverlay === "search"}
      onClose={handleClose}
      title={content.dialogs.search.title}
      description="Resultados locais da vitrine demonstrativa."
      size="lg"
      className="search-panel"
      initialFocusRef={inputRef}
    >
      <label className="field-label" htmlFor="product-search">{content.dialogs.search.label}</label>
      <div className="search-field">
        <Search aria-hidden="true" />
        <input
          ref={inputRef}
          id="product-search"
          type="search"
          value={query}
          placeholder={content.dialogs.search.placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button type="button" aria-label={content.dialogs.search.clear} onClick={() => setQuery("")}>
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <p className="search-summary" aria-live="polite">
        {query ? `${results.length} resultado${results.length === 1 ? "" : "s"} para “${query}”` : "Digite ou explore os produtos abaixo."}
      </p>
      {results.length > 0 ? (
        <ul className="overlay-product-list search-results">
          {results.map((product) => (
            <li key={product.id}>
              <ProductThumb product={product} />
              <div className="overlay-product__details">
                <span>{product.category} / {product.collection}</span>
                <strong>{product.name}</strong>
                <small>{formatCurrency(product.salePrice ?? product.price)}</small>
              </div>
              <a href="#produtos" onClick={handleClose} aria-label={`Ver ${product.name} na vitrine`}>
                <ArrowRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state" role="status"><Search aria-hidden="true" /><strong>{content.dialogs.search.empty}</strong><p>Tente um nome, categoria ou coleção diferente.</p></div>
      )}
    </Overlay>
  );
}

function FavoritesDrawer() {
  const { activeOverlay, closeOverlay, favoriteProducts, toggleFavorite } = useCommerce();
  const { toast } = useToast();

  return (
    <Overlay
      open={activeOverlay === "favorites"}
      onClose={closeOverlay}
      title={content.dialogs.favorites.title}
      description="Itens salvos somente neste navegador."
      size="lg"
      wrapperClassName="overlay-root--drawer"
      className="drawer-panel"
    >
      {favoriteProducts.length > 0 ? (
        <ul className="overlay-product-list drawer-list">
          {favoriteProducts.map((product) => (
            <li key={product.id}>
              <ProductThumb product={product} />
              <div className="overlay-product__details">
                <span>{product.collection}</span><strong>{product.name}</strong><small>{formatCurrency(product.salePrice ?? product.price)}</small>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label={`Remover ${product.name} dos favoritos`}
                onClick={() => {
                  toggleFavorite(product.id);
                  toast(content.feedback.removedFavorite);
                }}
              >
                <Trash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state"><Heart aria-hidden="true" /><strong>{content.dialogs.favorites.empty}</strong><p>Use o coração nos cards para guardar suas escolhas.</p><a className="button button--solid" href="#produtos" onClick={closeOverlay}>Explorar produtos</a></div>
      )}
    </Overlay>
  );
}

function CartDrawer() {
  const {
    activeOverlay,
    cartProducts,
    closeOverlay,
    openNotice,
    removeCartLine,
    subtotal,
    updateCartQuantity,
  } = useCommerce();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  return (
    <Overlay
      open={activeOverlay === "cart"}
      onClose={closeOverlay}
      title={content.dialogs.cart.title}
      description="Carrinho demonstrativo salvo somente neste navegador."
      size="lg"
      wrapperClassName="overlay-root--drawer"
      className="drawer-panel cart-panel"
    >
      {cartProducts.length > 0 ? (
        <div className="cart-layout">
          <ul className="overlay-product-list cart-list">
            {cartProducts.map(({ line, product }) => (
              <li key={line.key}>
                <ProductThumb product={product} />
                <div className="overlay-product__details">
                  <strong>{product.name}</strong>
                  <span>{line.size ? `Tam. ${line.size} / ` : ""}{line.color}</span>
                  <small>{formatCurrency((product.salePrice ?? product.price) * line.quantity)}</small>
                  <div className="quantity-control" aria-label={`Quantidade de ${product.name}`}>
                    <button type="button" aria-label={content.dialogs.cart.decrease} onClick={() => updateCartQuantity(line.key, line.quantity - 1)}><Minus aria-hidden="true" /></button>
                    <span aria-live="polite">{line.quantity}</span>
                    <button type="button" aria-label={content.dialogs.cart.increase} onClick={() => updateCartQuantity(line.key, line.quantity + 1)}><Plus aria-hidden="true" /></button>
                  </div>
                </div>
                <button
                  className="icon-button cart-remove"
                  type="button"
                  aria-label={`${content.dialogs.cart.remove}: ${product.name}`}
                  onClick={() => {
                    removeCartLine(line.key);
                    toast(content.feedback.removedFromCart);
                  }}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button className="text-button cart-expand" type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
            {expanded ? "Ocultar resumo detalhado" : "Ver resumo detalhado"}
          </button>
          {expanded ? (
            <div className="cart-details">
              <p><span>Itens</span><strong>{cartProducts.reduce((total, item) => total + item.line.quantity, 0)}</strong></p>
              <p><span>Frete</span><strong>A calcular na etapa futura</strong></p>
              <small>Valores e disponibilidade desta vitrine são demonstrativos.</small>
            </div>
          ) : null}
          <div className="cart-total"><span>{content.dialogs.cart.subtotal}</span><strong>{formatCurrency(subtotal)}</strong></div>
          <button
            className="button button--solid button--wide"
            type="button"
            onClick={() => openNotice({ title: "Checkout em breve", message: content.dialogs.cart.checkoutNotice })}
          >
            <ShoppingBag aria-hidden="true" /> {content.dialogs.cart.checkout}
          </button>
        </div>
      ) : (
        <div className="empty-state"><ShoppingBag aria-hidden="true" /><strong>{content.dialogs.cart.empty}</strong><p>Explore a vitrine e escolha sua primeira peça.</p><a className="button button--solid" href="#produtos" onClick={closeOverlay}>Ver produtos</a></div>
      )}
    </Overlay>
  );
}

function TrackingDialog() {
  const { activeOverlay, closeOverlay } = useCommerce();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toLocaleUpperCase("pt-BR");
    if (!normalized) {
      setMessage(content.dialogs.tracking.required);
      setIsError(true);
      return;
    }
    setIsError(false);
    setMessage(normalized === "DEMO123" ? content.dialogs.tracking.demoResult : content.dialogs.tracking.integrationPending);
  }

  return (
    <Overlay
      open={activeOverlay === "tracking"}
      onClose={closeOverlay}
      title={content.dialogs.tracking.title}
      description={content.dialogs.tracking.description}
      size="sm"
      initialFocusRef={inputRef}
    >
      <form className="dialog-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="tracking-code">{content.dialogs.tracking.label}</label>
        <input ref={inputRef} id="tracking-code" value={code} placeholder={content.dialogs.tracking.placeholder} onChange={(event) => { setCode(event.target.value); setMessage(""); }} aria-describedby="tracking-message" />
        <button className="button button--solid button--wide" type="submit"><PackageSearch aria-hidden="true" /> {content.dialogs.tracking.action}</button>
        <div className={`form-message${isError ? " form-message--error" : ""}`} id="tracking-message" aria-live="polite">
          {message ? <><strong>{code.trim().toLocaleUpperCase("pt-BR") === "DEMO123" && !isError ? "Status demonstrativo" : "Atenção"}</strong><p>{message}</p></> : null}
        </div>
      </form>
    </Overlay>
  );
}

function NotificationDialog() {
  const { activeOverlay, closeOverlay, notificationProduct } = useCommerce();
  const inputRef = useRef<HTMLInputElement>(null);
  const [submittedForId, setSubmittedForId] = useState<string | null>(null);
  const submitted = Boolean(notificationProduct && submittedForId === notificationProduct.id);

  function handleClose() {
    setSubmittedForId(null);
    closeOverlay();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (notificationProduct) setSubmittedForId(notificationProduct.id);
  }

  return (
    <Overlay
      open={activeOverlay === "notify"}
      onClose={handleClose}
      title={notificationProduct?.productionStatus === "Nova remessa em produção" ? "Nova remessa em andamento" : content.dialogs.notify.title}
      description={notificationProduct ? `${notificationProduct.name} — ${notificationProduct.productionLeadTime}` : content.dialogs.notify.description}
      size="sm"
      initialFocusRef={inputRef}
    >
      {submitted ? (
        <div className="form-confirmation" role="status"><Heart aria-hidden="true" /><strong>Interesse anotado nesta demonstração.</strong><p>{content.dialogs.notify.confirmation}</p><button className="button button--outline" type="button" onClick={handleClose}>Fechar</button></div>
      ) : (
        <form className="dialog-form" onSubmit={handleSubmit}>
          <p className="demo-callout">{content.dialogs.notify.description}</p>
          <label htmlFor="notify-email">{content.dialogs.notify.emailLabel}</label>
          <input ref={inputRef} id="notify-email" type="email" required autoComplete="email" placeholder="voce@exemplo.com" />
          <button className="button button--solid button--wide" type="submit">{content.dialogs.notify.action}</button>
        </form>
      )}
    </Overlay>
  );
}

function NoticeDialog() {
  const { activeOverlay, closeOverlay, notice } = useCommerce();
  return (
    <Overlay open={activeOverlay === "notice"} onClose={closeOverlay} title={notice?.title ?? "Aviso"} size="sm">
      <div className="notice-content"><p>{notice?.message}</p><button className="button button--solid" type="button" onClick={closeOverlay}>Entendi</button></div>
    </Overlay>
  );
}

export function CommerceOverlays() {
  return (
    <>
      <MobileMenu />
      <SearchDialog />
      <FavoritesDrawer />
      <CartDrawer />
      <TrackingDialog />
      <NotificationDialog />
      <NoticeDialog />
    </>
  );
}
