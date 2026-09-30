"use client";

import { ArrowUpRight, Instagram } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { brandConfig } from "@/config/brand";
import { content } from "@/content/pt-BR";
import { useCommerce } from "@/providers/CommerceProvider";

export function SocialShowcase() {
  const { openNotice } = useCommerce();

  const socialAction = brandConfig.social.instagramUrl ? (
    <a
      className="button button--outline"
      href={brandConfig.social.instagramUrl}
      target="_blank"
      rel="noreferrer"
    >
      <Instagram aria-hidden="true" /> {content.social.action} <ArrowUpRight aria-hidden="true" />
    </a>
  ) : (
    <button
      className="button button--outline"
      type="button"
      onClick={() => openNotice({
        title: "Instagram em configuração",
        message: brandConfig.social.instagramUnavailableMessage,
      })}
    >
      <Instagram aria-hidden="true" /> {content.social.action}
    </button>
  );

  return (
    <section className="section section-anchor social" id="social" aria-labelledby="social-title">
      <div className="shell">
        <div className="social__header">
          <SectionHeading
            eyebrow={`[09] ${content.social.eyebrow}`}
            title={content.social.title}
            description={content.social.description}
          />
          {socialAction}
        </div>
        <h2 className="sr-only" id="social-title">Conteúdo social demonstrativo</h2>
        <div className="social-grid">
          {content.social.cards.map((card, index) => (
            <article className={`social-card social-card--${index + 1}`} key={card.title}>
              <Image src={card.image} alt={card.alt} fill sizes="(max-width: 767px) 100vw, 40vw" />
              <div className="social-card__caption">
                <span>0{index + 1}</span>
                <div><h3>{card.title}</h3><p>{card.description}</p></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
