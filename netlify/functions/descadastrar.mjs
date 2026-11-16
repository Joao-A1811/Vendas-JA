// ============================================================
// Link "Descadastre-se" dos e-mails da sequência (exigência LGPD).
// O token HMAC garante que só quem recebeu o e-mail consegue
// descadastrar aquele endereço. Marca o contato como bloqueado no
// Brevo (não recebe mais nada) e tira da lista da sequência.
// ============================================================
import { garantirInfra, bloquearContato, removerDaLista, tokenDescadastro } from './lib/brevo.mjs';
import { compararSeguro as compararTokenSeguro } from './lib/seguranca.mjs';

const TEXTOS = {
  pt: {
    ok: ['Pronto!', 'Você não vai mais receber nossos e-mails. Sentiremos sua falta.',
         'Se mudar de ideia, é só se cadastrar de novo em qualquer página do site.'],
    erro: ['Link inválido', 'Este link de descadastro não é válido ou está incompleto. Abra o link diretamente do e-mail que você recebeu.'],
    falha: ['Não deu pra processar agora', 'Tivemos uma falha temporária e não conseguimos confirmar o seu descadastro.',
            'Por favor, tente de novo em alguns minutos abrindo o mesmo link do e-mail que você recebeu. Se continuar falhando, responda a qualquer e-mail nosso pedindo pra ser removido manualmente.'],
  },
  en: {
    ok: ['Done!', "You won't receive our emails anymore. We'll miss you.",
         'If you change your mind, just sign up again on any page of the site.'],
    erro: ['Invalid link', 'This unsubscribe link is invalid or incomplete. Please open the link directly from the email you received.'],
    falha: ['Could not process this right now', "We had a temporary failure and couldn't confirm your unsubscribe.",
            'Please try again in a few minutes using the same link from the email you received. If it keeps failing, reply to any of our emails asking to be removed manually.'],
  },
  es: {
    ok: ['¡Listo!', 'Ya no recibirás nuestros correos. Te vamos a extrañar.',
         'Si cambias de idea, solo regístrate de nuevo en cualquier página del sitio.'],
    erro: ['Enlace inválido', 'Este enlace de cancelación no es válido o está incompleto. Abre el enlace directamente desde el correo que recibiste.'],
    falha: ['No pudimos procesar esto ahora', 'Tuvimos una falla temporal y no logramos confirmar tu cancelación.',
            'Por favor, intenta de nuevo en unos minutos abriendo el mismo enlace del correo que recibiste. Si sigue fallando, responde a cualquier correo nuestro pidiendo ser eliminado manualmente.'],
  },
};

function pagina(titulo, paragrafos, idioma) {
  const corpo = paragrafos.map(p => `<p style="color:#cbd5e1;margin:10px 0 0;">${p}</p>`).join('');
  return `<!DOCTYPE html>
<html lang="${idioma}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>${titulo} | NextLevel</title></head>
<body style="margin:0;font-family:Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#0d1b2a 0%,#101b36 55%,#0a1420 100%);padding:24px;">
<div style="max-width:480px;color:#fff;">
<div style="font-weight:bold;letter-spacing:3px;margin-bottom:24px;color:#5eead4;">NEXTLEVEL</div>
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
  // POST = descadastro de 1 clique (RFC 8058), disparado pelo botão nativo
  // do Gmail/Outlook sem abrir página — a resposta é só um 200 sem HTML.
  const umClique = req.method === 'POST';

  if (!email || !compararTokenSeguro(token, tokenDescadastro(email))) {
    if (umClique) return new Response('invalid', { status: 400 });
    return new Response(pagina(t.erro[0], t.erro.slice(1), idioma), { status: 400, headers: cabecalho });
  }

  // bloquearContato é o que de fato impede novos envios (exigência LGPD) —
  // se ela falhar, a pessoa continuaria recebendo e-mail mesmo vendo a
  // página de sucesso, então aqui a falha tem que aparecer pra ela em vez
  // de ser engolida silenciosamente.
  try {
    await bloquearContato(email);
  } catch (e) {
    console.error('descadastrar: falha ao bloquear contato —', e.message);
    if (umClique) return new Response('error', { status: 502 });
    return new Response(pagina(t.falha[0], t.falha.slice(1), idioma), { status: 502, headers: cabecalho });
  }

  // Tirar da lista da sequência é só reforço (o contato já está bloqueado
  // e não recebe mais nada de qualquer forma) — falhar aqui não deve
  // impedir a confirmação pro usuário.
  try {
    const listaId = await garantirInfra();
    await removerDaLista(email, listaId);
  } catch (e) {
    console.error('descadastrar: contato bloqueado, mas falhou ao remover da lista —', e.message);
  }

  if (umClique) return new Response('ok', { status: 200 });
  return new Response(pagina(t.ok[0], t.ok.slice(1), idioma), { headers: cabecalho });
};
