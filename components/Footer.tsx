"use client";

import { ArrowUp, Instagram, MessageCircle } from "lucide-react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { brandConfig } from "@/config/brand";
import { content } from "@/content/pt-BR";
import { useCommerce } from "@/providers/CommerceProvider";

export function Footer() {
  const { openNotice } = useCommerce();

  function pendingPolicy(title: string) {
    openNotice({ title, message: content.footer.policyPending });
  }

  function unavailableService(title: string, message: string) {
    openNotice({ title, message });
  }

  return (
    <footer className="footer section-anchor" id="rodape">
      <div className="shell footer__grid">
        <div className="footer__brand">
          <a className="wordmark wordmark--footer" href="#inicio">
            <span>{brandConfig.name}</span><small>{brandConfig.signature}</small>
          </a>
          <p>{content.footer.tagline}</p>
          <p className="footer__legal">{brandConfig.legalNotice}</p>
        </div>
        <div>
          <h2>{content.footer.navigationTitle}</h2>
          <a href="#inicio">Início</a><a href="#produtos">Produtos</a><a href="#colecoes">Coleções</a><a href="#sobre">Sobre</a><a href="#faq">FAQ</a>
        </div>
        <div>
          <h2>{content.footer.categoriesTitle}</h2>
          <a href="#categorias">Camisetas</a><a href="#categorias">Moletons</a><a href="#categorias">Bandeiras</a><a href="#categorias">Adesivos</a>
        </div>
        <div>
          <h2>{content.footer.collectionsTitle}</h2>
          <a href="#colecoes">Coringão Loko</a><a href="#colecoes">Coringão Delas</a>
          <h2 className="footer__subheading">{content.footer.serviceTitle}</h2>
          <button type="button" onClick={() => unavailableService("WhatsApp em configuração", brandConfig.contact.whatsappUnavailableMessage)}><MessageCircle aria-hidden="true" /> WhatsApp</button>
          {brandConfig.social.instagramUrl ? (
            <a href={brandConfig.social.instagramUrl} target="_blank" rel="noreferrer"><Instagram aria-hidden="true" /> Instagram</a>
          ) : (
            <button type="button" onClick={() => unavailableService("Instagram em configuração", brandConfig.social.instagramUnavailableMessage)}><Instagram aria-hidden="true" /> Instagram</button>
          )}
        </div>
        <div>
          <h2>{content.footer.policiesTitle}</h2>
          <button type="button" onClick={() => pendingPolicy(content.footer.exchanges)}>{content.footer.exchanges}</button>
          <button type="button" onClick={() => pendingPolicy(content.footer.privacy)}>{content.footer.privacy}</button>
          <button type="button" onClick={() => pendingPolicy(content.footer.terms)}>{content.footer.terms}</button>
          <div className="footer__theme"><span>Tema</span><ThemeToggle /></div>
        </div>
      </div>
      <div className="shell footer__bottom">
        <p>{content.footer.demoNotice}</p>
        <a className="icon-button" href="#inicio" aria-label="Voltar ao início"><ArrowUp aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
