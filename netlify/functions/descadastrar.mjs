// ============================================================
// Link "Descadastre-se" dos e-mails da sequência (exigência LGPD).
// O token HMAC garante que só quem recebeu o e-mail consegue
// descadastrar aquele endereço. Marca o contato como bloqueado no
// Brevo (não recebe mais nada) e tira da lista da sequência.
// ============================================================
import { garantirInfra, bloquearContato, removerDaLista, tokenDescadastro } from './lib/brevo.mjs';

const TEXTOS = {
  pt: {
    ok: ['Pronto!', 'Você não vai mais receber nossos e-mails. Sentiremos sua falta. 💜',
         'Se mudar de ideia, é só se cadastrar de novo em qualquer página do site.'],
    erro: ['Link inválido', 'Este link de descadastro não é válido ou está incompleto. Abra o link diretamente do e-mail que você recebeu.'],
  },
  en: {
    ok: ['Done!', "You won't receive our emails anymore. We'll miss you. 💜",
         'If you change your mind, just sign up again on any page of the site.'],
    erro: ['Invalid link', 'This unsubscribe link is invalid or incomplete. Please open the link directly from the email you received.'],
  },
  es: {
    ok: ['¡Listo!', 'Ya no recibirás nuestros correos. Te vamos a extrañar. 💜',
         'Si cambias de idea, solo regístrate de nuevo en cualquier página del sitio.'],
    erro: ['Enlace inválido', 'Este enlace de cancelación no es válido o está incompleto. Abre el enlace directamente desde el correo que recibiste.'],
  },
};

function pagina(titulo, paragrafos, idioma) {
  const corpo = paragrafos.map(p => `<p style="color:#f0e8fb;margin:10px 0 0;">${p}</p>`).join('');
  return `<!DOCTYPE html>
<html lang="${idioma}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>${titulo} | NextLevel</title></head>
<body style="margin:0;font-family:Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#5b21b6,#7c3aed,#db2777);padding:24px;">
<div style="max-width:480px;color:#fff;">
<div style="font-weight:bold;letter-spacing:3px;margin-bottom:24px;">NEXTLEVEL</div>
<h1 style="margin:0;font-size:30px;">${titulo}</h1>
${corpo}
</div></body></html>`;
}

export default async (req) => {
  const url = new URL(req.url);
  const email = (url.searchParams.get('e') || '').trim().toLowerCase();
  const token = url.searchParams.get('t') || '';
  const l = url.searchParams.get('l');
  const idioma = ['pt', 'en', 'es'].includes(l) ? l : 'pt';
  const t = TEXTOS[idioma];
  const cabecalho = { 'content-type': 'text/html; charset=utf-8' };

  if (!email || token !== tokenDescadastro(email)) {
    return new Response(pagina(t.erro[0], t.erro.slice(1), idioma), { status: 400, headers: cabecalho });
  }

  try {
    await bloquearContato(email);
    const listaId = await garantirInfra();
    await removerDaLista(email, listaId).catch(() => {}); // pode já ter saído da lista
  } catch (e) {
    console.error('descadastrar:', e.message);
  }
  return new Response(pagina(t.ok[0], t.ok.slice(1), idioma), { headers: cabecalho });
};
