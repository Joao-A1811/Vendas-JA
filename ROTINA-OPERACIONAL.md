# Rotina Operacional — NextLevel

Checklist de acompanhamento do negócio (não é configuração — isso já está feito e documentado em
`CHECKLIST-CONFIGURACAO.md`). Este arquivo é só o "o que conferir, onde, e como" no dia a dia.

---

## 🔴 DIÁRIO (5–10 min)

### 1. Vendas na Hotmart
**Link:** https://app.hotmart.com/sales
1. Entrar com sua conta de produtor.
2. Conferir vendas novas, reembolsos e "compra recusada" (cartão negado etc.).
3. Se aparecer reembolso frequente no mesmo produto, é sinal de problema no material ou na
   expectativa criada pela página — investigar o produto específico.

### 2. Painel de leads e avaliações
**Link:** https://nextlevelbr.app.br/leads/painel-leads.html
1. Entrar com e-mail/senha do Firebase.
2. **Leads novos:** ver a tabela do topo — clicar no 💬 ao lado do WhatsApp de quem quiser
   contatar (abre a conversa já com mensagem pronta no idioma da pessoa).
3. **Avaliações pendentes:** rolar até o bloco de avaliações.
   - Confere o e-mail da pessoa contra a aba de Vendas da Hotmart.
   - Se bateu com uma compra → **"Aprovar (compra verificada)"**.
   - Se for alguém que recebeu o material de graça (cortesia) → **"Aprovar (recebeu grátis)"**.
   - Se parecer spam/golpe/ofensivo → **"Recusar"**.

### 3. O site está no ar?
**Link:** https://app.netlify.com → selecionar o site → aba **Deploys**
1. Confirmar que o deploy mais recente está com status verde ("Published").
2. **Se aparecer "Skipped due to account credit usage exceeded"**: os créditos do plano
   acabaram — é isso, não é bug no código. Precisa comprar/renovar crédito pra voltar a
   publicar. Isso já aconteceu uma vez (jul/2026).

---

## 🟡 SEMANAL (15–20 min, ex.: toda segunda-feira)

### 4. Eventos chegando no Meta
**Link:** https://business.facebook.com/events_manager2
1. Abrir o Pixel (ou a fonte de dados) da NextLevel.
2. Aba **Test Events** ou **Visão geral** → conferir se aparecem, nos últimos 7 dias:
   PageView, Lead, InitiateCheckout e **Purchase**.
3. Se "Purchase" não aparecer mesmo tendo venda na Hotmart no período → me avisar, é sinal do
   webhook (`hotmart-webhook`) falhando — dá pra ver o log (item 8 abaixo).
4. Conferir a **pontuação de qualidade do evento** (Event Match Quality) — quanto maior,
   melhor o Meta identifica quem converteu.

### 5. Funil no Google Analytics
**Link:** https://analytics.google.com
1. Selecionar a propriedade do site.
2. **Relatórios → Engajamento → Eventos**.
3. Comparar, por período: `page_view` → `begin_checkout` → (nenhum evento de "Purchase" ainda
   no GA4 — só existe no Meta hoje). Ver quais produtos geram mais `begin_checkout` e se algum
   produto/idioma está muito abaixo dos outros — pode indicar problema na página ou no preço.
4. **Relatórios → Aquisição → Aquisição de tráfego**: de onde vem a visita (direto, busca,
   redes sociais, anúncio).

### 6. Entregabilidade dos e-mails
**Link:** https://app.brevo.com → menu **Estatísticas** (ou **Campanhas → Transacional**)
1. Conferir taxa de abertura e taxa de clique dos e-mails da sequência (1, 2, 3) e do pedido
   de avaliação.
2. Conferir **bounces** (e-mails que voltaram) e **reclamações de spam** — se estiver alto,
   pode ser sinal de lista suja ou de reputação de domínio ainda "esquentando" (normal nos
   primeiros meses de domínio novo, mas acompanhar a tendência).

### 7. Erros nas functions do site
**Link:** https://app.netlify.com → selecionar o site → **Logs & metrics → Function log**
(trocar o filtro de tempo pra "Last 24 hours" ou "Last 7 days" — "Real-time" só mostra a
partir do momento em que a página é aberta).
1. Filtrar/ler por função: `hotmart-webhook`, `lead-email`, `sequencia-diaria`, `descadastrar`.
2. Qualquer linha `ERROR` merece atenção — me colar aqui pra eu diagnosticar junto, como já
   fizemos com o webhook da Hotmart.

---

## 🟢 MENSAL (20–30 min)

### 8. Busca orgânica (Search Console)
**Link:** https://search.google.com/search-console
1. Selecionar a propriedade `nextlevelbr.app.br`.
2. **Desempenho** → ver cliques, impressões e páginas mais buscadas nos últimos 28 dias.
3. **Sitemaps** → confirmar que `sitemap.xml` continua "Êxito" (sem erro).
4. **Páginas** (cobertura de indexação) → ver se alguma página está "excluída" sem motivo
   esperado.
> Leva algumas semanas pra esses números começarem a aparecer de verdade — não estranhar
> números baixos/zerados nos primeiros meses.

### 9. Qual produto/categoria performa melhor
**Link:** painel de leads (exportar CSV) + Hotmart → Relatórios de vendas
1. Exportar o CSV de leads do mês (botão "Exportar CSV" no painel).
2. Comparar volume de leads x vendas por produto/categoria.
3. Usar isso pra decidir onde concentrar tráfego pago quando for investir.

### 10. Saúde do banco de dados (Firebase)
**Link:** https://console.firebase.google.com → projeto `vendas-ja-99317` → **Realtime Database**
1. Aba **Dados**: dar uma olhada rápida em `leads` e `avaliacoes-pendentes` — volume muito
   acima do normal de repente pode ser spam/bot passando pelo honeypot.
2. Aba **Uso**: conferir se está dentro do plano gratuito (raramente será um problema nesse
   volume, mas é rápido de checar).

### 11. Checagem automática de preço (site x Hotmart) — opcional
Sempre que mudar preço, ou de tempos em tempos só pra garantir que nada saiu de sincronia.
Roda no seu computador (não dá pra rodar aqui comigo — a rede daqui bloqueia a Hotmart por
política). Precisa dos arquivos `hotmart_checagem_final.py` e `titulos-catalogo.json` (os
mesmos que já usamos — guarde numa pasta fixa, ex. `Downloads\NextLevel`) e das credenciais de
API que você já gerou (Hotmart → Ferramentas → Credenciais de API).

**PowerShell**, na pasta onde estão os arquivos:
```powershell
$env:HOTMART_CLIENT_ID = 'SEU_CLIENT_ID'
$env:HOTMART_CLIENT_SECRET = 'SEU_CLIENT_SECRET'
$env:HOTMART_BASIC = 'Basic SEU_TOKEN_BASIC'
python hotmart_checagem_final.py titulos-catalogo.json
```
Só leitura — nunca muda nada na Hotmart. No final aparece um resumo (quantos produtos batem,
quantos divergem) e um arquivo `resultado-final.json` com o detalhe de cada um. Se aparecer
algo em "DIVERGENTE", me manda o resumo que eu ajudo a diagnosticar — como já fizemos quando
achou a oferta do `investimentos` com a moeda errada.

> Se algum dia mudar o preço padrão de novo, atualiza também o dicionário `ESPERADO` no topo
> do `hotmart_checagem_final.py` (valor e moeda esperados por idioma) — hoje ele está fixo em
> R$ 19,99 (PT) / US$ 4,99 (EN-ES). Me chama que eu atualizo esse arquivo pra você.

### 12. Revisão geral do catálogo
1. Confirmar que os 30 produtos continuam com `disponivel: true` e checkout funcionando —
   um teste rápido: abrir 2–3 produtos aleatórios no site e clicar em "Comprar agora",
   conferir se abre a Hotmart certa (a checagem do item 11 já cobre o preço; isso aqui é só
   pra ver se o link em si ainda funciona).
2. Avaliar se algum produto precisa de preço revisado, novo depoimento aprovado, ou nova
   campanha de anúncio (copy já pronta em `anuncios/prontos/`).

---

## 🚨 O que exige ação IMEDIATA (fora da rotina normal)
- Deploy "Skipped" no Netlify por créditos — comprar crédito.
- `ERROR` repetido no log do `hotmart-webhook` — me chamar com o log colado.
- E-mails caindo 100% em spam / taxa de abertura despencando de repente no Brevo.
- Pixel parou de registrar eventos no Meta Events Manager.
- Avaliação claramente falsa/ofensiva na fila de moderação — recusar, não aprovar.
