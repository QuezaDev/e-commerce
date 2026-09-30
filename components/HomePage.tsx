"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CommerceOverlays } from "@/components/overlays/CommerceOverlays";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { BrandManifesto } from "@/components/sections/BrandManifesto";
import { CategoryFilter } from "@/components/sections/CategoryFilter";
import { CollectionShowcase } from "@/components/sections/CollectionShowcase";
import { FAQ } from "@/components/sections/FAQ";
import { FulfillmentExplainer } from "@/components/sections/FulfillmentExplainer";
import { Hero } from "@/components/sections/Hero";
import { PromotionSection } from "@/components/sections/PromotionSection";
import { RecommendationQuiz } from "@/components/sections/RecommendationQuiz";
import { SocialShowcase } from "@/components/sections/SocialShowcase";
import { TrustBenefits } from "@/components/sections/TrustBenefits";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/content/pt-BR";
import { featuredProducts, products } from "@/data/products";

export function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [quizProductIds, setQuizProductIds] = useState<string[] | null>(null);

  const visibleProducts = useMemo(() => {
    if (quizProductIds) {
      const idSet = new Set(quizProductIds);
      return products.filter((product) => idSet.has(product.id));
    }
    if (activeFilter) {
      return products.filter(
        (product) => product.category === activeFilter || product.collection === activeFilter,
      );
    }
    return featuredProducts;
  }, [activeFilter, quizProductIds]);

  function scrollToProducts() {
    window.setTimeout(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("produtos")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleFilter(filter: string | null) {
    setQuizProductIds(null);
    setActiveFilter(filter);
    scrollToProducts();
  }

  function handleRecommendations(ids: string[]) {
    setActiveFilter(null);
    setQuizProductIds(ids);
  }

  const selectionLabel = quizProductIds
    ? "Recomendações do quiz"
    : activeFilter
      ? `Filtro: ${activeFilter}`
      : "Mais vendidos";

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="conteudo-principal">
        <Hero />
        <CollectionShowcase onSelect={handleFilter} />

        <section className="section section-anchor products-section" id="produtos" aria-labelledby="products-title">
          <div className="shell">
            <div className="products-section__header">
              <SectionHeading
                eyebrow={`[03] ${content.products.eyebrow}`}
                title={quizProductIds ? "FEITO PARA AS SUAS ESCOLHAS" : activeFilter ? `PEÇAS / ${activeFilter}` : "MAIS VENDIDOS"}
                description={content.products.description}
              />
              {(activeFilter || quizProductIds) ? (
                <button
                  className="button button--outline selection-reset"
                  type="button"
                  onClick={() => {
                    setActiveFilter(null);
                    setQuizProductIds(null);
                  }}
                >
                  <X aria-hidden="true" /> Ver seleção inicial
                </button>
              ) : null}
            </div>
            <h2 className="sr-only" id="products-title">{selectionLabel}</h2>
            <ProductCarousel products={visibleProducts} label={selectionLabel} />
            <p className="products-section__demo-note">{content.products.demoPriceNotice}</p>
          </div>
        </section>

        <CategoryFilter active={activeFilter} onChange={handleFilter} />
        <PromotionSection />
        <FulfillmentExplainer />
        <BrandManifesto />
        <RecommendationQuiz onRecommend={handleRecommendations} />
        <SocialShowcase />
        <TrustBenefits />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
      <CommerceOverlays />
    </>
  );
}
