# CLAUDE.md — Vendas-JA (marca pública: NextLevel)

Contexto para o Claude (e para qualquer pessoa) que for trabalhar neste repositório.

## O que é este projeto

Site estático de venda de infoprodutos digitais (ebooks/cursos) em vários nichos, em **3 idiomas
(PT / EN / ES)**, publicado automaticamente pelo Netlify em `https://vendas-ja.netlify.app`
a cada push na `main`.

- **Marca pública: NextLevel.** "Vendas-JA" é só o nome interno do repositório/projeto —
  nunca deve aparecer para o cliente.
- **Idiomas:** cada página tem versões irmãs — `index.html` (PT), `index-en.html` (EN),
  `index-es.html` (ES) — com seletor de idioma no topo.
- Não há build, framework nem dependências — tudo é HTML estático.

## Estrutura e pontos únicos de edição

| Arquivo/pasta | O que é |
|---|---|
| `assets/config-global.js` | **Único lugar** do Pixel do Meta (`pixelId`) e do Firebase — vale pro site todo |
| `assets/produtos.js` | **Único lugar** do catálogo (títulos/resumos nos 3 idiomas, flag `disponivel`) |
| `index.html` / `-en` / `-es` | Página inicial (catálogo NextLevel), lê de `assets/produtos.js` |
| `landing-page/` | Template em branco (3 idiomas) — copiar pra criar produto novo |
| `produtos/<slug>/` | Página de vendas de cada produto (3 idiomas, `CONFIG` no topo de cada uma) |
| `ebooks/` | Gerador de ebook em PDF + `arquivos/` com os PDFs entregues (`<slug>-<idioma>.pdf`) |
| `anuncios/` | Templates de copy para Meta Ads (BR e internacional), com regras por nicho |
| `leads/painel-leads.html` | Painel de leads (login Google) com exportação CSV |
| `legal/` | Política de privacidade + termos de uso (3 idiomas) — exigidos pelo Meta Ads e LGPD |
| `assets/consent.js` | Banner de cookies (3 idiomas): o Pixel só liga depois que o visitante aceita |
| `emails/` | Conteúdo dos e-mails da sequência (3 × 3 idiomas, visual da marca) + `LEIA-ME-BREVO.md` |
| `netlify/functions/` | Automação de e-mail via API do Brevo: `lead-email` (e-mail 1 no cadastro), `sequencia-diaria` (e-mails 2 e 3, agendada 12h UTC), `descadastrar` (LGPD). Exige env var `BREVO_API_KEY` no Netlify |
| `404.html`, `sitemap.xml`, `robots.txt` | Página de erro, sitemap com hreflang e bloqueio de indexação de `/leads/` e `/ebooks/` |

Leads são salvos no Firebase (projeto `vendas-ja-99317`) com produto + idioma + UTMs.
Quem se cadastra recebe o ebook gratuito na hora, no idioma da página (campo
`linkEbookGratis` do `CONFIG`). O formulário tem honeypot anti-spam (campo `#lead-site`
escondido — robô que preenche é ignorado sem salvar).

As páginas de produto têm SEO/social prontos: favicon, Open Graph (imagem em
`assets/og-image.png`), canonical + hreflang gerados por JS a partir da própria URL.
As home pages têm as mesmas tags, estáticas.

## Catálogo atual (todos ainda `disponivel: false` = "Em breve")

`emagrecimento`, `ganho-de-massa` (Saúde) · `investimentos` (Finanças) ·
`confianca-social`, `comunicacao-e-relacionamentos` (Relacionamentos)

As 15 páginas de produto (5 × 3 idiomas) já estão com o `CONFIG` preenchido: headline,
benefícios, FAQ, preços (R$ 97→47 no PT; $37→$19 em EN/ES) e `linkEbookGratis` apontando
pro caminho convencionado dos PDFs. Falta em cada uma só o `linkCheckoutHotmart` real e o
upload dos PDFs em `ebooks/arquivos/`. Depoimentos estão vazios (`depoimentos: []`) e a
seção fica oculta automaticamente — **só preencher com depoimentos reais e autorizados;
inventar depoimento é vetado** (Meta Ads + CDC).

## Como fazer alterações comuns

- **Preço, headline, benefícios, FAQ, checkout Hotmart de um produto:** editar o `CONFIG` no
  topo de `produtos/<slug>/index*.html` (lembrar dos 3 idiomas).
- **Produto novo:** copiar `landing-page/` → `produtos/<slug>/`, preencher os `CONFIG`,
  adicionar o bloco em `assets/produtos.js`. Quando pronto pra vender, `disponivel: true`.
- **Publicar:** commit + push na `main` — o Netlify atualiza sozinho, sem deploy manual.

## Infraestrutura já concluída (julho/2026) — não refazer

- **Domínio próprio `nextlevelbr.app.br`** no ar (Registro.br + Netlify) e **verificado no
  Meta** (via registro TXT no DNS; a meta-tag também está no `index.html`). Todas as URLs
  do código já apontam pra ele. O `vendas-ja.netlify.app` continua servindo o mesmo site.
- **Pixel do Meta ativo** (ID em `assets/config-global.js`) e recebendo eventos.
  Conta de anúncios: `2104501427133123`, com método de pagamento cadastrado.
- **Firebase:** regras anti-spam publicadas; login do painel de leads é por **e-mail/senha**
  (usuário criado manualmente em Authentication → Users — NÃO é login Google; já foi e deu
  problema com popup/domínio).
- **Netlify:** a conta ("Valor Investimentos") estourou os créditos do plano free em jul/2026
  e os deploys pararam **silenciosamente** ("Skipped due to account credit usage exceeded" na
  aba Deploys). Créditos foram comprados. Se um push não aparecer no site, conferir isso
  ANTES de caçar bug no código.

## O que ainda falta (estado em julho/2026)

- **Produtos reais:** escrever/gerar os ebooks (`ebooks/gerador-ebook.html`), subir os PDFs
  em `ebooks/arquivos/` (`<slug>-<pt|en|es>.pdf`), cadastrar na Hotmart usando os textos de
  `CADASTRO-HOTMART.md` e colar o `linkCheckoutHotmart` em cada página, trocar `disponivel`
  para `true` no `assets/produtos.js`. **Nenhum produto foi escolhido pra sair primeiro.**
- ~~E-mail (Brevo)~~ ✅ **funcionando** (jul/2026): chave configurada no Netlify, envio
  testado. Diagnóstico em `/.netlify/functions/diagnostico`. Se mudar preço/nome de produto
  nas páginas, atualizar também `netlify/functions/lib/produtos-email.mjs`.
- **Remetente no domínio próprio (anti-spam):** os envios saem como `@outlook.com` e por
  isso tendem a cair no spam. Correção: criar `contato@nextlevelbr.app.br` (ImprovMX),
  verificar no Brevo e setar env var `EMAIL_REMETENTE` no Netlify — passo a passo na seção
  "Entregabilidade" do `emails/LEIA-ME-BREVO.md`.
- **Anúncios Meta Ads:** copy pronta por produto em `anuncios/prontos/` — publicar só quando
  o produto estiver vendável (checkout real + `disponivel: true`).

## Regras / decisões já tomadas (não contrariar)

- **Anúncios só via Meta Business Manager oficial, conta real única. NUNCA usar antidetect
  browser (Dolphin Anty etc.)** — risco de banimento permanente.
- **Nichos sensíveis:**
  - Emagrecimento / ganho de massa: sem promessa numérica ("perca X kg"), sem foto
    antes/depois, sem linguagem de vergonha corporal.
  - Investimentos: sem rentabilidade garantida ou específica.
  - Relacionamentos: confiança, comunicação e habilidades sociais — NUNCA manipulação.
  - (É a linha ética do projeto e também o que passa nas políticas de anúncio do Meta.)
- **Não commitar senhas/tokens.** As chaves do Firebase em `config-global.js` são config
  pública de cliente — a segurança vem das regras do Realtime Database.

## Configuração manual pendente de contas de terceiros

Ver `CHECKLIST-CONFIGURACAO.md` (Hotmart já tem conta de produtor; Firebase e Netlify já
configurados e funcionando).
