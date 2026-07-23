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
- **Identidade visual (jul/2026): tema escuro "dark premium"** — navy `#0d1b2a` + teal `#14b8a6`/`#5eead4`
  + âmbar `#f59e0b` nos CTAs, a mesma paleta das capas dos ebooks. O site todo usa esse tema:
  a home e as páginas de categorias têm CSS próprio já escuro; páginas de produto, legais e o
  template `landing-page/` carregam um bloco `/* ===== Tema escuro NextLevel ===== */` no FIM do
  `<style>` que sobrescreve a paleta clara antiga (não remover — produto novo copiado do template
  já vem com ele). Cada produto tem miniatura de capa `assets/produtos/<slug>/thumb-<idioma>.jpg`
  (400px, ~20-25 KB) usada na home — gerar junto com a galeria ao criar produto novo.

## Estrutura e pontos únicos de edição

| Arquivo/pasta | O que é |
|---|---|
| `assets/config-global.js` | **Único lugar** do Pixel do Meta (`pixelId`), do Google Analytics 4 (`gaId`, `assets/ga4.js` — inativo enquanto for `COLE_AQUI`, sem efeito nenhum), do Firebase **e do preço padrão do site** (`window.PRECOS_SITE` — home, páginas de produto e template leem daqui) — vale pro site todo |
| `assets/produtos.js` | **Único lugar** do catálogo (títulos/resumos nos 3 idiomas, flag `disponivel`, campo `categoria` + metadados `CATEGORIAS_SITE`) |
| `index.html` / `-en` / `-es` | Página inicial (redesign dark premium, jul/2026): catálogo completo com capas (`thumb-<idioma>.jpg`), busca em tempo real, filtro por categoria, selo "NOVO" automático (último de `PRODUTOS_SITE`), seção "Como funciona", faixa de confiança, captura de lead (select de objetivo, uma opção por categoria → entrega o ebook gratuito de `treino-em-casa` [saúde], `confianca-social` [relacionamentos], `financas-pessoais` [finanças] ou `ia-aplicada` [IA e produtividade] e dispara a mesma automação `lead-email` dos produtos) e JSON-LD ItemList |
| `categorias/` | Página "Explore por categoria" (3 idiomas): os chips FILTRAM os produtos — chegando com `#<categoria>` na URL (como os cards da home linkam) só aparece aquela categoria; "✨ Todos os guias" mostra tudo. Tem busca por texto (ignora acentos, atravessa as categorias) e JSON-LD ItemList. Categoria sem produto listado não aparece. O header de toda página de produto tem link "Categorias" ao lado do seletor de idiomas |
| `landing-page/` | Template em branco (3 idiomas) — copiar pra criar produto novo |
| `produtos/<slug>/` | Página de vendas de cada produto (3 idiomas, `CONFIG` no topo de cada uma) |
| `ebooks/` | Gerador de ebook em PDF + `arquivos/` com os PDFs entregues (`<slug>-<idioma>.pdf`) |
| `anuncios/` | Copy pra Meta Ads: `prontos/` (por produto), `categorias/` (por categoria, estratégia de isca grátis → sequência de e-mail vende), com regras por nicho |
| `leads/painel-leads.html` | Painel de leads (login e-mail/senha) com exportação CSV + **moderação de avaliações** (aprovar como "compra verificada"/"recebeu grátis" ou recusar — nada vai pro site sem aprovação) |
| `legal/` | Política de privacidade + termos de uso (3 idiomas) — exigidos pelo Meta Ads e LGPD |
| `assets/consent.js` | Banner de cookies (3 idiomas): o Pixel só liga depois que o visitante aceita |
| `emails/` | Conteúdo dos e-mails da sequência (3 × 3 idiomas, visual da marca) + `LEIA-ME-BREVO.md` |
| `netlify/functions/` | Automação de e-mail via API do Brevo: `lead-email` (e-mail 1 no cadastro + eco do evento pra Meta Conversions API + limite anti-abuso), `sequencia-diaria` (e-mails 2 e 3, agendada 12h UTC), `descadastrar` (LGPD). Exige env var `BREVO_API_KEY`; `META_ACCESS_TOKEN` já configurada (Conversions API ligada desde jul/2026). `hotmart-webhook` (✅ configurado e validado com evento real, ver CHECKLIST-CONFIGURACAO.md § 3a): recebe o aviso de compra aprovada da Hotmart (token no header `X-Hotmart-Hottok`), ecoa um evento "Purchase" pra CAPI **e pro GA4** (`lib/ga4-mp.mjs`, Measurement Protocol — exige env var `GA4_API_SECRET`, ver CHECKLIST § 4f; sem ela é no-op) e agenda no Brevo (~2 dias) o e-mail pedindo avaliação do produto (`lib/avaliacao-email.mjs`) — exige env var `HOTMART_HOTTOK` |
| `404.html`, `sitemap.xml`, `robots.txt` | Página de erro, sitemap com hreflang e bloqueio de indexação de `/leads/` e `/ebooks/` |
| `netlify.toml` | Além do build, define os cabeçalhos de segurança (CSP, X-Frame-Options etc.) pro site todo |

Leads são salvos no Firebase (projeto `vendas-ja-99317`) com produto + idioma + UTMs.
Quem se cadastra recebe o ebook gratuito na hora, no idioma da página (campo
`linkEbookGratis` do `CONFIG`; `financas-pessoais` entrega TAMBÉM uma planilha de controle de gastos via campo opcional `linkPlanilhaGratis` — isca dupla usada nos anúncios da categoria finanças). O formulário tem honeypot anti-spam (campo `#lead-site`
escondido — robô que preenche é ignorado sem salvar).

As páginas de produto têm SEO/social prontos: favicon, Open Graph com **imagem própria por
produto/idioma** (`assets/produtos/<slug>/og-<pt|en|es>.jpg`, 1200×630, gerada a partir da capa
do guia — ao criar produto novo, gerar junto com a galeria), canonical + hreflang gerados por JS
a partir da própria URL. As home pages têm as mesmas tags, estáticas (imagem genérica
`assets/og-image*.png`). **O Pixel do Meta (com banner de consentimento) roda em TODAS as
páginas**: produto, home e `/categorias/` — as duas últimas só PageView, sem Firebase.

## Catálogo atual

> ⚠️ **Preço padrão da coleção reduzido em jul/2026 — inclusive o "de" (âncora):** o site agora
> mostra **de R$ 49,99 por R$ 19,99 (PT)** e **de US$ 19,99 por US$ 4,99 (EN/ES)** (antes era de
> R$ 97,00/US$ 97,00 por R$ 49,99/US$ 19,00). **Desde jul/2026 o preço é centralizado em
> `assets/config-global.js` (`window.PRECOS_SITE`)** — home, as 90 páginas de produto e o template
> `landing-page/` leem de lá (o `CONFIG` das páginas referencia `window.PRECOS_SITE.<idioma>`, sem
> valor copiado); os e-mails leem do default `PRECOS` em `produtos-email.mjs`. Mudança de preço =
> editar esses 2 arquivos (+ Hotmart), nada de busca-e-troca em 90 páginas. **Pendência do
> lado do dono do projeto:** o valor exibido no site é só o texto da página — quem define o
> valor realmente cobrado é o preço cadastrado em cada oferta na Hotmart (30 produtos × até 3
> moedas). **Enquanto o preço não for atualizado lá também, o site vai anunciar um valor e a
> Hotmart vai cobrar outro** — risco de propaganda enganosa (CDC) e de carrinho abandonado no
> checkout. Trocar em Hotmart → Produtos → cada produto → Ofertas → editar o valor de cada
> moeda.

**Por decisão do dono do projeto (jul/2026), `assets/produtos.js` só lista produtos que JÁ
estão sendo vendidos de verdade** (checkout Hotmart real em pelo menos uma moeda) — hoje são
`treino-em-casa`, `suplementacao-inteligente`, `receitas-fitness`, `desafio-30-dias`,
`emagrecimento`, `ganho-de-massa`, `treino-academia`, `mentalidade-ansiedade-habitos`,
`mobilidade-alongamento-prevencao`, `confianca-social`, `carisma-humor-storytelling`,
`comunicacao-e-relacionamentos`, `atracao-com-respeito`, `presenca-social`,
`etfs-investimento-global`, `fiis-do-zero`, `financas-pessoais`,
`imposto-de-renda-investidores`, `investimentos`, `psicologia-do-investidor` (28º produto),
`renda-fixa-inteligente` (29º produto), `seguranca-financeira-e-golpes` (30º produto),
`dividendos-e-renda-passiva` (31º produto), `ia-para-profissoes` (32º produto — primeiro fora
das categorias Saúde/Relacionamentos/Finanças, abrindo a vertente "IA e Produtividade"),
`produtividade-com-ia` (33º produto, segundo da mesma vertente), `ia-para-negocios-pequenos`
(34º produto, terceiro da mesma vertente) e `ia-aplicada` (35º produto, quarto da mesma
vertente). Depoimentos
ficam vazios (`depoimentos: []`, seção some sozinha) até existir depoimento real e autorizado —
**inventar depoimento é vetado** (Meta Ads + CDC). Em jul/2026 o dono do projeto enviou 3 versões
de uma planilha com milhares de "avaliações" geradas artificialmente (a 1ª declarava-se sintética
na própria aba Leia-me) pedindo publicação — **recusado e não deve ser aceito em pedidos futuros**.
No lugar, existe o **sistema de avaliações reais com moderação** (`assets/avaliacoes.js` +
formulário em toda página de produto + fila `avaliacoes-pendentes` no Firebase + aprovação no
painel de leads + e-mail pós-compra automático pedindo avaliação): nada aparece no site sem
aprovação manual, e cada avaliação publicada leva etiqueta honesta de origem ("compra
verificada" ou "recebeu o material gratuitamente"). Regras do Firebase necessárias em
CHECKLIST-CONFIGURACAO.md § 1a (pendentes de publicação pelo dono).

**`treino-em-casa` (jul/2026, 6º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** CONFIG completo, ebooks gratuitos (isca, 7 páginas cada) em
`ebooks/arquivos/treino-em-casa-<pt|en|es>.pdf`, galeria "olhe por dentro" com 5 páginas de
amostra do manual em `assets/produtos/treino-em-casa/` (3 idiomas). Checkout real nas 3
moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/S106595121K` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/F106595630M` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/V106595694E` (US$ 4,99)

**`suplementacao-inteligente` (jul/2026, 7º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos
3 idiomas.** Guia pago de 50 páginas + ebook gratuito (isca, 7 páginas) nos 3 idiomas,
`ebooks/arquivos/suplementacao-inteligente-<pt|en|es>.pdf`. Ainda sem galeria "olhe por dentro"
(nenhum preview gerado pra este produto). Preço final definido pelo dono do projeto: **R$ 19,99
(PT) / US$ 4,99 (EN/ES)** — já salvo nas 3 páginas e em `produtos-email.mjs`. Checkout real nas
3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/T106596501Y` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/L106596626U` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/K106596585A` (US$ 4,99)

O produto EN tinha sido barrado pela Hotmart num primeiro momento (moderação reprovou por
"non-compliance", suspeita de a palavra "steroids" na descrição ter disparado filtro
automático). O dono do projeto reenviou **a versão antiga (sem alteração) e ela foi aceita** —
ou seja, a reprovação inicial não teve a ver com essa palavra especificamente (pode ter sido
falha pontual de moderação, ou outro campo do cadastro). A descrição revisada e o e-book EN sem
a palavra "steroids" continuam disponíveis em `CADASTRO-HOTMART.md` seção 7 como alternativa
mais conservadora, mas não foram necessários desta vez.

**`receitas-fitness` (jul/2026, 8º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Guia pago de 43 páginas (50+ receitas, cardápios por objetivo, sistema de meal prep
3-2-1, cronograma de 30 dias) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/receitas-fitness-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas de
amostra em `assets/produtos/receitas-fitness/` (3 idiomas). Preço padrão da coleção: **R$ 19,99
(PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/N106607533X` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/P106607574X` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/U106607614K` (US$ 4,99)

**`desafio-30-dias` (jul/2026, 9º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Guia pago de 36 páginas (sistema de pontuação semanal, treinos A/B/C com cardio e
mobilidade, cardápios flexíveis, protocolo anti-impulso, cronograma de 30 dias condensado em 4
páginas semanais, planner e plano de continuidade de 90 dias) + ebook gratuito (isca, 6
páginas) nos 3 idiomas, `ebooks/arquivos/desafio-30-dias-<pt|en|es>.pdf`. Galeria "olhe por
dentro" com 5 páginas de amostra em `assets/produtos/desafio-30-dias/` (3 idiomas). Preço padrão
da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel:
true`:
- PT/BRL: `https://pay.hotmart.com/L106608497Y` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/A106608536W` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/N106608560T` (US$ 4,99)

**`emagrecimento` (jul/2026, 10º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Reaproveitou o slug/pasta que já existia como rascunho (nicho sensível — ver regras
abaixo). Guia pago de 40 páginas (prato inteligente, método das mãos, cardápio flexível de 14
dias, treinos A/B com progressão de 4 semanas, protocolo P.A.U.S.A. contra a fome emocional,
plano de 30 dias, caderno de execução com planners) + ebook gratuito (isca, 6 páginas) nos 3
idiomas, `ebooks/arquivos/emagrecimento-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas
de amostra em `assets/produtos/emagrecimento/` (3 idiomas). Todo o conteúdo (headline, FAQ,
ebook, capa, Hotmart) foi escrito sem promessa numérica de peso, sem foto antes/depois e sem
linguagem de vergonha corporal, seguindo a regra do nicho sensível já documentada neste arquivo.
Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/H106609158K` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/W106609196K` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/G106609215L` (US$ 4,99)

**`ganho-de-massa` (jul/2026, 11º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Reaproveitou o slug/pasta que já existia como rascunho (nicho sensível — ver regras
abaixo). Guia pago de 43 páginas (superávit calórico inteligente, prato de hipertrofia,
cardápio flexível de 14 dias, 3 modelos de treino — iniciante 3x, intermediário 4x, ABC 5x —,
biblioteca de exercícios por grupo muscular, progressão de carga de 12 semanas, suplementação
sem fantasia, plano de execução de 30 dias com planners e checklist, plano de continuidade de
90 dias) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/ganho-de-massa-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas de
amostra em `assets/produtos/ganho-de-massa/` (3 idiomas). Todo o conteúdo (headline, FAQ, ebook,
capa, Hotmart) foi escrito sem promessa numérica de quilos ganhos, sem foto antes/depois e sem
linguagem de vergonha corporal, seguindo a regra do nicho sensível já documentada neste arquivo.
Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/W106610896N` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/Y106610935L` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/F106610965B` (US$ 4,99)

**`treino-academia` (jul/2026, 12º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Produto novo (sem pasta de rascunho prévia). Guia pago de 36 páginas (6 pilares da
evolução, dieta por objetivo com cardápio de 7 dias, treinos A/B por grupo muscular — peito,
costas, ombros, braços, pernas e core —, 4 divisões semanais prontas de 3x a 6x, cronograma de
12 semanas em fases, cardio e mobilidade, planners de evolução, biblioteca de exercícios e
fichas prontas Full Body/Superior-Inferior/Push-Pull-Legs) + ebook gratuito (isca, 6 páginas)
nos 3 idiomas, `ebooks/arquivos/treino-academia-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/treino-academia/` (3 idiomas). Preço padrão da coleção:
**R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/Y106612661T` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/J106612684I` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/X106612700Y` (US$ 4,99)

**`mentalidade-ansiedade-habitos` (jul/2026, 13º produto — "Coleção Projeto Verão") — ✅ AO VIVO
nos 3 idiomas.** Produto novo (sem pasta de rascunho prévia), funciona como bônus/complemento
emocional da coleção. Guia pago de 36 páginas (ciclo do hábito, fome física x fome emocional,
protocolo anti-impulso de 10 minutos, ambiente que facilita a dieta, sono e movimento como
regulação emocional, plano de 30 dias, recaídas e autoimagem, laboratório de gatilhos pessoais,
rotinas por perfil, desafios de 7 dias, plano de continuidade de 90 dias, cartões de bolso e
seção "Sinais de atenção" — mantém integralmente os avisos de saúde/segurança do material
original, sem diagnosticar nem tratar ansiedade ou transtornos alimentares) + ebook gratuito
(isca, 6 páginas) nos 3 idiomas, `ebooks/arquivos/mentalidade-ansiedade-habitos-<pt|en|es>.pdf`.
Galeria "olhe por dentro" com 5 páginas de amostra em
`assets/produtos/mentalidade-ansiedade-habitos/` (3 idiomas). Preço padrão da coleção: **R$
49,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/Q106613382C` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/N106613402F` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/B106613410C` (US$ 4,99)

**`mobilidade-alongamento-prevencao` (jul/2026, 14º produto — "Coleção Projeto Verão") — ✅ AO
VIVO nos 3 idiomas.** Produto novo (sem pasta de rascunho prévia). Guia pago de 37 páginas
(fundamentos da mobilidade, mapa rápido do corpo, aquecimento de 3 camadas, rotinas A/B por
articulação — ombros/escápulas, quadril/glúteos, tornozelos/panturrilhas, coluna
torácica/lombar, joelhos, punhos/cotovelos/mãos —, biblioteca de alongamentos e exercícios de
mobilidade/ativação, prevenção de lesões por área com as 7 causas mais comuns e sinais de
atenção por região, rotinas para a vida real — quem fica sentado, rotina matinal e noturna —,
dieta e recuperação para articulações, cronograma de 30 dias com planner e diário de
dor/rigidez — sem prometer "nunca mais sentir dor", sempre recomendando avaliação profissional
quando necessário) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/mobilidade-alongamento-prevencao-<pt|en|es>.pdf`. Galeria "olhe por dentro" com
5 páginas de amostra em `assets/produtos/mobilidade-alongamento-prevencao/` (3 idiomas). Preço
padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/P106614336M` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/T106614345B` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/C106614359D` (US$ 4,99)

**`confianca-social` (jul/2026, 15º produto — "Ansiedade Social e Conversas com Naturalidade",
nova vertente) — ✅ AO VIVO nos 3 idiomas.** Reaproveitou o slug/pasta que já existia como
rascunho ("Confiança Social na Prática"). Guia pago de 42 páginas (ansiedade social sem
vergonha, o ciclo da trava social, corpo calmo/mente presente com preparação de 3 minutos,
exposição gradual sem forçar com escada de 6 níveis, fórmulas de abertura respeitosa, método
P.E.C. para sustentar conversa sem parecer interrogatório, silêncio/rejeição/limites com
frases de encerramento elegante, playbooks por situação — faculdade, academia, festa, café,
redes sociais —, conversas com interesse e respeito sem pressão nem joguinho, cronograma de 30
dias, e workbook completo — diário social, mapa de gatilhos, escada pessoal de exposição, banco
de frases) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/confianca-social-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas de
amostra em `assets/produtos/confianca-social/` (3 idiomas). Todo o conteúdo (headline, FAQ,
ebook, capa, Hotmart) evita prometer conquista garantida ou resultado romântico, sempre
enquadrando o método como comunicação e habilidades sociais que dependem de reciprocidade —
nunca manipulação — seguindo a regra de nicho sensível de relacionamentos já documentada neste
arquivo. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3
moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/K106617805B` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/I106617832D` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Y106617848F` (US$ 4,99)

**`carisma-humor-storytelling` (jul/2026, 16º produto — "Carisma, Humor e Storytelling", mesma
nova vertente "Conexões, Presença e Relacionamentos Saudáveis") — ✅ AO VIVO nos 3 idiomas.**
Produto novo (sem pasta de rascunho prévia). Guia pago de 33 páginas (o método C.H.A.R.M.E. —
curiosidade, humor leve, autenticidade, reciprocidade, memória social e escuta —, carisma
saudável sem personagem, humor com respeito — tipos que aproximam, o que afasta, timing e
autohumor —, estruturas de storytelling 3C e F.E.C.H.A. com banco de histórias pessoais,
conversas em camadas com perguntas melhores e leitura de reciprocidade, playbooks por situação —
festa, encontro, WhatsApp, ambiente profissional, amigos, conflitos leves —, cronograma de 30
dias, e workbook completo — diagnóstico de carisma, construtor de histórias, banco de humor
seguro, cartões de bolso) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/carisma-humor-storytelling-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/carisma-humor-storytelling/` (3 idiomas). Todo o conteúdo
(headline, FAQ, ebook, capa, Hotmart) evita prometer conquista garantida ou fazer todo mundo
gostar do leitor, e explicitamente não ensina manipulação, negs, pressão ou técnicas para passar
por cima da vontade de alguém — segue a mesma regra de nicho sensível de relacionamentos do
`confianca-social`. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real
nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106618653J` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/X106618676C` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Q106618694P` (US$ 4,99)

**`comunicacao-e-relacionamentos` (jul/2026, 17º produto — "Comunicação e Relacionamento:
Conversas que Criam Conexão", mesma nova vertente "Conexões, Presença e Relacionamentos
Saudáveis") — ✅ AO VIVO nos 3 idiomas.** Reaproveitou o slug/pasta que já existia como rascunho
(único draft anterior a `confianca-social`, com CONFIG de exemplo desde o início do projeto).
Guia pago de 37 páginas (o método O.U.V.I.R. de escuta ativa — observar, usar silêncio, validar,
investigar com cuidado, responder com presença —, os quatro níveis de pergunta — leve, médio,
profundo, cuidado —, storytelling social com a estrutura 30-20-10, humor e leveza com o teste da
elegância, checklist de mensagens digitais e convites sem pressão, os cinco tipos de limite —
tempo, emocional, digital, social, físico —, método R.E.P.A.R.O. para conflitos, red flags e
green flags em relacionamentos, cronograma de 30 dias condensado em 2 tabelas semanais — a partir
de um PDF de origem com 30 páginas quase idênticas de "Dia N", a condensação mais agressiva do
projeto até aqui —, e workbook completo — mapa de conversa profunda, contrato pessoal de
comunicação, plano de relacionamento saudável) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/comunicacao-e-relacionamentos-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/comunicacao-e-relacionamentos/` (3 idiomas). Todo o
conteúdo (headline, FAQ, ebook, capa, Hotmart) reconhece que o outro sempre tem liberdade para
dizer sim, não ou talvez, e explicitamente não ensina manipulação, pressão, insistência após um
"não" ou qualquer jogo emocional — segue a mesma regra de nicho sensível de relacionamentos do
`confianca-social` e do `carisma-humor-storytelling`. Preço padrão da coleção: **R$ 19,99 (PT) /
US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/O106619803O` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/D106619836D` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Q106619860V` (US$ 4,99)

**`atracao-com-respeito` (jul/2026, 18º produto — "Confiança Social: Atração com Respeito", mesma
nova vertente "Conexões, Presença e Relacionamentos Saudáveis") — ✅ AO VIVO nos 3 idiomas.**
Produto novo, slug novo sem pasta de rascunho prévia — distinto do `confianca-social` já ao vivo
(que é sobre conversas e naturalidade social em geral); este produto tem foco específico em
presença pessoal, ansiedade social e atração com respeito. Guia pago de 33 páginas (diagnóstico
social com escada de exposição em 5 níveis, presença pessoal — aparência cuidada e linguagem
corporal —, o Protocolo P.A.R.E. para ansiedade social — pausar, aterrissar, reorganizar,
executar —, o método C.O.N.E.C.T.A. de 7 passos para conversas naturais, sinais de abertura e
cautela na atração, o convite respeitoso em 3 partes, reformulação madura diante da rejeição,
ambientes sociais — academia, eventos, trabalho, online —, limites e mensagens digitais
saudáveis, e um plano de 30 dias condensado em 2 tabelas semanais — a partir de um PDF de origem
com 30 páginas quase idênticas de "Dia N" — com workbook completo — mapa de limites pessoais,
identidade social autêntica, roteiro de conversa difícil) + ebook gratuito (isca, 6 páginas) nos
3 idiomas, `ebooks/arquivos/atracao-com-respeito-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/atracao-com-respeito/` (3 idiomas). Todo o conteúdo
(headline, FAQ, ebook, capa, Hotmart) não promete conquistar ninguém, não substitui terapia e não
incentiva insistência, pressão, manipulação ou qualquer abordagem invasiva — segue a mesma regra
de nicho sensível de relacionamentos do `confianca-social`, do `carisma-humor-storytelling` e do
`comunicacao-e-relacionamentos`. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**.
Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/I106620409B` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/L106620441I` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Q106620456T` (US$ 4,99)

**`presenca-social` (jul/2026, 19º produto — "Linguagem Corporal e Presença Social", mesma nova
vertente "Conexões, Presença e Relacionamentos Saudáveis") — ✅ AO VIVO nos 3 idiomas.** Produto
novo, slug novo sem pasta de rascunho prévia — distinto do `atracao-com-respeito` (foco em
ansiedade social e escada de exposição) e do `confianca-social` (foco em conversas); este produto
tem foco específico em linguagem corporal e regulação da ansiedade corporal antes de interagir.
Guia pago de 36 páginas (a diferença entre presença e atração, postura/eixo/energia com protocolo
de 60 segundos, olhar/rosto/sorriso com o método 3-2-1 para contato visual, voz/ritmo/pausas com
a regra dos 3 ajustes, espaço pessoal e limites com distâncias sociais por contexto, mãos/gestos
e congruência, imagem pessoal sem obsessão — os 6 pilares do autocuidado —, como entrar em
ambientes sociais com o ritual de chegada em 5 passos, calibragem social com o método O.A.R.,
ansiedade corporal com o Protocolo R.E.S.E.T. e escada de exposição social, playbooks por
situação, um plano de 30 dias com cronograma completo e score semanal de presença, e workbook com
ficha de diagnóstico e diário de interação social) + ebook gratuito (isca, 6 páginas) nos 3
idiomas, `ebooks/arquivos/presenca-social-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/presenca-social/` (3 idiomas). Todo o conteúdo (headline,
FAQ, ebook, capa, Hotmart) não promete que alguém vai se sentir atraído por quem lê, não substitui
apoio psicológico e não ensina nenhuma técnica de intimidação, encarada fixa ou invasão de espaço
alheio — segue a mesma regra de nicho sensível de relacionamentos do `confianca-social`, do
`carisma-humor-storytelling`, do `comunicacao-e-relacionamentos` e do `atracao-com-respeito`.
Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106621916S` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/N106621947M` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/A106621974F` (US$ 4,99)

**`limites-rejeicao-maturidade` (jul/2026, 20º produto — "Limites, Rejeição e Maturidade
Emocional", mesma nova vertente "Conexões, Presença e Relacionamentos Saudáveis") — ✅ AO VIVO
nos 3 idiomas.** Produto novo, a partir de um rascunho enviado pelo dono do projeto — distinto
dos demais produtos da vertente por focar em comunicar limites pessoais e lidar com rejeição e
ciúme com maturidade emocional. Guia pago de 65 páginas (fundamentos de maturidade emocional,
como descobrir os próprios limites, limites digitais saudáveis, limite x controle, o que a
rejeição realmente significa, como responder a um não com dignidade, o protocolo das primeiras 24
horas, textos que não se deve enviar, autoestima depois do não, quando insistência vira invasão, o
ciclo do impulso, o Protocolo P.A.R.A. para regular ansiedade/ciúme/vergonha, ciúme e insegurança
sem controle, dinâmicas ruins e red flags, e um plano de execução de 30 dias com workbook completo
— mapa de limites, frases de encerramento elegante e plano de continuidade de 90 dias) + ebook
gratuito (isca, 6 páginas) nos 3 idiomas, `ebooks/arquivos/limites-rejeicao-maturidade-<pt|en|es>.pdf`.
Galeria "olhe por dentro" com 5 páginas de amostra em
`assets/produtos/limites-rejeicao-maturidade/` (3 idiomas). Todo o conteúdo (headline, FAQ, ebook,
capa, Hotmart) reconhece que o outro sempre tem liberdade para dizer sim, não ou talvez, e
explicitamente não ensina manipulação, pressão, insistência após um "não" ou qualquer jogo
emocional — segue a mesma regra de nicho sensível de relacionamentos do `confianca-social`, do
`carisma-humor-storytelling`, do `comunicacao-e-relacionamentos`, do `atracao-com-respeito` e do
`presenca-social`. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real
nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106705365S` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/P106705432B` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/U106705446J` (US$ 4,99)

**`mensagens-e-conversas-online` (jul/2026, 21º produto — "Mensagens, WhatsApp e Conversas
Online", mesma nova vertente "Conexões, Presença e Relacionamentos Saudáveis") — ✅ AO VIVO nos 3
idiomas.** Produto novo, a partir de um rascunho enviado pelo dono do projeto — distinto dos
demais produtos da vertente por focar especificamente em comunicação digital (WhatsApp, DMs,
redes sociais). Guia pago de 50 páginas (o código da conversa online com a fórmula
contexto+leveza+curiosidade+saída elegante, perfil e presença digital, como iniciar conversas sem
parecer invasivo com banco de aberturas respeitosas, como manter a conversa viva com a técnica
C.E.C., WhatsApp sem ansiedade — tempo de resposta, áudio, textão, emojis e grupos —, convite para
sair com respeito, reciprocidade/limites/rejeição, segurança digital contra golpes afetivos, um
banco de mensagens adaptáveis e um plano de execução de 30 dias com workbook completo) + ebook
gratuito (isca, 6 páginas) nos 3 idiomas, `ebooks/arquivos/mensagens-e-conversas-online-<pt|en|es>.pdf`.
Galeria "olhe por dentro" com 5 páginas de amostra em
`assets/produtos/mensagens-e-conversas-online/` (3 idiomas). Todo o conteúdo (headline, FAQ,
ebook, capa, Hotmart) segue a mesma regra de nicho sensível de relacionamentos dos demais
produtos da vertente — não promete conquistar ninguém e não ensina pressão, manipulação,
joguinhos ou insistência; inclui módulo dedicado a segurança digital e reconhecimento de golpes
afetivos. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3
moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/X106706106E` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/W106706125W` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/I106706139S` (US$ 4,99)

**`primeiro-encontro` (jul/2026, 22º produto — "Primeiro Encontro: Conversa, Presença e
Respeito", mesma nova vertente "Conexões, Presença e Relacionamentos Saudáveis") — ✅ AO VIVO nos
3 idiomas.** Produto novo, a partir de um rascunho enviado pelo dono do projeto — distinto dos
demais produtos da vertente por focar especificamente no primeiro encontro presencial (não em
conversa online/digital, que é o foco do `mensagens-e-conversas-online`, nem em conversa social
em geral, que é o foco do `confianca-social`). Guia pago de 65 páginas (8 módulos: Mentalidade
do Primeiro Encontro — objetivo real, reciprocidade, presença sem personagem —, Convite e
Preparação — convite sem pressão, escolha do lugar, checklist, preparação mental de 15 minutos
—, Conversa e Conexão — estrutura C.E.C., aberturas, perguntas, escuta ativa, storytelling,
humor leve, profundidade gradual —, Presença, Sinais e Limites — linguagem corporal, sinais de
conforto/desconforto, espaço pessoal e toque, segurança e autonomia —, Encerramento e
Pós-Encontro — como lidar com rejeição, quando vale chamar de novo —, Playbooks Práticos com 8
cenários reais, Plano de 30 Dias e Workbook Premium com 8 páginas de ferramentas para preencher)
+ ebook gratuito (isca, 6 páginas) nos 3 idiomas, `ebooks/arquivos/primeiro-encontro-<pt|en|es>.pdf`.
Galeria "olhe por dentro" com 5 páginas de amostra em `assets/produtos/primeiro-encontro/` (3
idiomas). Todo o conteúdo (headline, FAQ, ebook, capa, Hotmart) segue a mesma regra de nicho
sensível de relacionamentos dos demais produtos da vertente — não promete conquistar ninguém e
não ensina pressão, manipulação, joguinhos ou insistência após um não; trata consentimento,
segurança e autonomia como base, não opcional. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/D106706588C` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/O106706603K` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/B106706622I` (US$ 4,99)

**`etfs-investimento-global` (jul/2026, 23º produto — "ETFs e Investimento Global", primeiro
produto da nova vertente "Projeto Verão Financeiro" / Educação Financeira) — ✅ AO VIVO nos 3
idiomas.** Produto novo, a partir de um rascunho enviado pelo dono do projeto — diferente do
rascunho antigo em `produtos/investimentos/` (sobre investir do zero em geral): este tem foco
específico em ETFs, BDRs e diversificação internacional. Criou a categoria `financas` em
`assets/produtos.js` (`window.CATEGORIAS_SITE`). Guia pago de 46 páginas (6 módulos: Por que
Pensar Globalmente — home bias, risco Brasil, diagnóstico —, ETF sem Mistério — o que é, tipos
por exposição, 10 critérios de análise, o índice como produto —, Caminhos de Acesso — ETF na B3,
BDR, BDR de ETF, conta no exterior, fundos locais —, Riscos/Custos/Impostos — câmbio, custos
invisíveis, tributação com aviso sobre a Lei 14.754/2023, liquidez/spread/domicílio,
concentração —, Carteira Global com Método — camadas, modelos didáticos, core-satellite,
rebalanceamento, estratégias comuns —, e Execução e Workbooks — plano de 30 dias, diagnóstico,
ficha de ETF, comparador de rotas, dashboard trimestral, cards de decisão, erros comuns, estudos
de caso, política pessoal, matriz de risco, mitos e verdades, glossário) + ebook gratuito (isca,
6 páginas) nos 3 idiomas, `ebooks/arquivos/etfs-investimento-global-<pt|en|es>.pdf`. Galeria "olhe
por dentro" com 5 páginas de amostra em `assets/produtos/etfs-investimento-global/` (3 idiomas).
**Nicho sensível (investimentos)** — todo o conteúdo (headline, FAQ, ebook, capa, Hotmart) evita
promessa de rentabilidade garantida ou específica e listas de "melhores ativos", trata o material
como estritamente educacional (não é recomendação individual nem consultoria de valores
mobiliários) e recomenda sempre consultar fontes oficiais/contador antes de vender ou declarar —
segue a regra de nicho sensível de investimentos já documentada neste arquivo. As versões EN/ES
generalizam a seção de tributação (que no PT cita a lei brasileira 14.754/2023) para não afirmar
regras fiscais específicas de outros países. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/G106711251O` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/L106711275V` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/B106711299T` (US$ 4,99)

**`fiis-do-zero` (jul/2026, 24º produto — "FIIs do Zero", segundo produto da vertente "Projeto
Verão Financeiro" / Educação Financeira) — ✅ AO VIVO nos 3 idiomas.**
Produto novo, a partir de um novo rascunho enviado pelo dono do projeto
("Aprenda_sobre_Fiis_do_Zero.pdf"). Guia pago de 51 páginas (7 módulos: Base dos FIIs — o que é
um fundo imobiliário, por que FII não é renda fixa, FII x imóvel físico, como o investidor ganha
ou perde dinheiro, código/negociação/liquidez, riscos principais —, Tipos de FIIs — visão rápida,
tijolo, segmentos de tijolo, papel, IPCA/CDI/prefixado, híbridos/FoFs/gestão ativa —, Indicadores
sem Confusão — Dividend Yield, P/VP e valor patrimonial, vacância física e financeira, WAULT e
vencimentos, liquidez e tamanho do fundo, indicadores de fundos de papel, ranking pessoal —,
Análise Prática — como ler um relatório gerencial, fichas de análise para FII de tijolo e de
papel, gestão e governança, emissões/subscrições/diluição, armadilhas comuns —, Carteira de FIIs —
por camadas, diversificação inteligente, modelo didático de alocação, aportes e preço médio,
rebalanceamento, acompanhamento trimestral de renda —, Tributação e Controle — visão educacional
(regra de isenção amplamente divulgada + aviso para verificar a regra vigente, citando a MP
1303/2025), rendimentos x ganho de capital, rotina fiscal e planilha de controle —, e Plano de
Execução — plano de 30 dias, checklist antes de comprar, ficha de tese do fundo, rotina mensal,
dashboard e plano de continuidade de 90 dias, glossário) + ebook gratuito (isca, 6 páginas) nos 3
idiomas, `ebooks/arquivos/fiis-do-zero-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas de
amostra em `assets/produtos/fiis-do-zero/` (3 idiomas). **Nicho sensível (investimentos)** — todo
o conteúdo (headline, FAQ, ebook, capa, Hotmart) evita promessa de rentabilidade garantida ou
específica e listas de "melhores fundos", trata o material como estritamente educacional (não é
recomendação individual nem consultoria de valores mobiliários) e recomenda sempre consultar
fontes oficiais/contador antes de vender ou declarar — segue a regra de nicho sensível de
investimentos já documentada neste arquivo. **FII (Fundo de Investimento Imobiliário) é um ativo
específico do mercado brasileiro** — as versões EN/ES generalizam o conceito para "REIT" (Real
Estate Investment Trust), o termo internacionalmente reconhecido equivalente, com título "REITs
from Zero" (EN) / "REITs desde Cero" (ES); o PT mantém todo o detalhe específico do Brasil (leis,
DARF, ReVar) e a seção de tributação nas versões EN/ES foi generalizada para não afirmar regras
fiscais específicas de outros países. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99
(EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/O106711807A` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/X106711836U` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/R106711854B` (US$ 4,99)

**`financas-pessoais` (jul/2026, 25º produto — "Finanças Pessoais e Liberdade Financeira",
terceiro produto da vertente "Projeto Verão Financeiro" / Educação Financeira) — ✅ AO VIVO nos 3
idiomas.** Produto novo, a partir de um novo rascunho enviado pelo
dono do projeto ("Financas_Pessoais_e_Liberdade_Financeira.pdf"). Diferente do ETFs e do FIIs
(focados em um instrumento específico de investimento), este é o produto mais abrangente da
vertente — cobre toda a jornada de organização financeira, não só investimento. Guia pago de 44
páginas (14 módulos: Mentalidade da Liberdade Financeira — o dinheiro como ferramenta de escolha,
os 4 inimigos silenciosos —, Diagnóstico — os 5 números que importam, score financeiro pessoal,
workbook raio-x financeiro —, Orçamento Inteligente e Fluxo de Caixa — orçamento por função,
método 70-20-10, checklist de vazamentos —, Dívidas — produtiva x destrutiva, Avalanche x Bola de
Neve, plano de renegociação —, Reserva de Emergência — papel da reserva, quanto guardar, proteção
além da reserva —, Metas Financeiras — por prazo, transformar desejo em plano —, Investimentos
dentro do Método — a ordem correta, mapa de classes de ativos, checklist antes de investir —,
Juros Compostos, Aportes e Patrimônio — o motor que você controla, indicador de liberdade
financeira, dashboard de patrimônio —, Renda, Carreira e Fontes Extras — regra do dinheiro novo —,
Consumo Consciente e Ansiedade Financeira — gatilhos de consumo, protocolo anti-impulso —,
Família, Casal e Conversas sobre Dinheiro — reunião financeira sem briga —, Plano de 30 Dias e
Roteiro de 12 Meses, Workbooks/Checklists/Trackers — método das 5 contas, níveis de liberdade
financeira, revisão trimestral —, e Glossário e Referências) + ebook gratuito (isca, 6 páginas)
nos 3 idiomas, `ebooks/arquivos/financas-pessoais-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/financas-pessoais/` (3 idiomas). **Nicho sensível
(investimentos/finanças)** — todo o conteúdo (headline, FAQ, ebook, capa, Hotmart) evita promessa
de rentabilidade garantida ou de riqueza rápida, não indica ativos ou produtos financeiros
específicos, trata o material como estritamente educacional (não é planejamento financeiro
individual, consultoria nem assessoria de investimentos) e recomenda sempre consultar fontes
oficiais/profissional antes de decisões reais — segue a regra de nicho sensível de investimentos
já documentada neste arquivo. **Conteúdo universal, não específico do Brasil** — diferente do
ETFs e do FIIs, não precisou de generalização de terminologia ou tributação para as versões EN/ES
(orçamento, dívidas, reserva de emergência e metas são conceitos universais); a tradução seguiu o
padrão normal de localização. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**.
Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/W106713797N` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/D106713828I` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Y106713849X` (US$ 4,99)

**`imposto-de-renda-investidores` (jul/2026, 26º produto — "Imposto de Renda para
Investidores", quarto produto da vertente "Projeto Verão Financeiro" / Educação Financeira) —
✅ AO VIVO nos 3 idiomas.** Produto novo, a partir de um novo rascunho
enviado pelo dono do projeto ("Imposto_de_Renda_para_Investidores.pdf"). **Caso especial de
generalização, mais extremo que ETFs/FIIs**: o rascunho original é inteiramente sobre a
declaração do Imposto de Renda brasileiro (Receita Federal, DARF, IRPF, alíquotas de 15%/20%,
Lei 14.754/2023, Lei 15.270/2025) — traduzir literalmente para EN/ES seria enganoso, já que
nada disso se aplica fora do Brasil. Por isso as versões EN/ES foram **totalmente
regeneralizadas** (não apenas traduzidas) para "Investment Tax Organization: A Practical
Method" (EN) / "Organización Fiscal para Inversionistas: Un Método Práctico" (ES) — ensinam o
método universal (pasta fiscal, rotina mensal, custo médio, separação de tipos de operação,
controle de ativos no exterior/cripto, checklist de documentos, erros comuns) sem citar nenhuma
alíquota, formulário (DARF) ou lei específica do Brasil, sempre remetendo o leitor à própria
autoridade fiscal do seu país ou a um profissional qualificado. O PT mantém 100% do detalhe
brasileiro do rascunho original. Guia pago de 45 páginas (10 módulos: Mapa do IR para
Investidores, Rotina Mensal e Pasta Fiscal, Renda Fixa/Fundos e Previdência, Ações e Operações
Comuns, Day Trade e Operações Especiais, FIIs/Fiagro/ETFs e BDRs, Dividendos/JCP e Proventos,
Exterior/Cripto e Outros Ativos, Declaração Anual, Workbooks e Plano de Execução) + ebook
gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/imposto-de-renda-investidores-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/imposto-de-renda-investidores/` (3 idiomas). **Nicho
sensível (investimentos/tributário)** — todo o conteúdo evita prometer restituição garantida ou
economia de imposto, não substitui contador/consultor tributário/orientação oficial da Receita
Federal (PT) ou da autoridade fiscal local (EN/ES), e recomenda sempre revisar a versão vigente
das regras antes de declarar ou recolher imposto — segue e reforça a regra de nicho sensível de
investimentos já documentada neste arquivo. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106716252K` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/V106716286B` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/W106716311O` (US$ 4,99)

**`investimentos` (jul/2026, 27º produto — "Investimentos do Zero ao Método", quinto produto da
vertente "Projeto Verão Financeiro" / Educação Financeira) — ✅ AO VIVO nos 3 idiomas.**
Reaproveita o slug/pasta `produtos/investimentos/` que já existia como rascunho
desde o início do projeto ("Ebook Investimentos do Zero", nunca lançado — texto antigo permanece
na seção 3 do `CADASTRO-HOTMART.md`, agora desatualizado). Novo rascunho enviado pelo dono do
projeto ("Investimentos_do_zero_ao_metodo.pdf", 54 páginas). Guia pago de 51 páginas (18
módulos: O Método em 6 Etapas, Diagnóstico, Orçamento/Dívidas/Reserva, Objetivos/Prazos/Perfil
de Risco, Conceitos Essenciais do Mercado, Renda Fixa na Prática, Fundos de Investimento, FIIs,
Ações, ETFs/Exterior, Previdência/Cripto/Alternativos, Custos/Impostos/Liquidez, Como Montar uma
Carteira, Aportes/Rebalanceamento/Revisão, Psicologia do Investidor, Segurança Contra Golpes,
Plano de 30 Dias e Biblioteca de Decisão — os 16 quase-idênticos "cards de decisão" do rascunho
original foram condensados em 2 tabelas comparativas) + ebook gratuito (isca, 5 páginas) nos 3
idiomas, `ebooks/arquivos/investimentos-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas
de amostra em `assets/produtos/investimentos/` (3 idiomas). **Generalização leve para EN/ES**
(nível intermediário, entre o caso ETFs e o caso Imposto de Renda): a maior parte do conteúdo
(método, diagnóstico, psicologia, montagem de carteira, segurança) é universal e foi traduzida
diretamente; só os veículos específicos do Brasil foram generalizados com paralelo explicativo —
"government bonds (e.g., Tesouro Direto in Brazil)", "deposit insurance (like Brazil's FGC)" —
em vez de reescrever o guia inteiro como no Imposto de Renda. O PT mantém 100% do detalhe
brasileiro (Tesouro Direto, CDB/LCI/LCA, FGC, Selic/CDI/IPCA). Segue a regra de nicho sensível de
investimentos já documentada neste arquivo (sem recomendar ativos, sem prometer rentabilidade).
Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/T106813833H` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/Y106716993J` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Y106717009V` (US$ 4,99)

**`psicologia-do-investidor` (jul/2026, 28º produto — "Psicologia do Investidor", sexto produto
da vertente "Finanças / Educação Financeira") — ✅ AO VIVO nos 3 idiomas.** Produto novo, slug
novo (sem pasta de rascunho prévia), distinto do `investimentos` (que cobre a jornada completa do
zero): este é 100% comportamental. Guia pago de 58 páginas (método P.A.U.S.A. — Parar, Analisar,
Unificar, Simular, Agir — para pausar antes de decidir, diagnóstico de 10 vieses comportamentais
— aversão à perda, confirmação, ancoragem, recência, FOMO/manada, excesso de confiança, efeito
disposição, contabilidade mental, status quo, aversão ao arrependimento —, sistema de decisão
completo — política pessoal de investimento, checklist antes de investir, tese em uma página,
regras de compra/venda, alocação como escudo emocional, rebalanceamento —, protocolo para quedas
de mercado e sinais de golpes financeiros, sete workbooks — diário do investidor, score emocional
mensal, registro de compra/venda, revisão mensal da carteira, plano para queda de mercado,
contrato de pré-compromisso, conversa financeira familiar — e plano guiado de 30 dias com
continuidade de 90 dias) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/psicologia-do-investidor-<pt|en|es>.pdf`. Capa, thumbnail e galeria "olhe por
dentro" com 5 páginas de amostra em `assets/produtos/psicologia-do-investidor/` (3 idiomas), já
no visual dark premium navy+teal+âmbar. Segue a regra de nicho sensível de investimentos já
documentada neste arquivo (sem indicar ativos, sem prometer rentabilidade). Preço padrão da
coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106722185U` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/Q106722260X` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/Q106722276C` (US$ 4,99)

**`renda-fixa-inteligente` (jul/2026, 29º produto — "Renda Fixa Inteligente", sétimo produto da
vertente "Finanças / Educação Financeira") — ✅ AO VIVO nos 3 idiomas.** Produto novo, slug novo
(sem pasta de rascunho prévia), distinto do `investimentos` (jornada completa do zero) e do
`psicologia-do-investidor` (100% comportamental): este é o guia prático de comparação de produtos
de renda fixa. Guia pago de 49 páginas (o jogo da renda fixa e glossário essencial — Selic, CDI,
IPCA, prefixado, liquidez —, reserva de emergência, Tesouro Direto na prática — Selic, Prefixado,
IPCA+, Renda+, Educa+ —, CDB/LCI/LCA e produtos bancários, FGC sem ilusão, crédito privado
avançado — debêntures, CRI, CRA —, impostos/taxas/rentabilidade líquida, marcação a mercado sem
trauma, um roteiro de 7 filtros para comparar produtos, carteira por camadas, fundos de renda
fixa e ETFs, erros que custam dinheiro, plano guiado de 30 dias, workbooks — diagnóstico
financeiro, política pessoal de investimento, checklist pré-compra, revisão mensal —, cards de
decisão por produto e simulações didáticas) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/renda-fixa-inteligente-<pt|en|es>.pdf`. Capa, thumbnail e galeria "olhe por
dentro" com 5 páginas de amostra em `assets/produtos/renda-fixa-inteligente/` (3 idiomas), já no
visual dark premium navy+teal+âmbar. Segue a regra de nicho sensível de investimentos já
documentada neste arquivo (sem indicar ativos, sem prometer rentabilidade). Preço padrão da
coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/T106725310X` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/K106725347G` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/K106725373C` (US$ 4,99)

**`seguranca-financeira-e-golpes` (jul/2026, 30º produto — "Segurança Financeira e Golpes",
oitavo produto da vertente "Finanças / Educação Financeira") — ✅ AO VIVO nos 3 idiomas.** Produto
novo, slug novo (sem pasta de rascunho prévia), distinto dos demais produtos financeiros: este é
100% sobre prevenção e resposta a golpes, não sobre investir propriamente. Guia pago de 54
páginas (mapa dos golpes financeiros e anatomia de um golpe — isca, confiança, urgência,
pagamento, silêncio —, por que pessoas inteligentes caem, os 20 sinais vermelhos, matriz de risco
da oferta, checklist antes de investir, como verificar instituição e conta de destino, golpes de
investimento — pirâmide, Ponzi, falso assessor, falsa corretora, cripto/Forex/robôs, clubes VIP,
recuperação de valores, investimento esquecido —, segurança digital e bancária —
senhas/2FA, e-mail/links, WhatsApp/engenharia social, Pix/limites, boletos/QR Codes falsos,
celular/dispositivos, redes sociais —, resposta a incidentes — primeiras 24 horas, preservar
provas, canais de reclamação, revisão sem culpa — e workbooks — diagnóstico de blindagem, ficha
de verificação de oferta, diário de sinais vermelhos, contrato pessoal anti-golpe, plano de
blindagem de 30 dias) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/seguranca-financeira-e-golpes-<pt|en|es>.pdf`. Capa, thumbnail e galeria "olhe
por dentro" com 5 páginas de amostra em `assets/produtos/seguranca-financeira-e-golpes/` (3
idiomas), já no visual dark premium navy+teal+âmbar. Conteúdo 100% educacional de prevenção — não
ensina a praticar golpes, não promete recuperação de valores e não substitui orientação jurídica,
policial, bancária ou regulatória. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**.
Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/T106728083S` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/B106728123S` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/B106728152H` (US$ 4,99)

**`dividendos-e-renda-passiva` (jul/2026, 31º produto — "Dividendos e Renda Passiva", nono
produto da vertente "Finanças / Educação Financeira") — ✅ AO VIVO nos 3 idiomas.** Distinto dos
demais produtos financeiros: este ensina a construir renda passiva com dividendos e FIIs, não
segurança nem investimento do zero. Guia pago de 46 páginas (a mentalidade da renda passiva — o
tripé qualidade/preço/tempo —, base financeira antes dos dividendos — reserva, meta de renda
mensal, camadas da carteira —, ações e proventos — dividendos, JCP, datas com/ex, dividend
yield, payout, qualidade da empresa pagadora, setores típicos —, FIIs e renda mensal — tijolo,
papel, híbridos, indicadores como vacância e P/VP —, tributação e organização — regras de 2026,
controle mensal, erros fiscais comuns —, método de carteira — alocação por objetivos,
diversificação, reinvestimento, rebalanceamento, cortes de dividendos — e um plano de execução
de 30 dias com worksheets — diagnóstico de renda, análise de ação pagadora, análise de FII,
dashboard mensal, cards de decisão rápida) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/dividendos-e-renda-passiva-<pt|en|es>.pdf`. Capa, thumbnail e galeria "olhe por
dentro" com 5 páginas de amostra em `assets/produtos/dividendos-e-renda-passiva/` (3 idiomas), já
no visual dark premium navy+teal+âmbar. Segue a regra de nicho sensível de investimentos já
documentada neste arquivo (sem indicar ativos, sem prometer renda garantida). Preço padrão da
coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/I106728656C` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/W106728688G` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/J106728736V` (US$ 4,99)

**`ia-para-profissoes` (jul/2026, 32º produto — "Inteligência Artificial para Profissões") — ✅
AO VIVO nos 3 idiomas.** Primeiro produto fora das 3 categorias existentes — abre a vertente
nova "IA e Produtividade" (`ia-produtividade` em `window.CATEGORIAS_SITE`). Guia pago de 40
páginas (a regra dos 4 papéis da IA — assistente, analista, criadora, treinadora —, matriz de
ferramentas por atividade cobrindo ChatGPT/Claude/Gemini/Copilot/Perplexity/NotebookLM/Canva AI,
o método do prompt profissional — contexto, tarefa, formato e revisão —, 16 profissões com
ferramentas indicadas, usos práticos e um prompt pronto cada uma — gestão, administrativo,
vendas, marketing, empreendedores, educação, RH, jurídico, contabilidade, investimentos, saúde,
engenharia, tecnologia, design e pesquisa —, 4 fluxos de trabalho prontos, biblioteca de 10
prompts por objetivo, checklist de segurança/qualidade/ética com níveis de risco, e plano de
implementação de 14 dias) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/ia-para-profissoes-<pt|en|es>.pdf`. Capa, thumbnail e galeria "olhe por dentro"
com 5 páginas de amostra em `assets/produtos/ia-para-profissoes/` (3 idiomas), já no visual dark
premium navy+teal+âmbar. Conteúdo alerta que a IA pode errar/inventar informação e que, em áreas
reguladas (saúde, direito, contabilidade, finanças, engenharia), o uso deve ser só de apoio com
validação de profissional habilitado. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99
(EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/X106752389V` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/P106752415S` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/I106752439G` (US$ 4,99)

**`produtividade-com-ia` (jul/2026, 33º produto — "Produtividade com Inteligência Artificial") —
✅ AO VIVO nos 3 idiomas.** Segundo produto da vertente "IA e Produtividade" — distinto do
`ia-para-profissoes` (organizado por 16 profissões): este é um sistema geral de produtividade.
Guia pago de 40 páginas (o novo conceito de produtividade — o que a IA faz melhor e o que não
resolve sozinha —, a matriz de 6 blocos de produtividade — clareza, comunicação, pesquisa,
documentos, organização, automação —, as principais ferramentas do mercado — ChatGPT, Claude,
Gemini, Microsoft Copilot, Perplexity, NotebookLM, Notion AI, Canva AI, Zapier/Make —, o Sistema
4D — Descarregar, Decidir, Desenvolver, Delegar — com prompt mestre e rotina diária sugerida, 8
fluxos de trabalho prontos — planejamento semanal, caixa de entrada, reunião produtiva, documento
em 30 minutos, pesquisa com fontes, planilha em insight, conteúdo para redes sociais, automação
simples —, biblioteca de 30+ prompts por objetivo, os multiplicadores de produtividade com modelo
de cálculo de ganho de tempo, como montar uma base de conhecimento com IA, segurança/privacidade/
qualidade com checklist antes de entregar, e um plano de implementação de 14 dias que termina no
"Manual Pessoal de Produtividade com IA" do leitor) + ebook gratuito (isca, 6 páginas) nos 3
idiomas, `ebooks/arquivos/produtividade-com-ia-<pt|en|es>.pdf`. Capa, thumbnail e galeria "olhe
por dentro" com 5 páginas de amostra em `assets/produtos/produtividade-com-ia/` (3 idiomas), já
no visual dark premium navy+teal+âmbar. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99
(EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/R106753629B` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/L106753657N` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/K106753682B` (US$ 4,99)

**`ia-para-negocios-pequenos` (jul/2026, 34º produto — "IA para Negócios Pequenos") — ✅ AO VIVO
nos 3 idiomas.** Terceiro produto da vertente "IA e Produtividade" — distinto dos dois anteriores
(organizado por profissão e por sistema geral de produtividade): este é focado em pequenos
negócios — o Sistema 6A (Atrair, Apresentar, Atender, Argumentar, Administrar, Aprender), matriz
de 13 ferramentas, aplicações práticas por área (marketing, vendas, atendimento, operação,
financeiro, pessoas), playbooks prontos para 10 tipos de negócio (loja, restaurante, salão,
clínica, prestador de serviço, imobiliária, escritório contábil, cursos, e-commerce,
infoprodutor), 6 fluxos completos pra vender mais, automações simples, biblioteca de 40+ prompts,
segurança/LGPD/bom senso, e plano de implantação de 14 dias. Guia pago de 39 páginas + ebook
gratuito (isca, 6 páginas) nos 3 idiomas, `ebooks/arquivos/ia-para-negocios-pequenos-<pt|en|es>.pdf`.
Capa, thumbnail e galeria "olhe por dentro" com 5 páginas de amostra em
`assets/produtos/ia-para-negocios-pequenos/` (3 idiomas), já no visual dark premium
navy+teal+âmbar. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99 (EN/ES)**. Checkout real nas
3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/V106755275G` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/P106755310M` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/R106755349X` (US$ 4,99)

**`ia-aplicada` (jul/2026, 35º produto — "Inteligência Artificial Aplicada") — ✅ AO VIVO nos 3
idiomas.** Quarto produto da vertente "IA e Produtividade" — distinto dos três anteriores
(organizados por profissão, sistema geral de produtividade e pequenos negócios): este é focado no
mapa/comparativo das 16 principais ferramentas de IA do mercado — ChatGPT, Claude, Gemini,
Microsoft Copilot, Perplexity, NotebookLM, Canva AI, Midjourney, Adobe Firefly, Runway,
ElevenLabs, Notion AI, GitHub Copilot, DeepSeek, Mistral, Grok —, com perfil detalhado de cada
ferramenta (melhor uso, quando usar, quando evitar, prompt inicial), o método de prompt que
funciona (modelo universal, prompt fraco x forte, 7 comandos), prompts prontos por atividade
(textos, pesquisa, documentos, planilhas, apresentações, marketing, imagem, vídeo, código),
aplicações por 8 perfis profissionais, cuidados com privacidade/direitos autorais/uso
responsável, um plano de implementação de 7 dias com checklist de maturidade, 5 modelos de
prompt prontos, glossário e workbook completo. Guia pago de 40 páginas + ebook gratuito (isca, 6
páginas) nos 3 idiomas, `ebooks/arquivos/ia-aplicada-<pt|en|es>.pdf`. Capa, thumbnail e galeria
"olhe por dentro" com 5 páginas de amostra em `assets/produtos/ia-aplicada/` (3 idiomas), já no
visual dark premium navy+teal+âmbar. Preço padrão da coleção: **R$ 19,99 (PT) / US$ 4,99
(EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/G106756375S` (R$ 19,99)
- EN/USD: `https://pay.hotmart.com/G106756401W` (US$ 4,99)
- ES/USD: `https://pay.hotmart.com/J106756430J` (US$ 4,99)

**Os produtos pagos (manuais completos, 3 idiomas cada) NÃO ficam no repositório** — foram
entregues direto pro dono do projeto pra upload manual na Hotmart (ebook comercial, não pode
ficar público no site), assim como as capas (imagem estilo capa de ebook, 3 idiomas cada). Falta
só, opcionalmente, copy de anúncio Meta Ads em `anuncios/` pros produtos ao vivo.

## Como fazer alterações comuns

- **Preço padrão do site (todos os produtos):** editar `window.PRECOS_SITE` em
  `assets/config-global.js` + o default `PRECOS` em `netlify/functions/lib/produtos-email.mjs`
  (+ o valor real das ofertas na Hotmart e o `ESPERADO` do `hotmart_checagem_final.py`).
  As páginas leem tudo de lá — NÃO existe mais preço copiado por página.
- **Preço próprio de UM produto (exceção):** trocar a referência `window.PRECOS_SITE...` por um
  valor literal no `CONFIG` das 3 páginas dele + override em `produtos-email.mjs`.
- **Headline, benefícios, FAQ, checkout Hotmart de um produto:** editar o `CONFIG` no
  topo de `produtos/<slug>/index*.html` (lembrar dos 3 idiomas).
- **Produto novo — checklist completo (por decisão do dono do projeto, jul/2026: já fazer tudo
  isso ao criar cada novo produto, sem esperar pedido separado):**
  1. Gerar o e-book pago + gratuito (PT/EN/ES) e a capa, a partir do rascunho enviado.
  2. **Gerar a galeria "olhe por dentro"**: 5 screenshots de páginas reais do PDF final por
     idioma (capa + 4 páginas que mostrem bem o conteúdo — variar entre divisória de módulo,
     página com tabela/callout, checklist, etc.), salvar em
     `assets/produtos/<slug>/preview-<pt|en|es>-<nome>.jpg` e já incluir a seção "Dê uma olhada
     por dentro" (`.preview-galeria`) nas 3 páginas do produto — não deixar pra depois.
     **Gerar também a miniatura da capa** `thumb-<pt|en|es>.jpg` (400px de largura, JPEG q=80,
     a partir do `preview-<idioma>-capa.jpg`) — é ela que aparece no card da home.
  3. Copiar `landing-page/` → `produtos/<slug>/`, preencher os `CONFIG`, adicionar o bloco em
     `assets/produtos.js` (incluindo o campo `categoria` — hoje existem `saude-fitness` e
     `relacionamentos`; categoria nova = adicionar também em `window.CATEGORIAS_SITE`) e o
     produto em `netlify/functions/lib/produtos-email.mjs`.
  4. Cadastrar na Hotmart (textos em `CADASTRO-HOTMART.md`), colar os `linkCheckoutHotmart`
     reais. Só trocar `disponivel` pra `true` quando TODOS os idiomas tiverem checkout
     funcionando.
  5. Adicionar entrada em `sitemap.xml`.
  6. **Entrega pro dono do projeto (SEMPRE nessa mensagem, sem esperar ele pedir):** mandar os
     PDFs pagos (PT/EN/ES) como arquivo, mandar as capas (PT/EN/ES —
     `assets/produtos/<slug>/preview-<idioma>-capa.jpg`) como arquivo, e colar o texto de
     cadastro da Hotmart (Nome + Descrição, 3 idiomas) direto na mensagem de chat — não só
     referenciar o `CADASTRO-HOTMART.md`, colar o texto pronto pra copiar.
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
- **E-mail (Brevo) funcionando de ponta a ponta**, incluindo entregabilidade: domínio
  `nextlevelbr.app.br` autenticado no Brevo (DKIM 1/2, DMARC, brevo-code no DNS do
  Registro.br), remetente próprio `contato@nextlevelbr.app.br` (via ImprovMX + MX/SPF no
  DNS, `EMAIL_REMETENTE` setado no Netlify) em vez de `@outlook.com`, e endereço postal
  físico no rodapé de todo e-mail (CAN-SPAM). Diagnóstico em
  `/.netlify/functions/diagnostico`. Se mudar preço/nome de produto nas páginas, atualizar
  também `netlify/functions/lib/produtos-email.mjs`. O que resta (não é bug, é normal pra
  domínio novo): reputação ainda "esquentando" — pode cair no spam do Outlook em especial
  por mais um tempo; marcar "Não é spam" nos primeiros testes ajuda. Detalhes e melhorias
  futuras opcionais em `emails/LEIA-ME-BREVO.md`.
- **Meta Conversions API (CAPI) — ✅ LIGADA (jul/2026):** todo formulário de lead manda o
  evento "Lead" também por trás, direto do servidor (`netlify/functions/lib/meta-capi.mjs`),
  deduplicado com o Pixel do navegador pelo mesmo `eventId`. As env vars `META_ACCESS_TOKEN`
  e `META_TEST_EVENT_CODE` estão configuradas no Netlify e o diagnóstico confirmou o token
  aceito no pixel certo (`1817037532617722`). Obs: existe um conjunto de dados abandonado
  no Business Manager ("NextLevel Servidor", `4547029375545191`), criado sem querer durante
  a configuração — não usar, não atrapalha.
- **Cabeçalhos de segurança + JSON-LD:** `netlify.toml` define CSP/X-Frame-Options/etc. pro
  site todo; as páginas de produto geram automaticamente dados estruturados
  (Product/Offer) a partir do próprio `CONFIG`, sem nada pra manter sincronizado à mão.
- **Limite anti-abuso** no `lead-email`: barra flood por e-mail/IP repetido em sequência
  (best-effort, por instância da função — não é distribuído, mas já barra a maioria dos
  scripts de spam).

## Ordem do catálogo (`assets/produtos.js`)

A ordem dos produtos dentro de cada categoria em `window.PRODUTOS_SITE` **não é cronológica
(ordem de lançamento) — é estratégica**, pensada pra abrir cada seção com o produto de maior
apelo/gancho comercial e fechar com os mais nichados/avançados, formando uma jornada coerente
dentro da categoria (reorganizado em jul/2026):
- **Saúde e Fitness:** Emagrecimento → Desafio 30 Dias → Treino em Casa → Ganho de Massa →
  Treino Academia → Receitas Fitness → Suplementação Inteligente → Mobilidade/Alongamento →
  Mentalidade/Ansiedade/Hábitos.
- **Relacionamentos:** Ansiedade Social e Conversas com Naturalidade → Linguagem Corporal e
  Presença Social → Carisma, Humor e Storytelling → Comunicação e Relacionamento → Mensagens e
  Conversas Online → Primeiro Encontro → Confiança Social: Atração com Respeito → Limites,
  Rejeição e Maturidade Emocional.
- **Finanças:** Finanças Pessoais → Psicologia do Investidor → Investimentos do Zero →
  Renda Fixa Inteligente → FIIs do Zero → Dividendos e Renda Passiva → ETFs e Investimento
  Global → Imposto de Renda → Segurança Financeira e Golpes.

A ordem das **categorias** (Saúde e Fitness → Relacionamentos → Finanças, definida pela ordem
das chaves em `window.CATEGORIAS_SITE`) também é proposital: da categoria de apelo mais amplo
e emocional pra mais racional/considerada.

O selo "NOVO" **não depende mais da posição no array** (antes era sempre o último item) — segue
o campo explícito `novo: true` no produto (hoje em `produtividade-com-ia`, o mais recente).
Ao lançar um produto novo, mover o `novo: true` pra ele e remover do anterior. A mesma lógica
(`MAIS_NOVO`) também escolhe uma das 3 capas em leque do hero, junto com o 1º produto do array e
um do meio — em `index.html` / `index-en.html` / `index-es.html`.

## O que ainda falta (estado em julho/2026)

- **Anúncios Meta Ads:** copy por produto em `anuncios/prontos/` e por categoria em
  `anuncios/categorias/` (estratégia de isca grátis, jul/2026) — publicar fica por conta do
  dono no Business Manager. Ainda não publicado.
- **Combos (jul/2026, preços aprovados):** plano completo em `COMBOS-HOTMART.md` — order bump
  (2º produto a R$ 9,99/US$ 2,99; tabela pronta, config do lado do dono na Hotmart) e 5 kits
  (4 por categoria a R$ 49,99/US$ 14,99 + completo a R$ 99,99/US$ 29,99; textos de cadastro
  prontos). Quando o dono cadastrar os kits e mandar os checkouts, construir as páginas dos
  kits no site (catálogo/sitemap/cross-sell/e-mail).
- **Order bumps AO VIVO (jul/2026) — ✅ 90/90 aplicados:** o dono criou na Hotmart, via
  Checkout Builder, uma página de checkout com order bump pra cada produto/idioma. Os links têm
  o formato `pay.hotmart.com/<código>?off=<oferta>&checkoutMode=10` e estão aplicados no
  `linkCheckoutHotmart` de TODAS as 90 páginas (30 produtos × 3 idiomas). Detalhe do
  `investimentos` PT: o checkout correto é o do produto novo `T106813833H` (o antigo
  `Q106716967J` cobrava em USD — ver commit "Fix investimentos (PT) checkout link"); se o dono
  mandar de volta um link `Q106716967J`, NÃO aplicar. A validação por acesso direto a
  `pay.hotmart.com` não é possível daqui (política de rede bloqueia o domínio) — a checagem foi
  por consistência de códigos (base do link novo × base já usada na página), que pegou 3 erros
  de copia-e-cola na planilha original, todos corrigidos com links reenviados pelo dono. Falta
  só o dono conferir por amostragem no navegador (produto certo, R$ 19,99/US$ 4,99, bump de
  R$ 9,99/US$ 2,49 aparecendo).

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
