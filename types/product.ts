/**
 * Tipos do catálogo demonstrativo.
 *
 * Antes da publicação, conecte estes tipos à fonte real de catálogo e estoque.
 * Enquanto `isDemo` for `true`, nenhum dado deve ser apresentado como informação
 * comercial definitiva.
 */

export const PRODUCT_CATEGORIES = [
  "Camisetas",
  "Moletons",
  "Bandeiras",
  "Adesivos",
] as const;

export const PRODUCT_COLLECTIONS = ["Coringão Loko", "Coringão Delas"] as const;

export const PRODUCTION_STATUSES = [
  "Pronta entrega",
  "Produção sob demanda",
  "Últimas unidades",
  "Temporariamente indisponível",
  "Nova remessa em produção",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductCollection = (typeof PRODUCT_COLLECTIONS)[number];
export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];

export const PRODUCTION_STATUS_LABELS = {
  "Pronta entrega": "Pronta entrega",
  "Produção sob demanda": "Produção sob demanda",
  "Últimas unidades": "Últimas unidades",
  "Temporariamente indisponível": "Temporariamente indisponível",
  "Nova remessa em produção": "Nova remessa em produção",
} as const satisfies Record<ProductionStatus, string>;

export type DemoStockState =
  | "available"
  | "limited"
  | "unavailable"
  | "in-production";

export interface ProductColor {
  name: string;
  /** Cor hexadecimal usada somente nos seletores visuais do protótipo. */
  hex: `#${string}`;
}

export interface DemoStock {
  /** Estado sem quantidade numérica para não sugerir um estoque real. */
  state: DemoStockState;
  quantity: null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  collection: ProductCollection;
  category: ProductCategory;
  /** Valor demonstrativo em reais, não em centavos. */
  price: number;
  /** Valor demonstrativo em reais, não em centavos. */
  salePrice?: number;
  images: readonly [string, ...string[]];
  imageAlt: string;
  alternateImageAlt?: string;
  colors: readonly ProductColor[];
  /** Vazio para itens sem seleção de tamanho. */
  sizes: readonly string[];
  /** Deve permanecer nulo até existirem avaliações reais verificadas. */
  rating?: number | null;
  /** Deve permanecer zero até existirem avaliações reais verificadas. */
  reviewCount: number;
  productionStatus: ProductionStatus;
  /** Prazo específico e provisório; substituir pela regra comercial validada. */
  productionLeadTime: string;
  badge?: string;
  demoStock: DemoStock;
  featured: boolean;
  isDemo: true;
}
