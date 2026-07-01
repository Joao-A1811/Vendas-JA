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

As páginas de produto ainda têm `{{placeholders}}` no `CONFIG`, aguardando conteúdo real.

## Como fazer alterações comuns

- **Preço, headline, benefícios, FAQ, checkout Hotmart de um produto:** editar o `CONFIG` no
  topo de `produtos/<slug>/index*.html` (lembrar dos 3 idiomas).
- **Produto novo:** copiar `landing-page/` → `produtos/<slug>/`, preencher os `CONFIG`,
  adicionar o bloco em `assets/produtos.js`. Quando pronto pra vender, `disponivel: true`.
- **Publicar:** commit + push na `main` — o Netlify atualiza sozinho, sem deploy manual.

## O que ainda falta (estado em julho/2026)

- **Pixel do Meta:** criar no Events Manager (tela estava travando) e colar o ID em
  `assets/config-global.js`.
- **E-mail de contato:** colar em `emailContato` no `assets/config-global.js` (aparece nas
  páginas legais; exigência LGPD).
- **Regras novas do Firebase:** colar a versão anti-spam do `CHECKLIST-CONFIGURACAO.md`
  (seção 1, passo 5) no console do Firebase.
- **Produtos reais:** gerar os ebooks (`ebooks/gerador-ebook.html`), preencher os `CONFIG`,
  colocar os PDFs em `ebooks/arquivos/`, trocar `disponivel` para `true`.
- **E-mail (Brevo):** sequência por idioma quando os ebooks existirem.
- **Anúncios Meta Ads:** usar os templates de `anuncios/`.

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
