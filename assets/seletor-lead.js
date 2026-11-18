// Seletor de tema elegante para o formulário de material gratuito da home.
// Substitui visualmente o <select id="lead-objetivo"> por uma lista própria,
// mas mantém o <select> original (escondido) sincronizado — o envio do
// formulário continua lendo document.getElementById('lead-objetivo').value.
(function () {
  'use strict';
  var ICONES = {
    'treino-em-casa': '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    'confianca-social': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    'financas-pessoais': '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.6-.6-3.1-1.6M12 6v2M12 16v2"/>',
    'ia-aplicada': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  };
  function icone(v) {
    return '<svg class="nl-sel-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONES[v] || '<circle cx="12" cy="12" r="9"/>') + '</svg>';
  }
  function partes(txt) {
    var i = txt.indexOf(' — ');
    return i === -1 ? { t: txt, s: '' } : { t: txt.slice(0, i), s: txt.slice(i + 3) };
  }

  function montar() {
    var sel = document.getElementById('lead-objetivo');
    if (!sel || sel.dataset.nlSel) return;
    sel.dataset.nlSel = '1';

    var caixa = document.createElement('div');
    caixa.className = 'nl-sel';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nl-sel-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', sel.getAttribute('aria-label') || '');
    var lista = document.createElement('ul');
    lista.className = 'nl-sel-lista';
    lista.setAttribute('role', 'listbox');
    lista.tabIndex = -1;

    var itens = [];
    Array.prototype.forEach.call(sel.options, function (op, i) {
      var p = partes(op.textContent);
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.dataset.i = i;
      li.innerHTML = icone(op.value) + '<span class="nl-sel-txt"><b>' + p.t + '</b>' +
        (p.s ? '<small>' + p.s + '</small>' : '') + '</span>' +
        '<svg class="nl-sel-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
      li.addEventListener('click', function () { escolher(i); fechar(true); });
      lista.appendChild(li);
      itens.push(li);
    });

    var ativo = sel.selectedIndex;
    function atualizar() {
      var op = sel.options[sel.selectedIndex];
      var p = partes(op.textContent);
      btn.innerHTML = icone(op.value) + '<span class="nl-sel-txt"><b>' + p.t + '</b>' +
        (p.s ? '<small>' + p.s + '</small>' : '') + '</span>' +
        '<svg class="nl-sel-seta" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      itens.forEach(function (li, i) { li.setAttribute('aria-selected', i === sel.selectedIndex ? 'true' : 'false'); });
    }
    function marcarAtivo(i) {
      ativo = i;
      itens.forEach(function (li, j) { li.classList.toggle('nl-sel-foco', j === i); });
    }
    function escolher(i) {
      sel.selectedIndex = i;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      atualizar();
    }
    function abrir() {
      caixa.classList.add('aberto');
      btn.setAttribute('aria-expanded', 'true');
      marcarAtivo(sel.selectedIndex);
      lista.focus({ preventScroll: true });
    }
    function fechar(foco) {
      caixa.classList.remove('aberto');
      btn.setAttribute('aria-expanded', 'false');
      if (foco) btn.focus({ preventScroll: true });
    }

    btn.addEventListener('click', function () { caixa.classList.contains('aberto') ? fechar(false) : abrir(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(); }
    });
    lista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); marcarAtivo(Math.min(itens.length - 1, ativo + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); marcarAtivo(Math.max(0, ativo - 1)); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); escolher(ativo); fechar(true); }
      else if (e.key === 'Escape' || e.key === 'Tab') { fechar(e.key === 'Escape'); }
    });
    document.addEventListener('click', function (e) { if (!caixa.contains(e.target)) fechar(false); });
    sel.addEventListener('change', atualizar);

    sel.classList.add('nl-sel-nativo');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');
    sel.parentNode.insertBefore(caixa, sel);
    caixa.appendChild(btn);
    caixa.appendChild(lista);
    caixa.appendChild(sel);
    atualizar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
