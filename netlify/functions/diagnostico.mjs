// ============================================================
// Página de diagnóstico da automação de e-mails.
// Abra /.netlify/functions/diagnostico no navegador: ela testa a
// cadeia inteira (chave, conta, remetente, lista) e explica em
// português o que estiver faltando. Com ?enviar=1, dispara um
// e-mail de teste — sempre e somente pro e-mail do DONO da conta
// Brevo (por isso não serve de canal de spam pra terceiros).
// ============================================================
import { chaveApi, api, garantirInfra, enviarEmailSequencia, REMETENTE } from './lib/brevo.mjs';

function pagina(itens, linkTeste) {
  const ICONE = { ok: '✅', erro: '❌', aviso: '⚠️' };
  const linhas = itens.map(([tipo, texto]) =>
    `<div style="background:#fff;border-radius:10px;padding:14px 16px;margin:10px 0;border-left:4px solid ${tipo === 'ok' ? '#16a34a' : tipo === 'erro' ? '#dc2626' : '#f59e0b'};">${ICONE[tipo]} ${texto}</div>`
  ).join('');
  const rodape = linkTeste
    ? `<p style="margin-top:22px;"><a href="?enviar=1" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#2b1a00;font-weight:bold;padding:12px 24px;border-radius:10px;text-decoration:none;">📨 Enviar e-mail de teste pra mim</a><br><span style="font-size:12px;color:#5c5470;">(vai pro e-mail do dono da conta Brevo)</span></p>`
    : '';
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>Diagnóstico de e-mail | NextLevel</title></head>
<body style="margin:0;font-family:Arial,sans-serif;background:#faf9fc;color:#1c1428;padding:30px 16px;">
<div style="max-width:640px;margin:0 auto;">
<div style="background:linear-gradient(135deg,#5b21b6,#db2777);color:#fff;border-radius:14px;padding:20px 24px;font-weight:bold;letter-spacing:2px;">NEXTLEVEL · DIAGNÓSTICO DE E-MAIL</div>
${linhas}
${rodape}
<p style="font-size:12px;color:#5c5470;margin-top:26px;">Se algum item estiver ❌, siga a instrução dele e recarregue esta página. Lembre: mudou variável de ambiente no Netlify → precisa de um novo deploy pra valer.</p>
</div></body></html>`;
}

export default async (req) => {
  const enviar = new URL(req.url).searchParams.get('enviar') === '1';
  const itens = [];
  let chaveOk = false;
  let contaEmail = null;

  try {
    chaveApi();
    chaveOk = true;
    itens.push(['ok', 'Variável <strong>BREVO_API_KEY</strong> está configurada no Netlify.']);
  } catch {
    itens.push(['erro', 'A variável <strong>BREVO_API_KEY</strong> NÃO chegou até a função. Ou ela não foi salva (confira em Site configuration → Environment variables — use "Same value for all deploy contexts"), ou o último deploy rodou <strong>antes</strong> de você salvá-la. Salve e dispare um novo deploy (Deploys → Trigger deploy).']);
  }

  if (chaveOk) {
    try {
      const conta = await api('/account');
      contaEmail = conta.email;
      itens.push(['ok', `Chave aceita pelo Brevo — conta: <strong>${conta.email}</strong>.`]);
    } catch (e) {
      chaveOk = false;
      itens.push(['erro', `O Brevo rejeitou a chave (HTTP ${e.status || '?'}). Provavelmente é a chave antiga (revogada) ou foi colada incompleta. Gere uma nova em app.brevo.com → SMTP & API → API Keys, atualize a variável no Netlify e dispare novo deploy.`]);
    }
  }

  if (chaveOk) {
    try {
      const remetentes = await api('/senders');
      const r = (remetentes.senders || []).find(s => s.email.toLowerCase() === REMETENTE.email.toLowerCase());
      if (r && r.active) itens.push(['ok', `Remetente <strong>${REMETENTE.email}</strong> verificado e ativo no Brevo.`]);
      else if (r) itens.push(['erro', `O remetente <strong>${REMETENTE.email}</strong> existe no Brevo mas não está verificado — abra a caixa dele e clique no link de confirmação que o Brevo mandou.`]);
      else itens.push(['erro', `O remetente <strong>${REMETENTE.email}</strong> não está cadastrado no Brevo (Settings → Senders → Add a sender).`]);
    } catch (e) {
      itens.push(['aviso', `Não consegui conferir os remetentes: ${e.message}`]);
    }

    // Entregabilidade: remetente em provedor gratuito é o maior motivo de
    // cair no spam quando o envio passa por uma plataforma como o Brevo.
    const FREEMAIL = ['outlook.com', 'hotmail.com', 'live.com', 'gmail.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'zohomail.com', 'bol.com.br', 'uol.com.br'];
    const dominioRemetente = REMETENTE.email.split('@')[1]?.toLowerCase() || '';
    if (FREEMAIL.includes(dominioRemetente)) {
      itens.push(['aviso', `O remetente atual usa um provedor gratuito (<strong>@${dominioRemetente}</strong>) — Gmail e Outlook tendem a mandar esses envios pro spam. Pra cair na caixa de entrada: 1) confirme que o domínio <strong>nextlevelbr.app.br</strong> está "Autenticado" no Brevo (Settings → Senders, Domains &amp; IPs → Domains → Autenticar); 2) crie <strong>contato@nextlevelbr.app.br</strong> com redirecionamento gratuito no improvmx.com; 3) verifique esse endereço como remetente no Brevo; 4) no Netlify, crie a variável <strong>EMAIL_REMETENTE</strong> com esse endereço e dispare novo deploy. Passo a passo completo em emails/LEIA-ME-BREVO.md.`]);
    }

    try {
      const listaId = await garantirInfra();
      itens.push(['ok', `Lista <strong>sequencia-automatica</strong> pronta no Brevo (id ${listaId}), atributos criados.`]);
    } catch (e) {
      itens.push(['erro', `Falha ao preparar a lista/atributos no Brevo: ${e.message}`]);
    }

    if (enviar) {
      if (contaEmail) {
        try {
          await enviarEmailSequencia(1, { email: contaEmail, nome: 'Teste', slug: 'emagrecimento', idioma: 'pt' });
          itens.push(['ok', `E-mail de teste enviado para <strong>${contaEmail}</strong> — confira a caixa de entrada (e o spam).`]);
        } catch (e) {
          itens.push(['erro', `O Brevo recusou o envio de teste: ${e.message}`]);
        }
      } else {
        itens.push(['aviso', 'Não deu pra enviar o teste porque a conta não foi identificada.']);
      }
    }
  }

  return new Response(pagina(itens, chaveOk && !enviar), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
};
