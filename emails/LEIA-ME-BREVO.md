# Sequência de e-mails — AUTOMÁTICA via código (Brevo API)

**A automação já está pronta em código** (`netlify/functions/`) — não é preciso montar
nada na interface do Brevo. O fluxo funciona assim, sozinho:

1. Visitante se cadastra numa página de produto → o site salva o lead no Firebase (como
   sempre) **e** chama a função `lead-email` no Netlify.
2. A função cadastra o contato no Brevo (lista `sequencia-automatica`, criada sozinha na
   primeira execução) e envia o **e-mail 1** (entrega do ebook) na hora.
3. Todo dia às 9h (Brasília), a função agendada `sequencia-diaria` roda sozinha e envia o
   **e-mail 2** pra quem se cadastrou há 2+ dias e o **e-mail 3** pra quem tem 4+ dias
   (depois disso o contato sai da lista — sequência concluída).
4. Todo e-mail tem link de **descadastro** próprio (função `descadastrar`, exigência
   LGPD): quem clica não recebe mais nada.

O conteúdo dos e-mails vem de `emails/<idioma>/*.html` (compilados em
`netlify/functions/lib/emails-conteudo.mjs`) e os dados de cada produto (tema, dica,
preço, links) de `netlify/functions/lib/produtos-email.mjs`.

> ✅ **Status (jul/2026): configurado e testado** — chave no Netlify, e-mail de teste
> entregue. Página de diagnóstico (testa tudo e explica o que faltar):
> `https://nextlevelbr.app.br/.netlify/functions/diagnostico`

## Configuração única (2 minutos) — a ÚNICA coisa manual

1. **Gerar a chave da API no Brevo:** app.brevo.com → menu do perfil (canto superior
   direito) → **SMTP & API** → aba **API Keys** → **Generate a new API key** → dê um nome
   (ex: `netlify`) → copie a chave (começa com `xkeysib-`). ⚠️ Ela só aparece uma vez.
2. **Colar no Netlify:** app.netlify.com → site vendas-ja → **Site configuration →
   Environment variables → Add a variable** → Key: `BREVO_API_KEY` → Value: a chave →
   salvar.
3. **Republicar:** aba **Deploys → Trigger deploy → Deploy project** (as funções só
   enxergam a variável a partir do próximo deploy).

Sem a chave, o site funciona 100% normal — só não envia os e-mails automáticos.

## Como testar depois de configurar

1. Abra uma página de produto no site publicado e cadastre um e-mail seu de verdade.
2. O e-mail 1 ("Seu material chegou!") deve chegar em instantes (confira o spam na
   primeira vez).
3. No Brevo, em **Contacts**, seu contato deve aparecer na lista `sequencia-automatica`
   com os campos PRODUTO_SLUG / IDIOMA / DATA_CADASTRO preenchidos.
4. Os e-mails 2 e 3 chegam sozinhos ao longo dos próximos 4 dias (envio diário às 9h).
5. Clique em "Descadastre-se" no rodapé do e-mail → deve abrir a página "Pronto!" e o
   contato para de receber a sequência.

## Pra editar um e-mail

1. Edite o arquivo em `emails/<idioma>/<n>-*.html` (os tokens `[[ASSIM]]` são
   preenchidos automaticamente com os dados de `produtos-email.mjs`).
2. Peça pro Claude regenerar `netlify/functions/lib/emails-conteudo.mjs` (ou rode o
   trecho Python do histórico) e faça commit + push.

## Entregabilidade: por que cai em spam e como ir pra caixa de entrada

O que **já está embutido no código** (nada a fazer):
- Versão em texto puro junto do HTML (multipart) — e-mails só-HTML pontuam pior;
- Cabeçalho de **descadastro de 1 clique** (RFC 8058), exigido pelo Gmail/Outlook pra
  remetentes em volume — habilita o botão nativo "Cancelar inscrição";
- `Reply-To` configurado e assuntos sem emoji.

O que **depende de configuração manual** (em ordem de impacto):

1. **Autenticar o domínio no Brevo** — os registros DNS (brevo-code, DKIM 1 e 2, DMARC)
   já foram cadastrados no Registro.br; falta só conferir em **Brevo → Settings →
   Senders, Domains & IPs → aba Domains** se `nextlevelbr.app.br` está **"Autenticado"**
   (se não, clicar em "Autenticar" de novo — DNS pode ter demorado a propagar).
2. **Trocar o remetente pra um e-mail do domínio próprio** — este é o maior motivo de
   spam hoje: enviar como `@outlook.com` por uma plataforma terceira falha na checagem
   DMARC da Microsoft. Correção:
   a. Criar `contato@nextlevelbr.app.br` com redirecionamento gratuito no
      **improvmx.com** (2 registros MX no Registro.br — não conflitam com nada já feito);
   b. Brevo → Settings → Senders → **Add a sender** com esse endereço → o link de
      confirmação chega redirecionado no Outlook → clicar;
   c. Netlify → Environment variables → criar **`EMAIL_REMETENTE`** =
      `contato@nextlevelbr.app.br` → **Trigger deploy**.
3. **Aquecer a reputação**: nos primeiros testes, se cair no spam, marcar como
   **"Não é spam"** — isso treina o Gmail/Outlook. E começar com volume baixo
   (o que já vai acontecer naturalmente).

> Mesmo com tudo certo, nenhum remetente do mundo garante 100% de caixa de entrada —
> mas os itens 1 e 2 tiram o envio da categoria "quase certamente spam" e o colocam na
> categoria "remetente legítimo autenticado".

## Configurações opcionais (variáveis de ambiente no Netlify)

| Variável | Padrão | Pra quê |
|---|---|---|
| `BREVO_API_KEY` | — (obrigatória) | Autenticação na API do Brevo |
| `EMAIL_REMETENTE` | `ja.investimentos@outlook.com` | Remetente dos e-mails (precisa estar verificado no Brevo) |
| `NOME_REMETENTE` | `NextLevel` | Nome exibido como remetente |
| `SITE_URL` | `https://nextlevelbr.app.br` | Base dos links de descadastro |

> Melhoria futura de entregabilidade: quando houver um e-mail no domínio próprio
> (ex: `contato@nextlevelbr.app.br`, via redirecionamento ImprovMX), basta verificá-lo
> como remetente no Brevo e trocar a variável `EMAIL_REMETENTE` — nada mais muda.
