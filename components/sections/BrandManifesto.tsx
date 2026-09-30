import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { brandConfig } from "@/config/brand";
import { content } from "@/content/pt-BR";

export function BrandManifesto() {
  return (
    <section className="manifesto section-anchor" id="sobre" aria-labelledby="manifesto-title">
      <div className="manifesto__grid shell">
        <Reveal className="manifesto__art">
          <Image
            src={brandConfig.assets.heroArtwork}
            alt="Composição demonstrativa abstrata inspirada em flash tattoo e cultura urbana"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
          />
          <span aria-hidden="true">NEVER<br />SURRENDER</span>
        </Reveal>
        <Reveal className="manifesto__copy" delay={0.08}>
          <p className="editorial-kicker">[07] {content.manifesto.eyebrow}</p>
          <h2 id="manifesto-title">{content.manifesto.title}</h2>
          <p className="manifesto__body">{content.manifesto.body}</p>
          <blockquote>“A roupa como extensão da pele. A paixão como ponto de encontro.”</blockquote>
          <p className="manifesto__legal">{brandConfig.legalNotice}</p>
        </Reveal>
      </div>
    </section>
  );
}
