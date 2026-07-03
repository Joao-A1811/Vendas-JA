// ============================================================
// Chamada pela página de produto logo após salvar o lead no
// Firebase: cadastra o contato no Brevo (lista da sequência) e
// envia o e-mail 1 (entrega do ebook) na hora.
// Os e-mails 2 e 3 ficam por conta da sequencia-diaria.mjs.
// ============================================================
import { garantirInfra, upsertContato, enviarEmailSequencia } from './lib/brevo.mjs';
import { PRODUTOS } from './lib/produtos-email.mjs';
import { enviarEventoCapi } from './lib/meta-capi.mjs';
import { permitido } from './lib/limite-taxa.mjs';

const ORIGENS_PERMITIDAS = [
  'https://nextlevelbr.app.br',
  'https://www.nextlevelbr.app.br',
  'https://vendas-ja.netlify.app',
];

export default async (req) => {
  if (req.method !== 'POST') return new Response('Método não permitido', { status: 405 });

  // Barreira simples contra uso do endpoint por outros sites.
  const origem = req.headers.get('origin');
  if (origem && !ORIGENS_PERMITIDAS.includes(origem)) {
    return new Response('Origem não permitida', { status: 403 });
  }

  let dados;
  try { dados = await req.json(); } catch { return new Response('JSON inválido', { status: 400 }); }

  // Honeypot: robô que preencheu o campo escondido é ignorado em silêncio.
  if (dados.site) return new Response(null, { status: 204 });

  const email = String(dados.email || '').trim().toLowerCase();
  const nome = String(dados.nome || '').trim().slice(0, 120);
  const slug = String(dados.slug || '').trim();
  const idioma = ['pt', 'en', 'es'].includes(dados.idioma) ? dados.idioma : 'pt';

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
    return new Response('E-mail inválido', { status: 400 });
  }
  if (!PRODUTOS[slug]?.[idioma]) {
    return new Response('Produto desconhecido', { status: 400 });
  }

  // Limite anti-abuso: mesmo e-mail ou mesmo IP tentando várias vezes seguidas
  // (best-effort — vale por instância da função; não substitui uma solução
  // distribuída, mas barra a maioria dos scripts de flood).
  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || 'sem-ip';
  if (!permitido(email) || !permitido(ip)) {
    return new Response('Muitas tentativas — aguarde um pouco.', { status: 429 });
  }

  try {
    const listaId = await garantirInfra();
    await upsertContato({ email, nome, slug, idioma, listaId });
    await enviarEmailSequencia(1, { email, nome, slug, idioma });
  } catch (e) {
    // O cadastro no Firebase já aconteceu; aqui só logamos — o lead não se perde
    // e a rotina diária não depende deste endpoint pra continuar a sequência.
    console.error('lead-email:', e.message);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Eco do mesmo evento "Lead" via Conversions API (não bloqueia a resposta
  // por falha — o Pixel do navegador já disparou o evento do lado dele).
  try {
    await enviarEventoCapi({
      nome: 'Lead',
      email,
      telefone: dados.whatsapp,
      url: dados.pagina,
      ip: ip !== 'sem-ip' ? ip : undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      fbp: dados.fbp,
      fbc: dados.fbc,
      eventId: dados.eventId,
    });
  } catch (e) {
    console.error('meta-capi:', e.message);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 202,
    headers: { 'content-type': 'application/json' },
  });
};
