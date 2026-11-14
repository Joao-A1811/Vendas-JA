// ============================================================
// FAIXA DE BLACK FRIDAY — NextLevel
// Campanha temporária (ver DATA_FIM abaixo). Injeta sozinho o banner no
// topo do <body> — nenhuma página precisa de HTML extra, só o
// <script src="/assets/black-friday.js" defer> no <head>/fim do <body>.
// Depois que a campanha acabar, o próprio banner some sozinho (ver
// expirou() mais abaixo) — não quebra nada ficar esquecido no ar, mas
// pra limpar de vez basta remover a tag <script> das páginas e apagar
// este arquivo.
//
// Fica em fluxo normal (não fixed/sticky) de propósito: assim ele some
// com a rolagem como qualquer conteúdo e não precisa de nenhum ajuste
// de offset com o cabeçalho sticky, o banner de cookies (consent.js)
// ou a barra fixa de compra do mobile — todos continuam se comportando
// exatamente como antes.
// ============================================================
(function () {
  // Horário de Brasília é UTC-3 o ano todo (sem horário de verão desde
  // 2019) — por isso o offset fixo "-03:00" funciona sem biblioteca de
  // fuso horário.
  var DATA_FIM = new Date('2026-11-30T23:59:00-03:00');

  function expirou() {
    return Date.now() >= DATA_FIM.getTime();
  }

  function idiomaDaPagina() {
    var p = location.pathname;
    if (/-en\.html$/.test(p)) return 'en';
    if (/-es\.html$/.test(p)) return 'es';
    return 'pt';
  }

  function numero(precoTexto) {
    return parseFloat((precoTexto || '').replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
  }

  function percentualOff(idioma) {
    var precos = (window.PRECOS_SITE || {})[idioma];
    if (!precos) return null;
    var de = numero(precos.de), por = numero(precos.por);
    if (!de) return null;
    return Math.round(((de - por) / de) * 100);
  }

  var TEXTOS = {
    pt: { titulo: 'BLACK FRIDAY', termina: 'Termina em', off: 'OFF em todos os guias', dias: 'd', horas: 'h', min: 'm', seg: 's', cta: 'Ver ofertas' },
    en: { titulo: 'BLACK FRIDAY', termina: 'Ends in', off: 'OFF on every guide', dias: 'd', horas: 'h', min: 'm', seg: 's', cta: 'See deals' },
    es: { titulo: 'BLACK FRIDAY', termina: 'Termina en', off: 'OFF en todas las guías', dias: 'd', horas: 'h', min: 'm', seg: 's', cta: 'Ver ofertas' },
  };

  function doisDigitos(n) { return n < 10 ? '0' + n : '' + n; }

  function formatarRestante(ms, t) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var dias = Math.floor(total / 86400);
    var horas = Math.floor((total % 86400) / 3600);
    var min = Math.floor((total % 3600) / 60);
    var seg = total % 60;
    return dias + t.dias + ' ' + doisDigitos(horas) + t.horas + ' ' + doisDigitos(min) + t.min + ' ' + doisDigitos(seg) + t.seg;
  }

  // CTA do banner: na home rola até o catálogo; em /categorias/ não faz
  // sentido linkar pra ela mesma (omite); em qualquer outra página
  // (produto, legal etc.) manda pra /categorias/ no idioma certo, pra
  // quem está decidido a aproveitar a promoção ver o resto do catálogo.
  function hrefCatalogo(idioma) {
    var p = location.pathname;
    if (/^\/(index(-en|-es)?\.html)?$/.test(p)) return '#catalogo';
    if (/^\/categorias\//.test(p)) return null;
    if (idioma === 'en') return '/categorias/index-en.html';
    if (idioma === 'es') return '/categorias/index-es.html';
    return '/categorias/';
  }

  function montar() {
    if (expirou()) return;
    var idioma = idiomaDaPagina();
    var t = TEXTOS[idioma];
    var pct = percentualOff(idioma);

    var estilo = document.createElement('style');
    estilo.textContent = [
      '.nl-bf-faixa{background:#0a0a0a;color:#fff;font-family:Arial,Helvetica,sans-serif;position:relative;overflow:hidden}',
      '.nl-bf-faixa::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(245,158,11,.12),transparent 40%,transparent 60%,rgba(245,158,11,.12));pointer-events:none}',
      '.nl-bf-inner{max-width:1080px;margin:0 auto;padding:9px 20px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;font-size:13px;font-weight:700;position:relative;text-align:center}',
      '.nl-bf-titulo{color:#f59e0b;font-weight:900;letter-spacing:.5px;font-size:13.5px;white-space:nowrap}',
      '.nl-bf-pct{background:#f59e0b;color:#1a1200;padding:2px 9px;border-radius:99px;font-weight:900;font-size:12px;white-space:nowrap}',
      '.nl-bf-off{color:#e8e8e8;font-weight:600;white-space:nowrap}',
      '.nl-bf-cron{display:inline-flex;align-items:center;gap:6px;color:#fff;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.35);padding:3px 10px;border-radius:99px;font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.nl-bf-cron b{color:#f59e0b}',
      '.nl-bf-cta{color:#0a0a0a;background:#f59e0b;padding:4px 12px;border-radius:99px;text-decoration:none;font-weight:800;white-space:nowrap;font-size:12.5px}',
      '.nl-bf-cta:hover{background:#fbbf24}',
      '@media(max-width:620px){.nl-bf-inner{padding:8px 14px;font-size:12px;gap:7px}.nl-bf-titulo{font-size:12.5px}.nl-bf-off{display:none}}',
      '.nl-bf-selo{position:absolute;top:12px;left:12px;z-index:2;background:#0a0a0a;color:#f59e0b;font-size:10px;font-weight:800;letter-spacing:.3px;padding:4px 10px;border-radius:99px;display:flex;align-items:center;gap:3px;box-shadow:0 2px 8px rgba(0,0,0,.35)}',
      '@media(max-width:640px){.nl-bf-selo{font-size:9px;padding:3px 8px}}',
      '.nl-bf-oferta-selo{display:inline-flex;align-items:center;gap:8px;background:#0a0a0a;color:#f59e0b;font-weight:800;font-size:13px;letter-spacing:.4px;padding:7px 16px;border-radius:99px;margin-bottom:16px}',
      '.nl-bf-oferta-pct{background:#f59e0b;color:#1a1200;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:900}',
      '#oferta .contador .bloco{background:#0a0a0a}',
      '#oferta .contador .bloco b{color:#f59e0b}',
      '#oferta .contador .bloco span{color:#fff}',
    ].join('');
    document.head.appendChild(estilo);

    var faixa = document.createElement('div');
    faixa.className = 'nl-bf-faixa';
    faixa.setAttribute('role', 'region');
    faixa.setAttribute('aria-label', t.titulo);

    var ctaHref = hrefCatalogo(idioma);
    var pctHtml = pct ? '<span class="nl-bf-pct">-' + pct + '%</span>' : '';
    var ctaHtml = ctaHref ? '<a class="nl-bf-cta" href="' + ctaHref + '">' + t.cta + '</a>' : '';

    faixa.innerHTML =
      '<div class="nl-bf-inner">' +
      '<span class="nl-bf-titulo">🔥 ' + t.titulo + '</span>' +
      pctHtml +
      '<span class="nl-bf-off">' + t.off + '</span>' +
      '<span class="nl-bf-cron">' + t.termina + ': <b id="nl-bf-tempo"></b></span>' +
      ctaHtml +
      '</div>';

    document.body.insertBefore(faixa, document.body.firstChild);

    var elTempo = document.getElementById('nl-bf-tempo');
    function atualizar() {
      var restante = DATA_FIM.getTime() - Date.now();
      if (restante <= 0) {
        faixa.remove();
        if (intervalo) clearInterval(intervalo);
        return;
      }
      elTempo.textContent = formatarRestante(restante, t);
    }
    atualizar();
    var intervalo = setInterval(atualizar, 1000);

    marcarCards(idioma, pct);
    marcarOferta(idioma, pct);
  }

  // Selo nas páginas de produto, em cima do preço na caixa de oferta —
  // o contador em si é o mecanismo que já existia em CONFIG
  // (contagemRegressivaFim), só ligado pra essa campanha; aqui só
  // coloca o rótulo "BLACK FRIDAY" que ele não tinha.
  function marcarOferta(idioma, pct) {
    var oferta = document.querySelector('.oferta');
    if (!oferta || oferta.querySelector('.nl-bf-oferta-selo')) return;
    var t = TEXTOS[idioma];
    var selo = document.createElement('div');
    selo.className = 'nl-bf-oferta-selo';
    selo.innerHTML = '🔥 ' + t.titulo + (pct ? ' <span class="nl-bf-oferta-pct">-' + pct + '%</span>' : '');
    oferta.insertBefore(selo, oferta.firstChild);
  }

  // Selo nos cards do catálogo (home e /categorias/) — ambos usam a
  // mesma classe .card, então um seletor só cobre as duas páginas. Os
  // cards já são renderizados por um <script> inline antes deste
  // arquivo (que é defer) rodar, mas o retry cobre o caso de alguma
  // página vir a gerar os cards de forma assíncrona no futuro.
  function marcarCards(idioma, pct) {
    if (!pct) return;
    var textoSelo = '🔥 -' + pct + '%';
    function aplicar() {
      var cards = document.querySelectorAll('.card');
      if (!cards.length) return false;
      cards.forEach(function (card) {
        if (card.querySelector('.nl-bf-selo')) return;
        var selo = document.createElement('span');
        selo.className = 'nl-bf-selo';
        selo.textContent = textoSelo;
        card.insertBefore(selo, card.firstChild);
      });
      return true;
    }
    if (aplicar()) return;
    var tentativas = 0;
    var retry = setInterval(function () {
      tentativas++;
      if (aplicar() || tentativas > 20) clearInterval(retry);
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
