// ============================================================
// GA4 Measurement Protocol — evento "purchase" server-side.
// Mesmo papel do meta-capi.mjs, só que pro Google Analytics: o
// checkout acontece na Hotmart, fora do site, então o gtag do
// navegador nunca vê a compra — sem isto, o funil do GA4 morre no
// begin_checkout. O hotmart-webhook chama daqui quando a Hotmart
// avisa compra aprovada.
//
// Fica DESLIGADO até existir a env var GA4_API_SECRET no Netlify
// (GA4 → Admin → Fluxos de dados → o fluxo do site → "Chaves secretas
// da API do Measurement Protocol" → Criar). Sem ela, é no-op — nada
// quebra, o site só não manda a compra pro GA4.
// O Measurement ID é público (mesmo valor de assets/config-global.js);
// GA4_MEASUREMENT_ID no Netlify sobrescreve se um dia mudar.
// ============================================================
import crypto from 'node:crypto';

const MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || 'G-RVZC5Z9GWC';

export async function enviarPurchaseGa4({ transacao, email, valor, moeda, produtoNome }) {
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) return { enviado: false, motivo: 'GA4_API_SECRET não configurada' };

  // O client_id normalmente vem do cookie do navegador, que não existe numa
  // compra avisada por webhook. Derivar do e-mail (hash, irreversível) dá um
  // id estável por comprador — compras repetidas caem no mesmo "cliente" e a
  // receita/contagem ficam certas, mesmo sem ligação com a sessão original.
  const hash = crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');
  const clientId = `${parseInt(hash.slice(0, 8), 16)}.${parseInt(hash.slice(8, 16), 16)}`;

  const corpo = {
    client_id: clientId,
    events: [{
      name: 'purchase',
      params: {
        transaction_id: String(transacao),
        value: Number(valor) || 0,
        currency: moeda || 'BRL',
        items: produtoNome ? [{ item_name: String(produtoNome) }] : [],
      },
    }],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(MEASUREMENT_ID)}&api_secret=${encodeURIComponent(apiSecret)}`;
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(corpo),
  });
  // O Measurement Protocol responde 2xx mesmo pra payload inválido (validação
  // só no endpoint de debug) — status aqui só pega falha de rede/chave.
  if (!resposta.ok) {
    throw new Error(`GA4 MP respondeu ${resposta.status}`);
  }
  return { enviado: true };
}
