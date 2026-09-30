import type { Product } from "@/types/product";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_COLLECTIONS,
} from "@/types/product";

/**
 * CATÁLOGO DEMONSTRATIVO — substituir antes da publicação.
 *
 * Revise nomes, descrições, preços, imagens, cores, tamanhos, disponibilidade e
 * prazos com o catálogo oficial. As artes locais não contêm estampas oficiais.
 * Avaliações ficam vazias até que dados reais e verificáveis estejam disponíveis.
 */
export const products = [
  {
    id: "demo-camiseta-fiel-old-school",
    slug: "camiseta-fiel-old-school",
    name: "Camiseta Fiel Old School",
    shortDescription:
      "Camiseta demonstrativa com composição autoral de faixas, estrela e traço clássico.",
    collection: "Coringão Loko",
    category: "Camisetas",
    price: 119.9,
    images: [
      "/products/camiseta-fiel-old-school.svg",
      "/products/camiseta-fiel-old-school-costas.svg",
    ],
    imageAlt:
      "Camiseta preta demonstrativa com arte abstrata old school em branco",
    alternateImageAlt:
      "Costas da camiseta preta demonstrativa com faixas e estrela abstrata",
    colors: [
      { name: "Preto", hex: "#111111" },
      { name: "Branco", hex: "#F4F4F2" },
    ],
    sizes: ["P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Pronta entrega",
    productionLeadTime: "Preparação para envio; prazo final a confirmar.",
    badge: "Destaque",
    demoStock: { state: "available", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-camiseta-arquibancada",
    slug: "camiseta-arquibancada",
    name: "Camiseta Arquibancada",
    shortDescription:
      "Listras, textura de impressão e energia de arquibancada em uma arte original.",
    collection: "Coringão Loko",
    category: "Camisetas",
    price: 109.9,
    salePrice: 99.9,
    images: ["/products/camiseta-arquibancada.svg"],
    imageAlt:
      "Camiseta branca demonstrativa com listras pretas e tipografia de arquibancada",
    colors: [
      { name: "Branco", hex: "#F4F4F2" },
      { name: "Grafite", hex: "#343434" },
    ],
    sizes: ["P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Produção sob demanda",
    productionLeadTime: "Prazo provisório de produção: até 12 dias úteis.",
    badge: "Sob demanda",
    demoStock: { state: "in-production", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-camiseta-delas-tradicional",
    slug: "camiseta-coringao-delas-tradicional",
    name: "Camiseta Coringão Delas Tradicional",
    shortDescription:
      "Modelagem demonstrativa com rosa autoral, estrela e contraste monocromático.",
    collection: "Coringão Delas",
    category: "Camisetas",
    price: 114.9,
    images: [
      "/products/camiseta-delas-tradicional.svg",
      "/products/camiseta-delas-tradicional-costas.svg",
    ],
    imageAlt:
      "Camiseta preta da coleção Coringão Delas com rosa old school abstrata",
    alternateImageAlt:
      "Costas da camiseta da coleção Coringão Delas com estrela e faixas",
    colors: [
      { name: "Preto", hex: "#111111" },
      { name: "Cinza claro", hex: "#D6D6D2" },
    ],
    sizes: ["PP", "P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Pronta entrega",
    productionLeadTime: "Preparação para envio; prazo final a confirmar.",
    badge: "Coringão Delas",
    demoStock: { state: "available", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-moletom-noite-de-jogo",
    slug: "moletom-noite-de-jogo",
    name: "Moletom Noite de Jogo",
    shortDescription:
      "Moletom demonstrativo de visual noturno, com chamas lineares e faixas urbanas.",
    collection: "Coringão Loko",
    category: "Moletons",
    price: 229.9,
    images: [
      "/products/moletom-noite-de-jogo.svg",
      "/products/moletom-noite-de-jogo-costas.svg",
    ],
    imageAlt:
      "Moletom grafite demonstrativo com arte linear em branco",
    alternateImageAlt:
      "Costas do moletom grafite com faixas e chama abstrata",
    colors: [
      { name: "Grafite", hex: "#282828" },
      { name: "Preto", hex: "#111111" },
    ],
    sizes: ["P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Nova remessa em produção",
    productionLeadTime: "Prazo provisório da remessa: até 18 dias úteis.",
    badge: "Nova remessa",
    demoStock: { state: "in-production", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-moletom-coringao-delas",
    slug: "moletom-coringao-delas",
    name: "Moletom Coringão Delas",
    shortDescription:
      "Silhueta confortável com lettering autoral e detalhe de rosa em linha.",
    collection: "Coringão Delas",
    category: "Moletons",
    price: 219.9,
    images: ["/products/moletom-coringao-delas.svg"],
    imageAlt:
      "Moletom preto demonstrativo da coleção Coringão Delas com lettering branco",
    colors: [
      { name: "Preto", hex: "#111111" },
      { name: "Cinza mescla", hex: "#9A9A96" },
    ],
    sizes: ["PP", "P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Produção sob demanda",
    productionLeadTime: "Prazo provisório de produção: até 15 dias úteis.",
    badge: "Sob demanda",
    demoStock: { state: "in-production", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-bandeira-linha-old-school",
    slug: "bandeira-linha-old-school",
    name: "Bandeira Linha Old School",
    shortDescription:
      "Bandeira demonstrativa com listras irregulares, estrela e acabamento gráfico.",
    collection: "Coringão Loko",
    category: "Bandeiras",
    price: 89.9,
    images: ["/products/bandeira-linha-old-school.svg"],
    imageAlt:
      "Bandeira monocromática demonstrativa com faixas e estrela abstrata",
    colors: [{ name: "Preto e branco", hex: "#202020" }],
    sizes: [],
    rating: null,
    reviewCount: 0,
    productionStatus: "Últimas unidades",
    productionLeadTime: "Preparação para envio; disponibilidade final a confirmar.",
    badge: "Últimas unidades",
    demoStock: { state: "limited", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-kit-adesivos-traco-de-rua",
    slug: "kit-adesivos-traco-de-rua",
    name: "Kit de Adesivos Traço de Rua",
    shortDescription:
      "Conjunto demonstrativo de adesivos com rosa, estrela, chama e faixas autorais.",
    collection: "Coringão Loko",
    category: "Adesivos",
    price: 29.9,
    images: ["/products/kit-adesivos-traco-de-rua.svg"],
    imageAlt:
      "Cartela demonstrativa de adesivos monocromáticos com desenhos old school",
    colors: [{ name: "Preto e branco", hex: "#202020" }],
    sizes: [],
    rating: null,
    reviewCount: 0,
    productionStatus: "Pronta entrega",
    productionLeadTime: "Preparação para envio; prazo final a confirmar.",
    badge: "Acessório",
    demoStock: { state: "available", quantity: null },
    featured: false,
    isDemo: true,
  },
  {
    id: "demo-camiseta-edicao-limitada",
    slug: "camiseta-edicao-limitada",
    name: "Camiseta Edição Limitada",
    shortDescription:
      "Peça conceitual com impressão desgastada, faixas diagonais e estrela central.",
    collection: "Coringão Loko",
    category: "Camisetas",
    price: 139.9,
    images: ["/products/camiseta-edicao-limitada.svg"],
    imageAlt:
      "Camiseta grafite demonstrativa com estrela e faixas diagonais",
    colors: [{ name: "Grafite", hex: "#2D2D2D" }],
    sizes: ["P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Temporariamente indisponível",
    productionLeadTime: "Sem previsão confirmada para a próxima remessa.",
    badge: "Indisponível",
    demoStock: { state: "unavailable", quantity: null },
    featured: false,
    isDemo: true,
  },
  {
    id: "demo-camiseta-delas-arquibancada",
    slug: "camiseta-delas-arquibancada",
    name: "Camiseta Delas Arquibancada",
    shortDescription:
      "Lettering amplo e recortes geométricos em uma composição urbana autoral.",
    collection: "Coringão Delas",
    category: "Camisetas",
    price: 124.9,
    salePrice: 112.9,
    images: ["/products/camiseta-delas-arquibancada.svg"],
    imageAlt:
      "Camiseta clara demonstrativa da coleção Coringão Delas com faixas pretas",
    colors: [
      { name: "Branco", hex: "#F4F4F2" },
      { name: "Preto", hex: "#111111" },
    ],
    sizes: ["PP", "P", "M", "G", "GG"],
    rating: null,
    reviewCount: 0,
    productionStatus: "Nova remessa em produção",
    productionLeadTime: "Prazo provisório da remessa: até 14 dias úteis.",
    badge: "Nova remessa",
    demoStock: { state: "in-production", quantity: null },
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-adesivo-estudio-arquibancada",
    slug: "adesivo-estudio-arquibancada",
    name: "Adesivo Estúdio & Arquibancada",
    shortDescription:
      "Adesivo demonstrativo com aperto de mãos, raios e moldura de flash tattoo.",
    collection: "Coringão Delas",
    category: "Adesivos",
    price: 12.9,
    images: ["/products/adesivo-estudio-arquibancada.svg"],
    imageAlt:
      "Adesivo monocromático demonstrativo com mãos e raios abstratos",
    colors: [{ name: "Preto e branco", hex: "#202020" }],
    sizes: [],
    rating: null,
    reviewCount: 0,
    productionStatus: "Pronta entrega",
    productionLeadTime: "Preparação para envio; prazo final a confirmar.",
    badge: "Acessório",
    demoStock: { state: "available", quantity: null },
    featured: false,
    isDemo: true,
  },
] satisfies readonly Product[];

export const featuredProducts = products.filter((product) => product.featured);
export const productCategories = PRODUCT_CATEGORIES;
export const productCollections = PRODUCT_COLLECTIONS;

export function findProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function findProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

