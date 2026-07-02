# E-mails prontos pro Brevo (automação de e-mail)

Três e-mails por idioma, com o visual do site (gradiente roxo→rosa, botão laranja),
prontos pra colar no Brevo:

| Arquivo | Quando dispara | O que faz |
|---|---|---|
| `1-entrega.html` | Na hora do cadastro | Entrega o link do ebook gratuito e cria expectativa |
| `2-dica.html` | 2 dias depois | Dá uma dica prática do tema (gera confiança) |
| `3-oferta.html` | 4 dias depois | Apresenta o produto pago, com preço e garantia de 7 dias |

O assunto e o preheader sugeridos de cada e-mail estão **em comentário no topo de cada
arquivo HTML**.

## Antes de colar: trocar os tokens `[[ASSIM]]`

Cada e-mail tem tokens que dependem do produto. Abra o HTML num editor de texto, use
localizar-e-substituir e troque:

| Token | Trocar por (exemplo: emagrecimento, PT) |
|---|---|
| `[[TEMA]]` | `emagrecimento leve e sem dietas malucas` |
| `[[LINK_EBOOK]]` | `https://nextlevelbr.app.br/ebooks/arquivos/emagrecimento-pt.pdf` |
| `[[NOME_DO_PRODUTO]]` | `Ebook Emagrecimento Inteligente` |
| `[[PRECO_DE]]` | `R$ 97,00` (EN/ES: `$37`) |
| `[[PRECO_POR]]` | `R$ 47,00` (EN/ES: `$19`) |
| `[[LINK_PAGINA]]` | `https://nextlevelbr.app.br/produtos/emagrecimento/` (EN: `.../index-en.html`, ES: `.../index-es.html`) |
| `[[SLUG]]` | `emagrecimento` |
| `[[DICA_PRINCIPAL — ...]]` | A dica nº 1 do ebook, em 2-3 frases (o texto dentro do token explica) |

> `{{ contact.FIRSTNAME }}` e `{{ unsubscribe }}` NÃO são tokens — são variáveis do
> próprio Brevo. Deixe como estão: o Brevo troca sozinho pelo nome do contato e pelo
> link de descadastro. ⚠️ O link de descadastro é obrigatório (LGPD) — não remova.

## Passo a passo no Brevo (uma vez)

1. Criar conta em **brevo.com** (plano gratuito: até 300 e-mails/dia — suficiente pro início).
2. **Verificar o remetente:** Settings → Senders & Domains → adicionar o e-mail que vai
   assinar os envios (ex: `ja.investimentos@outlook.com`) e clicar no link de confirmação
   que chega na caixa dele. (Melhor ainda, quando possível: autenticar o domínio
   `nextlevelbr.app.br` — melhora a entrega, o Brevo mostra os registros DNS pra colar
   no Registro.br, igual fizemos com o Meta.)
3. **Criar as listas:** Contacts → Lists → uma lista por produto+idioma que estiver ativo
   (ex: `emagrecimento-pt`). Não precisa criar todas de uma vez — só a do produto lançado.

## A cada produto lançado

1. **Importar os leads:** exportar o CSV no painel (`leads/painel-leads.html` → Exportar
   CSV) → Contacts → Import → mapear `nome` → FIRSTNAME e `email` → EMAIL → destino: a
   lista do produto/idioma certo (as colunas Produto e Idioma do CSV dizem quem vai pra
   qual lista).
2. **Criar os 3 templates:** Campaigns → Templates → New template → escolher edição em
   **HTML** (não o editor de blocos) → colar o conteúdo do arquivo (já com os tokens
   trocados) → salvar. Repetir pros 3 e-mails.
3. **Criar a automação:** Automations → Create → gatilho **"Contact added to a list"**
   (a lista do produto) → ação **Send email** (template 1) → **Wait 2 days** → Send email
   (template 2) → **Wait 2 days** → Send email (template 3) → ativar.
4. **Testar:** cadastrar seu próprio e-mail na lista e conferir se o e-mail 1 chega com
   visual certo (checar também a caixa de spam na primeira vez).

## Observações

- **Novos leads não entram sozinhos no Brevo** — o site salva no Firebase, não no Brevo.
  Rotina simples: 1-2x por semana, exportar o CSV do painel e importar a lista (o Brevo
  ignora contatos repetidos). Dá pra automatizar isso depois, se o volume crescer.
- A entrega instantânea do ebook na página continua funcionando independente do Brevo —
  o e-mail 1 é reforço (e serve pra quem fechou a página antes de baixar).
- Regra de ouro (LGPD + reputação): só importar quem se cadastrou no site. Nunca comprar
  lista nem adicionar e-mail de terceiros.
