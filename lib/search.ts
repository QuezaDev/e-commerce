import type { Product } from "@/types/product";

export function normalizeSearchTerm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function productMatchesQuery(product: Product, query: string) {
  const normalizedQuery = normalizeSearchTerm(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalizeSearchTerm(
    [product.name, product.category, product.collection, product.shortDescription].join(" "),
  ).includes(normalizedQuery);
}
