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
| `assets/config-global.js` | **Único lugar** do Pixel do Meta (`pixelId`) e do Firebase — vale pro site todo |
| `assets/produtos.js` | **Único lugar** do catálogo (títulos/resumos nos 3 idiomas, flag `disponivel`, campo `categoria` + metadados `CATEGORIAS_SITE`) |
| `index.html` / `-en` / `-es` | Página inicial (redesign dark premium, jul/2026): catálogo completo com capas (`thumb-<idioma>.jpg`), busca em tempo real, filtro por categoria, selo "NOVO" automático (último de `PRODUTOS_SITE`), seção "Como funciona", faixa de confiança, captura de lead (select de objetivo → entrega o ebook gratuito de `treino-em-casa` ou `confianca-social` e dispara a mesma automação `lead-email` dos produtos) e JSON-LD ItemList |
| `categorias/` | Página "Explore por categoria" (3 idiomas): os chips FILTRAM os produtos — chegando com `#<categoria>` na URL (como os cards da home linkam) só aparece aquela categoria; "✨ Todos os guias" mostra tudo. Tem busca por texto (ignora acentos, atravessa as categorias) e JSON-LD ItemList. Categoria sem produto listado não aparece. O header de toda página de produto tem link "Categorias" ao lado do seletor de idiomas |
| `landing-page/` | Template em branco (3 idiomas) — copiar pra criar produto novo |
| `produtos/<slug>/` | Página de vendas de cada produto (3 idiomas, `CONFIG` no topo de cada uma) |
| `ebooks/` | Gerador de ebook em PDF + `arquivos/` com os PDFs entregues (`<slug>-<idioma>.pdf`) |
| `anuncios/` | Templates de copy para Meta Ads (BR e internacional), com regras por nicho |
| `leads/painel-leads.html` | Painel de leads (login e-mail/senha) com exportação CSV |
| `legal/` | Política de privacidade + termos de uso (3 idiomas) — exigidos pelo Meta Ads e LGPD |
| `assets/consent.js` | Banner de cookies (3 idiomas): o Pixel só liga depois que o visitante aceita |
| `emails/` | Conteúdo dos e-mails da sequência (3 × 3 idiomas, visual da marca) + `LEIA-ME-BREVO.md` |
| `netlify/functions/` | Automação de e-mail via API do Brevo: `lead-email` (e-mail 1 no cadastro + eco do evento pra Meta Conversions API + limite anti-abuso), `sequencia-diaria` (e-mails 2 e 3, agendada 12h UTC), `descadastrar` (LGPD). Exige env var `BREVO_API_KEY`; `META_ACCESS_TOKEN` já configurada (Conversions API ligada desde jul/2026) |
| `404.html`, `sitemap.xml`, `robots.txt` | Página de erro, sitemap com hreflang e bloqueio de indexação de `/leads/` e `/ebooks/` |
| `netlify.toml` | Além do build, define os cabeçalhos de segurança (CSP, X-Frame-Options etc.) pro site todo |

Leads são salvos no Firebase (projeto `vendas-ja-99317`) com produto + idioma + UTMs.
Quem se cadastra recebe o ebook gratuito na hora, no idioma da página (campo
`linkEbookGratis` do `CONFIG`). O formulário tem honeypot anti-spam (campo `#lead-site`
escondido — robô que preenche é ignorado sem salvar).

As páginas de produto têm SEO/social prontos: favicon, Open Graph com **imagem própria por
produto/idioma** (`assets/produtos/<slug>/og-<pt|en|es>.jpg`, 1200×630, gerada a partir da capa
do guia — ao criar produto novo, gerar junto com a galeria), canonical + hreflang gerados por JS
a partir da própria URL. As home pages têm as mesmas tags, estáticas (imagem genérica
`assets/og-image*.png`). **O Pixel do Meta (com banner de consentimento) roda em TODAS as
páginas**: produto, home e `/categorias/` — as duas últimas só PageView, sem Firebase.

## Catálogo atual

**Por decisão do dono do projeto (jul/2026), `assets/produtos.js` só lista produtos que JÁ
estão sendo vendidos de verdade** (checkout Hotmart real em pelo menos uma moeda) — hoje são
`treino-em-casa`, `suplementacao-inteligente`, `receitas-fitness`, `desafio-30-dias`,
`emagrecimento`, `ganho-de-massa`, `treino-academia`, `mentalidade-ansiedade-habitos`,
`mobilidade-alongamento-prevencao`, `confianca-social`, `carisma-humor-storytelling`,
`comunicacao-e-relacionamentos`, `atracao-com-respeito` e `presenca-social`, todos Saúde. O único produto ainda em rascunho
(`investimentos`) **continua fora do catálogo público e do `sitemap.xml`**, mas a pasta
`produtos/investimentos/` continua no repositório (CONFIG de exemplo já preenchido: headline,
benefícios, FAQ, preços R$97→47 / $37→19, `linkEbookGratis` convencionado) pra reaproveitar
quando/se virar produto de verdade — basta cadastrar na Hotmart, colar o
`linkCheckoutHotmart` real e adicionar de volta o bloco em `assets/produtos.js` (e uma entrada
em `sitemap.xml`). Depoimentos ficam vazios (`depoimentos: []`, seção some sozinha) até existir
depoimento real e autorizado — **inventar depoimento é vetado** (Meta Ads + CDC).

**`treino-em-casa` (jul/2026, 6º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** CONFIG completo, ebooks gratuitos (isca, 7 páginas cada) em
`ebooks/arquivos/treino-em-casa-<pt|en|es>.pdf`, galeria "olhe por dentro" com 5 páginas de
amostra do manual em `assets/produtos/treino-em-casa/` (3 idiomas). Checkout real nas 3
moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/S106595121K` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/F106595630M` (US$ 19)
- ES/USD: `https://pay.hotmart.com/V106595694E` (US$ 19)

**`suplementacao-inteligente` (jul/2026, 7º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos
3 idiomas.** Guia pago de 50 páginas + ebook gratuito (isca, 7 páginas) nos 3 idiomas,
`ebooks/arquivos/suplementacao-inteligente-<pt|en|es>.pdf`. Ainda sem galeria "olhe por dentro"
(nenhum preview gerado pra este produto). Preço final definido pelo dono do projeto: **R$ 49,99
(PT) / US$ 19,00 (EN/ES)** — já salvo nas 3 páginas e em `produtos-email.mjs`. Checkout real nas
3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/T106596501Y` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/L106596626U` (US$ 19)
- ES/USD: `https://pay.hotmart.com/K106596585A` (US$ 19)

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
amostra em `assets/produtos/receitas-fitness/` (3 idiomas). Preço padrão da coleção: **R$ 49,99
(PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/N106607533X` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/P106607574X` (US$ 19)
- ES/USD: `https://pay.hotmart.com/U106607614K` (US$ 19)

**`desafio-30-dias` (jul/2026, 9º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Guia pago de 36 páginas (sistema de pontuação semanal, treinos A/B/C com cardio e
mobilidade, cardápios flexíveis, protocolo anti-impulso, cronograma de 30 dias condensado em 4
páginas semanais, planner e plano de continuidade de 90 dias) + ebook gratuito (isca, 6
páginas) nos 3 idiomas, `ebooks/arquivos/desafio-30-dias-<pt|en|es>.pdf`. Galeria "olhe por
dentro" com 5 páginas de amostra em `assets/produtos/desafio-30-dias/` (3 idiomas). Preço padrão
da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas, `disponivel:
true`:
- PT/BRL: `https://pay.hotmart.com/L106608497Y` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/A106608536W` (US$ 19)
- ES/USD: `https://pay.hotmart.com/N106608560T` (US$ 19)

**`emagrecimento` (jul/2026, 10º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Reaproveitou o slug/pasta que já existia como rascunho (nicho sensível — ver regras
abaixo). Guia pago de 40 páginas (prato inteligente, método das mãos, cardápio flexível de 14
dias, treinos A/B com progressão de 4 semanas, protocolo P.A.U.S.A. contra a fome emocional,
plano de 30 dias, caderno de execução com planners) + ebook gratuito (isca, 6 páginas) nos 3
idiomas, `ebooks/arquivos/emagrecimento-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5 páginas
de amostra em `assets/produtos/emagrecimento/` (3 idiomas). Todo o conteúdo (headline, FAQ,
ebook, capa, Hotmart) foi escrito sem promessa numérica de peso, sem foto antes/depois e sem
linguagem de vergonha corporal, seguindo a regra do nicho sensível já documentada neste arquivo.
Preço padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/H106609158K` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/W106609196K` (US$ 19)
- ES/USD: `https://pay.hotmart.com/G106609215L` (US$ 19)

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
Preço padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/W106610896N` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/Y106610935L` (US$ 19)
- ES/USD: `https://pay.hotmart.com/F106610965B` (US$ 19)

**`treino-academia` (jul/2026, 12º produto — "Coleção Projeto Verão") — ✅ AO VIVO nos 3
idiomas.** Produto novo (sem pasta de rascunho prévia). Guia pago de 36 páginas (6 pilares da
evolução, dieta por objetivo com cardápio de 7 dias, treinos A/B por grupo muscular — peito,
costas, ombros, braços, pernas e core —, 4 divisões semanais prontas de 3x a 6x, cronograma de
12 semanas em fases, cardio e mobilidade, planners de evolução, biblioteca de exercícios e
fichas prontas Full Body/Superior-Inferior/Push-Pull-Legs) + ebook gratuito (isca, 6 páginas)
nos 3 idiomas, `ebooks/arquivos/treino-academia-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/treino-academia/` (3 idiomas). Preço padrão da coleção:
**R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/Y106612661T` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/J106612684I` (US$ 19)
- ES/USD: `https://pay.hotmart.com/X106612700Y` (US$ 19)

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
49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/Q106613382C` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/N106613402F` (US$ 19)
- ES/USD: `https://pay.hotmart.com/B106613410C` (US$ 19)

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
padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/P106614336M` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/T106614345B` (US$ 19)
- ES/USD: `https://pay.hotmart.com/C106614359D` (US$ 19)

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
arquivo. Preço padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3
moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/K106617805B` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/I106617832D` (US$ 19)
- ES/USD: `https://pay.hotmart.com/Y106617848F` (US$ 19)

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
`confianca-social`. Preço padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real
nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106618653J` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/X106618676C` (US$ 19)
- ES/USD: `https://pay.hotmart.com/Q106618694P` (US$ 19)

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
`confianca-social` e do `carisma-humor-storytelling`. Preço padrão da coleção: **R$ 49,99 (PT) /
US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/O106619803O` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/D106619836D` (US$ 19)
- ES/USD: `https://pay.hotmart.com/Q106619860V` (US$ 19)

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
`comunicacao-e-relacionamentos`. Preço padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**.
Checkout real nas 3 moedas, `disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/I106620409B` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/L106620441I` (US$ 19)
- ES/USD: `https://pay.hotmart.com/Q106620456T` (US$ 19)

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
Preço padrão da coleção: **R$ 49,99 (PT) / US$ 19,00 (EN/ES)**. Checkout real nas 3 moedas,
`disponivel: true`:
- PT/BRL: `https://pay.hotmart.com/E106621916S` (R$ 49,99)
- EN/USD: `https://pay.hotmart.com/N106621947M` (US$ 19)
- ES/USD: `https://pay.hotmart.com/A106621974F` (US$ 19)

**`limites-rejeicao-maturidade` (jul/2026, 20º produto — "Limites, Rejeição e Maturidade
Emocional", mesma nova vertente "Conexões, Presença e Relacionamentos Saudáveis") — ⏳ conteúdo
pronto, aguardando cadastro na Hotmart.** Produto novo, a partir de um rascunho enviado pelo dono
do projeto — distinto dos demais produtos da vertente por focar em comunicar limites pessoais e
lidar com rejeição e ciúme com maturidade emocional. Guia pago de 65 páginas (fundamentos de
maturidade emocional, como descobrir os próprios limites, limites digitais saudáveis, limite x
controle, o que a rejeição realmente significa, como responder a um não com dignidade, o
protocolo das primeiras 24 horas, textos que não se deve enviar, autoestima depois do não, quando
insistência vira invasão, o ciclo do impulso, o Protocolo P.A.R.A. para regular
ansiedade/ciúme/vergonha, ciúme e insegurança sem controle, dinâmicas ruins e red flags, e um
plano de execução de 30 dias com workbook completo — mapa de limites, frases de encerramento
elegante e plano de continuidade de 90 dias) + ebook gratuito (isca, 6 páginas) nos 3 idiomas,
`ebooks/arquivos/limites-rejeicao-maturidade-<pt|en|es>.pdf`. Galeria "olhe por dentro" com 5
páginas de amostra em `assets/produtos/limites-rejeicao-maturidade/` (3 idiomas). Todo o conteúdo
(headline, FAQ, ebook, capa, Hotmart) reconhece que o outro sempre tem liberdade para dizer sim,
não ou talvez, e explicitamente não ensina manipulação, pressão, insistência após um "não" ou
qualquer jogo emocional — segue a mesma regra de nicho sensível de relacionamentos do
`confianca-social`, do `carisma-humor-storytelling`, do `comunicacao-e-relacionamentos`, do
`atracao-com-respeito` e do `presenca-social`. Preço padrão da coleção: **R$ 49,99 (PT) / US$
19,00 (EN/ES)**. Páginas de produto (3 idiomas) e bloco em `assets/produtos.js` já criados com
`disponivel: false` (aparece na home com selo "Em breve") — falta só cadastrar na Hotmart (textos
prontos em `CADASTRO-HOTMART.md`, seção 20), colar os `linkCheckoutHotmart` reais nas 3 páginas,
trocar `disponivel` pra `true` e adicionar a entrada em `sitemap.xml`.

**Os produtos pagos (manuais completos, 3 idiomas cada) NÃO ficam no repositório** — foram
entregues direto pro dono do projeto pra upload manual na Hotmart (ebook comercial, não pode
ficar público no site), assim como as capas (imagem estilo capa de ebook, 3 idiomas cada). Falta
só, opcionalmente, copy de anúncio Meta Ads em `anuncios/` pros produtos ao vivo.

## Como fazer alterações comuns

- **Preço, headline, benefícios, FAQ, checkout Hotmart de um produto:** editar o `CONFIG` no
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

## O que ainda falta (estado em julho/2026)

- **`investimentos`** continua com CONFIG de exemplo em `produtos/investimentos/`, mas fora do
  catálogo público e com `<meta name="robots" content="noindex">` nas 3 páginas — só volta a
  aparecer no site quando tiver ebook real + checkout Hotmart real (aí é só tirar o noindex).
- **`limites-rejeicao-maturidade`** já tem ebook pago + gratuito, capa, galeria e páginas de
  produto prontos nos 3 idiomas, e o bloco em `assets/produtos.js` com `disponivel: false`
  (aparece na home com selo "Em breve") — falta só cadastrar na Hotmart (textos em
  `CADASTRO-HOTMART.md`, seção 20), colar os `linkCheckoutHotmart` reais, trocar `disponivel`
  pra `true` e adicionar a entrada em `sitemap.xml`.
- **Anúncios Meta Ads:** copy pronta por produto em `anuncios/prontos/` — publicar só quando
  o produto estiver vendável (checkout real + `disponivel: true`). Ainda não feito pra nenhum
  dos produtos ao vivo.

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
