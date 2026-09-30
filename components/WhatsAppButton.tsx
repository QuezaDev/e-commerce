"use client";

import { MessageCircle } from "lucide-react";

import { brandConfig } from "@/config/brand";
import { useCommerce } from "@/providers/CommerceProvider";

export function WhatsAppButton() {
  const { openNotice } = useCommerce();
  const number = brandConfig.contact.whatsappNumber?.replace(/\D/g, "");

  if (number) {
    const href = `https://wa.me/${number}?text=${encodeURIComponent(brandConfig.contact.whatsappMessage)}`;
    return (
      <a className="whatsapp-button" href={href} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" /><span>Atendimento</span>
      </a>
    );
  }

  return (
    <button
      className="whatsapp-button"
      type="button"
      onClick={() => openNotice({
        title: "WhatsApp em configuração",
        message: brandConfig.contact.whatsappUnavailableMessage,
      })}
    >
      <MessageCircle aria-hidden="true" /><span>Atendimento</span>
    </button>
  );
}
