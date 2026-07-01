# Checklist de Configuração Manual

Passo a passo detalhado das contas e credenciais que precisam ser criadas fora deste repositório.
Nenhuma senha, token ou chave deve ser commitada aqui — cole as credenciais diretamente
nos arquivos indicados (eles já têm um campo `COLE_AQUI` / `PASTE_HERE` reservado para isso).

## Como fica a separação do site de investimentos

- **Código**: continua neste mesmo repositório, mas isolado na pasta `marketing-digital/` (a
  `plataforma-carteira/` não é tocada em nenhum passo abaixo).
- **Deploy/domínio**: site novo e separado no Netlify (domínio próprio, ex: `promo.suaempresa.com.br`
  ou um domínio novo comprado só para isso) — não é o mesmo site publicado da plataforma de carteira.
- **Banco de dados**: projeto Firebase novo e separado (leads de marketing não ficam no mesmo banco
  dos dados de carteira dos clientes).
- **Se quiser indo além**: dá para separar também em um **repositório GitHub próprio** (fora do
  `Valor-Investimentos`), mas isso não é necessário tecnicamente — só faz sentido se, por exemplo,
  quiser dar acesso a esse código pra alguém sem dar acesso à plataforma de carteira. Se quiser isso,
  me avise que eu ajudo a migrar.

## Ordem recomendada

**Fase 1 — infraestrutura (fazer tudo agora, sem ter o produto pronto):** passos 1 a 4 abaixo.
**Fase 2 — só depois que o ebook/curso estiver pronto:** passo 5 em diante.

---

## 1. Firebase (banco de dados dos leads)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e faça login com a
   conta Google da empresa.
2. Clique em **"Adicionar projeto"**.
3. Dê um nome diferente do projeto da carteira, ex: `valor-marketing-leads`. Clique em Continuar.
4. Na etapa do Google Analytics, pode **desativar** (não é necessário). Clique em **Criar projeto**
   e aguarde.
5. No menu lateral esquerdo, vá em **Build → Realtime Database** → **Criar banco de dados**.
   - Escolha uma localização (ex: `us-central1`).
   - Selecione **"Iniciar em modo de produção"**.
6. Ainda no menu, vá em **⚙️ Configurações do projeto** (ícone de engrenagem, canto superior
   esquerdo) → aba **Geral**.
7. Role até **"Seus aplicativos"** → clique no ícone **`</>`** (Web) → dê um nome (ex:
   `landing-page`) → **Registrar app**. Não precisa marcar "Firebase Hosting".
8. Vai aparecer um bloco de código com `const firebaseConfig = {...}`. Copie esses valores
   (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId).
9. Cole esses valores nos 3 arquivos abaixo, substituindo `COLE_AQUI` / `PASTE_HERE`:
   - `marketing-digital/landing-page/index.html` (dentro de `CONFIG.firebase`)
   - `marketing-digital/landing-page/index-en.html` (dentro de `CONFIG.firebase`)
   - `marketing-digital/leads/painel-leads.html` (dentro de `FIREBASE_CONFIG`)
10. Menu lateral → **Build → Authentication** → **Vamos começar** → aba **Sign-in method** →
    clique em **Google** → **Ativar** → selecione um e-mail de suporte → **Salvar**.
11. Volte em **Realtime Database → aba Regras**, apague o conteúdo e cole:
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
    Clique em **Publicar**. (Isso permite que qualquer visitante envie o formulário, mas só quem
    fizer login com Google consiga ler a lista de leads no painel.)

---

## 2. Meta Business Manager (conta de anúncios)

1. Acesse [business.facebook.com](https://business.facebook.com) → **Criar conta**.
2. Preencha nome da empresa, seu nome e e-mail comercial. Confirme o e-mail recebido.
3. Menu **Configurações do Business** (ícone de engrenagem) → **Contas → Contas de anúncios** →
   **Adicionar → Criar uma nova conta de anúncios**.
   - Nome da conta, fuso horário (Brasília), moeda (BRL, ou a moeda do país que for anunciar
     primeiro — depois dá pra criar outra conta pra outra moeda).
4. Ainda em Configurações do Business → **Métodos de pagamento** → adicione um cartão para a
   conta de anúncios.
5. **Verificação da empresa** (importante para evitar limitações): Configurações do Business →
   **Centro de segurança** → **Verificação da empresa** → siga o passo a passo enviando CNPJ e
   documentos solicitados.
6. Criar o Pixel: acesse [business.facebook.com/events_manager](https://business.facebook.com/events_manager)
   → **Conectar fontes de dados** → **Web** → **Pixel do Meta** → dê um nome (ex: `Pixel Marketing
   Valor`) → informe a URL da landing page (pode colocar um placeholder por enquanto, ex:
   `https://promo.suaempresa.com.br`) → **Continuar** → **Configurar manualmente**.
7. Copie o **ID do Pixel** (número) exibido.
8. Cole esse ID em `META_PIXEL_ID` nos arquivos `marketing-digital/landing-page/index.html` e
   `index-en.html`.
9. Depois que a landing page estiver publicada (passo 4), volte no Gerenciador de Eventos → aba
   **Testar eventos** → cole a URL do site publicado → confirme que o evento `PageView` aparece
   ao abrir a página, e `Lead` ao enviar o formulário de teste.

---

## 3. Hotmart — só a conta (produto vem na Fase 2)

1. Acesse [hotmart.com](https://hotmart.com) → **Cadastre-se como produtor**.
2. Preencha os dados pessoais/empresa.
3. Complete a verificação de identidade (documento + selfie, pedido pela própria Hotmart) — sem
   isso não é possível sacar valores de vendas depois.
4. Pare por aqui nesta fase. **Não cadastre o produto ainda.**

---

## 4. Netlify (publicar a landing page, separado da plataforma de carteira)

1. Acesse [app.netlify.com](https://app.netlify.com) e faça login (mesma conta usada no site
   atual, sem problema — o que importa é criar um **site novo**, não editar o existente).
2. Clique em **"Add new site" → "Import an existing project"**.
3. Conecte ao GitHub e selecione o repositório `Joao-A1811/Valor-Investimentos` (o mesmo repo — o
   Netlify permite ter vários sites apontando para pastas diferentes do mesmo repositório, cada
   um com seu próprio domínio, o que já resolve a separação sem precisar de um repo novo).
4. Em **"Site settings"** durante a importação:
   - **Base directory**: `marketing-digital/landing-page`
   - **Build command**: deixe em branco (é HTML estático, sem build)
   - **Publish directory**: `marketing-digital/landing-page`
5. Clique em **Deploy site**. O Netlify vai gerar uma URL temporária (ex:
   `nome-aleatorio.netlify.app`) — já dá pra testar o formulário nela.
6. **Site settings → Domain management → Add a domain** → informe o domínio/subdomínio desejado
   (ex: `promo.suaempresa.com.br`, separado do domínio da plataforma de carteira).
7. Siga as instruções de DNS mostradas (adicionar um registro CNAME ou os nameservers, no painel
   onde o domínio foi comprado). O certificado SSL é gerado automaticamente depois que o DNS
   propagar (pode levar algumas horas).
8. Depois de publicado, volte no Firebase → **Authentication → Settings → Authorized domains** →
   adicione o novo domínio (necessário para o login Google do painel de leads funcionar).

---

## 5. (Fase 2 — depois que o ebook/curso estiver pronto)

1. Cadastrar o produto na Hotmart → copiar o **link de checkout**.
2. Colar esse link em `CONFIG.linkCheckoutHotmart` nos arquivos da landing page.
3. Gerar o ebook em `marketing-digital/ebooks/gerador-ebook.html` e disponibilizar o PDF (link de
   download ou anexo no e-mail de boas-vindas).
4. Criar conta em [brevo.com](https://www.brevo.com), montar a automação de e-mail (lead entra na
   lista → recebe o ebook → depois de alguns dias recebe a oferta) e importar os leads exportados
   em CSV pelo `leads/painel-leads.html`.
5. Publicar a landing page atualizada (commit + push, o Netlify redeploya automaticamente).
6. Montar a campanha no Meta Ads usando `marketing-digital/anuncios/copy-facebook-br.md` (ou
   `-internacional.md`), com o Pixel já validado no passo 2.9 acima.

## 6. Teste final do funil completo

Abrir a landing page publicada → preencher o formulário → conferir se o lead aparece no
`painel-leads.html` → conferir no Gerenciador de Eventos do Meta se `PageView` e `Lead`
dispararam → clicar no botão de compra e confirmar que abre o checkout certo da Hotmart.
