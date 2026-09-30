"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/content/pt-BR";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section section-anchor faq" id="faq" aria-labelledby="faq-title">
      <div className="shell faq__layout">
        <div>
          <SectionHeading eyebrow={`[11] ${content.faq.eyebrow}`} title={content.faq.title} />
          <p className="faq__aside">Ainda ficou alguma dúvida? O atendimento será configurado antes do lançamento.</p>
        </div>
        <div className="faq-list">
          {content.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <article className="faq-item" key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span><small>{String(index + 1).padStart(2, "0")}</small>{item.question}</span>
                    {isOpen ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
                  </button>
                </h3>
                <div className="faq-item__panel" id={panelId} hidden={!isOpen}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
