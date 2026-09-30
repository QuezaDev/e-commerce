"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/content/pt-BR";
import { products } from "@/data/products";

interface RecommendationQuizProps {
  onRecommend: (productIds: string[]) => void;
}

type Answers = {
  productType?: string;
  collection?: string;
  availability?: string;
};

const questions = [
  { key: "productType" as const, ...content.quiz.questions.productType },
  { key: "collection" as const, ...content.quiz.questions.collection },
  { key: "availability" as const, ...content.quiz.questions.availability },
];

export function RecommendationQuiz({ onRecommend }: RecommendationQuizProps) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [complete, setComplete] = useState(false);

  const matches = useMemo(() => {
    if (!complete) return [];
    return products.filter((product) => {
      const productTypeMatches =
        answers.productType === "Camiseta"
          ? product.category === "Camisetas"
          : answers.productType === "Moletom"
            ? product.category === "Moletons"
            : product.category === "Bandeiras" || product.category === "Adesivos";
      const collectionMatches =
        answers.collection === "Quero ver todas" || product.collection === answers.collection;
      const availabilityMatches =
        answers.availability === "Tanto faz" ||
        (answers.availability === "Pronta entrega" &&
          (product.productionStatus === "Pronta entrega" || product.productionStatus === "Últimas unidades")) ||
        (answers.availability === "Sob demanda" &&
          (product.productionStatus === "Produção sob demanda" ||
            product.productionStatus === "Nova remessa em produção"));
      return productTypeMatches && collectionMatches && availabilityMatches;
    });
  }, [answers, complete]);

  function choose(value: string) {
    const question = questions[step];
    setAnswers((current) => ({ ...current, [question.key]: value }));
  }

  function next() {
    if (!answers[questions[step].key]) return;
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
    } else {
      setComplete(true);
    }
  }

  function reset() {
    setStarted(true);
    setStep(0);
    setAnswers({});
    setComplete(false);
  }

  return (
    <section className="section section-anchor quiz-section" id="quiz" aria-labelledby="quiz-title">
      <div className="shell quiz-layout">
        <div>
          <SectionHeading
            eyebrow={`[08] ${content.quiz.eyebrow}`}
            title={content.quiz.title}
            description={content.quiz.description}
          />
          <p className="quiz-layout__aside">Sem cadastro. Sem resposta certa. Só uma seleção mais direta.</p>
        </div>

        <div className="quiz-panel">
          {!started ? (
            <div className="quiz-panel__intro">
              <span className="quiz-panel__mark" aria-hidden="true">?</span>
              <h3>Vamos achar sua próxima peça?</h3>
              <p>São três escolhas rápidas usando apenas os produtos desta demonstração.</p>
              <button className="button button--inverse" type="button" onClick={() => setStarted(true)}>
                {content.quiz.start} <ArrowRight aria-hidden="true" />
              </button>
            </div>
          ) : complete ? (
            <div className="quiz-results" aria-live="polite">
              <p className="quiz-progress">Resultado / {matches.length} {matches.length === 1 ? "peça" : "peças"}</p>
              <h3>Sua seleção está pronta.</h3>
              {matches.length > 0 ? (
                <ul className="quiz-results__list">
                  {matches.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      <div className="quiz-result__image">
                        <Image src={product.images[0]} alt="" fill sizes="72px" />
                      </div>
                      <div><strong>{product.name}</strong><span>{product.productionStatus}</span></div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{content.quiz.noResults}</p>
              )}
              <div className="quiz-panel__actions">
                {matches.length > 0 ? (
                  <button
                    className="button button--inverse"
                    type="button"
                    onClick={() => {
                      onRecommend(matches.map((product) => product.id));
                      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {content.quiz.goToProducts} <ArrowRight aria-hidden="true" />
                  </button>
                ) : null}
                <button className="button button--ghost-inverse" type="button" onClick={reset}>
                  <RotateCcw aria-hidden="true" /> {content.quiz.restart}
                </button>
              </div>
            </div>
          ) : (
            <div className="quiz-question">
              <div className="quiz-progress" aria-label={`Pergunta ${step + 1} de ${questions.length}`}>
                {questions.map((question, index) => (
                  <span key={question.key} className={index <= step ? "is-current" : ""} aria-hidden="true" />
                ))}
                <strong>{step + 1} / {questions.length}</strong>
              </div>
              <fieldset>
                <legend>{questions[step].label}</legend>
                <div className="quiz-options">
                  {questions[step].options.map((option) => (
                    <button
                      key={option}
                      className={answers[questions[step].key] === option ? "quiz-option quiz-option--selected" : "quiz-option"}
                      type="button"
                      aria-pressed={answers[questions[step].key] === option}
                      onClick={() => choose(option)}
                    >
                      <span aria-hidden="true" /> {option}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="quiz-panel__actions">
                {step > 0 ? (
                  <button className="button button--ghost-inverse" type="button" onClick={() => setStep((current) => current - 1)}>
                    Voltar
                  </button>
                ) : null}
                <button
                  className="button button--inverse"
                  type="button"
                  disabled={!answers[questions[step].key]}
                  onClick={next}
                >
                  {step === questions.length - 1 ? content.quiz.seeResults : "Continuar"}
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
