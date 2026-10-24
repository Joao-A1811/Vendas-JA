// ============================================================
// SELETOR DE IDIOMA — NextLevel
// Duas responsabilidades, no mesmo arquivo pra carregar uma vez só:
//
// 1) Detecta o idioma/local do navegador do visitante e redireciona pra
//    versão certa da página na primeira visita — nunca de novo depois
//    disso (a escolha, automática ou manual, fica guardada em
//    localStorage `nl_idioma_escolhido`). Rastreadores/bots nunca são
//    redirecionados.
// 2) Monta em JS os itens do menu suspenso "idioma-seletor" do
//    cabeçalho — em vez de repetir os 3 <a> em cada uma das 105 páginas
//    públicas, o menu nasce vazio no HTML e é preenchido por aqui, um
//    lugar só de manter.
//
// O site só existe de verdade em 3 idiomas (PT/EN/ES, por decisão do
// dono do projeto — não há conteúdo traduzido pra mais nenhuma língua),
// então o seletor lista só esses 3.
// ============================================================
(function () {
  var CONTEUDO_SITE = ['pt', 'en', 'es'];
  var NOMES_SITE = { pt: 'Português', en: 'English', es: 'Español' };
  var BANDEIRAS_SITE = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' };

  function idiomaDoNavegador() {
    var bruto = (navigator.languages && navigator.languages[0]) || navigator.language || 'pt';
    bruto = bruto.toLowerCase();
    if (bruto.indexOf('pt') === 0) return 'pt';
    if (bruto.indexOf('es') === 0) return 'es';
    return 'en';
  }

  function idiomaDaPagina() {
    var p = location.pathname;
    if (/-en\.html$/.test(p)) return 'en';
    if (/-es\.html$/.test(p)) return 'es';
    return 'pt';
  }

  // Constrói a URL da versão num idioma, a partir da URL atual — funciona
  // em qualquer página (pasta com index.html, index.html explícito, ou
  // página solta tipo /legal/termos.html), sem precisar listar rotas.
  function urlNoIdioma(idioma) {
    var p = location.pathname;
    if (/-en\.html$/.test(p) || /-es\.html$/.test(p)) {
      var base = p.replace(/-(en|es)\.html$/, '');
      return idioma === 'pt' ? base + '.html' : base + '-' + idioma + '.html';
    }
    if (/index\.html$/.test(p)) {
      if (idioma === 'pt') return p;
      return p.replace(/index\.html$/, 'index-' + idioma + '.html');
    }
    if (p.charAt(p.length - 1) === '/') {
      return idioma === 'pt' ? p : p + 'index-' + idioma + '.html';
    }
    if (/\.html$/.test(p)) {
      if (idioma === 'pt') return p;
      return p.replace(/\.html$/, '-' + idioma + '.html');
    }
    return null;
  }

  function redirecionamentoAutomatico() {
    if (/bot|spider|crawl|slurp|facebookexternalhit|googlebot|bingbot|duckduckbot|baiduspider|yandex|ia_archiver|lighthouse/i.test(navigator.userAgent)) return;
    var jaEscolheu;
    try { jaEscolheu = localStorage.getItem('nl_idioma_escolhido'); } catch (e) { return; }
    if (jaEscolheu) return;

    var atual = idiomaDaPagina();
    var detectado = idiomaDoNavegador();
    if (detectado === atual) return;
    var destino = urlNoIdioma(detectado);
    if (!destino) return;
    try { localStorage.setItem('nl_idioma_escolhido', detectado); } catch (e) {}
    location.replace(destino + location.search + location.hash);
  }

  function escaparHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function montarMenu(menu, idiomaAtual) {
    var checkSvg = '<svg class="idioma-check" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7L5.5 10.5L12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var html = '';
    CONTEUDO_SITE.forEach(function (cod) {
      var href = urlNoIdioma(cod);
      var atual = cod === idiomaAtual;
      html += '<a href="' + escaparHtml(href) + '" class="idioma-item' + (atual ? ' atual' : '') + '" data-idioma-link="' + cod + '" role="menuitem" lang="' + cod + '">' +
        '<span class="idioma-bandeira">' + BANDEIRAS_SITE[cod] + '</span>' + NOMES_SITE[cod] +
        (atual ? checkSvg : '') + '</a>';
    });
    menu.innerHTML = html;
  }

  function iniciarMenu() {
    var raiz = document.getElementById('idioma-seletor');
    if (!raiz) return;
    var btn = document.getElementById('idioma-btn');
    var menu = document.getElementById('idioma-menu');
    if (!btn || !menu) return;

    montarMenu(menu, idiomaDaPagina());

    function fechar() {
      raiz.classList.remove('aberto');
      btn.setAttribute('aria-expanded', 'false');
    }
    function abrir() {
      raiz.classList.add('aberto');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (raiz.classList.contains('aberto')) fechar(); else abrir();
    });
    document.addEventListener('click', function (e) {
      if (!raiz.contains(e.target)) fechar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && raiz.classList.contains('aberto')) {
        fechar();
        btn.focus();
      }
    });

    menu.addEventListener('click', function (e) {
      var a = e.target.closest('[data-idioma-link]');
      if (!a) return;
      try { localStorage.setItem('nl_idioma_escolhido', a.getAttribute('data-idioma-link')); } catch (err) {}
    });
  }

  redirecionamentoAutomatico();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMenu);
  } else {
    iniciarMenu();
  }
})();
