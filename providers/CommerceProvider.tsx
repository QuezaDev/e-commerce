"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { products } from "@/data/products";
import { useStoredState } from "@/hooks/useStoredState";
import type { CartLine, NoticeContent, OverlayName } from "@/types/commerce";
import type { Product } from "@/types/product";

const CART_STORAGE_KEY = "coringao-loko-cart";
const FAVORITES_STORAGE_KEY = "coringao-loko-favorites";

interface AddToCartOptions {
  size?: string;
  color?: string;
  quantity?: number;
}

interface CommerceContextValue {
  activeOverlay: OverlayName;
  cart: CartLine[];
  cartCount: number;
  cartProducts: Array<{ line: CartLine; product: Product }>;
  closeOverlay: () => void;
  favorites: string[];
  favoriteProducts: Product[];
  hydrated: boolean;
  notice: NoticeContent | null;
  notificationProduct: Product | null;
  openNotice: (content: NoticeContent) => void;
  openOverlay: (name: Exclude<OverlayName, null>) => void;
  openProductNotification: (product: Product) => void;
  removeCartLine: (key: string) => void;
  subtotal: number;
  toggleFavorite: (productId: string) => void;
  updateCartQuantity: (key: string, quantity: number) => void;
  addToCart: (product: Product, options?: AddToCartOptions) => boolean;
}

const CommerceContext = createContext<CommerceContextValue | null>(null);

function isPurchasable(product: Product) {
  return (
    product.demoStock.state !== "unavailable" &&
    product.demoStock.state !== "in-production" &&
    product.productionStatus !== "Temporariamente indisponível" &&
    product.productionStatus !== "Nova remessa em produção"
  );
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayName>(null);
  const [notice, setNotice] = useState<NoticeContent | null>(null);
  const [notificationProductId, setNotificationProductId] = useState<string | null>(null);
  const [cart, setCart, cartMeta] = useStoredState<CartLine[]>(CART_STORAGE_KEY, []);
  const [favorites, setFavorites, favoritesMeta] = useStoredState<string[]>(
    FAVORITES_STORAGE_KEY,
    [],
  );

  const openOverlay = useCallback((name: Exclude<OverlayName, null>) => {
    setActiveOverlay(name);
  }, []);

  const closeOverlay = useCallback(() => {
    setActiveOverlay(null);
    setNotificationProductId(null);
  }, []);

  const openNotice = useCallback((content: NoticeContent) => {
    setNotice(content);
    setActiveOverlay("notice");
  }, []);

  const openProductNotification = useCallback((product: Product) => {
    setNotificationProductId(product.id);
    setActiveOverlay("notify");
  }, []);

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((current) =>
        current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      );
    },
    [setFavorites],
  );

  const addToCart = useCallback(
    (product: Product, options: AddToCartOptions = {}) => {
      if (!isPurchasable(product)) {
        openProductNotification(product);
        return false;
      }

      if (product.sizes.length > 0 && !options.size) {
        return false;
      }

      const color = options.color ?? product.colors[0]?.name ?? "Padrão";
      const key = `${product.id}:${options.size ?? "unico"}:${color}`;
      const quantity = Math.max(1, options.quantity ?? 1);

      setCart((current) => {
        const existing = current.find((line) => line.key === key);
        if (existing) {
          return current.map((line) =>
            line.key === key
              ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
              : line,
          );
        }

        return [
          ...current,
          {
            key,
            productId: product.id,
            size: options.size,
            color,
            quantity,
          },
        ];
      });

      return true;
    },
    [openProductNotification, setCart],
  );

  const updateCartQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((current) => current.filter((line) => line.key !== key));
        return;
      }

      setCart((current) =>
        current.map((line) =>
          line.key === key ? { ...line, quantity: Math.min(99, quantity) } : line,
        ),
      );
    },
    [setCart],
  );

  const removeCartLine = useCallback(
    (key: string) => setCart((current) => current.filter((line) => line.key !== key)),
    [setCart],
  );

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [],
  );

  const cartProducts = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = productById.get(line.productId);
        return product ? [{ line, product }] : [];
      }),
    [cart, productById],
  );

  const favoriteProducts = useMemo(
    () => favorites.flatMap((id) => (productById.has(id) ? [productById.get(id)!] : [])),
    [favorites, productById],
  );

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cartProducts.reduce(
        (total, { line, product }) =>
          total + (product.salePrice ?? product.price) * line.quantity,
        0,
      ),
    [cartProducts],
  );

  const value = useMemo<CommerceContextValue>(
    () => ({
      activeOverlay,
      addToCart,
      cart,
      cartCount,
      cartProducts,
      closeOverlay,
      favoriteProducts,
      favorites,
      hydrated: cartMeta.isHydrated && favoritesMeta.isHydrated,
      notice,
      notificationProduct: notificationProductId
        ? (productById.get(notificationProductId) ?? null)
        : null,
      openNotice,
      openOverlay,
      openProductNotification,
      removeCartLine,
      subtotal,
      toggleFavorite,
      updateCartQuantity,
    }),
    [
      activeOverlay,
      addToCart,
      cart,
      cartCount,
      cartMeta.isHydrated,
      cartProducts,
      closeOverlay,
      favoriteProducts,
      favorites,
      favoritesMeta.isHydrated,
      notice,
      notificationProductId,
      openNotice,
      openOverlay,
      openProductNotification,
      productById,
      removeCartLine,
      subtotal,
      toggleFavorite,
      updateCartQuantity,
    ],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error("useCommerce deve ser usado dentro de CommerceProvider.");
  }

  return context;
}
