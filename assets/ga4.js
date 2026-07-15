// ============================================================
// GOOGLE ANALYTICS 4 — NextLevel
// Mesma regra do Pixel do Meta: só liga depois que o visitante ACEITA
// os cookies (banner em /assets/consent.js chama window.iniciarGA4()).
// Enquanto window.SITE.gaId estiver 'COLE_AQUI' (config-global.js),
// esta função não faz nada — carregar um ID de verdade já ativa tudo,
// sem precisar mexer em mais nenhuma página.
// ============================================================
(function () {
  var GA_ATIVO = window.SITE && window.SITE.gaId && window.SITE.gaId !== 'COLE_AQUI';

  window.iniciarGA4 = function () {
    if (!GA_ATIVO || window.__ga4On) return;
    window.__ga4On = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(window.SITE.gaId);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', window.SITE.gaId);
  };
})();
