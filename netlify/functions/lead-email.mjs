// ============================================================
// Chamada pela página de produto logo após salvar o lead no
// Firebase: cadastra o contato no Brevo (lista da sequência) e
// envia o e-mail 1 (entrega do ebook) na hora.
// Os e-mails 2 e 3 ficam por conta da sequencia-diaria.mjs.
// ============================================================
import { garantirInfra, upsertContato, enviarEmailSequencia } from './lib/brevo.mjs';
import { PRODUTOS } from './lib/produtos-email.mjs';

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

  try {
    const listaId = await garantirInfra();
    await upsertContato({ email, nome, slug, idioma, listaId });
    await enviarEmailSequencia(1, { email, nome, slug, idioma });
    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    // O cadastro no Firebase já aconteceu; aqui só logamos — o lead não se perde
    // e a rotina diária não depende deste endpoint pra continuar a sequência.
    console.error('lead-email:', e.message);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
