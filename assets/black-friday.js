// ============================================================
// FAIXA DE BLACK FRIDAY — NextLevel
// Campanha temporária (ver DATA_FIM abaixo). Injeta sozinho todo o
// visual da campanha — nenhuma página precisa de HTML extra, só o
// <script src="/assets/black-friday.js" defer> no <head>/fim do <body>:
//   1) faixa fina no topo com contador (todas as páginas do site)
//   2) fita diagonal "-X% OFF" nos cards do catálogo (home e /categorias/)
//   3) selo + brilho na caixa de oferta das páginas de produto
//   4) seção de destaque grande entre o hero e o catálogo (só na home)
//   5) pop-up uma vez por dia por visitante (qualquer página)
// Depois que a campanha acabar, tudo some sozinho (ver expirou() mais
// abaixo) — não quebra nada ficar esquecido no ar, mas pra limpar de vez
// basta remover a tag <script> das páginas e apagar este arquivo.
//
// A faixa do topo fica em fluxo normal (não fixed/sticky) de propósito:
// assim ela some com a rolagem como qualquer conteúdo e não precisa de
// nenhum ajuste de offset com o cabeçalho sticky, o banner de cookies
// (consent.js) ou a barra fixa de compra do mobile — todos continuam se
// comportando exatamente como antes. O pop-up usa z-index 9999, acima de
// tudo isso (o maior z-index usado no resto do site é 60).
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

  function paginaHome() {
    return /^\/(index(-en|-es)?\.html)?$/.test(location.pathname);
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
    pt: {
      titulo: 'BLACK FRIDAY', termina: 'Termina em', off: 'OFF em todos os guias',
      dias: 'd', horas: 'h', min: 'm', seg: 's', cta: 'Ver ofertas', fechar: 'Fechar',
      destaqueSub: 'Só até segunda-feira (Cyber Monday) — depois os preços voltam ao normal.',
    },
    en: {
      titulo: 'BLACK FRIDAY', termina: 'Ends in', off: 'OFF on every guide',
      dias: 'd', horas: 'h', min: 'm', seg: 's', cta: 'See deals', fechar: 'Close',
      destaqueSub: 'Only until Monday (Cyber Monday) — prices go back up after that.',
    },
    es: {
      titulo: 'BLACK FRIDAY', termina: 'Termina en', off: 'OFF en todas las guías',
      dias: 'd', horas: 'h', min: 'm', seg: 's', cta: 'Ver ofertas', fechar: 'Cerrar',
      destaqueSub: 'Solo hasta el lunes (Cyber Monday) — después los precios vuelven a la normalidad.',
    },
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

  // Versão em blocos (dia/hora/min/seg separados) usada na seção de
  // destaque da home e no pop-up — mesmo visual do contador que já
  // existia nas páginas de produto.
  function blocosHtml(ms, t) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var dias = Math.floor(total / 86400);
    var horas = Math.floor((total % 86400) / 3600);
    var min = Math.floor((total % 3600) / 60);
    var seg = total % 60;
    var partes = [[dias, t.dias], [doisDigitos(horas), t.horas], [doisDigitos(min), t.min], [doisDigitos(seg), t.seg]];
    return partes.map(function (p) {
      return '<div class="bloco"><b>' + p[0] + '</b><span>' + p[1] + '</span></div>';
    }).join('');
  }

  // CTA da campanha: na home rola até o catálogo; em /categorias/ não faz
  // sentido linkar pra ela mesma (omite — quem chama trata o null); em
  // qualquer outra página (produto, legal etc.) manda pra /categorias/
  // no idioma certo, pra quem está decidido a aproveitar a promoção ver
  // o resto do catálogo.
  function hrefCatalogo(idioma) {
    if (paginaHome()) return '#catalogo';
    if (/^\/categorias\//.test(location.pathname)) return null;
    if (idioma === 'en') return '/categorias/index-en.html';
    if (idioma === 'es') return '/categorias/index-es.html';
    return '/categorias/';
  }

  function chaveHoje() {
    var d = new Date();
    return d.getFullYear() + '-' + doisDigitos(d.getMonth() + 1) + '-' + doisDigitos(d.getDate());
  }

  function jaMostrouPopupHoje() {
    try { return localStorage.getItem('nl_bf_popup') === chaveHoje(); } catch (e) { return false; }
  }

  function marcarPopupMostrado() {
    try { localStorage.setItem('nl_bf_popup', chaveHoje()); } catch (e) {}
  }

  function montar() {
    if (expirou()) return;
    var idioma = idiomaDaPagina();
    var t = TEXTOS[idioma];
    var pct = percentualOff(idioma);

    injetarEstilos();
    montarFaixa(idioma, t, pct);
    marcarCards(pct);
    marcarOferta(idioma, t, pct);
    montarDestaque(idioma, t, pct);
    montarPopup(idioma, t, pct);
  }

  function injetarEstilos() {
    var estilo = document.createElement('style');
    estilo.textContent = [
      // --- faixa fina no topo ---
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

      // --- fita diagonal nos cards do catálogo (telas largas) ---
      '.nl-bf-fita{position:absolute;top:17px;left:-36px;width:144px;transform:rotate(-45deg);background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#1a1200;font-weight:900;font-size:11px;letter-spacing:.2px;text-align:center;padding:4px 0;z-index:3;box-shadow:0 3px 8px rgba(0,0,0,.3);pointer-events:none;animation:nlBfPulsoFita 2.4s ease-in-out infinite}',
      // A capa do card é uma faixa bem baixa (aspect-ratio 5.6/1) — numa
      // tela estreita (cards em 2 colunas) a fita diagonal, que tem
      // tamanho fixo, acaba mais alta que essa faixa e invade o título/
      // categoria abaixo. Em vez de só encolher a fita (o que ainda
      // vazava), ela vira um selo reto e compacto, do tamanho certo pra
      // caber só em cima da capa — mesmo visual "chamativo", sem invadir
      // o conteúdo do card.
      '@media(max-width:640px){.nl-bf-fita{top:7px;left:7px;width:auto;transform:none;border-radius:6px;font-size:10px;padding:3px 7px;letter-spacing:0}}',

      // --- selo na caixa de oferta das páginas de produto ---
      '.nl-bf-oferta-selo{display:inline-flex;align-items:center;gap:8px;background:#0a0a0a;color:#f59e0b;font-weight:800;font-size:13px;letter-spacing:.4px;padding:7px 16px;border-radius:99px;margin-bottom:16px}',
      '.nl-bf-oferta-pct{background:#f59e0b;color:#1a1200;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:900}',
      '#oferta .contador .bloco{background:#0a0a0a}',
      '#oferta .contador .bloco b{color:#f59e0b}',
      '#oferta .contador .bloco span{color:#fff}',

      // --- seção de destaque na home ---
      '.nl-bf-destaque{background:linear-gradient(160deg,#0a0a0a,#111827 60%,#0a0a0a);color:#fff;padding:48px 20px;text-align:center;position:relative;overflow:hidden;font-family:Arial,Helvetica,sans-serif}',
      '.nl-bf-destaque::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 20%,rgba(245,158,11,.16),transparent 45%),radial-gradient(circle at 82% 80%,rgba(94,234,212,.08),transparent 45%);pointer-events:none}',
      '.nl-bf-destaque-inner{position:relative;max-width:720px;margin:0 auto}',
      '.nl-bf-destaque-selo{display:inline-flex;align-items:center;gap:8px;background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.4);color:#f59e0b;font-weight:800;font-size:13px;letter-spacing:.5px;padding:6px 16px;border-radius:99px;margin-bottom:18px}',
      '.nl-bf-destaque-titulo{font-size:clamp(26px,5vw,42px);font-weight:900;margin:0 0 10px;line-height:1.15}',
      '.nl-bf-destaque-titulo b{color:#f59e0b}',
      '.nl-bf-destaque-sub{color:#c7d2d8;font-size:15px;margin:0 0 28px;line-height:1.5}',
      '.nl-bf-blocos{display:flex;justify-content:center;gap:12px;margin-bottom:30px;flex-wrap:wrap}',
      '.nl-bf-blocos .bloco{background:rgba(255,255,255,.06);border:1px solid rgba(245,158,11,.3);border-radius:12px;padding:14px 16px;min-width:68px}',
      '.nl-bf-blocos .bloco b{display:block;font-size:26px;font-weight:900;color:#f59e0b;font-variant-numeric:tabular-nums}',
      '.nl-bf-blocos .bloco span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#9fb0b8;margin-top:2px}',
      '.nl-bf-destaque-cta{display:inline-block;background:#f59e0b;color:#0a0a0a;font-weight:800;font-size:15px;padding:13px 32px;border-radius:99px;text-decoration:none}',
      '.nl-bf-destaque-cta:hover{background:#fbbf24}',
      '@media(max-width:620px){.nl-bf-destaque{padding:36px 16px}.nl-bf-blocos .bloco{min-width:56px;padding:10px 10px}.nl-bf-blocos .bloco b{font-size:20px}}',

      // --- pop-up diário ---
      '.nl-bf-modal-overlay{position:fixed;inset:0;background:rgba(5,8,12,.72);display:flex;align-items:center;justify-content:center;z-index:9999;padding:18px;opacity:0;pointer-events:none;transition:opacity .25s ease}',
      '.nl-bf-modal-overlay.nl-bf-aberto{opacity:1;pointer-events:auto}',
      '.nl-bf-modal-caixa{position:relative;background:#0a0a0a;color:#fff;border:1px solid rgba(245,158,11,.35);border-radius:20px;max-width:420px;width:100%;padding:34px 26px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.5);transform:scale(.92);transition:transform .25s ease}',
      '.nl-bf-modal-overlay.nl-bf-aberto .nl-bf-modal-caixa{transform:scale(1)}',
      '.nl-bf-modal-fechar{position:absolute;top:8px;right:10px;background:transparent;border:0;color:#9fb0b8;font-size:24px;line-height:1;cursor:pointer;padding:8px}',
      '.nl-bf-modal-fechar:hover{color:#fff}',
      '.nl-bf-modal-selo{display:inline-flex;align-items:center;gap:8px;background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.4);color:#f59e0b;font-weight:800;font-size:12px;letter-spacing:.5px;padding:5px 14px;border-radius:99px;margin-bottom:14px}',
      '.nl-bf-modal-titulo{font-size:22px;font-weight:900;margin:0 0 8px;line-height:1.25}',
      '.nl-bf-modal-titulo b{color:#f59e0b}',
      '.nl-bf-modal-sub{color:#c7d2d8;font-size:13.5px;margin:0 0 20px;line-height:1.5}',
      '.nl-bf-modal-caixa .nl-bf-blocos{margin-bottom:22px;gap:8px}',
      '.nl-bf-modal-caixa .nl-bf-blocos .bloco{min-width:54px;padding:9px 8px}',
      '.nl-bf-modal-caixa .nl-bf-blocos .bloco b{font-size:19px}',
      '.nl-bf-modal-cta{display:inline-block;background:#f59e0b;color:#0a0a0a;font-weight:800;font-size:14px;padding:12px 30px;border-radius:99px;text-decoration:none;border:0;cursor:pointer;font-family:inherit}',
      '.nl-bf-modal-cta:hover{background:#fbbf24}',
      'body.nl-bf-trava{overflow:hidden}',

      // --- brilho pulsante (CTAs e preço com desconto) ---
      '@keyframes nlBfPulsoBtn{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.5)}50%{box-shadow:0 0 0 9px rgba(245,158,11,0)}}',
      '.nl-bf-glow{animation:nlBfPulsoBtn 1.8s ease-out infinite}',
      '@keyframes nlBfPulsoPreco{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}',
      '.nl-bf-preco-glow{display:inline-block;animation:nlBfPulsoPreco 1.6s ease-in-out infinite}',
      '@keyframes nlBfPulsoFita{0%,100%{box-shadow:0 3px 8px rgba(0,0,0,.3)}50%{box-shadow:0 3px 14px rgba(245,158,11,.65)}}',
      '@media(prefers-reduced-motion:reduce){.nl-bf-glow,.nl-bf-fita,.nl-bf-preco-glow{animation:none!important}}',
    ].join('');
    document.head.appendChild(estilo);
  }

  function montarFaixa(idioma, t, pct) {
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
    var intervalo;
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
    intervalo = setInterval(atualizar, 1000);
  }

  // Fita diagonal nos cards do catálogo (home e /categorias/) — ambos
  // usam a mesma classe .card, então um seletor só cobre as duas
  // páginas. Os cards já são renderizados por um <script> inline antes
  // deste arquivo (que é defer) rodar, mas o retry cobre o caso de
  // alguma página vir a gerar os cards de forma assíncrona no futuro.
  function marcarCards(pct) {
    if (!pct) return;
    var textoFita = '-' + pct + '% OFF';
    function aplicar() {
      var cards = document.querySelectorAll('.card');
      if (!cards.length) return false;
      cards.forEach(function (card) {
        if (card.querySelector('.nl-bf-fita')) return;
        var fita = document.createElement('span');
        fita.className = 'nl-bf-fita';
        fita.textContent = textoFita;
        card.insertBefore(fita, card.firstChild);
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

  // Selo + brilho na caixa de oferta das páginas de produto — o
  // contador em si é o mecanismo que já existia em CONFIG
  // (contagemRegressivaFim), só ligado pra essa campanha; aqui só
  // coloca o rótulo "BLACK FRIDAY" e o brilho no botão/preço.
  function marcarOferta(idioma, t, pct) {
    var oferta = document.querySelector('.oferta');
    if (!oferta) return;
    if (!oferta.querySelector('.nl-bf-oferta-selo')) {
      var selo = document.createElement('div');
      selo.className = 'nl-bf-oferta-selo';
      selo.innerHTML = '🔥 ' + t.titulo + (pct ? ' <span class="nl-bf-oferta-pct">-' + pct + '%</span>' : '');
      oferta.insertBefore(selo, oferta.firstChild);
    }
    var preco = document.getElementById('oferta-preco-por');
    if (preco) preco.classList.add('nl-bf-preco-glow');
    var btn = document.getElementById('btn-checkout');
    if (btn) btn.classList.add('nl-bf-glow');
    var btnBarra = document.getElementById('barra-btn');
    if (btnBarra) btnBarra.classList.add('nl-bf-glow');
  }

  function paginaProduto() {
    return /^\/produtos\//.test(location.pathname);
  }

  // Seção grande de destaque — na home, entre o hero e o catálogo
  // (#catalogo); numa página de produto, entre o hero e o resto do
  // conteúdo, mandando pra caixa de oferta (#oferta) da própria página.
  function montarDestaque(idioma, t, pct) {
    var pai, refElemento, ctaHref;

    if (paginaHome()) {
      refElemento = document.getElementById('catalogo');
      if (!refElemento || !refElemento.parentNode) return;
      pai = refElemento.parentNode;
      ctaHref = '#catalogo';
    } else if (paginaProduto()) {
      var hero = document.querySelector('.hero');
      var oferta = document.getElementById('oferta');
      if (!hero || !hero.parentNode || !oferta) return;
      pai = hero.parentNode;
      refElemento = hero.nextElementSibling; // null = insere no fim (hero nunca é o último)
      ctaHref = '#oferta';
    } else {
      return;
    }

    var secao = document.createElement('section');
    secao.className = 'nl-bf-destaque';
    secao.innerHTML =
      '<div class="nl-bf-destaque-inner">' +
      '<span class="nl-bf-destaque-selo">🔥 ' + t.titulo + '</span>' +
      '<h2 class="nl-bf-destaque-titulo">' + (pct ? '<b>-' + pct + '%</b> ' : '') + t.off + '</h2>' +
      '<p class="nl-bf-destaque-sub">' + t.destaqueSub + '</p>' +
      '<div class="nl-bf-blocos" id="nl-bf-destaque-blocos"></div>' +
      '<a class="nl-bf-destaque-cta nl-bf-glow" href="' + ctaHref + '">' + t.cta + '</a>' +
      '</div>';

    pai.insertBefore(secao, refElemento);

    var elBlocos = document.getElementById('nl-bf-destaque-blocos');
    var intervalo;
    function atualizar() {
      var restante = DATA_FIM.getTime() - Date.now();
      if (restante <= 0) {
        secao.remove();
        if (intervalo) clearInterval(intervalo);
        return;
      }
      elBlocos.innerHTML = blocosHtml(restante, t);
    }
    atualizar();
    intervalo = setInterval(atualizar, 1000);
  }

  // Pop-up uma vez por dia por visitante (qualquer página do site que
  // carregue este script). Aparece com um pequeno atraso, trava o
  // scroll enquanto aberto e fecha pelo X, clique fora ou Esc.
  function montarPopup(idioma, t, pct) {
    if (jaMostrouPopupHoje()) return;

    var overlay = document.createElement('div');
    overlay.className = 'nl-bf-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t.titulo);

    var ctaHref = hrefCatalogo(idioma);
    var ctaTag = ctaHref
      ? '<a class="nl-bf-modal-cta" href="' + ctaHref + '" id="nl-bf-modal-cta">' + t.cta + '</a>'
      : '<button type="button" class="nl-bf-modal-cta" id="nl-bf-modal-cta">' + t.cta + '</button>';

    overlay.innerHTML =
      '<div class="nl-bf-modal-caixa">' +
      '<button type="button" class="nl-bf-modal-fechar" aria-label="' + t.fechar + '">×</button>' +
      '<span class="nl-bf-modal-selo">🔥 ' + t.titulo + '</span>' +
      '<h3 class="nl-bf-modal-titulo">' + (pct ? '<b>-' + pct + '%</b> ' : '') + t.off + '</h3>' +
      '<p class="nl-bf-modal-sub">' + t.destaqueSub + '</p>' +
      '<div class="nl-bf-blocos" id="nl-bf-modal-blocos"></div>' +
      ctaTag +
      '</div>';

    document.body.appendChild(overlay);

    var elBlocos = document.getElementById('nl-bf-modal-blocos');
    var intervalo;
    function atualizar() {
      var restante = DATA_FIM.getTime() - Date.now();
      if (restante <= 0) { fechar(); return; }
      elBlocos.innerHTML = blocosHtml(restante, t);
    }

    function abrir() {
      if (expirou()) return;
      atualizar();
      intervalo = setInterval(atualizar, 1000);
      overlay.classList.add('nl-bf-aberto');
      document.body.classList.add('nl-bf-trava');
      marcarPopupMostrado();
    }

    function fechar() {
      overlay.classList.remove('nl-bf-aberto');
      document.body.classList.remove('nl-bf-trava');
      if (intervalo) clearInterval(intervalo);
      setTimeout(function () { overlay.remove(); }, 300);
    }

    overlay.querySelector('.nl-bf-modal-fechar').addEventListener('click', fechar);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) fechar();
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { fechar(); document.removeEventListener('keydown', escHandler); }
    });
    var cta = document.getElementById('nl-bf-modal-cta');
    if (cta) cta.addEventListener('click', fechar);

    setTimeout(abrir, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
