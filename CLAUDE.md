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
| `leads/painel-leads.html` | Painel de leads (login e-mail/senha) com exportação CSV |
| `legal/` | Política de privacidade + termos de uso (3 idiomas) — exigidos pelo Meta Ads e LGPD |
| `assets/consent.js` | Banner de cookies (3 idiomas): o Pixel só liga depois que o visitante aceita |
| `emails/` | Conteúdo dos e-mails da sequência (3 × 3 idiomas, visual da marca) + `LEIA-ME-BREVO.md` |
| `netlify/functions/` | Automação de e-mail via API do Brevo: `lead-email` (e-mail 1 no cadastro + eco do evento pra Meta Conversions API + limite anti-abuso), `sequencia-diaria` (e-mails 2 e 3, agendada 12h UTC), `descadastrar` (LGPD). Exige env var `BREVO_API_KEY`; `META_ACCESS_TOKEN` é opcional (liga a Conversions API) |
| `404.html`, `sitemap.xml`, `robots.txt` | Página de erro, sitemap com hreflang e bloqueio de indexação de `/leads/` e `/ebooks/` |
| `netlify.toml` | Além do build, define os cabeçalhos de segurança (CSP, X-Frame-Options etc.) pro site todo |

Leads são salvos no Firebase (projeto `vendas-ja-99317`) com produto + idioma + UTMs.
Quem se cadastra recebe o ebook gratuito na hora, no idioma da página (campo
`linkEbookGratis` do `CONFIG`). O formulário tem honeypot anti-spam (campo `#lead-site`
escondido — robô que preenche é ignorado sem salvar).

As páginas de produto têm SEO/social prontos: favicon, Open Graph (imagem em
`assets/og-image.png`), canonical + hreflang gerados por JS a partir da própria URL.
As home pages têm as mesmas tags, estáticas.

## Catálogo atual

**Por decisão do dono do projeto (jul/2026), `assets/produtos.js` só lista produtos que JÁ
estão sendo vendidos de verdade** (checkout Hotmart real em pelo menos uma moeda) — hoje são
`treino-em-casa`, `suplementacao-inteligente`, `receitas-fitness`, `desafio-30-dias`,
`emagrecimento`, `ganho-de-massa`, `treino-academia`, `mentalidade-ansiedade-habitos` e
`mobilidade-alongamento-prevencao`, todos Saúde. Os 3 produtos ainda em rascunho
(`investimentos`, `confianca-social`,
`comunicacao-e-relacionamentos`) **continuam fora do catálogo público e do `sitemap.xml`**,
mas as pastas `produtos/<slug>/` continuam no repositório (CONFIG de exemplo já preenchido:
headline, benefícios, FAQ, preços R$97→47 / $37→19, `linkEbookGratis` convencionado) pra
reaproveitar quando/se algum deles virar produto de verdade — basta cadastrar na Hotmart,
colar o `linkCheckoutHotmart` real e adicionar de volta o bloco em `assets/produtos.js` (e uma
entrada em `sitemap.xml`). Depoimentos ficam vazios (`depoimentos: []`, seção some sozinha) até
existir depoimento real e autorizado — **inventar depoimento é vetado** (Meta Ads + CDC).

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

**Os produtos pagos (manuais completos, 3 idiomas cada) NÃO ficam no repositório** — foram
entregues direto pro dono do projeto pra upload manual na Hotmart (ebook comercial, não pode
ficar público no site), assim como as capas (imagem estilo capa de ebook, 3 idiomas cada). Falta
só, opcionalmente, copy de anúncio Meta Ads em `anuncios/` pros nove produtos.

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
  3. Copiar `landing-page/` → `produtos/<slug>/`, preencher os `CONFIG`, adicionar o bloco em
     `assets/produtos.js` e o produto em `netlify/functions/lib/produtos-email.mjs`.
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
- **Meta Conversions API (CAPI):** todo formulário de lead já manda o evento "Lead" também
  por trás, direto do servidor (`netlify/functions/lib/meta-capi.mjs`), deduplicado com o
  Pixel do navegador pelo mesmo `eventId`. Fica desligada até existir a env var
  `META_ACCESS_TOKEN` no Netlify (System User Access Token gerado no Business Manager) —
  sem ela, o site funciona normal, só sem o reforço server-side.
- **Cabeçalhos de segurança + JSON-LD:** `netlify.toml` define CSP/X-Frame-Options/etc. pro
  site todo; as páginas de produto geram automaticamente dados estruturados
  (Product/Offer) a partir do próprio `CONFIG`, sem nada pra manter sincronizado à mão.
- **Limite anti-abuso** no `lead-email`: barra flood por e-mail/IP repetido em sequência
  (best-effort, por instância da função — não é distribuído, mas já barra a maioria dos
  scripts de spam).

## O que ainda falta (estado em julho/2026)

- **Os 3 produtos em rascunho** (`investimentos`,
  `confianca-social`, `comunicacao-e-relacionamentos`) continuam com CONFIG de exemplo em
  `produtos/<slug>/`, mas fora do catálogo público — só voltam a aparecer no site quando
  tiverem ebook real + checkout Hotmart real, igual aos nove já ao vivo.
- **Anúncios Meta Ads:** copy pronta por produto em `anuncios/prontos/` — publicar só quando
  o produto estiver vendável (checkout real + `disponivel: true`). Ainda não feito pra nenhum
  dos nove produtos ao vivo.

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
