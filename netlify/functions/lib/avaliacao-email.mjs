// ============================================================
// E-mail pós-compra pedindo avaliação do produto.
// Disparado pelo hotmart-webhook quando chega PURCHASE_APPROVED:
// agenda (via Brevo, ~2 dias depois da compra, pra pessoa ter tempo
// de ler) um e-mail convidando o comprador a avaliar o material na
// própria página do produto (âncora #avaliar). A avaliação cai como
// pendente no Firebase e só aparece no site depois de aprovada no
// painel — ver assets/avaliacoes.js.
// ============================================================
import { api, REMETENTE, tokenDescadastro, textoSimples } from './brevo.mjs';
import { PRODUTOS } from './produtos-email.mjs';

const URL_SITE = process.env.SITE_URL || 'https://nextlevelbr.app.br';

// Acha slug+idioma a partir do nome do produto como está na Hotmart.
// Os cadastros na Hotmart usam os mesmos nomes de produtos-email.mjs
// (nomeProduto), mas com pequenas variações possíveis — normaliza
// (minúsculas, sem acento) e compara o "núcleo" do nome (antes do "—").
function normalizar(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function identificarProduto(nomeHotmart) {
  const bruto = String(nomeHotmart || '').toLowerCase().trim();
  if (!bruto) return null;
  // 1º passo: nome completo idêntico, preservando acentos — sem isso, "Desafío 30 Días" (ES)
  // e "Desafio 30 Dias" (PT) empatam depois de normalizar e o comprador ES receberia PT.
  for (const [slug, porIdioma] of Object.entries(PRODUTOS)) {
    for (const idioma of ['pt', 'en', 'es']) {
      if (String(porIdioma[idioma]?.nomeProduto || '').toLowerCase().trim() === bruto) {
        return { slug, idioma };
      }
    }
  }
  // 2º passo: núcleo normalizado (tolerante a pequenas variações do cadastro na Hotmart)
  const alvo = normalizar(String(nomeHotmart || '').split('—')[0]);
  if (!alvo) return null;
  for (const [slug, porIdioma] of Object.entries(PRODUTOS)) {
    for (const idioma of ['pt', 'en', 'es']) {
      const nome = normalizar(String(porIdioma[idioma]?.nomeProduto || '').split('—')[0]);
      if (nome && (nome === alvo || nome.includes(alvo) || alvo.includes(nome))) {
        return { slug, idioma };
      }
    }
  }
  return null;
}

const TEXTOS = {
  pt: {
    assunto: 'O que você achou do seu material NextLevel?',
    saudacao: 'Olá!',
    corpo1: 'Faz alguns dias que o seu material <strong>[[PRODUTO]]</strong> chegou — esperamos que a leitura esteja rendendo.',
    corpo2: 'A sua opinião sincera ajuda outras pessoas a decidirem com mais confiança (e nos ajuda a melhorar). Leva menos de 2 minutos:',
    botao: 'Avaliar o material',
    ps: 'Toda avaliação passa por verificação antes de ser publicada — por isso pedimos o mesmo e-mail usado na compra.',
    rodape1: 'NextLevel — todos os direitos reservados. ·',
    politica: 'Política de privacidade',
    linkPolitica: 'https://nextlevelbr.app.br/legal/privacidade.html',
    rodape2: 'Você está recebendo este e-mail porque comprou um produto NextLevel.',
    rodape3: 'Não quer mais receber?',
    descadastrar: 'Descadastre-se aqui',
  },
  en: {
    assunto: 'What did you think of your NextLevel material?',
    saudacao: 'Hi!',
    corpo1: 'It has been a few days since your <strong>[[PRODUTO]]</strong> arrived — we hope the reading is paying off.',
    corpo2: 'Your honest opinion helps other people decide with confidence (and helps us improve). It takes less than 2 minutes:',
    botao: 'Review the material',
    ps: 'Every review is verified before being published — that is why we ask for the same email used at checkout.',
    rodape1: 'NextLevel — all rights reserved. ·',
    politica: 'Privacy policy',
    linkPolitica: 'https://nextlevelbr.app.br/legal/privacidade-en.html',
    rodape2: 'You are receiving this email because you bought a NextLevel product.',
    rodape3: "Don't want these emails?",
    descadastrar: 'Unsubscribe here',
  },
  es: {
    assunto: '¿Qué te pareció tu material NextLevel?',
    saudacao: '¡Hola!',
    corpo1: 'Hace unos días que llegó tu material <strong>[[PRODUTO]]</strong> — esperamos que la lectura esté rindiendo.',
    corpo2: 'Tu opinión sincera ayuda a otras personas a decidir con confianza (y nos ayuda a mejorar). Toma menos de 2 minutos:',
    botao: 'Evaluar el material',
    ps: 'Toda evaluación pasa por verificación antes de publicarse — por eso pedimos el mismo correo usado en la compra.',
    rodape1: 'NextLevel — todos los derechos reservados. ·',
    politica: 'Política de privacidad',
    linkPolitica: 'https://nextlevelbr.app.br/legal/privacidade-es.html',
    rodape2: 'Recibes este correo porque compraste un producto NextLevel.',
    rodape3: '¿No quieres recibir más?',
    descadastrar: 'Cancela aquí',
  },
};

function montarHtml({ idioma, nomeProduto, linkAvaliar, linkDescadastro }) {
  const t = TEXTOS[idioma];
  return `<!DOCTYPE html>
<html lang="${idioma}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7fbfa;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f7fbfa">
<tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td bgcolor="#0d1b2a" align="center" style="border-radius:14px 14px 0 0;padding:26px 30px;">
    <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;">Next<span style="color:#5eead4;">Level</span></span>
  </td></tr>

  <tr><td bgcolor="#ffffff" style="padding:32px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#2b3446;">
    <p style="margin:0 0 16px;">${t.saudacao}</p>
    <p style="margin:0 0 16px;">${t.corpo1.replace('[[PRODUTO]]', nomeProduto)}</p>
    <p style="margin:0 0 22px;">${t.corpo2}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 22px;">
      <tr><td bgcolor="#0f766e" style="border-radius:10px;">
        <a href="${linkAvaliar}" style="display:inline-block;padding:14px 34px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">${t.botao}</a>
      </td></tr>
    </table>
    <p style="margin:0;font-size:12.5px;color:#5b6b68;">${t.ps}</p>
  </td></tr>

  <tr><td bgcolor="#0d1b2a" align="center" style="border-radius:0 0 14px 14px;padding:22px 30px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.8;color:#a9c4bf;">
    ${t.rodape1} <a href="${t.linkPolitica}" style="color:#5eead4;">${t.politica}</a><br>
    Av. Do Contorno, 5770 — Savassi — 30110-036 — Belo Horizonte — MG — Brasil<br>
    ${t.rodape2}<br>
    ${t.rodape3} <a href="${linkDescadastro}" style="color:#5eead4;">${t.descadastrar}</a>.
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// Envia (agendado pra ~2 dias depois, pra pessoa ter tempo de ler) o pedido
// de avaliação. Se o Brevo recusar o agendamento, cai pra envio imediato —
// melhor um e-mail cedo do que nenhum.
export async function enviarPedidoAvaliacao({ email, nomeHotmart }) {
  const alvo = identificarProduto(nomeHotmart);
  const idioma = alvo?.idioma || 'pt';
  const slug = alvo?.slug || null;
  const t = TEXTOS[idioma];

  const sufixo = idioma === 'pt' ? '' : `index-${idioma}.html`;
  const linkAvaliar = slug
    ? `${URL_SITE}/produtos/${slug}/${sufixo}#avaliar`
    : URL_SITE;
  const linkDescadastro = `${URL_SITE}/.netlify/functions/descadastrar` +
    `?e=${encodeURIComponent(email)}&t=${tokenDescadastro(email)}&l=${idioma}`;
  const nomeProduto = alvo ? PRODUTOS[slug][idioma].nomeProduto : String(nomeHotmart || 'NextLevel');

  const html = montarHtml({ idioma, nomeProduto, linkAvaliar, linkDescadastro });
  const corpo = {
    sender: REMETENTE,
    replyTo: REMETENTE,
    to: [{ email }],
    subject: t.assunto,
    htmlContent: html,
    textContent: textoSimples(html),
    headers: {
      'List-Unsubscribe': `<${linkDescadastro}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    tags: ['pedido-avaliacao', slug || 'produto-desconhecido'],
  };

  const agendadoPara = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  try {
    await api('/smtp/email', 'POST', { ...corpo, scheduledAt: agendadoPara });
  } catch (e) {
    console.error('pedido-avaliacao: agendamento falhou (' + e.message + ') — enviando agora');
    await api('/smtp/email', 'POST', corpo);
  }
}
