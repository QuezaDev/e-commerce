import { ArrowDownRight } from "lucide-react";

import { content } from "@/content/pt-BR";

export function PromotionSection() {
  return (
    <section className="promotion section-anchor" id="nova-remessa" aria-labelledby="promotion-title">
      <div className="promotion__ticker" aria-hidden="true">
        <span>NOVA REMESSA / NOVA REMESSA / NOVA REMESSA /</span>
      </div>
      <div className="promotion__inner shell">
        <p className="editorial-kicker">[05] {content.promotion.eyebrow}</p>
        <h2 id="promotion-title">{content.promotion.title}</h2>
        <p>{content.promotion.description}</p>
        <a className="button button--inverse" href="#produtos">
          {content.promotion.action} <ArrowDownRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
