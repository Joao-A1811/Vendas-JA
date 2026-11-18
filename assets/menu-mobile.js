// Menu do celular da home: botão ☰ no cabeçalho que abre os mesmos links do
// menu do computador (Catálogo, Categorias, Como funciona, Material gratuito).
(function () {
  'use strict';
  function montar() {
    var topo = document.querySelector('header.topo:not(.interno)');
    var menu = topo && topo.querySelector('nav.menu');
    if (!menu || topo.querySelector('.nl-menu-btn')) return;
    var idioma = document.documentElement.lang || 'pt';
    var rotulo = /^en/.test(idioma) ? 'Menu' : 'Menu';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nl-menu-btn';
    btn.setAttribute('aria-label', rotulo);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    topo.querySelector('.container').appendChild(btn);
    function fechar() { topo.classList.remove('nl-menu-aberto'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var aberto = topo.classList.toggle('nl-menu-aberto');
      btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fechar(); });
    document.addEventListener('click', function (e) { if (!topo.contains(e.target)) fechar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
