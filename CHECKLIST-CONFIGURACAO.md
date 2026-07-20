# Checklist de Configuração Manual

Passo a passo detalhado das contas e credenciais que precisam ser criadas fora deste repositório.
Nenhuma senha, token ou chave deve ser commitada aqui — cole as credenciais diretamente
nos arquivos indicados (eles já têm um campo `COLE_AQUI` / `PASTE_HERE` reservado para isso).

Nota: o domínio técnico do site continua `vendas-ja.netlify.app` (nome do projeto no Netlify),
mas a marca que aparece pro cliente em todas as páginas é **NextLevel**. Dá pra trocar o domínio
por um definitivo depois, em Domain management no Netlify, sem precisar mudar nada no código.

## Ordem recomendada

**Fase 1 — infraestrutura (fazer uma vez só, vale para todos os produtos):** passos 1 a 4 abaixo.
**Fase 2 — repetir a cada novo produto:** passo 5 em diante.

---

## 1. Firebase (banco de dados dos leads) — ✅ já configurado

Projeto **Vendas-JA** (ID `vendas-ja-99317`) já criado, com Realtime Database e regras de
segurança publicadas. O `firebaseConfig` já vem preenchido em todas as páginas de produto novas
(copiadas do `landing-page/`). Só repita os passos 1 a 3 se precisar recriar o projeto do zero —
o login do painel mudou pra **e-mail/senha** (mais simples que o Google Sign-In anterior, que
esbarrava em bloqueio de popup no celular e domínio não autorizado):

1. **console.firebase.google.com** → Adicionar projeto.
2. **Build → Realtime Database → Criar banco de dados** → modo bloqueado.
3. **Configurações → Configurações do projeto → Seus aplicativos → `</>` Web** → registrar e
   copiar o `firebaseConfig`.
4. **Build → Authentication → Sign-in method → E-mail/senha → Ativar**.
5. **Build → Authentication → Users → Add user** → digite o e-mail e a senha que vão usar pra
   entrar no painel de leads (`leads/painel-leads.html`). Pode criar mais de um usuário aqui se
   mais de uma pessoa precisar de acesso — não existe cadastro público, só quem for adicionado
   manualmente aqui consegue logar.
6. **Realtime Database → Regras**, colar:
   ```json
   {
     "rules": {
       "leads": {
         ".read": "auth != null",
         ".indexOn": ["data"],
         "$lead": {
           ".write": "!data.exists()",
           ".validate": "newData.hasChildren(['nome', 'email', 'produto', 'idioma', 'data'])",
           "nome":         { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 120" },
           "email":        { ".validate": "newData.isString() && newData.val().contains('@') && newData.val().length < 200" },
           "whatsapp":     { ".validate": "newData.isString() && newData.val().length < 40" },
           "produto":      { ".validate": "newData.isString() && newData.val().length < 120" },
           "idioma":       { ".validate": "newData.isString() && newData.val().length < 6" },
           "pagina":       { ".validate": "newData.isString() && newData.val().length < 500" },
           "data":         { ".validate": "newData.isString() && newData.val().length < 40" },
           "utm_source":   { ".validate": "newData.isString() && newData.val().length < 200" },
           "utm_medium":   { ".validate": "newData.isString() && newData.val().length < 200" },
           "utm_campaign": { ".validate": "newData.isString() && newData.val().length < 200" },
           "utm_content":  { ".validate": "newData.isString() && newData.val().length < 200" },
           "utm_term":     { ".validate": "newData.isString() && newData.val().length < 200" },
           "$outro":       { ".validate": false }
         }
       }
     }
   }
   ```
   > ⚠️ **Estas regras foram reforçadas em jul/2026** (anti-spam: só aceitam cadastro novo com
   > os campos esperados, tamanhos limitados e e-mail com @; ninguém apaga ou edita lead pelo
   > site). A leitura (`.read`) fica liberada pra qualquer usuário autenticado porque, com login
   > por e-mail/senha, **só existe conta pra quem vocês criarem manualmente no passo 5** — não
   > tem cadastro público, então não precisa travar por e-mail específico.
   >
   > Cole em **Realtime Database → Regras → Publicar** — 1 minuto, não afeta os leads salvos.

### 1a. Regras das avaliações de leitores — ⚠️ PENDENTE (obrigatório pro sistema de avaliações)

O site tem um sistema de avaliações reais com moderação (jul/2026): o formulário nas páginas
de produto salva em `avaliacoes-pendentes/<slug>`, **nada aparece no site** até você aprovar no
painel (`leads/painel-leads.html`), e a aprovação move para `avaliacoes-publicadas/<slug>`, que
é o único nó que as páginas leem. Para funcionar, as regras do Realtime Database precisam ganhar
os dois blocos abaixo — **cole DENTRO de `"rules": { ... }`, ao lado do bloco `"leads"`**, e
publique:

```json
"avaliacoes-pendentes": {
  ".read": "auth != null",
  "$slug": {
    "$avaliacao": {
      ".write": "!data.exists() || auth != null",
      ".validate": "newData.hasChildren(['nome', 'email', 'nota', 'comentario', 'idioma', 'data'])",
      "nome":       { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 80" },
      "email":      { ".validate": "newData.isString() && newData.val().contains('@') && newData.val().length < 200" },
      "nota":       { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 5" },
      "comentario": { ".validate": "newData.isString() && newData.val().length > 10 && newData.val().length < 1200" },
      "idioma":     { ".validate": "newData.isString() && newData.val().length < 6" },
      "data":       { ".validate": "newData.isString() && newData.val().length < 40" },
      "$outro":     { ".validate": false }
    }
  }
},
"avaliacoes-publicadas": {
  ".read": true,
  ".write": "auth != null"
}
```

O que as regras garantem: visitante só consegue **criar** avaliação pendente (com campos
validados — nunca editar/apagar nada); só usuário autenticado (você, no painel) lê a fila,
aprova ou recusa; e a parte pública (`avaliacoes-publicadas`) só aceita escrita autenticada.
O e-mail do avaliador fica **só na fila de moderação** — a versão publicada não o contém.

Enquanto essas regras não forem publicadas, o site continua normal — o formulário aparece,
mas o envio retorna erro amigável e nenhuma avaliação é aceita.

---

## 2. Meta Business Manager (conta de anúncios) — ✅ já configurado

Pixel criado e ativo (ID `1817037532617722`, colado em `assets/config-global.js`), conta de
anúncios `2104501427133123` com pagamento cadastrado, domínio `nextlevelbr.app.br` verificado
(via registro TXT no DNS). Só repita os passos abaixo se precisar recriar do zero:

1. **business.facebook.com** → Criar conta → nome da empresa, seu nome, e-mail comercial.
2. **Configurações do Business → Contas → Contas de anúncios → Adicionar → Criar nova conta de
   anúncios** → fuso horário (Brasília), moeda (BRL, ou a do primeiro país-alvo).
3. **Métodos de pagamento** → cadastrar cartão.
4. **Centro de segurança → Verificação da empresa** → enviar CNPJ (pode ficar pendente, não
   bloqueia o resto).
5. **business.facebook.com/events_manager → Conectar fontes de dados → Web → Pixel do Meta** →
   nome → URL da página (ex: `https://vendas-ja.netlify.app`) → Configurar manualmente.
6. Copiar o **ID do Pixel** e colar em `pixelId` no arquivo `assets/config-global.js` — **um
   lugar só**, todas as páginas (de todos os produtos e idiomas) passam a medir automaticamente.

Se a tela de conectar Pixel não carregar: tentar aba anônima, desativar bloqueador de
anúncios/rastreamento, ou tentar em outro navegador/computador.

---

## 3. Hotmart — ✅ conta já existente

Conta de produtor já existe. Antes de cadastrar cada produto nesta plataforma, confira em
**Configurações → Verificação de identidade** se está aprovada (só é obrigatório pra sacar
valores, não bloqueia nada antes disso).

### 3a. Webhook de compra → evento "Purchase" na Meta — ✅ configurado e testado (15/jul/2026)

Antes o Meta só recebia o evento "Lead" (quando alguém deixa o e-mail) — o checkout inteiro
acontece na Hotmart, fora do site, e o Meta nunca ficava sabendo quem de fato *comprou*.
Isso limitava a otimização de anúncio, que aprende muito melhor com sinal de compra do que
só de topo de funil. A function `netlify/functions/hotmart-webhook.mjs` fecha esse buraco e
já está **ativa e validada com um evento de teste real** — resumo de como ficou configurado:

1. **Hotmart → Ferramentas → Webhook → Criar webhook** (uma vez, vale pra todos os produtos
   já cadastrados e os futuros — não precisa repetir por produto).
2. **URL de destino:** `https://nextlevelbr.app.br/.netlify/functions/hotmart-webhook`.
3. **Eventos:** marcados todos (deixar marcado tudo é seguro — a function só age em "Compra
   aprovada"/`PURCHASE_APPROVED` e "Compra completa"/`PURCHASE_COMPLETE`; qualquer outro
   evento recebido é ignorado silenciosamente com 200 OK, sem gerar erro nem custo). Dedup
   pelo número da transação evita contar a mesma venda 2x pro Meta.
4. A Hotmart manda o **token (Hottok)** no header `X-Hotmart-Hottok` de cada chamada (não no
   corpo do JSON, como a documentação pública sugeria) — o valor gerado pela Hotmart está
   colado no Netlify (Environment variables) como **`HOTMART_HOTTOK`**.
5. **Testado:** um evento de teste `PURCHASE_APPROVED` real passou pelo pipeline inteiro —
   o log do Netlify mostrou "Purchase enviado" com transação, produto, preço e moeda todos
   corretos, confirmando que os caminhos de campo (`data.buyer.email`,
   `data.purchase.transaction`/`price`, `data.product.name`) batem com o payload real da
   Hotmart. Não precisa mexer em nada — só acompanhar o Gerenciador de Eventos do Meta na
   primeira venda de verdade pra confirmar que o evento "Purchase" chega lá também.

---

## 4. Netlify (publicar o site, com todos os produtos)

O site já está publicado em **vendas-ja.netlify.app**. Como agora o repositório tem várias
páginas (uma por produto, mais o catálogo), é preciso ajustar a configuração do site pra publicar
a partir da **raiz do repositório**, não mais só da pasta `landing-page`:

1. No painel do site, no Netlify: **Site settings → Build & deploy → Build settings → Edit
   settings**.
2. **Base directory**: deixe em branco (ou `/`).
3. **Publish directory**: deixe em branco (ou `.`).
4. Salve e force um novo deploy (**Deploys → Trigger deploy → Deploy site**).

Depois disso, cada produto fica acessível assim:
- Catálogo: `https://vendas-ja.netlify.app/`
- Produto: `https://vendas-ja.netlify.app/produtos/nome-do-produto/`
- Painel de leads: `https://vendas-ja.netlify.app/leads/painel-leads.html`
- Gerador de ebook: `https://vendas-ja.netlify.app/ebooks/gerador-ebook.html`

---

## 4b. Domínio próprio — ✅ feito (`nextlevelbr.app.br`)

Registrado no Registro.br, apontado pro Netlify (A `75.2.60.5` + CNAME www), HTTPS ativo,
URLs do código atualizadas e domínio verificado no Meta. Os passos abaixo ficam de
referência caso um dia troquem de domínio:

Os PDFs dos ebooks terão links pro site dentro deles — link impresso não se corrige depois.
Por isso, decida o domínio definitivo antes de gerar os PDFs. Duas opções:

**Opção A — continuar no `vendas-ja.netlify.app`:** válido, custo zero. Só saiba que a URL
aparece nos anúncios e nos ebooks.

**Opção B — domínio próprio (ex: `nextlevel-oficial.com`, ~R$ 40/ano):**
1. Registrar em **registro.br** (domínios `.com.br`) ou **cloudflare.com** (`.com`).
2. No Netlify: painel do site → **Domain management → Add a domain** → digitar o domínio →
   seguir as instruções de DNS que o Netlify mostrar (apontar CNAME/A no registrador).
3. Aguardar o HTTPS ativar (automático, minutos até algumas horas).
4. **Avisar o Claude** pra trocar todas as URLs do código (sitemap, hreflang, Open Graph,
   robots.txt) pro domínio novo — é uma mudança de minutos.
5. Depois disso, verificar o domínio no Meta: **Configurações do Business → Segurança da
   marca → Domínios → Adicionar** → escolher verificação por meta-tag → mandar a tag pro
   Claude instalar no site → voltar e clicar em Verificar.
Obs.: como o login do painel de leads agora é por e-mail/senha (não é mais Google Sign-In), não
é preciso autorizar o domínio novo no Firebase Authentication — o login funciona igual em
qualquer domínio que sirva o site.

---

## 4c. Sequência de e-mails automática — ✅ configurada e testada (jul/2026)

A automação inteira está em código (`netlify/functions/`): e-mail 1 na hora do cadastro,
e-mail 2 após 2 dias, e-mail 3 após 4 dias, com descadastro LGPD embutido. A chave
`BREVO_API_KEY` já está nas variáveis de ambiente do Netlify e o envio foi testado com
sucesso (e-mail de teste entregue).

**Entregabilidade (jul/2026): domínio autenticado + remetente próprio.** O domínio
`nextlevelbr.app.br` está autenticado no Brevo (DKIM 1/2, DMARC, brevo-code no DNS do
Registro.br) e o remetente passou a ser `contato@nextlevelbr.app.br` (criado via
ImprovMX, `EMAIL_REMETENTE` configurado no Netlify) em vez de um e-mail `@outlook.com`.
Todo e-mail também tem o endereço postal físico da empresa no rodapé (exigência do
CAN-SPAM Act pra e-mail comercial). O que resta é só a reputação do domínio novo se
firmar com o tempo (Outlook demora mais que o Gmail) — detalhes em
`emails/LEIA-ME-BREVO.md`.

A mesma página também confere a **Meta Conversions API** (ver seção abaixo).

**Página de diagnóstico** (testa a cadeia inteira e explica o que estiver faltando):
`https://nextlevelbr.app.br/.netlify/functions/diagnostico`
— use sempre que suspeitar que os e-mails pararam. Se um dia trocar a chave no Brevo,
atualize a variável no Netlify e dispare novo deploy (variável só vale no deploy seguinte).

---

## 4d. Meta Conversions API (CAPI) — ✅ configurada e testada (jul/2026)

Reforço server-side do evento "Lead": além do Pixel do navegador, o servidor manda o
mesmo evento por trás (`netlify/functions/lib/meta-capi.mjs`), deduplicado pelo mesmo
`eventId`. Configurado com um usuário do sistema no Business Manager (`Conversions API
System User`) com acesso total ao Pixel `NextLevel`, e as variáveis `META_ACCESS_TOKEN` e
`META_TEST_EVENT_CODE` no Netlify. Teste confirmado no Gerenciador de Eventos → aba Test
Events: evento "Lead" recebido do Servidor, status "Processado".

**Pra testar com segurança** (sem contar como lead de verdade na conta de anúncios):
1. Gerenciador de Eventos (business.facebook.com/events_manager) → seu pixel → aba
   **Test Events** → copie o código de teste mostrado ali.
2. Netlify → Environment variables → criar **`META_TEST_EVENT_CODE`** com esse código →
   Trigger deploy.
3. Abra a página de diagnóstico (seção 4c acima) — com as duas variáveis configuradas,
   aparece o botão **"Enviar evento de teste pra Conversions API"**. Clique e confira se
   o evento aparece na aba Test Events em alguns segundos.

Sem `META_ACCESS_TOKEN`, essa parte fica desligada e o site funciona normal — só o Pixel
do navegador continua sozinho, sem o reforço server-side.

---

## 4e. Google Analytics 4 e Search Console — ✅ configurado (15/jul/2026)

Antes o site só media quem chegava por anúncio (Pixel do Meta), sem visibilidade nenhuma de
tráfego orgânico/busca. Agora os dois estão ativos:

**Google Analytics 4:** propriedade criada, ID de mensuração `G-RVZC5Z9GWC` colado em
`assets/config-global.js` (campo `gaId`) e publicado. Confirmado por teste automatizado que
o script só carrega depois que o visitante aceita o banner de cookies (`assets/consent.js`),
em todas as páginas — nenhum dado é medido sem consentimento.

**Google Search Console:** propriedade tipo Domínio (`nextlevelbr.app.br`) verificada via
TXT no Registro.br, e o sitemap (`https://nextlevelbr.app.br/sitemap.xml`) já foi enviado
pra acelerar a indexação.

### 4f. Compra ("purchase") no GA4 — ⚠️ PENDENTE (1 chave, 2 minutos)

O checkout acontece na Hotmart, fora do site, então o GA4 do navegador nunca vê a venda — o
funil do Analytics morria no `begin_checkout`. O `hotmart-webhook` agora manda a compra
também pro GA4 (via Measurement Protocol, `lib/ga4-mp.mjs`), no mesmo momento em que já
avisa o Meta. Falta só a chave:

1. **analytics.google.com** → **Admin** (engrenagem) → coluna do meio → **Fluxos de dados** →
   clicar no fluxo do site (`nextlevelbr.app.br`).
2. Rolar até **"Chaves secretas da API do Measurement Protocol"** (Measurement Protocol API
   secrets) → **Criar** → dar um nome (ex.: `hotmart-webhook`) → copiar o **valor da chave**.
3. **app.netlify.com** → site → **Site configuration → Environment variables → Add a
   variable** → Key: `GA4_API_SECRET` → Value: a chave → salvar → **Deploys → Trigger
   deploy**.
4. Pronto. Na próxima compra aprovada (ou evento de teste da Hotmart), o GA4 recebe o evento
   `purchase` com valor, moeda e produto — conferir em **Relatórios → Tempo real** ou, no dia
   seguinte, em **Relatórios → Monetização**. Enquanto a env var não existir, nada quebra — o
   webhook só registra "GA4 pulado" no log.

---

## 5. A cada novo produto (repetir esta parte)

1. Cadastrar o produto na Hotmart → copiar o **link de checkout** (um por idioma/moeda, se os
   preços forem diferentes).
2. Duplicar `landing-page/` (já vem com as 3 versões PT/EN/ES) para
   `produtos/<nome-do-produto>/` e editar o `CONFIG` em cada uma das 3 (headline, benefícios,
   depoimentos, preço, `linkCheckoutHotmart`, `linkEbookGratis`, FAQ), cada uma na língua certa.
3. Adicionar o bloco do produto em `assets/produtos.js` (um lugar só — o catálogo dos 3 idiomas
   atualiza junto). Quando o produto estiver pronto pra vender, trocar `disponivel: false` por
   `true` pra sumir o selo "Em breve".
4. Gerar os 3 ebooks gratuitos (um por idioma) em `ebooks/gerador-ebook.html` e subir os PDFs em
   `ebooks/arquivos/` seguindo a convenção `<slug>-pt.pdf` / `<slug>-en.pdf` / `<slug>-es.pdf`.
   Com o `linkEbookGratis` preenchido, a entrega é instantânea no idioma da página.
5. E-mails: **nada a fazer por produto** — a sequência de 3 e-mails é enviada automaticamente
   por código (funções do Netlify + API do Brevo, no idioma certo, com o link do ebook do
   produto). Configuração única na seção 4c abaixo; detalhes em `emails/LEIA-ME-BREVO.md`.
6. Commit + push — o Netlify publica sozinho. (Pra mudanças pequenas dá pra editar direto no
   github.com: abrir o arquivo → botão de lápis → Commit changes.)
7. Montar a campanha no Meta Ads usando `anuncios/copy-facebook-br.md` (para PT) ou
   `-internacional.md` (para EN/ES), respeitando os avisos de política por nicho descritos lá.

## 5b. E-mail de contato das páginas legais (fazer uma vez, na Fase 1)

O site tem Política de Privacidade e Termos de Uso (`legal/`, nos 3 idiomas) — o Meta costuma
exigir esse link na página pra aprovar anúncio, e a LGPD exige um canal de contato pro titular
dos dados. Defina qual e-mail vai atender esses pedidos (pode ser um Gmail) e cole no campo
`emailContato` de `assets/config-global.js`. Enquanto estiver `COLE_AQUI`, as páginas legais
mostram um texto genérico ("pelos nossos canais de atendimento") em vez do e-mail.

---

## 6. Teste do funil (fazer pra cada produto novo)

Abrir a página do produto publicada → preencher o formulário → conferir no
`leads/painel-leads.html` se o lead apareceu, já identificado com o nome certo do produto →
conferir no Gerenciador de Eventos do Meta se `PageView` e `Lead` dispararam → clicar no botão de
compra e confirmar que abre o checkout certo da Hotmart.
