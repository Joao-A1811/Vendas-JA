// Barra de compra fixa das páginas de produto (cartão flutuante, sempre visível).
// Reaproveita o #barra-fixa que cada página já tem e o preenche com capa, nome,
// preço antigo, preço novo e % de desconto — lidos da própria página, sem nada
// a manter por produto. Mexer aqui muda as 90 páginas de produto.
(function () {
  'use strict';
  function montar() {
    var barra = document.getElementById('barra-fixa');
    var btn = document.getElementById('barra-btn');
    if (!barra || !btn || barra.dataset.nlBarra) return;
    barra.dataset.nlBarra = '1';

    var p = location.pathname;
    var idioma = /-en\.html$/.test(p) ? 'en' : /-es\.html$/.test(p) ? 'es' : 'pt';
    var m = p.match(/\/produtos\/([^/]+)\//);
    var slug = m ? m[1] : null;

    function txt(id) { var e = document.getElementById(id); return e ? e.textContent.trim() : ''; }
    var nome = txt('oferta-produto') || txt('barra-produto');
    var por = txt('barra-preco');
    var de = txt('oferta-preco-de').replace(/^\s*(De|Was|Antes)\s+/i, '');

    function num(s) {
      var t = String(s).replace(/[^\d.,]/g, '');
      if (t.indexOf(',') > -1) t = t.replace(/\./g, '').replace(',', '.');
      return parseFloat(t);
    }
    var pct = (de && por && num(de) > num(por)) ? Math.round((1 - num(por) / num(de)) * 100) : 0;

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    var esquerda = document.createElement('div');
    esquerda.className = 'nl-bc-esq';
    esquerda.innerHTML =
      (slug ? '<img class="nl-bc-capa" src="/assets/produtos/' + esc(slug) + '/thumb-' + idioma + '.jpg" alt="" width="400" height="565" decoding="async">' : '') +
      '<div class="nl-bc-txt"><span class="nl-bc-nome">' + esc(nome) + '</span>' +
      '<span class="nl-bc-pr">' + (de ? '<s>' + esc(de) + '</s>' : '') + '<b>' + esc(por) + '</b>' +
      (pct ? '<i>-' + pct + '%</i>' : '') + '</span></div>';

    var cont = barra.querySelector('.container') || barra;
    var info = cont.querySelector('.info');
    if (info) info.style.display = 'none';
    cont.insertBefore(esquerda, cont.firstChild);
    barra.classList.add('nl-bc', 'on');
    // A página tira o "on" quando o visitante volta ao topo: aqui ele fica sempre.
    new MutationObserver(function () {
      if (!barra.classList.contains('on')) barra.classList.add('on');
    }).observe(barra, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
