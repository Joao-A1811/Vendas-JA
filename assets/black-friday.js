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
      titulo: 'BLACK FRIDAY', termina: 'termina em', de: 'de', por: 'por', em: 'em',
      subOferta: function (p) { return '<b>' + p + '% de desconto</b> — só até 30/11'; },
      popTexto: function (p) { return 'Todos os guias com <b>' + p + '% de desconto</b>, só até 30/11.'; }, todos: 'em todos os guias',
      desconto: function (p) { return p + '% de desconto'; },
      cta: 'Ver as ofertas', ctaProduto: 'Quero aproveitar', fechar: 'Fechar',
      aviso: 'Oferta de Black Friday até 30/11', economiza: 'Você economiza',
      d: 'd', h: 'h', m: 'm', s: 's',
    },
    en: {
      titulo: 'BLACK FRIDAY', termina: 'ends in', de: 'was', por: 'now', em: 'on',
      subOferta: function (p) { return '<b>' + p + '% off</b> — only until Nov 30'; },
      popTexto: function (p) { return 'Every guide <b>' + p + '% off</b>, only until Nov 30.'; }, todos: 'on every guide',
      desconto: function (p) { return p + '% off'; },
      cta: 'See the deals', ctaProduto: 'Grab the deal', fechar: 'Close',
      aviso: 'Black Friday offer until Nov 30', economiza: 'You save',
      d: 'd', h: 'h', m: 'm', s: 's',
    },
    es: {
      titulo: 'BLACK FRIDAY', termina: 'termina en', de: 'de', por: 'por', em: 'en',
      subOferta: function (p) { return '<b>' + p + '% de descuento</b> — solo hasta el 30/11'; },
      popTexto: function (p) { return 'Todas las guías con <b>' + p + '% de descuento</b>, solo hasta el 30/11.'; }, todos: 'en todas las guías',
      desconto: function (p) { return p + '% de descuento'; },
      cta: 'Ver las ofertas', ctaProduto: 'Aprovechar ahora', fechar: 'Cerrar',
      aviso: 'Oferta de Black Friday hasta el 30/11', economiza: 'Ahorras',
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
      '.nl-bf-faixa,.nl-bf-hero,.nl-bf-wrap,.nl-bf-of-cab,.nl-bf-of-tag,.nl-bf-modal-overlay,.nl-bf-fita,.nl-bf-tag-oferta,.nl-bf-estrela,.nl-bf-economiza'
    );
    for (var i = 0; i < alvos.length; i++) alvos[i].remove();
    document.body.classList.remove('nl-bf-trava');
    if (estilo) estilo.remove();
  }

  function injetarEstilos() {
    estilo = document.createElement('style');
    estilo.textContent = [
      // ---------- 1) faixa do topo ----------
      '.nl-bf-faixa{display:block;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-family:inherit;font-weight:800;font-size:12px;line-height:1.2;white-space:nowrap;overflow:hidden;padding:8px 0;text-decoration:none}',
      '.nl-bf-trilho{display:flex;width:max-content;animation:nl-bf-mq 70s linear infinite}',
      '.nl-bf-faixa:hover .nl-bf-trilho{animation-play-state:paused}',
      '.nl-bf-grupo{display:flex;align-items:center;flex:none}',
      '.nl-bf-item{display:flex;align-items:center;gap:28px;padding-right:28px}',
      '.nl-bf-faixa .tit{font-family:Poppins,Arial,sans-serif;letter-spacing:1px}',
      '.nl-bf-faixa .pil{border-radius:99px;padding:4px 10px;background:#0d1b2a;color:#fff;letter-spacing:.4px}',
      '.nl-bf-faixa .pil.cont{font-weight:700;font-variant-numeric:tabular-nums}',
      '.nl-bf-faixa .est{font-size:11px}',
      '@keyframes nl-bf-mq{to{transform:translateX(-50%)}}',
      '@media(prefers-reduced-motion:reduce){.nl-bf-trilho{animation:none;width:auto;justify-content:center}.nl-bf-grupo+.nl-bf-grupo{display:none}.nl-bf-grupo .nl-bf-item:nth-child(n+2){display:none}.nl-bf-item{gap:8px;padding-right:0}.nl-bf-faixa .est{display:none}}',

      // ---------- 2) banner de destaque ----------
      '.nl-bf-hero{position:relative;overflow:hidden;background:linear-gradient(160deg,#0f766e 0%,#0c5c56 55%,#0a4540 100%);color:#fff;font-family:inherit;border-top:3px solid #f5b72a;padding:32px 22px 28px}',
      '.nl-bf-hero-in{position:relative;max-width:1080px;margin:0 auto}',
      '.nl-bf-wm{font-family:Poppins,Arial,sans-serif;font-weight:700;font-size:46px;letter-spacing:-1px;line-height:1.04;margin:0;color:#f5b72a}',
      '.nl-bf-rule{width:44px;height:3px;background:linear-gradient(135deg,#fde68a,#f59e0b);margin:14px 0 12px}',
      '.nl-bf-p{font-size:15px;color:#d5f3ee;line-height:1.4;max-width:210px;margin:0}',
      '.nl-bf-p b{color:#fff;font-weight:700}',
      '.nl-bf-p span{display:block;margin-top:2px}',
      '.nl-bf-etiqueta{position:absolute;right:0;top:-6px;width:116px;overflow:visible;transform:rotate(6deg);transform-origin:50% 0;z-index:8}',

      // capas em leque (--u escala tudo junto no desktop)
      '.nl-bf-palco{--u:1px;position:relative;height:calc(230*var(--u));margin-top:6px}',
      '.nl-bf-sombra{position:absolute;left:12%;right:12%;bottom:2px;height:calc(20*var(--u));border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)}',
      '.nl-bf-livro{position:absolute;border-radius:2px 5px 5px 2px;box-shadow:0 14px 22px rgba(0,0,0,.4)}',
      '.nl-bf-livro img{display:block;width:100%;height:auto;border-radius:2px 5px 5px 2px}',
      '.nl-bf-livro::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6%;background:linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,0));border-radius:2px 0 0 2px}',
      '.nl-bf-livro.esq{width:calc(104*var(--u));left:calc(50% - 124*var(--u));bottom:calc(12*var(--u));transform:rotate(-6deg);z-index:2}',
      '.nl-bf-livro.dir{width:calc(104*var(--u));left:calc(50% + 20*var(--u));bottom:calc(12*var(--u));transform:rotate(6deg);z-index:2}',
      '.nl-bf-livro.cen{width:calc(124*var(--u));left:calc(50% - 62*var(--u));bottom:calc(6*var(--u));z-index:3}',

      '.nl-bf-linha{display:flex;flex-direction:column;align-items:stretch;gap:14px;margin-top:16px}',
      '.nl-bf-pr{display:flex;align-items:baseline;gap:12px}.nl-bf-pr s{color:#a8d4cc;font-size:13px}',
      '.nl-bf-pr b{font-size:34px;font-weight:800;color:#fff;white-space:nowrap;line-height:1.1}',
      '.nl-bf-btn{display:block;text-align:center;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:800;font-size:14px;padding:15px 20px;border-radius:10px;text-decoration:none;white-space:nowrap;border:0;cursor:pointer;font-family:inherit;box-shadow:0 6px 16px rgba(0,0,0,.3)}',
      '.nl-bf-btn:hover{background:linear-gradient(135deg,#fff1b8,#f5b72a)}',
      '.nl-bf-tm{margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.22);font-size:12px;color:#d5f3ee;letter-spacing:.5px}',
      '.nl-bf-tm b{color:#fff;font-weight:700}',
      '.nl-bf-aviso{margin-top:6px;font-size:11px;color:#b6ded7}',
      '.nl-bf-hero{background:transparent;color:#0d1b2a;border:0;border-bottom:1px solid rgba(13,27,42,.16)}',
      '.nl-bf-hero .nl-bf-wm{color:#0d1b2a;text-shadow:none}',
      '.nl-bf-hero .nl-bf-p{color:#3f5c58}',
      '.nl-bf-hero .nl-bf-p b,.nl-bf-hero .nl-bf-pr b,.nl-bf-hero .nl-bf-tm b{color:#0d1b2a}',
      '.nl-bf-hero .nl-bf-pr s,.nl-bf-hero .nl-bf-aviso{color:#5b6b68}',
      '.nl-bf-hero .nl-bf-tm{border-top-color:rgba(13,27,42,.14);color:#3f5c58}',
      '.nl-bf-hero .nl-bf-sombra{background:radial-gradient(ellipse,rgba(13,27,42,.28),transparent 70%)}',
      '.nl-bf-hero .nl-bf-btn{box-shadow:0 6px 16px rgba(13,27,42,.2)}',
      '[data-tema="escuro"] .nl-bf-hero{background:transparent;color:#fff;border-bottom-color:rgba(94,234,212,.28)}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-wm{color:#f5b72a;text-shadow:none}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-p{color:#d5f3ee}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-p b,[data-tema="escuro"] .nl-bf-hero .nl-bf-pr b,[data-tema="escuro"] .nl-bf-hero .nl-bf-tm b{color:#fff}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-pr s{color:#a8d4cc}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-aviso{color:#b6ded7}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-tm{border-top-color:rgba(255,255,255,.22);color:#d5f3ee}',
      '[data-tema="escuro"] .nl-bf-hero .nl-bf-sombra{background:radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)}',

      '@media(max-width:360px){.nl-bf-wm{font-size:37px;letter-spacing:-1px}.nl-bf-etiqueta{width:96px}.nl-bf-p{max-width:150px}.nl-bf-pr b{font-size:28px}.nl-bf-btn{padding:14px 14px;font-size:13px}}',
      '@media(min-width:820px){.nl-bf-hero{padding:44px 22px}.nl-bf-hero-in{display:grid;grid-template-columns:1fr 460px;grid-template-areas:"txt palco" "act palco";column-gap:48px;align-items:center}',
      '.nl-bf-txt{grid-area:txt}.nl-bf-palco{grid-area:palco;--u:1.25px;margin-top:0}.nl-bf-act{grid-area:act}',
      '.nl-bf-wm{font-size:68px;letter-spacing:-1.5px}.nl-bf-p{font-size:18px;max-width:380px}.nl-bf-pr b{font-size:44px}.nl-bf-linha{flex-direction:row;align-items:center;justify-content:flex-start;gap:28px}.nl-bf-btn{display:inline-block}.nl-bf-etiqueta{width:140px;top:-22px;right:6px}}',

      // ---------- 3) selo nos cards do catálogo ----------
      // (a capa do card é uma faixa baixa, aspect-ratio 5.6/1: em tela
      // larga cabe uma fita diagonal; em tela estreita viraria mais alta
      // que a capa e invadiria o título, então vira selo reto compacto)
      '.nl-bf-fita{position:absolute;top:17px;left:-36px;width:144px;transform:rotate(-45deg);background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:800;font-size:11px;letter-spacing:.3px;text-align:center;padding:4px 0;z-index:3;box-shadow:0 3px 8px rgba(0,0,0,.25);pointer-events:none}',
      '@media(max-width:640px){.nl-bf-fita{top:7px;left:7px;width:auto;transform:none;border-radius:6px;font-size:10.5px;padding:3px 8px;letter-spacing:0}}',

      // ---------- 4) caixa de oferta nas páginas de produto ----------
      '#oferta .oferta{position:relative;overflow:hidden;background:linear-gradient(135deg,#d9f3ee 0%,#a7e3d8 50%,#5ec9b6 100%);color:#0d1b2a;border:2px solid #f5b72a;box-shadow:0 14px 40px rgba(15,118,110,.16)}',
      '#oferta .oferta .preco{font-size:clamp(38px,11.5vw,56px);font-weight:800;line-height:1.05;color:#0d1b2a}',
      '#oferta .oferta .produto{color:#0f766e}','#oferta .oferta .preco-de{color:#3f5c58}','[data-tema="escuro"] #oferta .oferta .preco{color:#fff}','#oferta .oferta #btn-checkout{background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;box-shadow:0 8px 20px rgba(245,158,11,.3)}','#oferta .oferta #btn-checkout:hover{background:linear-gradient(135deg,#fff1b8,#f5b72a)}','#oferta .oferta .garantia{background:rgba(255,255,255,.6);color:#0f766e}','#oferta .oferta .confianca-compra{border-top-color:rgba(255,255,255,.22)}','#oferta .oferta .confianca-compra span{color:#244a45}','#oferta .oferta .badge-pagto{background:rgba(255,255,255,.65);color:#0d1b2a}',
      '[data-tema="escuro"] #oferta .oferta{background:linear-gradient(135deg,#13293d,#0f4f4a);color:#fff}[data-tema="escuro"] #oferta .oferta .produto{color:#5eead4}[data-tema="escuro"] #oferta .oferta .preco-de{color:#9fc4bd}[data-tema="escuro"] #oferta .oferta .garantia,[data-tema="escuro"] #oferta .oferta .badge-pagto,[data-tema="escuro"] .nl-bf-economiza{background:rgba(255,255,255,.08);color:#e6f4f1}[data-tema="escuro"] #oferta .oferta .confianca-compra span{color:#cfe7e2}',
      '#oferta .contador .bloco{background:#0d1b2a}',
      '#oferta .contador .bloco b{color:#5eead4}',
      '#oferta .contador .bloco span{color:#b7d5cf}',
      '.nl-bf-tag-oferta{font-family:Poppins,Arial,sans-serif;display:inline-block;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:800;letter-spacing:3px;font-size:11px;padding:7px 14px;border-radius:6px;margin-bottom:14px}',
      '.nl-bf-economiza{display:inline-block;background:rgba(255,255,255,.6);color:#0d1b2a;font-weight:800;font-size:13px;padding:6px 14px;border-radius:99px;margin:2px 0 16px}',
      
      '.nl-bf-estrela{position:absolute;top:12px;right:12px;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;transform:rotate(10deg);box-shadow:0 6px 14px rgba(13,27,42,.25);font-family:inherit}',
      '@media(max-width:520px){#oferta .oferta{padding:34px 16px 28px}.nl-bf-estrela{width:54px;height:54px;font-size:15px;top:8px;right:8px}}',

      // ---------- 2b) cartão de Black Friday acima do hero ----------
      '.nl-bf-wrap{padding:22px 22px 4px;font-family:inherit}',
      '.nl-bf-card{max-width:1032px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;background:rgba(255,255,255,.78);border:1px solid rgba(13,27,42,.1);border-radius:20px;padding:18px 28px 18px 20px;box-shadow:0 12px 30px rgba(15,118,110,.12)}',
      '.nl-bf-esq{display:flex;align-items:center;gap:18px;min-width:0}',
      '.nl-bf-tagbox{flex:none;width:88px;margin:-22px 4px -14px 0}',
      '.nl-bf-card .nl-bf-etiqueta{position:static;display:block;width:88px;transform:rotate(-6deg);transform-origin:50% 0}',
      '.nl-bf-tit{font-family:Poppins,Arial,sans-serif;font-weight:700;font-size:32px;line-height:1.05;letter-spacing:-.5px;color:#0d1b2a}',
      '.nl-bf-txt2{margin:6px 0 0;font-size:15px;line-height:1.45;color:#3f5c58}',
      '.nl-bf-txt2 b{color:#0d1b2a}',
      '.nl-bf-tm2{margin-top:6px;font-size:12.5px;color:#5b6b68}',
      '.nl-bf-tm2 b{color:#0d1b2a;font-variant-numeric:tabular-nums}',
      '.nl-bf-btn2{flex:none;display:inline-block;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:700;font-size:15px;padding:13px 24px;border-radius:12px;text-decoration:none;white-space:nowrap;box-shadow:0 8px 20px rgba(245,158,11,.3)}',
      '.nl-bf-btn2:hover{filter:brightness(1.05)}',
      '[data-tema="escuro"] .nl-bf-card{background:rgba(19,42,62,.85);border-color:rgba(94,234,212,.18);box-shadow:0 12px 30px rgba(0,0,0,.35)}',
      '[data-tema="escuro"] .nl-bf-tit,[data-tema="escuro"] .nl-bf-txt2 b,[data-tema="escuro"] .nl-bf-tm2 b{color:#fff}',
      '[data-tema="escuro"] .nl-bf-txt2{color:#cfe7e2}',
      '[data-tema="escuro"] .nl-bf-tm2{color:#9fc4bd}',
      '@media(max-width:700px){.nl-bf-wrap{padding:16px 16px 0}.nl-bf-card{flex-direction:column;align-items:stretch;text-align:center;padding:20px 18px;gap:14px}.nl-bf-tagbox{display:none}.nl-bf-tit{font-size:28px}.nl-bf-btn2{display:block;text-align:center}}',

      // ---------- 4b) caixa de oferta: título + etiqueta pendurada ----------
      '#oferta .oferta{overflow:visible!important;border:0!important;border-radius:22px!important;margin-top:40px;box-shadow:0 14px 40px rgba(15,118,110,.16)!important}',
      '.nl-bf-of-tag{position:absolute;top:-58px;right:34px;width:150px;transform:rotate(8deg);z-index:3}',
      '.nl-bf-of-tag .nl-bf-etiqueta{position:static;display:block;width:100%;transform:none}',
      '.nl-bf-of-tit{font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:38px;line-height:1.05;letter-spacing:-.6px;color:#0d1b2a}',
      '.nl-bf-of-sub{font-size:15px;color:#244a45;margin:6px 0 18px}.nl-bf-of-sub b{color:#0d1b2a}',
      '#oferta .oferta .produto{font-family:Poppins,Arial,sans-serif!important;font-weight:700!important;font-size:26px!important;line-height:1.2;color:#0d1b2a!important;text-transform:none!important;letter-spacing:-.3px!important;margin-bottom:8px}',
      '#oferta .oferta .preco-de{font-size:24px!important;font-weight:600!important;color:#3f5c58!important;text-decoration:line-through;text-decoration-color:#e0870a;text-decoration-thickness:2.5px}',
      '#oferta .oferta .contador .bloco{background:#fff!important;border-radius:14px!important;min-width:72px!important;padding:14px 10px!important;box-shadow:0 6px 16px rgba(15,118,110,.12)}#oferta .oferta .contador .bloco b{color:#0d1b2a!important;font-size:26px!important}#oferta .oferta .contador .bloco span{color:#0f766e!important;letter-spacing:1px}',
      '#oferta .oferta .nl-bf-economiza{background:rgba(255,255,255,.7)!important;color:#0d1b2a!important}#oferta .oferta .garantia,#oferta .oferta .badge-pagto{background:rgba(255,255,255,.7)!important}#oferta .oferta #btn-checkout{font-size:17px!important;padding:16px 44px!important}',
      '[data-tema="escuro"] .nl-bf-of-tit,[data-tema="escuro"] #oferta .oferta .produto,[data-tema="escuro"] .nl-bf-of-sub b{color:#fff!important}[data-tema="escuro"] .nl-bf-of-sub,[data-tema="escuro"] #oferta .oferta .preco-de{color:#cfe7e2!important}[data-tema="escuro"] #oferta .oferta .contador .bloco{background:rgba(255,255,255,.08)!important}[data-tema="escuro"] #oferta .oferta .contador .bloco b{color:#fff!important}[data-tema="escuro"] #oferta .oferta .contador .bloco span{color:#5eead4!important}',
      '[data-tema="escuro"] #oferta .oferta .nl-bf-economiza,[data-tema="escuro"] #oferta .oferta .garantia,[data-tema="escuro"] #oferta .oferta .badge-pagto{background:rgba(255,255,255,.1)!important;color:#e6f4f1!important}',
      '@media(max-width:520px){#oferta .oferta{padding-top:134px!important}.nl-bf-of-tag{width:90px;top:-50px;right:16px}.nl-bf-of-tit{font-size:32px}#oferta .oferta .produto{font-size:21px!important}#oferta .oferta .contador .bloco{min-width:58px!important}}',

      // ---------- 5) pop-up diário ----------
      '.nl-bf-modal-overlay{position:fixed;inset:0;background:rgba(5,12,20,.78);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility 0s linear .25s}',
      '.nl-bf-modal-overlay.nl-bf-aberto{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .25s ease,visibility 0s}',
      '.nl-bf-modal-caixa{position:relative;display:flex;background:#fff;color:#0d1b2a;border-radius:22px;max-width:640px;width:100%;overflow:hidden;font-family:inherit;box-shadow:0 24px 70px rgba(0,0,0,.4);transform:scale(.94);transition:transform .25s ease;max-height:calc(100vh - 32px);overflow-y:auto}',
      '.nl-bf-modal-overlay.nl-bf-aberto .nl-bf-modal-caixa{transform:scale(1)}',
      '.nl-bf-modal-capas{flex:0 0 250px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#d9f3ee,#a7e3d8);padding:20px 0}',
      '.nl-bf-modal-capas .nl-bf-palco{--u:.78px;width:100%;margin:0}',
      '.nl-bf-modal-capas .nl-bf-sombra{background:radial-gradient(ellipse,rgba(13,27,42,.3),transparent 70%)}',
      '.nl-bf-modal-corpo{flex:1;padding:34px 28px 26px}',
      '.nl-bf-modal-selo{display:inline-block;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:800;font-size:11px;letter-spacing:3px;padding:6px 12px;border-radius:7px}',
      '.nl-bf-modal-tit{font-family:Poppins,Arial,sans-serif;font-weight:700;font-size:34px;line-height:1.05;letter-spacing:-.6px;margin:12px 0 8px}',
      '.nl-bf-modal-txt{margin:0;font-size:15px;line-height:1.45;color:#3f5c58}.nl-bf-modal-txt b{color:#0d1b2a}',
      '.nl-bf-modal-pr{display:flex;align-items:baseline;gap:10px;margin:14px 0 16px}.nl-bf-modal-pr b{font-size:32px;font-weight:800;white-space:nowrap}.nl-bf-modal-pr s{font-size:14px;color:#5b6b68}',
      '.nl-bf-modal-cta{display:block;width:100%;text-align:center;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#0d1b2a;font-weight:700;font-size:15px;padding:14px;border-radius:12px;border:0;cursor:pointer;font-family:inherit;text-decoration:none;box-shadow:0 8px 20px rgba(245,158,11,.3)}',
      '.nl-bf-modal-cta:hover{filter:brightness(1.05)}',
      '.nl-bf-modal-tm{margin-top:12px;font-size:12.5px;color:#5b6b68}.nl-bf-modal-tm b{color:#0d1b2a;font-variant-numeric:tabular-nums}',
      '.nl-bf-modal-fechar{position:absolute;top:12px;right:12px;z-index:2;background:rgba(13,27,42,.08);border:0;color:#0d1b2a;font-size:22px;line-height:1;cursor:pointer;width:36px;height:36px;border-radius:50%}',
      '.nl-bf-modal-fechar:hover{background:rgba(13,27,42,.16)}',
      '[data-tema="escuro"] .nl-bf-modal-caixa{background:#132a3e;color:#fff}[data-tema="escuro"] .nl-bf-modal-txt{color:#cfe7e2}[data-tema="escuro"] .nl-bf-modal-txt b,[data-tema="escuro"] .nl-bf-modal-tm b{color:#fff}[data-tema="escuro"] .nl-bf-modal-pr s,[data-tema="escuro"] .nl-bf-modal-tm{color:#9fc4bd}[data-tema="escuro"] .nl-bf-modal-capas{background:linear-gradient(160deg,#0f766e,#0a4540)}[data-tema="escuro"] .nl-bf-modal-fechar{background:rgba(255,255,255,.12);color:#fff}',
      '@media(max-width:640px){.nl-bf-modal-caixa{flex-direction:column;max-width:380px}.nl-bf-modal-capas{flex:0 0 auto;padding:14px 0 6px}.nl-bf-modal-capas .nl-bf-palco{--u:.7px}.nl-bf-modal-corpo{padding:20px 22px 22px}.nl-bf-modal-tit{font-size:30px}}',
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
    faixa.setAttribute('aria-label', 'BLACK FRIDAY' + (pct ? ' -' + pct + '% OFF' : ''));
    var item = '<span class="nl-bf-item"><span class="tit">BLACK FRIDAY</span>' +
      (pct ? '<span class="pil">-' + pct + '% OFF</span>' : '') +
      '<span class="pil cont nl-bf-tempo"></span><span class="est">\u2605</span></span>';
    var grupo = '';
    for (var i = 0; i < 8; i++) grupo += item;
    faixa.innerHTML = '<div class="nl-bf-trilho" aria-hidden="true"><div class="nl-bf-grupo">' + grupo +
      '</div><div class="nl-bf-grupo" aria-hidden="true">' + grupo + '</div></div>';
    document.body.insertBefore(faixa, document.body.firstChild);
  }

  // Etiqueta de preço pendurada (SVG), na cor âmbar do site.
  var contEtiqueta = 0;
  function etiquetaSvg(pct, preco) {
    var gid = 'nlbfg' + (++contEtiqueta);
    var f = 'font-family="Poppins,Arial,sans-serif" fill="#0d1b2a" text-anchor="middle"';
    return '<svg class="nl-bf-etiqueta" viewBox="0 -60 124 226" aria-hidden="true" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>' +
      '<path d="M60 30 C58 -10 66 -30 54 -60" fill="none" stroke="#d99a06" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M13 41 L41 13 H89 L117 41 V155 Q117 163 109 163 H21 Q13 163 13 155 Z" fill="#0d1b2a" opacity=".18"/>' +
      '<path d="M8 36 L36 8 H84 L112 36 V150 Q112 158 104 158 H16 Q8 158 8 150 Z" fill="url(#' + gid + ')" stroke="#0d1b2a" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="60" cy="30" r="6.5" fill="#0d1b2a"/>' +
      '<text x="60" y="72" ' + f + ' font-weight="800" font-size="11" letter-spacing=".6">BLACK FRIDAY</text>' +
      '<line x1="22" y1="81" x2="98" y2="81" stroke="#0d1b2a" stroke-width="2"/>' +
      '<text x="60" y="118" ' + f + ' font-weight="900" font-size="33" letter-spacing="-1">-' + pct + '%</text>' +
      (preco ? '<text x="60" y="143" ' + f + ' font-weight="800" font-size="14">' + esc(preco) + '</text>' : '') + '</svg>';
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
    // Nas páginas de produto o destaque fica só na caixa de oferta (pedido do dono).
    if (!hero || !hero.parentNode || !ehHome) return;
    var href = ehHome ? '#catalogo' : '#oferta';
    var precos = precosDoIdioma(idioma);

    var nomeEl = ehProduto && document.getElementById('oferta-produto');
    var nome = nomeEl ? nomeEl.textContent.trim() : '';
    var paragrafo = pct
      ? '<b>' + esc(t.desconto(pct)) + '</b> ' + (nome ? esc(t.em) + ' ' + esc(nome) : t.todos)
      : (nome ? esc(nome) : t.todos);

    var oferta = precos
      ? ' — ' + esc(t.de) + ' <s>' + esc(precos.de) + '</s> ' + esc(t.por) + ' <b>' + esc(precos.por) + '</b>'
      : '';
    var secao = document.createElement('section');
    secao.className = 'nl-bf-wrap';
    secao.setAttribute('aria-label', t.titulo);
    secao.innerHTML =
      '<div class="nl-bf-card">' +
      '<div class="nl-bf-esq">' +
      (pct ? '<span class="nl-bf-tagbox">' + etiquetaSvg(pct, precos && precos.por) + '</span>' : '') +
      '<div class="nl-bf-info">' +
      '<div class="nl-bf-tit">Black Friday</div>' +
      '<p class="nl-bf-txt2">' + paragrafo + oferta + '</p>' +
      '<div class="nl-bf-tm2">' + t.termina + ' <b class="nl-bf-tempo"></b></div>' +
      '</div></div>' +
      '<a class="nl-bf-btn2" href="' + href + '">' + (ehHome ? t.cta : t.ctaProduto) + '</a>' +
      '</div>';

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
    if (!oferta.querySelector('.nl-bf-of-tit')) {
      var precos = precosDoIdioma(idioma);
      var cab = document.createElement('div');
      cab.className = 'nl-bf-of-cab';
      cab.innerHTML = '<div class="nl-bf-of-tit">Black Friday</div>' +
        (pct ? '<div class="nl-bf-of-sub">' + t.subOferta(pct) + '</div>' : '');
      oferta.insertBefore(cab, oferta.firstChild);
      if (pct) {
        var tag = document.createElement('div');
        tag.className = 'nl-bf-of-tag';
        tag.innerHTML = etiquetaSvg(pct, precos && precos.por);
        oferta.insertBefore(tag, oferta.firstChild);
      }
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
      ? '<a class="nl-bf-modal-cta" href="' + href + '">' + rotuloCta + '</a>'
      : '<button type="button" class="nl-bf-modal-cta">' + rotuloCta + '</button>';

    overlay.innerHTML =
      '<div class="nl-bf-modal-caixa">' +
      '<button type="button" class="nl-bf-modal-fechar" aria-label="' + t.fechar + '">×</button>' +
      '<div class="nl-bf-modal-capas">' + palcoHtml(idioma) + '</div>' +
      '<div class="nl-bf-modal-corpo">' +
      (pct ? '<span class="nl-bf-modal-selo">-' + pct + '% OFF</span>' : '') +
      '<div class="nl-bf-modal-tit">Black Friday</div>' +
      '<p class="nl-bf-modal-txt">' + (pct ? t.popTexto(pct) : t.todos) + '</p>' +
      (precos ? '<div class="nl-bf-modal-pr"><b>' + esc(precos.por) + '</b><s>' + esc(precos.de) + '</s></div>' : '') +
      cta +
      '<div class="nl-bf-modal-tm">' + t.termina + ' <b class="nl-bf-tempo"></b></div>' +
      '</div></div>';

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
