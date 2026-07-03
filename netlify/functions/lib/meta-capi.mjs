// ============================================================
// Meta Conversions API (CAPI): envia o mesmo evento "Lead" que o Pixel do
// navegador manda, só que direto do servidor. Isso importa porque
// bloqueador de anúncio, Safari (ITP) e o iOS derrubam boa parte dos
// eventos client-side — a CAPI é o jeito de não perder o sinal.
// O eventId é o mesmo usado no fbq('track', 'Lead', {}, {eventID}) do
// navegador: o Meta deduplica os dois automaticamente, não conta 2x.
// Variável de ambiente opcional: META_ACCESS_TOKEN (Netlify → Environment
// variables). Sem ela, esta função não faz nada — o Pixel do navegador
// continua funcionando normal, só não tem o reforço server-side.
// ============================================================
import crypto from 'node:crypto';

const PIXEL_ID = process.env.META_PIXEL_ID || '1817037532617722';
const API = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;

function hash(valor) {
  return crypto.createHash('sha256').update(String(valor).trim().toLowerCase()).digest('hex');
}

export async function enviarEventoCapi({ nome, email, telefone, url, ip, userAgent, fbp, fbc, eventId }) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) return;

  const userData = {};
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (email) userData.em = [hash(email)];
  if (telefone) {
    const digitos = telefone.replace(/\D/g, '');
    if (digitos) userData.ph = [hash(digitos)];
  }

  const corpo = {
    data: [{
      event_name: nome,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: url,
      action_source: 'website',
      user_data: userData,
    }],
  };

  const resposta = await fetch(`${API}?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Meta CAPI ${resposta.status}: ${texto}`);
  }
}
