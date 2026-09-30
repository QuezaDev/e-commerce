/**
 * Configuração central da marca.
 *
 * Substitua as variáveis `NEXT_PUBLIC_*` pelos dados oficiais antes de publicar.
 * Valores ausentes permanecem `null`, evitando links e contatos inventados.
 */

const optionalPublicValue = (value: string | undefined) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

export const brandConfig = {
  name: "Coringão Loko",
  signature: "by Never Surrender Tattoo",
  locale: "pt-BR",
  currency: "BRL",
  country: "BR",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  legalNotice: "Marca independente. Não representa um canal oficial do clube.",
  assets: {
    wordmark: "/brand/wordmark.svg",
    icon: "/brand/icon.svg",
    openGraph: "/brand/og-placeholder.svg",
    heroArtwork: "/brand/hero-art.svg",
    collectionLoko: "/brand/collection-loko.svg",
    collectionDelas: "/brand/collection-delas.svg",
  },
  seo: {
    title: "Coringão Loko | Roupas com identidade old school",
    description:
      "Roupas e acessórios com identidade corinthiana e estética old school, criados de corinthiano para corinthiano.",
    canonicalUrl: optionalPublicValue(process.env.NEXT_PUBLIC_SITE_URL),
  },
  contact: {
    whatsappNumber: optionalPublicValue(
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    ),
    whatsappMessage:
      "Olá! Vim pelo site do Coringão Loko e gostaria de informações sobre os produtos.",
    whatsappUnavailableMessage:
      "O número oficial de atendimento ainda será configurado.",
  },
  social: {
    instagramUrl: optionalPublicValue(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    instagramUnavailableMessage:
      "O perfil oficial será adicionado antes do lançamento.",
  },
} as const;

export type BrandConfig = typeof brandConfig;
