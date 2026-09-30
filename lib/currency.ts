import { brandConfig } from "@/config/brand";

const currencyFormatter = new Intl.NumberFormat(brandConfig.locale, {
  style: "currency",
  currency: brandConfig.currency,
});

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(value);
}

/**
 * Prévia visual para os cards. Não representa condição real de pagamento.
 * Substitua a regra ao integrar o provedor de checkout.
 */
export function formatDemoInstallment(value: number, installments = 3): string {
  const safeInstallments = Math.max(1, Math.trunc(installments));
  const installmentValue = value / safeInstallments;

  return `${safeInstallments}x de ${formatCurrency(installmentValue)} (simulação)`;
}

