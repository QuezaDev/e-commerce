# Coringão Loko — homepage demonstrativa

Homepage responsiva do e-commerce **Coringão Loko — by Never Surrender Tattoo**, construída com Next.js App Router, TypeScript, Tailwind CSS, Motion e Lucide. A experiência é inteiramente front-end nesta etapa: não há checkout, autenticação, estoque ou integração de rastreamento reais.

## Executar localmente

Pré-requisitos: Node.js 20 ou superior e pnpm.

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

Verificações disponíveis:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Onde editar

- Produtos, preços, prazos, status e referências de imagens: `data/products.ts`.
- Tipos de produto e estados permitidos: `types/product.ts`.
- Textos em português do Brasil: `content/pt-BR.ts`.
- Nome, aviso de marca independente, locale, moeda, SEO e contatos: `config/brand.ts`.
- Imagens demonstrativas de produtos: `public/products/`.
- Artes institucionais e Open Graph: `public/brand/`.
- Conteúdo social demonstrativo: `public/social/`.
- Paleta, tipografia, espaçamentos, raios, elevação e breakpoints: `app/globals.css`, no bloco de tokens no início do arquivo.

Todos os SVGs são placeholders originais e monocromáticos. Substitua os arquivos preservando os mesmos caminhos ou atualize as referências centralizadas. Não há escudo, patrocinador ou arte oficial do clube nesta versão.

## Configuração por ambiente

Copie `.env.example` para `.env.local` e preencha apenas dados oficiais confirmados:

```dotenv
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEMO_MODE=true
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: DDI + DDD + número, somente dígitos. Se vazio, o botão informa que a configuração está pendente.
- `NEXT_PUBLIC_INSTAGRAM_URL`: URL oficial completa. Se vazia, nenhum endereço fictício é aberto.
- `NEXT_PUBLIC_SITE_URL`: origem pública usada no canonical e metadados.
- `NEXT_PUBLIC_DEMO_MODE`: mantenha `true` durante o desenvolvimento.

## Como sair do modo demonstrativo

O modo demonstrativo só deve ser desativado depois de:

1. substituir produtos, imagens, valores, disponibilidade e prazos pelos dados comerciais validados;
2. publicar políticas reais de troca, devolução, privacidade e termos;
3. configurar URLs e telefone oficiais;
4. integrar checkout, estoque, frete e rastreamento reais;
5. revisar textos legais e a observação de marca independente;
6. executar novamente lint, typecheck, build e a revisão de acessibilidade.

Depois dessas etapas, defina `NEXT_PUBLIC_DEMO_MODE=false`. Essa variável centraliza o estado do projeto, mas não transforma integrações simuladas em integrações reais.

## Funcionalidades locais nesta versão

- tema claro/escuro com preferência do sistema e persistência;
- menu mobile, busca local, filtros e carrossel por toque, arraste e teclado;
- favoritos e carrinho persistidos no `localStorage`;
- seleção de tamanho e cor, quantidade, subtotal e feedback acessível;
- quiz de recomendação com dados locais;
- rastreamento demonstrativo com o código `DEMO123`;
- formulário demonstrativo de aviso de reposição;
- FAQ acessível, modais/drawers com controle de foco e suporte a redução de movimento.

## Integrações ainda simuladas

- checkout e pagamentos;
- estoque e prazos comerciais definitivos;
- emissão fiscal, frete, logística e rastreamento;
- autenticação e conta do cliente;
- captura de e-mail do aviso de reposição;
- Instagram e WhatsApp enquanto as variáveis oficiais estiverem vazias;
- políticas e retirada no estúdio.

Nenhum formulário desta versão deve ser usado para coletar dados reais. Os próximos passos recomendados são conectar catálogo/estoque, criar páginas de produto e categoria, validar as políticas comerciais e integrar um checkout real sem exigir cadastro prévio.
