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

Projeto `vendas-ja-99317` já criado, com Realtime Database, login Google e regras de segurança
publicadas. O `firebaseConfig` já vem preenchido em todas as páginas de produto novas (copiadas
do `landing-page/`). Só repita esses passos se precisar recriar o projeto do zero:

1. **console.firebase.google.com** → Adicionar projeto.
2. **Build → Realtime Database → Criar banco de dados** → modo bloqueado.
3. **Configurações → Configurações do projeto → Seus aplicativos → `</>` Web** → registrar e
   copiar o `firebaseConfig`.
4. **Build → Authentication → Sign-in method → Google → Ativar**.
5. **Realtime Database → Regras**, colar:
   ```json
   {
     "rules": {
       "leads": {
         ".read": "auth != null",
         ".write": true,
         ".indexOn": ["data"]
       }
     }
   }
   ```

---

## 2. Meta Business Manager (conta de anúncios) — ⏳ pendente (Pixel)

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
5. Criar/atualizar a automação de e-mail no **brevo.com** — o ideal é uma lista por idioma (lead
   entra na lista → recebe o ebook no idioma certo → depois de alguns dias recebe a oferta),
   importando os leads exportados em CSV pelo `leads/painel-leads.html` (as colunas "Produto" e
   "Idioma" já vêm preenchidas).
6. Commit + push — o Netlify publica sozinho. (Pra mudanças pequenas dá pra editar direto no
   github.com: abrir o arquivo → botão de lápis → Commit changes.)
7. Montar a campanha no Meta Ads usando `anuncios/copy-facebook-br.md` (para PT) ou
   `-internacional.md` (para EN/ES), respeitando os avisos de política por nicho descritos lá.

## 6. Teste do funil (fazer pra cada produto novo)

Abrir a página do produto publicada → preencher o formulário → conferir no
`leads/painel-leads.html` se o lead apareceu, já identificado com o nome certo do produto →
conferir no Gerenciador de Eventos do Meta se `PageView` e `Lead` dispararam → clicar no botão de
compra e confirmar que abre o checkout certo da Hotmart.
