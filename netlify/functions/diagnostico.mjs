// ============================================================
// Página de diagnóstico da automação de e-mails.
// Abra /.netlify/functions/diagnostico no navegador: ela testa a
// cadeia inteira (chave, conta, remetente, lista) e explica em
// português o que estiver faltando. Com ?enviar=1, dispara um
// e-mail de teste — sempre e somente pro e-mail do DONO da conta
// Brevo (por isso não serve de canal de spam pra terceiros).
// ============================================================
import { chaveApi, api, garantirInfra, enviarEmailSequencia, REMETENTE } from './lib/brevo.mjs';
import { verificarToken, enviarEventoCapi } from './lib/meta-capi.mjs';

function pagina(itens, linkTeste, linkCapi) {
  const ICONE = { ok: '✅', erro: '❌', aviso: '⚠️' };
  const linhas = itens.map(([tipo, texto]) =>
    `<div style="background:#fff;border-radius:10px;padding:14px 16px;margin:10px 0;border-left:4px solid ${tipo === 'ok' ? '#16a34a' : tipo === 'erro' ? '#dc2626' : '#f59e0b'};">${ICONE[tipo]} ${texto}</div>`
  ).join('');
  const rodape = (linkTeste
    ? `<p style="margin-top:22px;"><a href="?enviar=1" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#2b1a00;font-weight:bold;padding:12px 24px;border-radius:10px;text-decoration:none;">📨 Enviar e-mail de teste pra mim</a><br><span style="font-size:12px;color:#5c5470;">(vai pro e-mail do dono da conta Brevo)</span></p>`
    : '') + (linkCapi
    ? `<p style="margin-top:14px;"><a href="?testarcapi=1" style="display:inline-block;background:linear-gradient(135deg,#5b21b6,#7c3aed);color:#fff;font-weight:bold;padding:12px 24px;border-radius:10px;text-decoration:none;">🎯 Enviar evento de teste pra Conversions API</a><br><span style="font-size:12px;color:#5c5470;">(aparece só no painel de Test Events do Meta, não conta nas métricas reais)</span></p>`
    : '');
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
  const url = new URL(req.url);
  const enviar = url.searchParams.get('enviar') === '1';
  const testarCapi = url.searchParams.get('testarcapi') === '1';
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

  // Meta Conversions API — opcional. Sem META_ACCESS_TOKEN, nem entra aqui:
  // o Pixel do navegador continua funcionando normal, só sem o reforço server-side.
  let capiOk = false;
  if (process.env.META_ACCESS_TOKEN) {
    try {
      const info = await verificarToken();
      capiOk = true;
      itens.push(['ok', `Meta Conversions API: token aceito — pixel <strong>${info.nome} (${info.id})</strong> acessível.`]);
      if (!process.env.META_TEST_EVENT_CODE) {
        itens.push(['aviso', 'Variável <strong>META_TEST_EVENT_CODE</strong> não configurada — o botão de teste abaixo fica escondido de propósito (sem ela, um teste mandaria um evento "Lead" de verdade pra sua conta de anúncios). Pra testar com segurança: Gerenciador de Eventos → aba <strong>Test Events</strong> do seu pixel → copie o código de teste → crie a variável <code>META_TEST_EVENT_CODE</code> no Netlify com esse valor → novo deploy.']);
      }
    } catch (e) {
      itens.push(['erro', `Meta rejeitou o token da Conversions API (HTTP ${e.status || '?'}): ${e.message}. Confira se o token não expirou e se o usuário do sistema ainda tem acesso ao Pixel no Business Manager.`]);
    }
  } else {
    itens.push(['aviso', 'Variável <strong>META_ACCESS_TOKEN</strong> não configurada — a Conversions API fica desligada (o Pixel do navegador continua funcionando normal). Passo a passo em CLAUDE.md, seção de infraestrutura.']);
  }

  if (testarCapi) {
    if (!capiOk) {
      itens.push(['erro', 'Não deu pra testar a Conversions API porque o token não foi validado acima.']);
    } else if (!process.env.META_TEST_EVENT_CODE) {
      itens.push(['erro', 'Configure a variável META_TEST_EVENT_CODE antes de testar (veja o aviso acima) — sem ela, o teste contaria como um lead real na sua conta de anúncios, por isso o botão fica bloqueado.']);
    } else {
      try {
        await enviarEventoCapi({
          nome: 'Lead',
          email: 'teste@nextlevelbr.app.br',
          url: 'https://nextlevelbr.app.br/.netlify/functions/diagnostico',
          eventId: 'diagnostico-' + Date.now(),
          testEventCode: process.env.META_TEST_EVENT_CODE,
        });
        itens.push(['ok', 'Evento de teste enviado! Confira em Gerenciador de Eventos → Test Events — deve aparecer em alguns segundos.']);
      } catch (e) {
        itens.push(['erro', `Meta recusou o evento de teste: ${e.message}`]);
      }
    }
  }

  return new Response(pagina(itens, chaveOk && !enviar, capiOk && !!process.env.META_TEST_EVENT_CODE && !testarCapi), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
};
