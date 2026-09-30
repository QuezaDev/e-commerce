"use client";

import { Flag, Layers3, Shirt, Sticker, X } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";

interface CategoryFilterProps {
  active: string | null;
  onChange: (filter: string | null) => void;
}

const filters = [
  { label: "Camisetas", icon: Shirt },
  { label: "Moletons", icon: Layers3 },
  { label: "Bandeiras", icon: Flag },
  { label: "Adesivos", icon: Sticker },
  { label: "Coringão Loko", icon: Shirt },
  { label: "Coringão Delas", icon: Shirt },
];

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <section className="section section-anchor categories" id="categorias" aria-labelledby="categories-title">
      <div className="shell">
        <SectionHeading
          eyebrow="[04] Encontre do seu jeito"
          title="VÁ DIRETO AO QUE INTERESSA"
          description="Filtre a seleção sem sair da página. O resultado aparece nos produtos acima."
        />
        <h2 className="sr-only" id="categories-title">Categorias</h2>
        <div className="category-grid" role="group" aria-label="Filtrar produtos">
          {filters.map(({ label, icon: Icon }, index) => (
            <button
              className={`category-button${active === label ? " category-button--active" : ""}`}
              type="button"
              key={label}
              aria-pressed={active === label}
              onClick={() => onChange(active === label ? null : label)}
            >
              <span>0{index + 1}</span>
              <Icon aria-hidden="true" />
              <strong>{label}</strong>
            </button>
          ))}
        </div>
        {active ? (
          <button className="button button--outline filter-clear" type="button" onClick={() => onChange(null)}>
            <X aria-hidden="true" /> Remover filtro “{active}”
          </button>
        ) : null}
      </div>
    </section>
  );
}
