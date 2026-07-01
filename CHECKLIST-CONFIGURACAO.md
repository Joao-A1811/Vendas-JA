# Checklist de Configuração Manual

Passo a passo das contas e credenciais que precisam ser criadas fora deste repositório.
Nenhuma senha, token ou chave deve ser commitada aqui — cole as credenciais diretamente
nos arquivos indicados (eles já têm um campo `COLE_AQUI` / `PASTE_HERE` reservado para isso)
apenas no seu ambiente local, ou direto no editor do Netlify.

## 1. Firebase (captura de lead)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um **projeto novo**
   (não reaproveitar o `valor-carteira`).
2. Ative o **Realtime Database** (modo produção).
3. Em Project Settings → Your apps → adicione um app Web e copie o `firebaseConfig`.
4. Cole esse config em:
   - `marketing-digital/landing-page/index.html` (campo `firebase` dentro de `CONFIG`)
   - `marketing-digital/landing-page/index-en.html` (idem)
   - `marketing-digital/leads/painel-leads.html` (campo `FIREBASE_CONFIG`)
5. Em Authentication, ative o provedor **Google** e adicione o(s) e-mail(s) que podem acessar o
   painel de leads.
6. Configure as **regras do Realtime Database** para que:
   - Qualquer pessoa possa **escrever** em `/leads` (é o formulário público da landing page), mas
     **sem conseguir ler** os dados de outros leads.
   - Só usuários autenticados (login Google) possam **ler** `/leads` (usado pelo painel).

   Exemplo de regra:
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

## 2. Hotmart

1. Criar conta de produtor em [hotmart.com](https://hotmart.com).
2. Completar a verificação de identidade (necessário para sacar valores).
3. Cadastrar o produto (tipo: ebook/curso digital).
4. Definir preço, moeda e (se for vender fora do Brasil) ativar as moedas/localidades desejadas.
5. Copiar o **link de checkout** do produto e colar em `CONFIG.linkCheckoutHotmart` na landing page.
6. Configurar o programa de afiliados (comissão sugerida: 40–60%) quando o produto já tiver
   algumas vendas orgânicas e boas avaliações (ajuda a atrair afiliados).

## 3. Meta Business Manager (anúncios)

1. Criar o Business Manager em [business.facebook.com](https://business.facebook.com) com a
   identidade real da empresa (não usar antidetect browser / múltiplas contas — ver `README.md`).
2. Verificar a empresa (Meta pode pedir CNPJ/documentos).
3. Criar uma conta de anúncios e associar um método de pagamento.
4. Criar um **Pixel** em Eventos → Pixels, copiar o ID e colar em `META_PIXEL_ID` na landing page
   (`index.html` e/ou `index-en.html`).
5. No Gerenciador de Eventos, conferir se os eventos `PageView`, `Lead` e `InitiateCheckout` estão
   chegando (abra a landing page publicada e simule um cadastro).
6. Montar a campanha usando os templates em `anuncios/copy-facebook-br.md` (ou `-internacional.md`).

## 4. E-mail marketing (Brevo — recomendado, plano grátis)

1. Criar conta em [brevo.com](https://www.brevo.com).
2. Criar uma lista e uma automação: "quando um contato for adicionado à lista X → enviar e-mail
   com o ebook em anexo/link → depois de N dias → enviar e-mail com a oferta do produto pago".
3. Os leads capturados no Firebase precisam ser importados (manual via CSV exportado no
   `painel-leads.html`, ou futuramente uma integração automática via API do Brevo).

## 5. Netlify (publicar a landing page)

1. Criar um **novo site** no Netlify (separado do site atual da `plataforma-carteira`).
2. Apontar o **base directory** para `marketing-digital/landing-page` e publish directory `.`
   (ou copiar o conteúdo dessa pasta para um repositório/site próprio, se preferir manter os
   domínios totalmente separados).
3. Configurar o domínio/subdomínio desejado (ex: `promo.valorinvestimentos.com.br`).

## 6. Depois de configurado

- Testar o funil inteiro uma vez: abrir a landing page publicada → preencher o formulário → conferir
  se o lead aparece no `painel-leads.html` → conferir se o Pixel disparou no Gerenciador de Eventos
  do Meta → clicar no botão de compra e conferir se chega no checkout certo da Hotmart.
