// ============================================================
// AVALIAÇÕES DE LEITORES — NextLevel
// Duas responsabilidades, nas páginas de produto (3 idiomas):
//   1. Mostrar as avaliações JÁ APROVADAS do produto
//      (lidas de avaliacoes-publicadas/<slug> no Realtime Database,
//      via REST — leitura pública, sem SDK).
//   2. Formulário "Avalie este material": salva em
//      avaliacoes-pendentes/<slug> e NADA aparece no site até o dono
//      aprovar no painel (leads/painel-leads.html). É o que mantém a
//      seção honesta: só entra avaliação de gente real, verificada.
// Regras do Firebase exigidas: ver CHECKLIST-CONFIGURACAO.md § 1a.
// Se o Firebase estiver fora do ar, a seção simplesmente não aparece
// (leitura) e o formulário mostra erro amigável (escrita).
// ============================================================
(function () {
  var TEXTOS = {
    pt: {
      tituloLista: 'O que os leitores dizem',
      recebeuGratis: 'recebeu o material gratuitamente para avaliação',
      tituloForm: 'Avalie este material',
      subForm: 'Leu o material? Conte o que achou — avaliações passam por verificação antes de aparecer aqui.',
      nome: 'Seu nome',
      email: 'Seu e-mail (não é publicado — usado só pra verificar)',
      comentario: 'O que você achou do material?',
      consent: 'Autorizo a publicação do meu comentário e primeiro nome no site.',
      enviar: 'Enviar avaliação',
      ok: 'Obrigado! Sua avaliação foi recebida e será publicada após verificação.',
      erro: 'Não foi possível enviar agora. Tente de novo em instantes.',
      notaLabel: 'Sua nota',
      verificada: 'compra verificada',
    },
    en: {
      tituloLista: 'What readers say',
      recebeuGratis: 'received the material for free for review',
      tituloForm: 'Review this material',
      subForm: "Read the material? Tell us what you think — reviews are verified before they appear here.",
      nome: 'Your name',
      email: 'Your email (never published — used only for verification)',
      comentario: 'What did you think of the material?',
      consent: 'I authorize publishing my comment and first name on this site.',
      enviar: 'Submit review',
      ok: 'Thank you! Your review was received and will be published after verification.',
      erro: "Couldn't submit right now. Please try again in a moment.",
      notaLabel: 'Your rating',
      verificada: 'verified purchase',
    },
    es: {
      tituloLista: 'Lo que dicen los lectores',
      recebeuGratis: 'recibió el material gratis para evaluarlo',
      tituloForm: 'Evalúa este material',
      subForm: '¿Leíste el material? Cuéntanos qué te pareció — las evaluaciones se verifican antes de aparecer aquí.',
      nome: 'Tu nombre',
      email: 'Tu correo (no se publica — solo para verificación)',
      comentario: '¿Qué te pareció el material?',
      consent: 'Autorizo la publicación de mi comentario y primer nombre en el sitio.',
      enviar: 'Enviar evaluación',
      ok: '¡Gracias! Tu evaluación fue recibida y se publicará tras la verificación.',
      erro: 'No se pudo enviar ahora. Intenta de nuevo en un momento.',
      notaLabel: 'Tu nota',
      verificada: 'compra verificada',
    },
  };

  function estrelas(n) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += i <= n ? '★' : '☆';
    return s;
  }

  function esc(t) {
    var d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  function iniciar() {
    var container = document.getElementById('nl-avaliacoes-container');
    // CONFIG é const de topo de página (escopo compartilhado entre <script>
    // clássicos — não existe window.CONFIG; usar o identificador direto).
    if (!container || typeof CONFIG === 'undefined' || !window.SITE || !window.SITE.firebase) return;
    var dbUrl = window.SITE.firebase.databaseURL;
    if (!dbUrl || dbUrl.indexOf('COLE_AQUI') !== -1) return;

    var idioma = ['pt', 'en', 'es'].indexOf(CONFIG.idioma) !== -1 ? CONFIG.idioma : 'pt';
    var t = TEXTOS[idioma];
    var partes = location.pathname.split('/').filter(Boolean);
    var slug = partes[0] === 'produtos' ? partes[1] : null;
    if (!slug) return;

    var estilo = document.createElement('style');
    estilo.textContent = [
      '#nl-avaliacoes-container .nl-av-secao{padding:0}',
      '.nl-av-card{background:#fff;border:1px solid rgba(13,27,42,.08);border-radius:14px;padding:20px 22px;margin-bottom:14px;box-shadow:0 4px 18px rgba(15,118,110,.06)}',
      '.nl-av-card .nl-av-topo{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}',
      '.nl-av-card strong{font-family:"Poppins",Arial,sans-serif;font-size:14.5px;color:#0d1b2a}',
      '.nl-av-estrelas{color:#f59e0b;font-size:15px;letter-spacing:2px}',
      '.nl-av-tag{font-size:11px;color:#0f766e;background:#eef6f5;border-radius:20px;padding:3px 10px}',
      '.nl-av-card p{font-size:14px;color:#3d4a48;line-height:1.6;margin:0}',
      '.nl-av-form{background:#fff;border:1px solid rgba(13,27,42,.08);border-radius:14px;padding:26px;box-shadow:0 4px 18px rgba(15,118,110,.06)}',
      '.nl-av-form h4{font-family:"Poppins",Arial,sans-serif;font-size:17px;color:#0d1b2a;margin:0 0 6px}',
      '.nl-av-form .nl-av-sub{font-size:13px;color:#5b6b68;margin:0 0 16px}',
      '.nl-av-form input[type=text],.nl-av-form input[type=email],.nl-av-form textarea{width:100%;box-sizing:border-box;padding:12px 14px;margin-bottom:10px;border:1px solid rgba(13,27,42,.15);border-radius:10px;font-size:14px;font-family:inherit}',
      '.nl-av-form textarea{min-height:90px;resize:vertical}',
      '.nl-av-notas{display:flex;flex-direction:row-reverse;justify-content:flex-end;gap:4px;margin-bottom:10px}',
      '.nl-av-notas input{display:none}',
      '.nl-av-notas label{font-size:26px;color:#cbd5e1;cursor:pointer;transition:color .15s}',
      '.nl-av-notas input:checked ~ label,.nl-av-notas label:hover,.nl-av-notas label:hover ~ label{color:#f59e0b}',
      '.nl-av-consent{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:#5b6b68;margin-bottom:14px}',
      '.nl-av-consent input{margin-top:2px}',
      '.nl-av-form button{background:#0d1b2a;color:#5eead4;border:none;border-radius:10px;padding:13px 26px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit}',
      '.nl-av-form button[disabled]{opacity:.6;cursor:default}',
      '#nl-av-msg{margin-top:10px;font-size:13.5px;font-weight:600}',
      '#nl-av-site{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}',
    ].join('');
    document.head.appendChild(estilo);

    var notasHtml = '';
    for (var i = 5; i >= 1; i--) {
      notasHtml += '<input type="radio" name="nl-av-nota" id="nl-av-n' + i + '" value="' + i + '"' + (i === 5 ? ' checked' : '') + '>' +
        '<label for="nl-av-n' + i + '" title="' + i + '">★</label>';
    }

    container.innerHTML =
      '<section class="section nl-av-secao" id="avaliar">' +
      '<div class="container">' +
      '<div id="nl-av-lista"></div>' +
      '<div class="nl-av-form">' +
      '<h4>' + t.tituloForm + '</h4>' +
      '<p class="nl-av-sub">' + t.subForm + '</p>' +
      '<form id="nl-av-form">' +
      '<span style="font-size:13px;color:#5b6b68">' + t.notaLabel + ':</span>' +
      '<div class="nl-av-notas">' + notasHtml + '</div>' +
      '<input type="text" id="nl-av-nome" placeholder="' + t.nome + '" required maxlength="79">' +
      '<input type="email" id="nl-av-email" placeholder="' + t.email + '" required maxlength="199">' +
      '<input type="text" id="nl-av-site" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<textarea id="nl-av-comentario" placeholder="' + t.comentario + '" required minlength="11" maxlength="1199"></textarea>' +
      '<label class="nl-av-consent"><input type="checkbox" id="nl-av-consent" required><span>' + t.consent + '</span></label>' +
      '<button type="submit">' + t.enviar + '</button>' +
      '<div id="nl-av-msg" role="status"></div>' +
      '</form></div></div></section>';

    // -------- Avaliações publicadas (leitura pública via REST) --------
    fetch(dbUrl.replace(/\/$/, '') + '/avaliacoes-publicadas/' + encodeURIComponent(slug) + '.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (dados) {
        if (!dados) return;
        var itens = Object.keys(dados).map(function (k) { return dados[k]; })
          .filter(function (a) { return a && a.comentario && a.idioma === idioma; })
          .sort(function (a, b) { return (b.data || '').localeCompare(a.data || ''); });
        if (!itens.length) return;
        var html = '<h3 style="margin-bottom:18px">' + t.tituloLista + '</h3>';
        itens.forEach(function (a) {
          var primeiroNome = String(a.nome || '').trim().split(/\s+/)[0];
          var origem = a.origem === 'gratis' ? t.recebeuGratis : (a.origem === 'compra' ? t.verificada : '');
          html += '<div class="nl-av-card">' +
            '<div class="nl-av-topo">' +
            '<span class="nl-av-estrelas" aria-label="' + esc(a.nota) + '/5">' + estrelas(Number(a.nota) || 5) + '</span>' +
            '<strong>' + esc(primeiroNome) + '</strong>' +
            (origem ? '<span class="nl-av-tag">' + origem + '</span>' : '') +
            '</div><p>' + esc(a.comentario) + '</p></div>';
        });
        document.getElementById('nl-av-lista').innerHTML = html;
      })
      .catch(function () { /* leitura falhou → seção de lista só não aparece */ });

    // -------- Envio (fica pendente até aprovação no painel) --------
    document.getElementById('nl-av-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('nl-av-msg');
      // Honeypot: robô preencheu o campo escondido → finge sucesso, não salva.
      if (document.getElementById('nl-av-site').value) {
        msg.textContent = t.ok; msg.style.color = '#0f766e';
        return;
      }
      var botao = e.target.querySelector('button');
      botao.disabled = true;
      var notaEl = document.querySelector('input[name="nl-av-nota"]:checked');
      var corpo = {
        nome: document.getElementById('nl-av-nome').value.trim().slice(0, 79),
        email: document.getElementById('nl-av-email').value.trim().slice(0, 199),
        nota: Number(notaEl ? notaEl.value : 5),
        comentario: document.getElementById('nl-av-comentario').value.trim().slice(0, 1199),
        idioma: idioma,
        data: new Date().toISOString(),
      };
      fetch(dbUrl.replace(/\/$/, '') + '/avaliacoes-pendentes/' + encodeURIComponent(slug) + '.json', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(corpo),
      }).then(function (r) {
        if (!r.ok) throw new Error('regra negou');
        msg.textContent = t.ok; msg.style.color = '#0f766e';
        e.target.reset();
      }).catch(function () {
        msg.textContent = t.erro; msg.style.color = '#c0392b';
        botao.disabled = false;
      });
    });

    // Link do e-mail pós-compra chega com #avaliar — rola até o formulário.
    if (location.hash === '#avaliar') {
      setTimeout(function () {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
