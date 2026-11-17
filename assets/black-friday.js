// ============================================================
// BLACK FRIDAY — NextLevel
// Campanha temporária (ver DATA_FIM abaixo). Injeta sozinho todo o visual
// — nenhuma página precisa de HTML extra, só o
// <script src="/assets/black-friday.js" defer>:
//   1) faixa-letreiro no topo (todas as páginas): texto rolando + contador,
//      fita zebrada amarela/preta; clique leva à oferta
//   2) bloco "oferta relâmpago" logo abaixo do cabeçalho (home e produtos):
//      -X% gigante, preço de/por, contador e botão grande
//   3) selo vermelho nos cards do catálogo (home e /categorias/)
//   4) caixa de oferta das páginas de produto vira vitrine da promoção
//   5) pop-up uma vez por dia por visitante
// Quando DATA_FIM passa, tudo se remove sozinho — inclusive o <style>
// injetado, então as páginas voltam exatamente ao visual normal. Pra
// limpar de vez, tirar a tag <script> das páginas e apagar este arquivo.
//
// A faixa do topo fica em fluxo normal (não fixed/sticky) de propósito:
// não precisa de ajuste de offset com o cabeçalho sticky, o banner de
// cookies (consent.js) nem a barra fixa de compra do mobile. O pop-up usa
// z-index 9999 (o maior z-index do resto do site é 60).
//
// Paleta da campanha (de propósito fora da paleta da marca, pra destacar):
// preto #0a0a0a · amarelo #ffd60a/#ffb800 · vermelho #ff1f3d.
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
      titulo: 'BLACK FRIDAY', termina: 'Termina em', todos: 'em todos os guias',
      cta: 'Ver as ofertas', ctaProduto: 'Quero aproveitar', fechar: 'Fechar',
      sub: 'Oferta de Black Friday até segunda-feira (Cyber Monday)',
      extras: '⚡ Acesso imediato · 🛡️ 7 dias de garantia', economiza: 'Você economiza',
      d: 'd', h: 'h', m: 'm', s: 's', dias: 'DIAS', horas: 'HORAS', min: 'MIN', seg: 'SEG',
    },
    en: {
      titulo: 'BLACK FRIDAY', termina: 'Ends in', todos: 'on every guide',
      cta: 'See the deals', ctaProduto: 'Grab the deal', fechar: 'Close',
      sub: 'Black Friday offer until Monday (Cyber Monday)',
      extras: '⚡ Instant access · 🛡️ 7-day guarantee', economiza: 'You save',
      d: 'd', h: 'h', m: 'm', s: 's', dias: 'DAYS', horas: 'HRS', min: 'MIN', seg: 'SEC',
    },
    es: {
      titulo: 'BLACK FRIDAY', termina: 'Termina en', todos: 'en todas las guías',
      cta: 'Ver las ofertas', ctaProduto: 'Aprovechar ahora', fechar: 'Cerrar',
      sub: 'Oferta de Black Friday hasta el lunes (Cyber Monday)',
      extras: '⚡ Acceso inmediato · 🛡️ 7 días de garantía', economiza: 'Ahorras',
      d: 'd', h: 'h', m: 'm', s: 's', dias: 'DÍAS', horas: 'HORAS', min: 'MIN', seg: 'SEG',
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

  function formatarRestante(ms, t) {
    var p = partes(ms);
    return p.dias + t.d + ' ' + doisDigitos(p.horas) + t.h + ' ' + doisDigitos(p.min) + t.m + ' ' + doisDigitos(p.seg) + t.s;
  }

  // Contador em blocos (dia/hora/min/seg) usado no bloco de oferta e no pop-up.
  function blocosHtml(ms, t) {
    var p = partes(ms);
    function bloco(v, rotulo) {
      return '<div class="nl-bf-bloco"><b>' + v + '</b><span>' + rotulo + '</span></div>';
    }
    var dois = '<i class="nl-bf-dois">:</i>';
    return bloco(p.dias, t.dias) + dois + bloco(doisDigitos(p.horas), t.horas) + dois +
      bloco(doisDigitos(p.min), t.min) + dois + bloco(doisDigitos(p.seg), t.seg);
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

  var estilo = null;
  var intervalo = null;
  var idiomaAtual = 'pt';
  var tAtual = null;

  function montar() {
    if (expirou()) return;
    idiomaAtual = idiomaDaPagina();
    tAtual = TEXTOS[idiomaAtual];
    var pct = percentualOff(idiomaAtual);

    injetarEstilos();
    montarFaixa(idiomaAtual, tAtual, pct);
    montarBlocoOferta(idiomaAtual, tAtual, pct);
    marcarCards(pct);
    marcarOferta(idiomaAtual, tAtual, pct);
    montarPopup(idiomaAtual, tAtual, pct);

    tick();
    intervalo = setInterval(tick, 1000);
  }

  // Um único relógio atualiza todos os contadores da página.
  function tick() {
    var restante = DATA_FIM.getTime() - Date.now();
    if (restante <= 0) { encerrar(); return; }
    var texto = formatarRestante(restante, tAtual);
    var html = blocosHtml(restante, tAtual);
    var tempos = document.querySelectorAll('.nl-bf-tempo');
    for (var i = 0; i < tempos.length; i++) tempos[i].textContent = texto;
    var blocos = document.querySelectorAll('.nl-bf-blocos');
    for (var j = 0; j < blocos.length; j++) blocos[j].innerHTML = html;
  }

  // Campanha acabou com a página aberta: remove tudo, inclusive o CSS.
  function encerrar() {
    if (intervalo) clearInterval(intervalo);
    var alvos = document.querySelectorAll(
      '.nl-bf-faixa,.nl-bf-hero,.nl-bf-modal-overlay,.nl-bf-fita,.nl-bf-tag-oferta,.nl-bf-estrela,.nl-bf-economiza'
    );
    for (var i = 0; i < alvos.length; i++) alvos[i].remove();
    var marcados = document.querySelectorAll('.nl-bf-shine,.nl-bf-batida,.nl-bf-preco-glow');
    for (var j = 0; j < marcados.length; j++) {
      marcados[j].classList.remove('nl-bf-shine', 'nl-bf-batida', 'nl-bf-preco-glow');
    }
    document.body.classList.remove('nl-bf-trava');
    if (estilo) estilo.remove();
  }

  function injetarEstilos() {
    estilo = document.createElement('style');
    estilo.textContent = [
      // ---------- 1) faixa-letreiro ----------
      '.nl-bf-faixa{display:block;background:#0a0a0a;color:#fff;font-family:Arial,Helvetica,sans-serif;position:relative;overflow:hidden;text-decoration:none}',
      '.nl-bf-faixa::after{content:"";display:block;height:5px;background:repeating-linear-gradient(135deg,#ffd60a 0 9px,#0a0a0a 9px 18px)}',
      '.nl-bf-trilho{display:flex;width:max-content;padding:9px 0;animation:nlBfLetreiro 26s linear infinite}',
      '.nl-bf-grupo{display:flex;align-items:center;flex-shrink:0}',
      '.nl-bf-rep{display:flex;align-items:center;flex-shrink:0}',
      '.nl-bf-item{white-space:nowrap;font-weight:900;font-size:13px;letter-spacing:.7px;text-transform:uppercase;padding:0 12px}',
      '.nl-bf-item.amarelo{color:#ffd60a}',
      '.nl-bf-item .nl-bf-tempo{color:#ffd60a;font-variant-numeric:tabular-nums}',
      '.nl-bf-pilula{background:#ff1f3d;color:#fff;border-radius:4px;padding:3px 10px;transform:skew(-8deg);display:inline-block}',
      '.nl-bf-estrela-sep{color:#ffd60a;font-size:12px}',
      '@keyframes nlBfLetreiro{to{transform:translateX(-50%)}}',

      // ---------- 2) bloco de oferta relâmpago ----------
      '.nl-bf-hero{background:#050505;color:#fff;position:relative;overflow:hidden;font-family:Arial,Helvetica,sans-serif;text-align:center;padding:24px 16px 28px}',
      '.nl-bf-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0,rgba(255,214,10,.30),transparent 62%),radial-gradient(circle at 100% 100%,rgba(255,31,61,.26),transparent 55%),radial-gradient(circle at 0 100%,rgba(255,31,61,.16),transparent 50%);pointer-events:none}',
      '.nl-bf-hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:repeating-linear-gradient(135deg,#ffd60a 0 9px,#050505 9px 18px)}',
      '.nl-bf-hero-in{position:relative;max-width:560px;margin:0 auto}',
      '.nl-bf-tag{display:inline-block;background:#ff1f3d;color:#fff;font-weight:900;letter-spacing:1.6px;font-size:13px;padding:6px 16px;border-radius:4px;transform:skew(-8deg);box-shadow:0 0 0 2px #ffd60a;text-transform:uppercase}',
      '.nl-bf-big{display:flex;align-items:baseline;justify-content:center;gap:8px;margin:10px 0 0;line-height:.95}',
      '.nl-bf-big b{font-size:clamp(76px,24vw,128px);font-weight:900;font-style:italic;letter-spacing:-3px;background:linear-gradient(180deg,#fff27a,#ffb800);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;filter:drop-shadow(0 4px 0 rgba(0,0,0,.55)) drop-shadow(0 0 22px rgba(255,184,0,.35))}',
      '.nl-bf-big span{font-size:clamp(26px,8vw,44px);font-weight:900;font-style:italic;color:#fff}',
      '.nl-bf-sub{font-size:14.5px;font-weight:800;color:#e8e8e8;letter-spacing:.5px;margin:2px 0 14px;text-transform:uppercase}',
      '.nl-bf-precos{display:flex;align-items:center;justify-content:center;gap:12px;margin:0 0 16px}',
      '.nl-bf-precos s{font-size:20px;font-weight:700;color:#ff6b7f;text-decoration-thickness:2px}',
      '.nl-bf-precos i{color:#ffd60a;font-style:normal;font-size:22px}',
      '.nl-bf-precos strong{font-size:clamp(36px,11vw,52px);font-weight:900;color:#ffd60a;line-height:1}',
      '.nl-bf-termina{font-size:12px;font-weight:900;letter-spacing:2.2px;text-transform:uppercase;color:#ff6b7f;margin-bottom:8px}',
      '.nl-bf-blocos{display:flex;justify-content:center;align-items:flex-start;gap:5px;margin:0 0 18px}',
      '.nl-bf-bloco{background:linear-gradient(180deg,#1c1c1c,#0b0b0b);border:1px solid rgba(255,214,10,.5);border-radius:10px;min-width:60px;padding:9px 4px 7px}',
      '.nl-bf-bloco b{display:block;font-size:30px;font-weight:900;color:#ffd60a;font-variant-numeric:tabular-nums;line-height:1}',
      '.nl-bf-bloco span{display:block;font-size:9px;font-weight:800;letter-spacing:1.1px;color:#bdbdbd;margin-top:5px}',
      '.nl-bf-dois{color:#ffd60a;font-style:normal;font-weight:900;font-size:24px;line-height:1;margin-top:9px}',
      '.nl-bf-btn{display:block;max-width:420px;margin:0 auto;background:linear-gradient(180deg,#ffe14d,#ffb800);color:#111;font-weight:900;font-size:18px;letter-spacing:.6px;text-transform:uppercase;padding:16px 20px;border-radius:12px;text-decoration:none;border:0;cursor:pointer;font-family:inherit;box-shadow:0 6px 0 #b37f00,0 12px 28px rgba(255,184,0,.35);position:relative;overflow:hidden}',
      '.nl-bf-btn:active{transform:translateY(3px);box-shadow:0 3px 0 #b37f00,0 6px 16px rgba(255,184,0,.3)}',
      '.nl-bf-extras{margin-top:13px;font-size:12.5px;color:#d0d0d0}',
      '.nl-bf-sub-aviso{margin-top:6px;font-size:11.5px;color:#9a9a9a}',

      // brilho que atravessa o botão + "batida" leve
      '.nl-bf-shine{position:relative;overflow:hidden}',
      '.nl-bf-shine::after{content:"";position:absolute;top:0;left:-60%;width:38%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg);animation:nlBfBrilho 2.8s ease-in-out infinite;pointer-events:none}',
      '@keyframes nlBfBrilho{0%,55%{left:-60%}100%{left:135%}}',
      '.nl-bf-batida{animation:nlBfBatida 1.7s ease-in-out infinite}',
      '@keyframes nlBfBatida{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}',
      '@keyframes nlBfPulsoPreco{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}',
      '.nl-bf-preco-glow{display:inline-block;animation:nlBfPulsoPreco 1.6s ease-in-out infinite}',
      '@keyframes nlBfPulsoFita{0%,100%{box-shadow:0 3px 8px rgba(0,0,0,.35)}50%{box-shadow:0 3px 16px rgba(255,31,61,.75)}}',

      // ---------- 3) selo nos cards do catálogo ----------
      // (a capa do card é uma faixa baixa, aspect-ratio 5.6/1: em tela
      // larga cabe uma fita diagonal; em tela estreita viraria mais alta
      // que a capa e invadiria o título, então vira selo reto compacto)
      '.nl-bf-fita{position:absolute;top:17px;left:-36px;width:144px;transform:rotate(-45deg);background:linear-gradient(135deg,#ff2d4a,#d90429);color:#fff;font-weight:900;font-size:11px;letter-spacing:.3px;text-align:center;padding:4px 0;z-index:3;border-top:2px solid #ffd60a;border-bottom:2px solid #ffd60a;box-shadow:0 3px 8px rgba(0,0,0,.35);pointer-events:none;animation:nlBfPulsoFita 2.4s ease-in-out infinite}',
      '@media(max-width:640px){.nl-bf-fita{top:7px;left:7px;width:auto;transform:none;border:1.5px solid #ffd60a;border-radius:6px;font-size:10.5px;padding:3px 7px;letter-spacing:0}}',
      'body .card .preco{color:#d90429}',
      '[data-tema="escuro"] body .card .preco,[data-tema="escuro"] .card .preco{color:#ff6b7f}',

      // ---------- 4) caixa de oferta nas páginas de produto ----------
      '#oferta .oferta{position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 0,rgba(255,214,10,.18),transparent 62%),#0a0a0a;border:2px solid #ffd60a;box-shadow:0 0 0 4px rgba(255,214,10,.14),0 18px 60px rgba(255,184,0,.24);color:#fff}',
      '#oferta .oferta .produto{color:#ffd60a}',
      '#oferta .oferta .preco-de{color:#ff6b7f;font-size:20px;font-weight:700;text-decoration-thickness:2px}',
      '#oferta .oferta .preco{color:#ffd60a;font-size:clamp(52px,15vw,74px);font-weight:900;line-height:1;margin:8px 0 6px}',
      '#oferta .oferta .garantia{background:rgba(255,255,255,.09);color:#fff}',
      '#oferta .oferta .confianca-compra{border-top-color:rgba(255,255,255,.16)}',
      '#oferta .oferta .confianca-compra span{color:#d0d0d0}',
      '#oferta .contador .bloco{background:linear-gradient(180deg,#1c1c1c,#0b0b0b);border:1px solid rgba(255,214,10,.5)}',
      '#oferta .contador .bloco b{color:#ffd60a}',
      '#oferta .contador .bloco span{color:#bdbdbd}',
      '#oferta #btn-checkout{display:block;width:100%;max-width:420px;margin:0 auto;background:linear-gradient(180deg,#ffe14d,#ffb800);color:#111;font-weight:900;font-size:19px;letter-spacing:.6px;text-transform:uppercase;padding:18px 20px;border-radius:12px;border:0;box-shadow:0 6px 0 #b37f00,0 12px 28px rgba(255,184,0,.35)}',
      '.barra-fixa .btn#barra-btn{background:linear-gradient(180deg,#ffe14d,#ffb800);color:#111;font-weight:900;text-transform:uppercase;box-shadow:0 4px 0 #b37f00}',
      '.nl-bf-tag-oferta{margin-bottom:14px}',
      '.nl-bf-economiza{display:inline-block;background:#ff1f3d;color:#fff;font-weight:900;font-size:13px;letter-spacing:.6px;padding:6px 16px;border-radius:4px;margin:2px 0 18px;text-transform:uppercase;transform:skew(-8deg)}',
      '.nl-bf-estrela{position:absolute;top:12px;right:12px;width:66px;height:66px;border-radius:50%;background:#ff1f3d;color:#fff;font-weight:900;font-size:19px;display:flex;align-items:center;justify-content:center;transform:rotate(12deg);box-shadow:0 0 0 3px #ffd60a,0 6px 16px rgba(0,0,0,.5);font-family:Arial,Helvetica,sans-serif;z-index:2}',
      '@media(max-width:520px){#oferta .oferta{padding:34px 16px 28px}.nl-bf-estrela{width:56px;height:56px;font-size:16px;top:8px;right:8px}}',

      // ---------- 5) pop-up diário ----------
      '.nl-bf-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility 0s linear .25s}',
      '.nl-bf-modal-overlay.nl-bf-aberto{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .25s ease,visibility 0s}',
      '.nl-bf-modal-caixa{position:relative;background:#050505;color:#fff;border:2px solid #ffd60a;border-radius:18px;max-width:400px;width:100%;padding:26px 16px 20px;text-align:center;font-family:Arial,Helvetica,sans-serif;box-shadow:0 0 0 5px rgba(255,214,10,.16),0 24px 70px rgba(255,184,0,.28);transform:scale(.9);transition:transform .25s ease;overflow:hidden}',
      '.nl-bf-modal-caixa::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0,rgba(255,214,10,.3),transparent 62%),radial-gradient(circle at 100% 100%,rgba(255,31,61,.26),transparent 55%);pointer-events:none}',
      '.nl-bf-modal-caixa>*{position:relative}',
      '.nl-bf-modal-overlay.nl-bf-aberto .nl-bf-modal-caixa{transform:scale(1)}',
      '.nl-bf-modal-fechar{position:absolute!important;top:6px;right:8px;background:rgba(255,255,255,.12);border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;width:38px;height:38px;border-radius:50%;z-index:2}',
      '.nl-bf-modal-fechar:hover{background:rgba(255,255,255,.22)}',
      '.nl-bf-modal-caixa .nl-bf-big b{font-size:clamp(70px,22vw,104px)}',
      '.nl-bf-modal-caixa .nl-bf-blocos{margin-bottom:16px}',
      '.nl-bf-modal-caixa .nl-bf-bloco{min-width:56px}',
      '.nl-bf-modal-caixa .nl-bf-bloco b{font-size:26px}',
      'body.nl-bf-trava{overflow:hidden}',

      // ---------- telas estreitas ----------
      '@media(max-width:420px){.nl-bf-bloco{min-width:54px}.nl-bf-bloco b{font-size:27px}.nl-bf-item{font-size:12.5px;padding:0 10px}.nl-bf-btn{font-size:17px}}',

      // ---------- acessibilidade: sem movimento ----------
      '@media(prefers-reduced-motion:reduce){.nl-bf-trilho{animation:none;width:auto;flex-wrap:wrap;justify-content:center}.nl-bf-grupo{flex-wrap:wrap;justify-content:center}.nl-bf-grupo+.nl-bf-grupo,.nl-bf-rep+.nl-bf-rep{display:none}.nl-bf-shine::after{display:none}.nl-bf-batida,.nl-bf-preco-glow,.nl-bf-fita{animation:none!important}}',
    ].join('');
    document.head.appendChild(estilo);
  }

  // ---------- 1) faixa-letreiro ----------
  function montarFaixa(idioma, t, pct) {
    var href = hrefAcao(idioma);
    var faixa = document.createElement(href ? 'a' : 'div');
    faixa.className = 'nl-bf-faixa';
    if (href) faixa.setAttribute('href', href);
    faixa.setAttribute('aria-label', t.titulo + (pct ? ' -' + pct + '%' : ''));

    var sep = '<span class="nl-bf-item nl-bf-estrela-sep" aria-hidden="true">★</span>';
    var rep =
      '<span class="nl-bf-rep">' +
      '<span class="nl-bf-item amarelo">🔥 ' + t.titulo + '</span>' + sep +
      (pct ? '<span class="nl-bf-item"><span class="nl-bf-pilula">-' + pct + '% OFF</span></span>' + sep : '') +
      '<span class="nl-bf-item">' + t.termina + ' <span class="nl-bf-tempo"></span></span>' + sep +
      '</span>';
    var grupo = '<div class="nl-bf-grupo">' + rep + rep + rep + '</div>';
    faixa.innerHTML = '<div class="nl-bf-trilho">' + grupo + grupo.replace('class="nl-bf-grupo"', 'class="nl-bf-grupo" aria-hidden="true"') + '</div>';

    document.body.insertBefore(faixa, document.body.firstChild);
  }

  // ---------- 2) bloco de oferta relâmpago (home e produtos) ----------
  function montarBlocoOferta(idioma, t, pct) {
    var hero = document.querySelector('.hero');
    var ehHome = paginaHome();
    var ehProduto = paginaProduto() && document.getElementById('oferta');
    if (!hero || !hero.parentNode || !(ehHome || ehProduto)) return;
    var href = ehHome ? '#catalogo' : '#oferta';
    var precos = precosDoIdioma(idioma);

    var secao = document.createElement('section');
    secao.className = 'nl-bf-hero';
    secao.setAttribute('aria-label', t.titulo);
    secao.innerHTML =
      '<div class="nl-bf-hero-in">' +
      '<span class="nl-bf-tag">🔥 ' + t.titulo + '</span>' +
      (pct ? '<div class="nl-bf-big"><b>-' + pct + '%</b><span>OFF</span></div>' : '') +
      '<div class="nl-bf-sub">' + t.todos + '</div>' +
      (precos
        ? '<div class="nl-bf-precos"><s>' + precos.de + '</s><i>→</i><strong>' + precos.por + '</strong></div>'
        : '') +
      '<div class="nl-bf-termina">⏰ ' + t.termina + '</div>' +
      '<div class="nl-bf-blocos"></div>' +
      '<a class="nl-bf-btn nl-bf-shine nl-bf-batida" href="' + href + '">' + (ehHome ? t.cta : t.ctaProduto) + '</a>' +
      '<div class="nl-bf-extras">' + t.extras + '</div>' +
      '<div class="nl-bf-sub-aviso">' + t.sub + '</div>' +
      '</div>';

    // Na página de produto, o nome do produto no lugar do texto genérico
    // (o resto da primeira tela agora é só promoção).
    var nomeProduto = ehProduto && document.getElementById('oferta-produto');
    if (nomeProduto && nomeProduto.textContent.trim()) {
      secao.querySelector('.nl-bf-sub').textContent = nomeProduto.textContent.trim();
    }

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
  // selo, a estrela de desconto, a linha de economia e os botões.
  function marcarOferta(idioma, t, pct) {
    var oferta = document.querySelector('.oferta');
    if (!oferta) return;
    if (!oferta.querySelector('.nl-bf-tag-oferta')) {
      var selo = document.createElement('div');
      selo.className = 'nl-bf-tag nl-bf-tag-oferta';
      selo.textContent = '🔥 ' + t.titulo;
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
    if (preco) preco.classList.add('nl-bf-preco-glow');
    var btn = document.getElementById('btn-checkout');
    if (btn) btn.classList.add('nl-bf-shine', 'nl-bf-batida');
    var btnBarra = document.getElementById('barra-btn');
    if (btnBarra) btnBarra.classList.add('nl-bf-shine');
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
      ? '<a class="nl-bf-btn nl-bf-shine nl-bf-batida nl-bf-modal-cta" href="' + href + '">' + rotuloCta + '</a>'
      : '<button type="button" class="nl-bf-btn nl-bf-shine nl-bf-batida nl-bf-modal-cta">' + rotuloCta + '</button>';

    overlay.innerHTML =
      '<div class="nl-bf-modal-caixa">' +
      '<button type="button" class="nl-bf-modal-fechar" aria-label="' + t.fechar + '">×</button>' +
      '<span class="nl-bf-tag">🔥 ' + t.titulo + '</span>' +
      (pct ? '<div class="nl-bf-big"><b>-' + pct + '%</b><span>OFF</span></div>' : '') +
      '<div class="nl-bf-sub">' + t.todos + '</div>' +
      (precos
        ? '<div class="nl-bf-precos"><s>' + precos.de + '</s><i>→</i><strong>' + precos.por + '</strong></div>'
        : '') +
      '<div class="nl-bf-termina">⏰ ' + t.termina + '</div>' +
      '<div class="nl-bf-blocos"></div>' +
      cta +
      '<div class="nl-bf-extras">' + t.extras + '</div>' +
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
