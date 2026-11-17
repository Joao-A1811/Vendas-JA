// ============================================================
// BLACK FRIDAY — NextLevel
// Campanha temporária (ver DATA_FIM abaixo). Injeta sozinho todo o visual
// — nenhuma página precisa de HTML extra, só o
// <script src="/assets/black-friday.js" defer>:
//   1) faixa fina no topo (todas as páginas), com contador; clique leva
//      à oferta
//   2) banner de destaque logo abaixo do cabeçalho (home e produtos):
//      nome "BLACK FRIDAY", etiqueta de preço pendurada, capas reais dos
//      guias, preço de/por, botão e contador
//   3) selo "-X% OFF" nos cards do catálogo (home e /categorias/)
//   4) caixa de oferta das páginas de produto em destaque
//   5) pop-up uma vez por dia por visitante
// Visual usa só as cores do site (azul-marinho, verde-água e âmbar).
// Quando DATA_FIM passa, tudo se remove sozinho — inclusive o <style>
// injetado, então as páginas voltam exatamente ao visual normal. Pra
// limpar de vez, tirar a tag <script> das páginas e apagar este arquivo.
//
// A faixa do topo fica em fluxo normal (não fixed/sticky) de propósito:
// não precisa de ajuste de offset com o cabeçalho sticky, o banner de
// cookies (consent.js) nem a barra fixa de compra do mobile. O pop-up usa
// z-index 9999 (o maior z-index do resto do site é 60).
// ============================================================
(function () {
  // Horário de Brasília é UTC-3 o ano todo (sem horário de verão desde
  // 2019) — por isso o offset fixo "-03:00" funciona sem biblioteca.
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

  function paginaProduto() {
    return /^\/produtos\//.test(location.pathname);
  }

  function slugDoProduto() {
    var m = location.pathname.match(/^\/produtos\/([^/]+)\//);
    return m ? m[1] : null;
  }

  // Aceita "R$ 49,99", "$4.99" e também milhar ("R$ 1.234,56"): o último
  // separador é o decimal.
  function numero(precoTexto) {
    var s = String(precoTexto || '').replace(/[^0-9,.]/g, '');
    var dec = Math.max(s.lastIndexOf('.'), s.lastIndexOf(','));
    if (dec === -1) return parseFloat(s) || 0;
    var inteiro = s.slice(0, dec).replace(/[.,]/g, '');
    return parseFloat(inteiro + '.' + s.slice(dec + 1)) || 0;
  }

  function precosDoIdioma(idioma) {
    var p = (window.PRECOS_SITE || {})[idioma];
    if (!p || !numero(p.de) || !numero(p.por)) return null;
    return p;
  }

  function percentualOff(idioma) {
    var p = precosDoIdioma(idioma);
    if (!p) return null;
    var de = numero(p.de), por = numero(p.por);
    return Math.round(((de - por) / de) * 100);
  }

  // Quanto a pessoa economiza, no mesmo formato do preço do site.
  function economia(idioma) {
    var p = precosDoIdioma(idioma);
    if (!p) return null;
    var prefixo = (String(p.por).match(/^[^0-9]*/) || [''])[0];
    var valor = (numero(p.de) - numero(p.por)).toFixed(2);
    if (idioma === 'pt') valor = valor.replace('.', ',');
    return prefixo + valor;
  }

  var TEXTOS = {
    pt: {
      titulo: 'BLACK FRIDAY', termina: 'termina em', de: 'de', todos: 'em todos os guias',
      desconto: function (p) { return p + '% de desconto'; },
      cta: 'Ver as ofertas', ctaProduto: 'Quero aproveitar', fechar: 'Fechar',
      aviso: 'Oferta de Black Friday até segunda-feira (Cyber Monday)', economiza: 'Você economiza',
      d: 'd', h: 'h', m: 'm', s: 's',
    },
    en: {
      titulo: 'BLACK FRIDAY', termina: 'ends in', de: 'was', todos: 'on every guide',
      desconto: function (p) { return p + '% off'; },
      cta: 'See the deals', ctaProduto: 'Grab the deal', fechar: 'Close',
      aviso: 'Black Friday offer until Monday (Cyber Monday)', economiza: 'You save',
      d: 'd', h: 'h', m: 'm', s: 's',
    },
    es: {
      titulo: 'BLACK FRIDAY', termina: 'termina en', de: 'de', todos: 'en todas las guías',
      desconto: function (p) { return p + '% de descuento'; },
      cta: 'Ver las ofertas', ctaProduto: 'Aprovechar ahora', fechar: 'Cerrar',
      aviso: 'Oferta de Black Friday hasta el lunes (Cyber Monday)', economiza: 'Ahorras',
      d: 'd', h: 'h', m: 'm', s: 's',
    },
  };

  function doisDigitos(n) { return n < 10 ? '0' + n : '' + n; }

  function partes(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    return {
      dias: Math.floor(total / 86400),
      horas: Math.floor((total % 86400) / 3600),
      min: Math.floor((total % 3600) / 60),
      seg: total % 60,
    };
  }

  // "13d 13h 32m" (faixa do topo) ou "13d 13h 32m 15s" (banner e pop-up).
  function formatarRestante(ms, t, comSegundos) {
    var p = partes(ms);
    var txt = p.dias + t.d + ' ' + doisDigitos(p.horas) + t.h + ' ' + doisDigitos(p.min) + t.m;
    return comSegundos ? txt + ' ' + doisDigitos(p.seg) + t.s : txt;
  }

  function esc(texto) {
    return String(texto == null ? '' : texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Pra onde o clique leva: na home, ao catálogo; no produto, à caixa de
  // oferta da própria página; em /categorias/ não há destino (null) —
  // quem chama trata; nas demais, a /categorias/ no idioma certo.
  function hrefAcao(idioma) {
    if (paginaHome()) return '#catalogo';
    if (paginaProduto() && document.getElementById('oferta')) return '#oferta';
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

  // Quais 3 capas aparecem no banner: nas páginas de produto, a do
  // próprio produto no centro; na home, uma seleção fixa de 3 produtos
  // de categorias diferentes. Só entram produtos que existem no catálogo.
  function capasDoBanner() {
    var catalogo = (window.PRODUTOS_SITE || []).filter(function (p) { return p.disponivel; })
      .map(function (p) { return p.slug; });
    function existe(s) { return catalogo.indexOf(s) !== -1; }
    var preferidos = ['emagrecimento', 'financas-pessoais', 'ia-aplicada', 'confianca-social'];
    var atual = paginaProduto() ? slugDoProduto() : null;
    var centro = atual && existe(atual) ? atual : (existe('emagrecimento') ? 'emagrecimento' : catalogo[0]);
    var laterais = preferidos.concat(catalogo).filter(function (s, i, a) {
      return existe(s) && s !== centro && a.indexOf(s) === i;
    }).slice(0, 2);
    if (!centro || laterais.length < 2) return null;
    return { esquerda: laterais[0], centro: centro, direita: laterais[1] };
  }

  var estilo = null;
  var intervalo = null;
  var tAtual = null;

  function montar() {
    if (expirou()) return;
    var idioma = idiomaDaPagina();
    tAtual = TEXTOS[idioma];
    var pct = percentualOff(idioma);

    injetarEstilos();
    montarFaixa(idioma, tAtual, pct);
    montarBanner(idioma, tAtual, pct);
    marcarCards(pct);
    marcarOferta(idioma, tAtual, pct);
    montarPopup(idioma, tAtual, pct);

    tick();
    intervalo = setInterval(tick, 1000);
  }

  // Um único relógio atualiza todos os contadores da página.
  function tick() {
    var restante = DATA_FIM.getTime() - Date.now();
    if (restante <= 0) { encerrar(); return; }
    var curto = formatarRestante(restante, tAtual, false);
    var longo = formatarRestante(restante, tAtual, true);
    var a = document.querySelectorAll('.nl-bf-tempo');
    for (var i = 0; i < a.length; i++) a[i].textContent = curto;
    var b = document.querySelectorAll('.nl-bf-tempo-full');
    for (var j = 0; j < b.length; j++) b[j].textContent = longo;
  }

  // Campanha acabou com a página aberta: remove tudo, inclusive o CSS.
  function encerrar() {
    if (intervalo) clearInterval(intervalo);
    var alvos = document.querySelectorAll(
      '.nl-bf-faixa,.nl-bf-hero,.nl-bf-modal-overlay,.nl-bf-fita,.nl-bf-tag-oferta,.nl-bf-estrela,.nl-bf-economiza'
    );
    for (var i = 0; i < alvos.length; i++) alvos[i].remove();
    document.body.classList.remove('nl-bf-trava');
    if (estilo) estilo.remove();
  }

  function injetarEstilos() {
    estilo = document.createElement('style');
    estilo.textContent = [
      // ---------- 1) faixa do topo ----------
      '.nl-bf-faixa{display:block;background:#0d1b2a;color:#fff;font-family:inherit;font-weight:600;font-size:12px;line-height:1.2;white-space:nowrap;overflow:hidden;padding:11px 8px;text-align:center;text-decoration:none;border-bottom:2px solid #f59e0b}',
      '.nl-bf-faixa b{color:#fbbf24;font-weight:800;letter-spacing:.8px}',
      '.nl-bf-faixa .nl-bf-tempo{color:#5eead4;font-weight:700}',

      // ---------- 2) banner de destaque ----------
      '.nl-bf-hero{position:relative;overflow:hidden;background:linear-gradient(160deg,#0d1b2a 0%,#0f4a52 100%);color:#fff;font-family:inherit;border-top:3px solid #f59e0b;border-bottom:1px solid rgba(94,234,212,.25);padding:32px 22px 28px}',
      '.nl-bf-hero-in{position:relative;max-width:1080px;margin:0 auto}',
      '.nl-bf-ey{color:#5eead4;font-size:11px;font-weight:700;letter-spacing:4px}',
      '.nl-bf-wm{font-weight:800;font-size:44px;letter-spacing:5px;line-height:1.02;margin:10px 0 0;color:#fbbf24}',
      '.nl-bf-rule{width:44px;height:3px;background:#f59e0b;margin:14px 0 12px}',
      '.nl-bf-p{font-size:15px;color:#b7d5cf;line-height:1.4;max-width:210px;margin:0}',
      '.nl-bf-p b{color:#fff;font-weight:700}',
      '.nl-bf-p span{display:block;margin-top:2px}',
      '.nl-bf-etiqueta{position:absolute;right:0;top:-6px;width:74px;overflow:visible;transform:rotate(6deg);transform-origin:50% 0;z-index:3;filter:drop-shadow(0 8px 8px rgba(0,0,0,.3))}',

      // capas em leque (--u escala tudo junto no desktop)
      '.nl-bf-palco{--u:1px;position:relative;height:calc(230*var(--u));margin-top:6px}',
      '.nl-bf-sombra{position:absolute;left:12%;right:12%;bottom:2px;height:calc(20*var(--u));border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)}',
      '.nl-bf-livro{position:absolute;border-radius:2px 5px 5px 2px;box-shadow:0 14px 22px rgba(0,0,0,.4)}',
      '.nl-bf-livro img{display:block;width:100%;height:auto;border-radius:2px 5px 5px 2px}',
      '.nl-bf-livro::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6%;background:linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,0));border-radius:2px 0 0 2px}',
      '.nl-bf-livro.esq{width:calc(104*var(--u));left:calc(50% - 124*var(--u));bottom:calc(12*var(--u));transform:rotate(-6deg);z-index:2}',
      '.nl-bf-livro.dir{width:calc(104*var(--u));left:calc(50% + 20*var(--u));bottom:calc(12*var(--u));transform:rotate(6deg);z-index:2}',
      '.nl-bf-livro.cen{width:calc(124*var(--u));left:calc(50% - 62*var(--u));bottom:calc(6*var(--u));z-index:3}',

      '.nl-bf-linha{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px}',
      '.nl-bf-pr s{display:block;color:#8aa7a3;font-size:13px}',
      '.nl-bf-pr b{display:block;font-size:34px;font-weight:800;color:#fbbf24;white-space:nowrap;line-height:1.1}',
      '.nl-bf-btn{display:inline-block;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#2b1a00;font-weight:800;font-size:14px;padding:15px 20px;border-radius:10px;text-decoration:none;white-space:nowrap;border:0;cursor:pointer;font-family:inherit;box-shadow:0 6px 16px rgba(245,158,11,.28)}',
      '.nl-bf-btn:hover{filter:brightness(1.06)}',
      '.nl-bf-tm{margin-top:16px;padding-top:14px;border-top:1px solid rgba(94,234,212,.2);font-size:12px;color:#9fd9d1;letter-spacing:.5px}',
      '.nl-bf-tm b{color:#fff;font-weight:700}',
      '.nl-bf-aviso{margin-top:6px;font-size:11px;color:#7fa39c}',

      '@media(max-width:360px){.nl-bf-wm{font-size:40px}.nl-bf-etiqueta{width:66px}.nl-bf-pr b{font-size:28px}.nl-bf-btn{padding:14px 14px;font-size:13px}}',
      '@media(min-width:820px){.nl-bf-hero{padding:44px 22px}.nl-bf-hero-in{display:grid;grid-template-columns:1fr 460px;grid-template-areas:"txt palco" "act palco";column-gap:48px;align-items:center}',
      '.nl-bf-txt{grid-area:txt}.nl-bf-palco{grid-area:palco;--u:1.25px;margin-top:0}.nl-bf-act{grid-area:act}',
      '.nl-bf-wm{font-size:64px;letter-spacing:7px}.nl-bf-p{font-size:18px;max-width:380px}.nl-bf-pr b{font-size:44px}.nl-bf-linha{justify-content:flex-start;gap:28px}.nl-bf-etiqueta{width:92px;top:-18px;right:34px}}',

      // ---------- 3) selo nos cards do catálogo ----------
      // (a capa do card é uma faixa baixa, aspect-ratio 5.6/1: em tela
      // larga cabe uma fita diagonal; em tela estreita viraria mais alta
      // que a capa e invadiria o título, então vira selo reto compacto)
      '.nl-bf-fita{position:absolute;top:17px;left:-36px;width:144px;transform:rotate(-45deg);background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0d1b2a;font-weight:800;font-size:11px;letter-spacing:.3px;text-align:center;padding:4px 0;z-index:3;box-shadow:0 3px 8px rgba(0,0,0,.25);pointer-events:none}',
      '@media(max-width:640px){.nl-bf-fita{top:7px;left:7px;width:auto;transform:none;border-radius:6px;font-size:10.5px;padding:3px 8px;letter-spacing:0}}',

      // ---------- 4) caixa de oferta nas páginas de produto ----------
      '#oferta .oferta{position:relative;overflow:hidden;border:2px solid #f59e0b;box-shadow:0 0 0 4px rgba(245,158,11,.12),0 14px 40px rgba(245,158,11,.16)}',
      '#oferta .oferta .preco{font-size:clamp(38px,11.5vw,56px);font-weight:800;line-height:1.05;color:#0f766e}',
      '[data-tema="escuro"] #oferta .oferta .preco{color:#5eead4}',
      '#oferta .contador .bloco{background:#0d1b2a}',
      '#oferta .contador .bloco b{color:#fbbf24}',
      '#oferta .contador .bloco span{color:#b7d5cf}',
      '.nl-bf-tag-oferta{display:inline-block;background:#0d1b2a;color:#fbbf24;font-weight:800;letter-spacing:3px;font-size:11px;padding:7px 14px;border-radius:6px;margin-bottom:14px}',
      '.nl-bf-economiza{display:inline-block;background:rgba(245,158,11,.16);color:#92400e;font-weight:800;font-size:13px;padding:6px 14px;border-radius:99px;margin:2px 0 16px}',
      '[data-tema="escuro"] .nl-bf-economiza{color:#fbbf24}',
      '.nl-bf-estrela{position:absolute;top:12px;right:12px;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0d1b2a;font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;transform:rotate(10deg);box-shadow:0 6px 14px rgba(13,27,42,.25);font-family:inherit}',
      '@media(max-width:520px){#oferta .oferta{padding:34px 16px 28px}.nl-bf-estrela{width:54px;height:54px;font-size:15px;top:8px;right:8px}}',

      // ---------- 5) pop-up diário ----------
      '.nl-bf-modal-overlay{position:fixed;inset:0;background:rgba(5,12,20,.78);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility 0s linear .25s}',
      '.nl-bf-modal-overlay.nl-bf-aberto{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .25s ease,visibility 0s}',
      '.nl-bf-modal-caixa{position:relative;background:linear-gradient(160deg,#0d1b2a 0%,#0f4a52 100%);color:#fff;border:2px solid #f59e0b;border-radius:18px;max-width:380px;width:100%;padding:28px 22px 22px;font-family:inherit;box-shadow:0 24px 70px rgba(0,0,0,.5);transform:scale(.94);transition:transform .25s ease;overflow:hidden}',
      '.nl-bf-modal-overlay.nl-bf-aberto .nl-bf-modal-caixa{transform:scale(1)}',
      '.nl-bf-modal-caixa .nl-bf-wm{font-size:38px}',
      '.nl-bf-modal-caixa .nl-bf-p{max-width:none}',
      '.nl-bf-modal-caixa .nl-bf-linha{flex-direction:column;align-items:stretch;gap:14px}',
      '.nl-bf-modal-caixa .nl-bf-btn{text-align:center}',
      '.nl-bf-modal-fechar{position:absolute;top:8px;right:10px;background:rgba(255,255,255,.12);border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;width:38px;height:38px;border-radius:50%}',
      '.nl-bf-modal-fechar:hover{background:rgba(255,255,255,.22)}',
      'body.nl-bf-trava{overflow:hidden}',
    ].join('');
    document.head.appendChild(estilo);
  }

  // ---------- 1) faixa do topo ----------
  function montarFaixa(idioma, t, pct) {
    var href = hrefAcao(idioma);
    var faixa = document.createElement(href ? 'a' : 'div');
    faixa.className = 'nl-bf-faixa';
    if (href) faixa.setAttribute('href', href);
    faixa.innerHTML =
      '<b>' + t.titulo + '</b>' +
      (pct ? ' &nbsp;·&nbsp; ' + pct + '% OFF' : '') +
      ' &nbsp;·&nbsp; ' + t.termina + ' <span class="nl-bf-tempo"></span>';
    document.body.insertBefore(faixa, document.body.firstChild);
  }

  // Etiqueta de preço pendurada (SVG), na cor âmbar do site.
  function etiquetaSvg(pct) {
    return '<svg class="nl-bf-etiqueta" viewBox="0 -60 120 220" aria-hidden="true">' +
      '<path d="M60 30 C58 -10 66 -30 54 -60" fill="none" stroke="#fbbf24" stroke-width="2" opacity=".7"/>' +
      '<path d="M8 36 L36 8 H84 L112 36 V150 Q112 158 104 158 H16 Q8 158 8 150 Z" fill="#fbbf24" stroke="#0d1b2a" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="60" cy="30" r="6" fill="#0d1b2a" stroke="#0d1b2a" stroke-width="2.5"/>' +
      '<text x="60" y="108" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="34" letter-spacing="-1" fill="#0d1b2a">-' + pct + '%</text>' +
      '<text x="60" y="134" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="11" letter-spacing="3" fill="#0d1b2a">OFF</text></svg>';
  }

  function palcoHtml(idioma) {
    var c = capasDoBanner();
    if (!c) return '';
    function livro(classe, slug) {
      return '<div class="nl-bf-livro ' + classe + '"><img src="/assets/produtos/' + esc(slug) +
        '/thumb-' + idioma + '.jpg" alt="" width="400" height="565" decoding="async"></div>';
    }
    return '<div class="nl-bf-palco" aria-hidden="true"><div class="nl-bf-sombra"></div>' +
      livro('esq', c.esquerda) + livro('dir', c.direita) + livro('cen', c.centro) + '</div>';
  }

  // ---------- 2) banner de destaque (home e produtos) ----------
  function montarBanner(idioma, t, pct) {
    var hero = document.querySelector('.hero');
    var ehHome = paginaHome();
    var ehProduto = paginaProduto() && document.getElementById('oferta');
    if (!hero || !hero.parentNode || !(ehHome || ehProduto)) return;
    var href = ehHome ? '#catalogo' : '#oferta';
    var precos = precosDoIdioma(idioma);

    var nomeEl = ehProduto && document.getElementById('oferta-produto');
    var nome = nomeEl ? nomeEl.textContent.trim() : '';
    var paragrafo = pct
      ? '<b>' + esc(t.desconto(pct)) + '</b>' + (nome ? '<span>' + esc(nome) + '</span>' : ' ' + t.todos)
      : (nome ? esc(nome) : t.todos);

    var secao = document.createElement('section');
    secao.className = 'nl-bf-hero';
    secao.setAttribute('aria-label', t.titulo);
    secao.innerHTML =
      '<div class="nl-bf-hero-in">' +
      (pct ? etiquetaSvg(pct) : '') +
      '<div class="nl-bf-txt">' +
      '<div class="nl-bf-ey">NEXTLEVEL</div>' +
      '<div class="nl-bf-wm">BLACK<br>FRIDAY</div>' +
      '<div class="nl-bf-rule"></div>' +
      '<p class="nl-bf-p">' + paragrafo + '</p>' +
      '</div>' +
      palcoHtml(idioma) +
      '<div class="nl-bf-act">' +
      '<div class="nl-bf-linha">' +
      (precos ? '<div class="nl-bf-pr"><s>' + esc(t.de) + ' ' + esc(precos.de) + '</s><b>' + esc(precos.por) + '</b></div>' : '') +
      '<a class="nl-bf-btn" href="' + href + '">' + (ehHome ? t.cta : t.ctaProduto) + '</a>' +
      '</div>' +
      '<div class="nl-bf-tm">' + t.termina + ' <b class="nl-bf-tempo-full"></b></div>' +
      '<div class="nl-bf-aviso">' + t.aviso + '</div>' +
      '</div></div>';

    hero.parentNode.insertBefore(secao, hero);
  }

  // ---------- 3) selo nos cards do catálogo ----------
  // Home e /categorias/ usam a mesma classe .card. Os cards já são
  // renderizados por <script> inline antes deste arquivo (defer) rodar,
  // mas o retry cobre geração assíncrona no futuro.
  function marcarCards(pct) {
    if (!pct) return;
    var textoFita = '-' + pct + '% OFF';
    function aplicar() {
      var cards = document.querySelectorAll('.card');
      if (!cards.length) return false;
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.querySelector('.nl-bf-fita')) continue;
        var fita = document.createElement('span');
        fita.className = 'nl-bf-fita';
        fita.textContent = textoFita;
        card.insertBefore(fita, card.firstChild);
      }
      return true;
    }
    if (aplicar()) return;
    var tentativas = 0;
    var retry = setInterval(function () {
      tentativas++;
      if (aplicar() || tentativas > 20) clearInterval(retry);
    }, 150);
  }

  // ---------- 4) caixa de oferta nas páginas de produto ----------
  // O contador da caixa é o mecanismo que já existia em CONFIG
  // (contagemRegressivaFim), ligado pra esta campanha; aqui entram o
  // selo, a estrela de desconto e a linha de economia.
  function marcarOferta(idioma, t, pct) {
    var oferta = document.querySelector('.oferta');
    if (!oferta) return;
    if (!oferta.querySelector('.nl-bf-tag-oferta')) {
      var selo = document.createElement('div');
      selo.className = 'nl-bf-tag-oferta';
      selo.textContent = t.titulo;
      oferta.insertBefore(selo, oferta.firstChild);
    }
    if (pct && !oferta.querySelector('.nl-bf-estrela')) {
      var estrela = document.createElement('div');
      estrela.className = 'nl-bf-estrela';
      estrela.textContent = '-' + pct + '%';
      oferta.appendChild(estrela);
    }
    var eco = economia(idioma);
    var preco = document.getElementById('oferta-preco-por');
    if (eco && preco && !oferta.querySelector('.nl-bf-economiza')) {
      var linha = document.createElement('div');
      linha.className = 'nl-bf-economiza';
      linha.textContent = t.economiza + ' ' + eco;
      preco.parentNode.insertBefore(linha, preco.nextSibling);
    }
  }

  // ---------- 5) pop-up uma vez por dia ----------
  // Aparece com pequeno atraso, trava o scroll, prende o foco do teclado
  // dentro dele e fecha pelo X, clique fora ou Esc.
  function montarPopup(idioma, t, pct) {
    if (jaMostrouPopupHoje()) return;
    var precos = precosDoIdioma(idioma);

    var overlay = document.createElement('div');
    overlay.className = 'nl-bf-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t.titulo);

    var href = hrefAcao(idioma);
    var rotuloCta = paginaProduto() ? t.ctaProduto : t.cta;
    var cta = href
      ? '<a class="nl-bf-btn nl-bf-modal-cta" href="' + href + '">' + rotuloCta + '</a>'
      : '<button type="button" class="nl-bf-btn nl-bf-modal-cta">' + rotuloCta + '</button>';

    overlay.innerHTML =
      '<div class="nl-bf-modal-caixa">' +
      '<button type="button" class="nl-bf-modal-fechar" aria-label="' + t.fechar + '">×</button>' +
      '<div class="nl-bf-ey">NEXTLEVEL</div>' +
      '<div class="nl-bf-wm">BLACK<br>FRIDAY</div>' +
      '<div class="nl-bf-rule"></div>' +
      '<p class="nl-bf-p">' + (pct ? '<b>' + esc(t.desconto(pct)) + '</b> ' : '') + t.todos + '</p>' +
      '<div class="nl-bf-linha">' +
      (precos ? '<div class="nl-bf-pr"><s>' + esc(t.de) + ' ' + esc(precos.de) + '</s><b>' + esc(precos.por) + '</b></div>' : '') +
      cta + '</div>' +
      '<div class="nl-bf-tm">' + t.termina + ' <b class="nl-bf-tempo-full"></b></div>' +
      '</div>';

    document.body.appendChild(overlay);

    var botaoFechar = overlay.querySelector('.nl-bf-modal-fechar');
    var focoAnterior = null;
    var aberto = false;

    function aoTeclar(e) {
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key !== 'Tab') return;
      var focaveis = overlay.querySelectorAll('button,a[href]');
      var primeiro = focaveis[0];
      var ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }

    function abrir() {
      if (expirou() || !document.body.contains(overlay)) return;
      aberto = true;
      focoAnterior = document.activeElement;
      overlay.classList.add('nl-bf-aberto');
      document.body.classList.add('nl-bf-trava');
      document.addEventListener('keydown', aoTeclar);
      botaoFechar.focus({ preventScroll: true });
      marcarPopupMostrado();
      tick();
    }

    function fechar() {
      overlay.classList.remove('nl-bf-aberto');
      document.body.classList.remove('nl-bf-trava');
      document.removeEventListener('keydown', aoTeclar);
      if (aberto && focoAnterior && focoAnterior.focus) { try { focoAnterior.focus({ preventScroll: true }); } catch (e) {} }
      aberto = false;
      setTimeout(function () { overlay.remove(); }, 300);
    }

    botaoFechar.addEventListener('click', fechar);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) fechar(); });
    overlay.querySelector('.nl-bf-modal-cta').addEventListener('click', fechar);

    setTimeout(abrir, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
