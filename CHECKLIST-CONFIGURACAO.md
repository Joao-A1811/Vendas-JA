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

## 4c. Sequência de e-mails automática (fazer uma vez) — ⏳ falta só a chave da API

A automação inteira já está em código (`netlify/functions/`): e-mail 1 na hora do cadastro,
e-mail 2 após 2 dias, e-mail 3 após 4 dias, com descadastro LGPD embutido. Falta apenas:

1. **Gerar a chave da API no Brevo:** app.brevo.com → menu do perfil (canto superior direito)
   → **SMTP & API** → aba **API Keys** → **Generate a new API key** → nomear (ex: `netlify`)
   → copiar a chave `xkeysib-...` (ela só aparece uma vez).
2. **Colar no Netlify:** app.netlify.com → site vendas-ja → **Site configuration →
   Environment variables → Add a variable** → Key `BREVO_API_KEY`, Value = a chave → salvar.
3. **Republicar:** Deploys → **Trigger deploy → Deploy project**.
4. **Testar:** cadastrar um e-mail seu numa página de produto → o e-mail "Seu material
   chegou!" deve chegar em instantes (olhar o spam na primeira vez).

Sem a chave, o site funciona normal — só não envia os e-mails automáticos.

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
