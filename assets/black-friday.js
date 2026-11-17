// ============================================================
// BLACK FRIDAY — NextLevel
// Campanha temporária (ver DATA_FIM abaixo). Injeta sozinho todo o visual
// — nenhuma página precisa de HTML extra, só o
// <script src="/assets/black-friday.js" defer>:
//   1) faixa amarela fina no topo (todas as páginas), com contador
//   2) banner preto logo abaixo do cabeçalho (home e produtos): nome
//      "BLACK FRIDAY", desconto, preço, contador e botão
//   3) selo amarelo "-X% OFF" nos cards do catálogo (home e /categorias/)
//   4) caixa de oferta das páginas de produto em preto e amarelo
//   5) pop-up uma vez por dia por visitante
// Paleta da campanha: preto #0a0a0a + amarelo #ffd60a (de propósito fora
// da paleta da marca, só durante a campanha).
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
      termina: 'termina em', de: 'de', todos: 'NEXTLEVEL · EM TODOS OS GUIAS', desc: 'de desconto',
      especial: 'PREÇO ESPECIAL', cta: 'VER AS OFERTAS', ctaProduto: 'QUERO APROVEITAR', fechar: 'Fechar',
      aviso: 'Oferta de Black Friday até segunda-feira (Cyber Monday)', economiza: 'Você economiza',
      d: 'd', h: 'h', m: 'm', s: 's', dias: 'DIAS', horas: 'HORAS', min: 'MIN', seg: 'SEG',
    },
    en: {
      termina: 'ends in', de: 'was', todos: 'NEXTLEVEL · ON EVERY GUIDE', desc: 'off',
      especial: 'SPECIAL PRICE', cta: 'SEE THE DEALS', ctaProduto: 'GRAB THE DEAL', fechar: 'Close',
      aviso: 'Black Friday offer until Monday (Cyber Monday)', economiza: 'You save',
      d: 'd', h: 'h', m: 'm', s: 's', dias: 'DAYS', horas: 'HRS', min: 'MIN', seg: 'SEC',
    },
    es: {
      termina: 'termina en', de: 'de', todos: 'NEXTLEVEL · EN TODAS LAS GUÍAS', desc: 'de descuento',
      especial: 'PRECIO ESPECIAL', cta: 'VER LAS OFERTAS', ctaProduto: 'APROVECHAR AHORA', fechar: 'Cerrar',
      aviso: 'Oferta de Black Friday hasta el lunes (Cyber Monday)', economiza: 'Ahorras',
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
    return p.dias + t.d + ' ' + doisDigitos(p.horas) + t.h + ' ' + doisDigitos(p.min) + t.m;
  }

  // Quatro cartões (dias/horas/min/seg) do banner e do pop-up.
  function blocosHtml(ms, t) {
    var p = partes(ms);
    function c(v, r) { return '<div><b>' + v + '</b><span>' + r + '</span></div>'; }
    return c(p.dias, t.dias) + c(doisDigitos(p.horas), t.horas) + c(doisDigitos(p.min), t.min) + c(doisDigitos(p.seg), t.seg);
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
    var curto = formatarRestante(restante, tAtual);
    var html = blocosHtml(restante, tAtual);
    var a = document.querySelectorAll('.nl-bf-tempo');
    for (var i = 0; i < a.length; i++) a[i].textContent = curto;
    var b = document.querySelectorAll('.nl-bf-cartoes');
    for (var j = 0; j < b.length; j++) b[j].innerHTML = html;
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
      '.nl-bf-faixa{display:block;background:#ffd60a;color:#0a0a0a;font-family:inherit;font-weight:800;font-size:12px;letter-spacing:.8px;line-height:1.2;white-space:nowrap;overflow:hidden;padding:11px 8px;text-align:center;text-decoration:none;text-transform:uppercase}',
      '@media(max-width:360px){.nl-bf-faixa{font-size:11px;letter-spacing:.2px}}',

      // ---------- 2) banner (também usado no pop-up) ----------
      '.nl-bf-hero{background:#0a0a0a;color:#fff;font-family:inherit;text-align:center;padding:30px 22px 28px;border-bottom:4px solid #ffd60a}',
      '.nl-bf-in{max-width:520px;margin:0 auto}',
      '.nl-bf-lock{display:inline-block;text-align:left}',
      '.nl-bf-lock span{display:block;font-weight:900;font-size:clamp(46px,16vw,62px);letter-spacing:-1px;line-height:1}',
      '.nl-bf-lock .a{color:#fff}',
      '.nl-bf-lock .b{background:#ffd60a;color:#0a0a0a;padding:2px 14px 4px;margin-top:2px}',
      '.nl-bf-sub{margin:18px 0 6px;font-size:14px;color:#cfcfcf;letter-spacing:.6px;text-transform:uppercase}',
      '.nl-bf-big{font-size:24px;font-weight:800;margin:0 0 18px}',
      '.nl-bf-big b{color:#ffd60a;font-size:40px;font-weight:900}',
      '.nl-bf-box{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#161616;border:1px solid #2c2c2c;border-radius:12px;padding:14px 16px;margin-bottom:12px}',
      '.nl-bf-box .l{text-align:left;font-size:12px;color:#9a9a9a;letter-spacing:1px}',
      '.nl-bf-box .l s{display:block;font-size:14px;color:#777;letter-spacing:0;margin-top:2px}',
      '.nl-bf-box .p{font-size:34px;font-weight:900;color:#ffd60a;white-space:nowrap}',
      '.nl-bf-cartoes{display:flex;gap:8px;margin-bottom:20px}',
      '.nl-bf-cartoes div{flex:1;background:#161616;border:1px solid #2c2c2c;border-radius:10px;padding:10px 0}',
      '.nl-bf-cartoes b{display:block;font-size:24px;font-weight:800;font-variant-numeric:tabular-nums}',
      '.nl-bf-cartoes span{display:block;font-size:9px;letter-spacing:1.5px;color:#9a9a9a;margin-top:2px}',
      '.nl-bf-btn{display:block;background:#ffd60a;color:#0a0a0a;font-weight:900;letter-spacing:1.5px;font-size:15px;padding:16px;border-radius:10px;text-decoration:none;text-align:center;border:0;cursor:pointer;font-family:inherit;width:100%;box-sizing:border-box}',
      '.nl-bf-btn:hover{background:#ffe14d}',
      '.nl-bf-aviso{margin-top:12px;font-size:11px;color:#8a8a8a}',
      '@media(min-width:820px){.nl-bf-hero{padding:44px 22px 40px}.nl-bf-in{max-width:560px}.nl-bf-lock span{font-size:84px}}',

      // ---------- 3) selo nos cards do catálogo ----------
      // (a capa do card é uma faixa baixa, aspect-ratio 5.6/1: em tela
      // larga cabe uma fita diagonal; em tela estreita viraria mais alta
      // que a capa e invadiria o título, então vira selo reto compacto)
      '.nl-bf-fita{position:absolute;top:17px;left:-36px;width:144px;transform:rotate(-45deg);background:#ffd60a;color:#0a0a0a;font-weight:900;font-size:11px;letter-spacing:.3px;text-align:center;padding:4px 0;z-index:3;border-top:2px solid #0a0a0a;border-bottom:2px solid #0a0a0a;box-shadow:0 3px 8px rgba(0,0,0,.3);pointer-events:none}',
      '@media(max-width:640px){.nl-bf-fita{top:7px;left:7px;width:auto;transform:none;border:2px solid #0a0a0a;border-radius:6px;font-size:10.5px;padding:2px 7px;letter-spacing:0}}',

      // ---------- 4) caixa de oferta nas páginas de produto ----------
      '#oferta .oferta{position:relative;overflow:hidden;background:#0a0a0a;border:2px solid #ffd60a;box-shadow:0 0 0 4px rgba(255,214,10,.14),0 14px 40px rgba(0,0,0,.3);color:#fff}',
      '#oferta .oferta .produto{color:#ffd60a}',
      '#oferta .oferta .preco-de{color:#8a8a8a;font-size:18px;font-weight:700}',
      '#oferta .oferta .preco{font-size:clamp(40px,12vw,58px);font-weight:900;line-height:1.05;color:#ffd60a}',
      '#oferta .oferta .garantia{background:#161616;border:1px solid #2c2c2c;color:#fff}',
      '#oferta .oferta .confianca-compra{border-top-color:#2c2c2c}',
      '#oferta .oferta .confianca-compra span{color:#bdbdbd}',
      '#oferta .contador .bloco{background:#161616;border:1px solid #2c2c2c}',
      '#oferta .contador .bloco b{color:#ffd60a}',
      '#oferta .contador .bloco span{color:#9a9a9a}',
      '#oferta #btn-checkout{display:block;width:100%;max-width:420px;margin:0 auto;background:#ffd60a;color:#0a0a0a;font-weight:900;font-size:16px;letter-spacing:1.2px;text-transform:uppercase;padding:17px 18px;border-radius:10px;border:0;box-shadow:none}',
      '.barra-fixa .btn#barra-btn{background:#ffd60a;color:#0a0a0a;font-weight:900;text-transform:uppercase;box-shadow:none}',
      '.nl-bf-tag-oferta{display:inline-block;background:#ffd60a;color:#0a0a0a;font-weight:900;letter-spacing:3px;font-size:11px;padding:7px 14px;border-radius:4px;margin-bottom:14px}',
      '.nl-bf-economiza{display:inline-block;background:rgba(255,214,10,.14);color:#ffd60a;font-weight:800;font-size:13px;padding:6px 14px;border-radius:99px;margin:2px 0 16px}',
      '.nl-bf-estrela{position:absolute;top:12px;right:12px;width:60px;height:60px;border-radius:50%;background:#ffd60a;color:#0a0a0a;font-weight:900;font-size:17px;display:flex;align-items:center;justify-content:center;transform:rotate(10deg);font-family:inherit}',
      '@media(max-width:520px){#oferta .oferta{padding:34px 16px 28px}.nl-bf-estrela{width:52px;height:52px;font-size:15px;top:8px;right:8px}}',

      // ---------- 5) pop-up diário ----------
      '.nl-bf-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility 0s linear .25s}',
      '.nl-bf-modal-overlay.nl-bf-aberto{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .25s ease,visibility 0s}',
      '.nl-bf-modal-caixa{position:relative;background:#0a0a0a;color:#fff;border:2px solid #ffd60a;border-radius:16px;max-width:400px;width:100%;max-height:calc(100vh - 32px);overflow-y:auto;font-family:inherit;transform:scale(.94);transition:transform .25s ease}',
      '.nl-bf-modal-overlay.nl-bf-aberto .nl-bf-modal-caixa{transform:scale(1)}',
      '.nl-bf-modal-caixa .nl-bf-hero{border-bottom:0;padding:34px 18px 22px}',
      '.nl-bf-modal-caixa .nl-bf-lock span{font-size:clamp(40px,13vw,50px)}',
      '.nl-bf-modal-caixa .nl-bf-sub{margin-top:14px}',
      '.nl-bf-modal-caixa .nl-bf-big{margin-bottom:14px}',
      '.nl-bf-modal-fechar{position:absolute;top:8px;right:10px;background:#1f1f1f;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;width:38px;height:38px;border-radius:50%;z-index:2}',
      '.nl-bf-modal-fechar:hover{background:#2c2c2c}',
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
      'BLACK FRIDAY' + (pct ? ' &nbsp;·&nbsp; ' + pct + '% OFF' : '') +
      ' &nbsp;·&nbsp; ' + t.termina + ' <span class="nl-bf-tempo"></span>';
    document.body.insertBefore(faixa, document.body.firstChild);
  }

  // Miolo do banner e do pop-up: nome, desconto, preço, contador e botão.
  function miolo(idioma, t, pct, href, rotuloCta, nomeProduto) {
    var precos = precosDoIdioma(idioma);
    var cta = href
      ? '<a class="nl-bf-btn nl-bf-cta" href="' + href + '">' + rotuloCta + '</a>'
      : '<button type="button" class="nl-bf-btn nl-bf-cta">' + rotuloCta + '</button>';
    return '<div class="nl-bf-in">' +
      '<div class="nl-bf-lock"><span class="a">BLACK</span><span class="b">FRIDAY</span></div>' +
      '<div class="nl-bf-sub">' + (nomeProduto ? esc(nomeProduto) : t.todos) + '</div>' +
      (pct ? '<div class="nl-bf-big"><b>' + pct + '%</b> ' + t.desc + '</div>' : '') +
      (precos
        ? '<div class="nl-bf-box"><div class="l">' + t.especial + '<s>' + t.de + ' ' + esc(precos.de) + '</s></div><div class="p">' + esc(precos.por) + '</div></div>'
        : '') +
      '<div class="nl-bf-cartoes"></div>' +
      cta +
      '<div class="nl-bf-aviso">' + t.aviso + '</div>' +
      '</div>';
  }

  // ---------- 2) banner (home e produtos) ----------
  function montarBanner(idioma, t, pct) {
    var hero = document.querySelector('.hero');
    var ehHome = paginaHome();
    var ehProduto = paginaProduto() && document.getElementById('oferta');
    if (!hero || !hero.parentNode || !(ehHome || ehProduto)) return;
    var nomeEl = ehProduto && document.getElementById('oferta-produto');
    var nome = nomeEl ? nomeEl.textContent.trim() : '';

    var secao = document.createElement('section');
    secao.className = 'nl-bf-hero';
    secao.setAttribute('aria-label', 'BLACK FRIDAY');
    secao.innerHTML = miolo(idioma, t, pct, ehHome ? '#catalogo' : '#oferta', ehHome ? t.cta : t.ctaProduto, nome);
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
      selo.textContent = 'BLACK FRIDAY';
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

    var overlay = document.createElement('div');
    overlay.className = 'nl-bf-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'BLACK FRIDAY');

    overlay.innerHTML =
      '<div class="nl-bf-modal-caixa">' +
      '<button type="button" class="nl-bf-modal-fechar" aria-label="' + t.fechar + '">×</button>' +
      '<div class="nl-bf-hero">' +
      miolo(idioma, t, pct, hrefAcao(idioma), paginaProduto() ? t.ctaProduto : t.cta, '') +
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
    overlay.querySelector('.nl-bf-cta').addEventListener('click', fechar);

    setTimeout(abrir, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
