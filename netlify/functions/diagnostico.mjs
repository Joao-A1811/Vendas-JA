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
import { verificarIdTokenGoogle, criarCookieSessao, lerSessaoValida } from './lib/auth-google.mjs';

const CAMINHO_FUNCAO = '/.netlify/functions/diagnostico';

// Página mostrada enquanto não há sessão válida: ou falta configurar o
// login (GOOGLE_CLIENT_ID/ADMIN_EMAIL/SESSAO_ADMIN_SECRET no Netlify), ou
// mostra o botão "Entrar com Google". Nenhum dado do diagnóstico em si
// aparece aqui — só depois de autenticado.
function paginaLogin({ clientId, configurado, erro }) {
  const avisoConfig = !configurado
    ? `<div style="background:#fff;border-radius:10px;padding:14px 16px;margin:16px 0;border-left:4px solid #dc2626;">
         ❌ Login ainda não configurado no Netlify. Faltam uma ou mais destas variáveis: <strong>GOOGLE_CLIENT_ID</strong>, <strong>ADMIN_EMAIL</strong>, <strong>SESSAO_ADMIN_SECRET</strong>.
       </div>`
    : '';
  const erroHtml = erro
    ? `<p id="erro-login" style="color:#dc2626;font-weight:bold;">${erro}</p>`
    : `<p id="erro-login" style="color:#dc2626;font-weight:bold;"></p>`;
  const botao = configurado
    ? `<a href="#" id="btn-entrar" style="display:inline-block;background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;font-weight:bold;padding:14px 30px;border-radius:10px;text-decoration:none;">Entrar com Google</a>`
    : '';
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>Diagnóstico de e-mail | NextLevel</title></head>
<body style="margin:0;font-family:Arial,sans-serif;background:#f7fbfa;color:#0d1b2a;padding:30px 16px;">
<div style="max-width:640px;margin:0 auto;text-align:center;">
<div style="background:linear-gradient(135deg,#0d1b2a,#0f766e);color:#fff;border-radius:14px;padding:20px 24px;font-weight:bold;letter-spacing:2px;text-align:left;">NEXTLEVEL · DIAGNÓSTICO DE E-MAIL</div>
<p style="margin:26px 0 18px;">Esta página é restrita. Entre com a conta Google autorizada pra continuar.</p>
${avisoConfig}
${botao}
${erroHtml}
</div>
<script>
(function () {
  var CLIENT_ID = ${JSON.stringify(clientId || '')};
  var btn = document.getElementById('btn-entrar');
  var elErro = document.getElementById('erro-login');

  function mostrarErro(msg) { if (elErro) elErro.textContent = msg; }

  function nonceAleatorio() {
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  }

  // Voltou do Google com o id_token no fragmento da URL (fluxo implícito)?
  var hash = location.hash && location.hash[0] === '#' ? location.hash.slice(1) : '';
  var params = new URLSearchParams(hash);
  var idToken = params.get('id_token');

  if (idToken) {
    var nonce = '';
    try { nonce = sessionStorage.getItem('nl_admin_nonce') || ''; sessionStorage.removeItem('nl_admin_nonce'); } catch (e) {}
    history.replaceState(null, '', location.pathname);
    fetch(location.pathname, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ credential: idToken, nonce: nonce }),
    }).then(function (r) { return r.json(); }).then(function (r) {
      if (r.ok) { location.reload(); }
      else { mostrarErro(r.erro || 'Login recusado.'); }
    }).catch(function () { mostrarErro('Falha ao validar o login.'); });
  }

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var nonce = nonceAleatorio();
      try { sessionStorage.setItem('nl_admin_nonce', nonce); } catch (e) {}
      var url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: location.origin + location.pathname,
        response_type: 'id_token',
        scope: 'openid email',
        nonce: nonce,
        prompt: 'select_account',
      });
      location.href = url;
    });
  }
})();
</script>
</body></html>`;
}

async function tratarLogin(req) {
  const cabecalho = { 'content-type': 'application/json' };
  let corpo;
  try { corpo = await req.json(); } catch { return new Response(JSON.stringify({ ok: false, erro: 'JSON inválido.' }), { status: 400, headers: cabecalho }); }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const emailPermitido = process.env.ADMIN_EMAIL;
  if (!clientId || !emailPermitido || !process.env.SESSAO_ADMIN_SECRET) {
    return new Response(JSON.stringify({ ok: false, erro: 'Login não configurado no servidor.' }), { status: 500, headers: cabecalho });
  }

  try {
    const payload = await verificarIdTokenGoogle(corpo.credential, { clientId, nonceEsperado: corpo.nonce });
    if (payload.email.toLowerCase() !== emailPermitido.toLowerCase()) {
      console.error('diagnostico: login recusado — e-mail não autorizado');
      return new Response(JSON.stringify({ ok: false, erro: 'E-mail não autorizado.' }), { status: 403, headers: cabecalho });
    }
    const cookie = criarCookieSessao(payload.email, CAMINHO_FUNCAO);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cabecalho, 'set-cookie': cookie } });
  } catch (e) {
    console.error('diagnostico: login recusado —', e.message);
    return new Response(JSON.stringify({ ok: false, erro: 'Login recusado.' }), { status: 401, headers: cabecalho });
  }
}

function pagina(itens, linkTeste, linkCapi) {
  const ICONE = { ok: '✅', erro: '❌', aviso: '⚠️' };
  const linhas = itens.map(([tipo, texto]) =>
    `<div style="background:#fff;border-radius:10px;padding:14px 16px;margin:10px 0;border-left:4px solid ${tipo === 'ok' ? '#16a34a' : tipo === 'erro' ? '#dc2626' : '#f59e0b'};">${ICONE[tipo]} ${texto}</div>`
  ).join('');
  const rodape = (linkTeste
    ? `<p style="margin-top:22px;"><a href="?enviar=1" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#2b1a00;font-weight:bold;padding:12px 24px;border-radius:10px;text-decoration:none;">📨 Enviar e-mail de teste pra mim</a><br><span style="font-size:12px;color:#5c5470;">(vai pro e-mail do dono da conta Brevo)</span></p>`
    : '') + (linkCapi
    ? `<p style="margin-top:14px;"><a href="?testarcapi=1" style="display:inline-block;background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;font-weight:bold;padding:12px 24px;border-radius:10px;text-decoration:none;">🎯 Enviar evento de teste pra Conversions API</a><br><span style="font-size:12px;color:#5c5470;">(aparece só no painel de Test Events do Meta, não conta nas métricas reais)</span></p>`
    : '');
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>Diagnóstico de e-mail | NextLevel</title></head>
<body style="margin:0;font-family:Arial,sans-serif;background:#f7fbfa;color:#0d1b2a;padding:30px 16px;">
<div style="max-width:640px;margin:0 auto;">
<div style="background:linear-gradient(135deg,#0d1b2a,#0f766e);color:#fff;border-radius:14px;padding:20px 24px;font-weight:bold;letter-spacing:2px;">NEXTLEVEL · DIAGNÓSTICO DE E-MAIL</div>
${linhas}
${rodape}
<p style="font-size:12px;color:#5c5470;margin-top:26px;">Se algum item estiver ❌, siga a instrução dele e recarregue esta página. Lembre: mudou variável de ambiente no Netlify → precisa de um novo deploy pra valer.</p>
</div></body></html>`;
}

export default async (req) => {
  if (req.method === 'POST') return tratarLogin(req);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const emailPermitido = process.env.ADMIN_EMAIL;
  const configurado = !!(clientId && emailPermitido && process.env.SESSAO_ADMIN_SECRET);
  const sessaoEmail = configurado ? lerSessaoValida(req, emailPermitido) : null;

  if (!sessaoEmail) {
    return new Response(paginaLogin({ clientId, configurado }), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

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
