import {
  Box,
  CircleDollarSign,
  CreditCard,
  MapPin,
  MessageCircle,
  PackageSearch,
  Ruler,
  Truck,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/content/pt-BR";

const icons = [CreditCard, CircleDollarSign, PackageSearch, Truck, MapPin, MessageCircle, Ruler, Box];

export function TrustBenefits() {
  return (
    <section className="section section-anchor trust" id="beneficios" aria-labelledby="trust-title">
      <div className="shell">
        <SectionHeading
          eyebrow={`[10] ${content.trust.eyebrow}`}
          title={content.trust.title}
          description={content.trust.pendingNotice}
          align="center"
        />
        <h2 className="sr-only" id="trust-title">Benefícios e informações de confiança</h2>
        <ul className="trust-grid">
          {content.trust.items.map((item, index) => {
            const Icon = icons[index];
            return <li key={item}><Icon aria-hidden="true" /><span>{item}</span></li>;
          })}
        </ul>
      </div>
    </section>
  );
}
