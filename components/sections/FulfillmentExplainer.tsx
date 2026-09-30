import { AlertCircle, Clock3, PackageCheck } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/content/pt-BR";

const icons = [PackageCheck, Clock3, AlertCircle];

export function FulfillmentExplainer() {
  return (
    <section className="section section-anchor fulfillment" id="prazos" aria-labelledby="fulfillment-title">
      <div className="shell">
        <SectionHeading
          eyebrow={`[06] ${content.fulfillment.eyebrow}`}
          title={content.fulfillment.title}
          description="O status e o prazo pertencem a cada peça — sem promessas genéricas."
        />
        <h2 className="sr-only" id="fulfillment-title">Disponibilidade dos produtos</h2>
        <div className="fulfillment__grid">
          {content.fulfillment.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item.title} delay={index * 0.06} className="fulfillment-card">
                <span className="fulfillment-card__index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
