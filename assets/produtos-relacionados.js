// ============================================================
// "VOCÊ TAMBÉM PODE GOSTAR" — NextLevel
// Cross-sell nas páginas de produto: mostra os 3 produtos mais
// correlacionados (campo `relacionados` de cada produto em
// /assets/produtos.js, curado à mão por proximidade de tema — não é
// só "mesma categoria"). Se um produto ainda não tiver curadoria (ou
// algum relacionado tiver saído do catálogo/ficado indisponível), cai
// de volta pra qualquer outro da mesma categoria, como rede de
// segurança. Não faz nada se não sobrar nenhum produto pra mostrar.
// ============================================================
(function () {
  var TEXTOS = {
    pt: { titulo: 'Você também pode gostar', tag: null },
    en: { titulo: 'You might also like', tag: null },
    es: { titulo: 'También te puede gustar', tag: null },
  };

  function iniciar() {
    var container = document.getElementById('nl-relacionados-container');
    // CONFIG é `const` de topo de página (não vira window.CONFIG, mas fica
    // acessível como identificador — mesmo escopo de script compartilhado
    // entre todo <script> clássico da mesma página).
    if (!container || !window.PRODUTOS_SITE || typeof CONFIG === 'undefined') return;

    var idioma = ['pt', 'en', 'es'].indexOf(CONFIG.idioma) !== -1 ? CONFIG.idioma : 'pt';
    var partes = location.pathname.split('/').filter(Boolean);
    var slugAtual = partes[0] === 'produtos' ? partes[1] : null;
    if (!slugAtual) return;

    var lista = window.PRODUTOS_SITE;
    var porSlug = {};
    lista.forEach(function (p) { porSlug[p.slug] = p; });
    var atual = porSlug[slugAtual];
    if (!atual) return;

    // 1ª tentativa: os relacionados curados à mão (mais precisos que "mesma
    // categoria" — evita, por exemplo, mostrar ganho de massa pra quem está
    // vendo emagrecimento só porque os dois são "Saúde e Fitness").
    var escolhidos = (atual.relacionados || [])
      .map(function (slug) { return porSlug[slug]; })
      .filter(function (p) { return p && p.slug !== slugAtual && p.disponivel; });

    // Rede de segurança: completa (ou substitui, se não houver curadoria)
    // com outros produtos da mesma categoria, caso a curadoria esteja
    // incompleta ou algum relacionado tenha saído do catálogo.
    if (escolhidos.length < 3) {
      var jaEscolhidos = {};
      escolhidos.forEach(function (p) { jaEscolhidos[p.slug] = true; });
      var extras = lista.filter(function (p) {
        return p.slug !== slugAtual && p.categoria === atual.categoria && p.disponivel && !jaEscolhidos[p.slug];
      });
      extras.sort(function (a, b) { return (b.novo ? 1 : 0) - (a.novo ? 1 : 0); });
      escolhidos = escolhidos.concat(extras).slice(0, 3);
    }
    if (!escolhidos.length) return;

    var sufixo = idioma === 'pt' ? '' : ('index-' + idioma + '.html');
    var t = TEXTOS[idioma];

    var estilo = document.createElement('style');
    estilo.textContent = [
      '.nl-relacionados{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:34px}',
      '@media(max-width:800px){.nl-relacionados{grid-template-columns:1fr}}',
      '.nl-relacionados-card{display:block;text-decoration:none;background:#fff;border-radius:14px;overflow:hidden;',
      'border:1px solid rgba(13,27,42,.08);box-shadow:0 4px 18px rgba(15,118,110,.08);transition:transform .2s ease, box-shadow .2s ease}',
      '.nl-relacionados-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(15,118,110,.16)}',
      '.nl-relacionados-card img{width:100%;aspect-ratio:400/565;object-fit:cover;display:block}',
      '.nl-relacionados-card .corpo{padding:16px 18px}',
      '.nl-relacionados-card h4{font-family:"Poppins",Arial,sans-serif;font-size:15px;color:#0d1b2a;margin:0 0 4px;line-height:1.3}',
      '.nl-relacionados-card p{font-family:Arial,sans-serif;font-size:12.5px;color:#5b6b68;margin:0;line-height:1.5}',
      '[data-tema="escuro"] .nl-relacionados-card{background:#132a3e;border-color:rgba(94,234,212,.14);box-shadow:0 4px 18px rgba(0,0,0,.35)}',
      '[data-tema="escuro"] .nl-relacionados-card:hover{box-shadow:0 10px 28px rgba(20,184,166,.18)}',
      '[data-tema="escuro"] .nl-relacionados-card h4{color:#fff}',
      '[data-tema="escuro"] .nl-relacionados-card p{color:#b7d5cf}',
    ].join('');
    document.head.appendChild(estilo);

    var cardsHtml = escolhidos.map(function (p) {
      var titulo = p.titulo[idioma];
      return '<a class="nl-relacionados-card" href="/produtos/' + p.slug + '/' + sufixo + '">' +
        '<img src="/assets/produtos/' + p.slug + '/thumb-' + idioma + '.jpg" alt="' + titulo + '" loading="lazy">' +
        '<div class="corpo"><h4>' + titulo + '</h4><p>' + p.resumo[idioma] + '</p></div>' +
        '</a>';
    }).join('');

    container.innerHTML =
      '<section class="section" id="relacionados-secao">' +
      '<div class="container">' +
      '<h3>' + t.titulo + '</h3>' +
      '<div class="nl-relacionados">' + cardsHtml + '</div>' +
      '</div>' +
      '</section>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
