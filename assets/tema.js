// ============================================================
// TEMA CLARO/ESCURO — NextLevel
// Roda o mais cedo possível no <head> (antes do <style>) pra evitar
// flash do tema errado. Padrão é "claro" (combina com os e-mails,
// que usam fundo claro por compatibilidade de renderização).
// Preferência salva em localStorage; alternância via .tema-toggle.
// ============================================================
(function () {
  function ler() {
    try {
      return localStorage.getItem('nl-tema') === 'escuro' ? 'escuro' : 'claro';
    } catch (e) {
      return 'claro';
    }
  }

  function aplicar(tema) {
    document.documentElement.setAttribute('data-tema', tema);
  }

  aplicar(ler());

  function atualizarBotoes() {
    var tema = document.documentElement.getAttribute('data-tema');
    var ICO = window.ICONS || {};
    document.querySelectorAll('.tema-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', tema === 'escuro' ? 'true' : 'false');
      btn.innerHTML = tema === 'escuro' ? (ICO.sun || '☀️') : (ICO.moon || '🌙');
    });
  }

  window.NL_TEMA_ALTERNAR = function () {
    var novo = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
    aplicar(novo);
    try {
      localStorage.setItem('nl-tema', novo);
    } catch (e) {}
    atualizarBotoes();
  };

  document.addEventListener('DOMContentLoaded', atualizarBotoes);
})();
