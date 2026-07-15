// ============================================================
// Webhook da Hotmart → evento "Purchase" na Meta Conversions API.
// Até hoje o Pixel só via até o "Lead" (cadastro do e-mail); o
// checkout inteiro acontece na Hotmart, fora do site, então o Meta
// nunca ficava sabendo quem de fato COMPROU — o anúncio otimizava só
// pra topo de funil. Esta função fecha esse buraco: a Hotmart avisa
// aqui quando uma compra é aprovada, e a gente ecoa isso pro Meta.
//
// Configuração (uma vez, do lado da Hotmart — ver CHECKLIST-CONFIGURACAO.md):
// 1. Hotmart → Ferramentas → Webhook → Criar webhook.
// 2. URL: https://nextlevelbr.app.br/.netlify/functions/hotmart-webhook
// 3. Eventos: marcar "Compra aprovada" (PURCHASE_APPROVED) e
//    "Compra completa" (PURCHASE_COMPLETE) — o dedup pelo event_id
//    (transação da Hotmart) evita contar a mesma venda 2x pro Meta.
// 4. A Hotmart gera um token (Hottok) — colar em HOTMART_HOTTOK no
//    Netlify (Environment variables) + redeploy.
// 5. Testar com o botão de teste do painel de webhook da Hotmart e
//    conferir os logs desta function no Netlify (Functions → Logs).
//
// A Hotmart manda o token no header `X-Hotmart-Hottok` (não no corpo do
// JSON) — confirmado em produção em 15/jul/2026 via log real. Os nomes de
// campo do corpo (data.buyer.email, data.purchase.transaction/price,
// data.product.name) também já foram confirmados contra um evento
// PURCHASE_APPROVED real.
// ============================================================
import { enviarEventoCapi } from './lib/meta-capi.mjs';

const EVENTOS_DE_COMPRA = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'];

export default async (req) => {
  if (req.method !== 'POST') return new Response('Método não permitido', { status: 405 });

  let corpo;
  try { corpo = await req.json(); } catch { return new Response('JSON inválido', { status: 400 }); }

  const hottokEsperado = (process.env.HOTMART_HOTTOK || '').trim();
  if (!hottokEsperado) {
    console.error('hotmart-webhook: HOTMART_HOTTOK não configurada no Netlify');
    return new Response('Não configurado', { status: 500 });
  }
  // Confirmado em produção: a Hotmart manda o token no header
  // X-Hotmart-Hottok. Mantém o fallback pro campo `hottok` no corpo por via
  // das dúvidas (formato mais antigo / alguma variação de evento).
  const hottokRecebido = String(req.headers.get('x-hotmart-hottok') || corpo.hottok || '').trim();
  if (hottokRecebido !== hottokEsperado) {
    // Não loga os valores completos (é um segredo), só o suficiente pra
    // diagnosticar sem expor o token: tamanho de cada um e os 4 primeiros/
    // últimos caracteres — dá pra ver na hora se foi espaço extra, token
    // cortado ou copiou o valor errado.
    const resumo = (v) => v ? `len=${v.length} "${v.slice(0, 4)}…${v.slice(-4)}"` : '(vazio)';
    console.error(
      'hotmart-webhook: hottok inválido — recebido:', resumo(hottokRecebido),
      '| esperado (HOTMART_HOTTOK):', resumo(hottokEsperado)
    );
    return new Response('Token inválido', { status: 401 });
  }

  // Sempre responde 200 daqui pra frente — a Hotmart reenvia (com backoff) se
  // não receber 2xx, e eventos que não nos interessam (reembolso, cancelamento
  // etc.) não são erro, só não geram evento no Meta.
  if (!EVENTOS_DE_COMPRA.includes(corpo.event)) {
    return new Response(JSON.stringify({ ok: true, ignorado: corpo.event }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const dados = corpo.data || {};
    const compra = dados.purchase || {};
    const comprador = dados.buyer || compra.buyer || {};
    const email = comprador.email;
    const transacao = compra.transaction || corpo.id;
    const valor = compra.price?.value;
    const moeda = compra.price?.currency_value;
    const produtoNome = dados.product?.name;

    if (!email || !transacao) {
      console.error('hotmart-webhook: payload sem e-mail ou transação —', JSON.stringify(corpo).slice(0, 500));
      return new Response(JSON.stringify({ ok: false, motivo: 'payload incompleto' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    await enviarEventoCapi({
      nome: 'Purchase',
      email,
      eventId: 'hotmart-' + transacao,
      valor,
      moeda,
      conteudo: produtoNome,
    });

    console.log('hotmart-webhook: Purchase enviado —', transacao, produtoNome, valor, moeda);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    console.error('hotmart-webhook:', e.message);
    // 200 mesmo em erro: já logamos pra investigar, e não queremos que a
    // Hotmart fique retentando indefinidamente por causa de uma falha nossa.
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
};
