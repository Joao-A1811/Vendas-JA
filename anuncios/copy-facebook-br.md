# Copy de Anúncio — Facebook/Instagram Ads (Brasil)

Template para preencher antes de subir uma campanha no Meta Business Manager.
Um anúncio bom testa **3 a 5 variações** de texto e criativo ao mesmo tempo — não suba só uma versão.

> Limites recomendados pelo Meta (o anúncio ainda roda passando disso, mas corta texto em alguns posicionamentos):
> - Texto principal: ideal até 125 caracteres
> - Título (headline): até 40 caracteres
> - Descrição: até 30 caracteres

---

## Produto
`{{NOME_DO_PRODUTO}}`

## Objetivo da campanha
`{{ex: Geração de cadastro (lead) | Conversão (venda) | Tráfego para landing page}}`

## Público-alvo (para configurar no Meta Ads Manager)
- Localização: `{{ex: Brasil, todas as capitais}}`
- Idade: `{{ex: 25-55}}`
- Interesses: `{{ex: investimentos, educação financeira, empreendedorismo}}`
- Observação: comece testando **público amplo** (sem excesso de interesses) e deixe o algoritmo otimizar depois de ~50 conversões.

---

## Variação 1 — Dor / Problema
**Texto principal:**
`{{Você já perdeu dinheiro por não saber X? Isso pode mudar hoje.}}`

**Título:**
`{{Pare de perder dinheiro com X}}`

**Descrição:**
`{{Aprenda o método em minutos}}`

**CTA (botão):** Saiba Mais / Cadastre-se / Comprar Agora

---

## Variação 2 — Prova social / Resultado
**Texto principal:**
`{{Mais de {{N}} pessoas já usaram esse método para {{resultado}}. Veja como.}}`

**Título:**
`{{O método que já ajudou {{N}} pessoas}}`

**Descrição:**
`{{Resultado comprovado}}`

**CTA (botão):** Saiba Mais

---

## Variação 3 — Curiosidade / Pergunta
**Texto principal:**
`{{Você sabia que {{fato curioso relacionado ao produto}}? Descubra o que fazer com isso.}}`

**Título:**
`{{O segredo de {{tema}}}}`

**Descrição:**
`{{Descubra agora}}`

**CTA (botão):** Saiba Mais

---

## Variação 4 — Oferta direta
**Texto principal:**
`{{{{NOME_DO_PRODUTO}} por apenas {{preço}}. Vagas/condição por tempo limitado.}}`

**Título:**
`{{Oferta especial: {{NOME_DO_PRODUTO}}}}`

**Descrição:**
`{{Por tempo limitado}}`

**CTA (botão):** Comprar Agora

---

## Checklist antes de publicar
- [ ] Pixel do Meta instalado na landing page (`marketing-digital/landing-page/index.html`) e testando eventos (PageView, Lead, InitiateCheckout) no Gerenciador de Eventos
- [ ] Link da landing page com UTMs configurados (ex: `?utm_source=facebook&utm_medium=cpc&utm_campaign={{nome_da_campanha}}&utm_content={{variacao}}`)
- [ ] Conta de anúncios verificada no Meta Business Manager (identidade da empresa, sem antidetect browser / multi-contas)
- [ ] Orçamento diário definido e teto de gasto configurado
- [ ] Público, texto e criativo revisados contra as Políticas de Publicidade do Meta (promessas exageradas de ganho financeiro são frequentemente reprovadas — evitar "garantido", "sem risco", números de retorno específicos)
