"use client";

import {
  Heart,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCommerce } from "@/providers/CommerceProvider";

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Coleções", href: "#colecoes" },
  { label: "Sobre", href: "#sobre" },
];

export function Header() {
  const { cartCount, favorites, hydrated, openOverlay } = useCommerce();
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsCondensed(window.scrollY > 36);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header${isCondensed ? " site-header--condensed" : ""}`} id="cabecalho">
      <div className="site-header__inner shell">
        <a className="wordmark" href="#inicio" aria-label="Coringão Loko — início">
          <span>Coringão Loko</span>
          <small>by Never Surrender Tattoo</small>
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <button type="button" onClick={() => openOverlay("tracking")}>
            Rastrear pedido
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button header-action--optional"
            type="button"
            aria-label="Buscar produtos"
            onClick={() => openOverlay("search")}
          >
            <Search aria-hidden="true" />
          </button>
          <button
            className="icon-button header-action--optional counter-button"
            type="button"
            aria-label={hydrated ? `Favoritos: ${favorites.length}` : "Abrir favoritos"}
            onClick={() => openOverlay("favorites")}
          >
            <Heart aria-hidden="true" />
            {hydrated && favorites.length > 0 ? (
              <span className="header-count" aria-hidden="true">{favorites.length}</span>
            ) : null}
          </button>
          <button
            className="icon-button counter-button"
            type="button"
            aria-label={hydrated ? `Carrinho: ${cartCount} itens` : "Abrir carrinho"}
            onClick={() => openOverlay("cart")}
          >
            <ShoppingBag aria-hidden="true" />
            {hydrated && cartCount > 0 ? (
              <span className="header-count" aria-hidden="true">{cartCount}</span>
            ) : null}
          </button>
          <ThemeToggle />
          <button
            className="icon-button mobile-menu-trigger"
            type="button"
            aria-label="Abrir menu"
            onClick={() => openOverlay("menu")}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>

      <button
        className="tracking-compact"
        type="button"
        onClick={() => openOverlay("tracking")}
      >
        <PackageSearch aria-hidden="true" />
        <span>Rastrear</span>
      </button>
    </header>
  );
}
