"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SectionHeading } from "@/components/ui/SectionHeading";

interface CollectionShowcaseProps {
  onSelect: (collection: string) => void;
}

const collections = [
  {
    title: "Coringão Loko",
    description: "Peças com identidade urbana, paixão de arquibancada e estética old school.",
    image: "/brand/collection-loko.svg",
    modifier: "collection-card--dark",
  },
  {
    title: "Coringão Delas",
    description: "Modelagens e peças da coleção Coringão Delas, com a mesma identidade da marca.",
    image: "/brand/collection-delas.svg",
    modifier: "collection-card--light",
  },
];

export function CollectionShowcase({ onSelect }: CollectionShowcaseProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section section-anchor collections" id="colecoes" aria-labelledby="collections-title">
      <div className="shell">
        <SectionHeading
          eyebrow="[02] Duas coleções, uma só paixão"
          title="ESCOLHA SEU LADO DA ARQUIBANCADA"
          description="A mesma assinatura visual em peças pensadas para diferentes estilos e modelagens."
        />
        <h2 className="sr-only" id="collections-title">Coleções</h2>
        <div className="collections__grid">
          {collections.map((collection, index) => (
            <motion.article
              className={`collection-card ${collection.modifier}`}
              key={collection.title}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <Image
                className="collection-card__image"
                src={collection.image}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                alt={`Arte demonstrativa da coleção ${collection.title}`}
              />
              <div className="collection-card__texture" aria-hidden="true" />
              <div className="collection-card__content">
                <span className="collection-card__number">0{index + 1}</span>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <button
                  className="button button--inverse"
                  type="button"
                  onClick={() => onSelect(collection.title)}
                >
                  Ver peças <ArrowUpRight aria-hidden="true" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
