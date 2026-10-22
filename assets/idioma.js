// ============================================================
// SELETOR DE IDIOMA — NextLevel
// Duas responsabilidades, no mesmo arquivo pra carregar uma vez só:
//
// 1) Detecta o idioma do navegador do visitante e redireciona pra versão
//    certa da página (PT/EN/ES) na primeira visita — nunca de novo depois
//    disso, seja porque o redirecionamento já aconteceu uma vez ou porque a
//    pessoa clicou manualmente num idioma no menu. A escolha fica guardada
//    em localStorage (`nl_idioma_escolhido`). Rastreadores/bots são
//    ignorados (nunca redireciona um crawler).
// 2) Liga o menu suspenso "idioma-seletor" (abrir/fechar, teclado, clique
//    fora) que existe no cabeçalho de toda página pública.
// ============================================================
(function () {
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

  function iniciarMenu() {
    var raiz = document.getElementById('idioma-seletor');
    if (!raiz) return;
    var btn = document.getElementById('idioma-btn');
    var menu = document.getElementById('idioma-menu');
    if (!btn || !menu) return;

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
    raiz.querySelectorAll('[data-idioma-link]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { localStorage.setItem('nl_idioma_escolhido', a.getAttribute('data-idioma-link')); } catch (e) {}
      });
    });
  }

  redirecionamentoAutomatico();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMenu);
  } else {
    iniciarMenu();
  }
})();
