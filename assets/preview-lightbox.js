// ============================================================
// LIGHTBOX DA GALERIA "OLHE POR DENTRO" — NextLevel
// Intercepta os links de assets/produtos/<slug>/preview-*.jpg dentro de
// .preview-galeria e abre um visualizador dentro da própria página, com
// seta anterior/próxima, teclado e clique fora pra fechar — em vez de abrir
// a imagem em outra aba. Um script só, incluído em toda página de produto;
// não faz nada se a página não tiver .preview-galeria.
// ============================================================
(function () {
  function iniciar() {
    var galerias = document.querySelectorAll('.preview-galeria');
    if (!galerias.length) return;

    var itens = [];
    galerias.forEach(function (galeria) {
      galeria.querySelectorAll('a').forEach(function (link) {
        var img = link.querySelector('img');
        if (!img) return;
        var indice = itens.length;
        itens.push({ src: link.getAttribute('href') || img.src, alt: img.getAttribute('alt') || '' });
        link.addEventListener('click', function (e) {
          e.preventDefault();
          abrir(indice, link);
        });
      });
    });
    if (!itens.length) return;

    var estilo = document.createElement('style');
    estilo.textContent = [
      '.nl-lightbox{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;',
      'background:rgba(8,14,24,.92);padding:24px;box-sizing:border-box}',
      '.nl-lightbox.on{display:flex}',
      '.nl-lightbox-fig{position:relative;max-width:min(900px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center}',
      '.nl-lightbox-fig img{max-width:100%;max-height:78vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:block}',
      '.nl-lightbox-legenda{color:#cbd5e1;font-family:Arial,sans-serif;font-size:14px;margin-top:14px;text-align:center;max-width:600px}',
      '.nl-lightbox-contador{color:#5eead4;font-family:Arial,sans-serif;font-size:12px;letter-spacing:.5px;margin-top:6px}',
      '.nl-lightbox-fechar,.nl-lightbox-seta{position:fixed;z-index:2;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);',
      'color:#f0f4f8;border-radius:50%;width:46px;height:46px;display:flex;align-items:center;justify-content:center;',
      'cursor:pointer;font-size:20px;line-height:1;transition:background .15s ease}',
      '.nl-lightbox-fechar:hover,.nl-lightbox-seta:hover{background:rgba(255,255,255,.18)}',
      '.nl-lightbox-fechar{top:20px;right:20px}',
      '.nl-lightbox-seta.prev{left:20px;top:50%;transform:translateY(-50%)}',
      '.nl-lightbox-seta.next{right:20px;top:50%;transform:translateY(-50%)}',
      '@media(max-width:640px){.nl-lightbox-seta{width:40px;height:40px;font-size:17px}',
      '.nl-lightbox-seta.prev{left:8px}.nl-lightbox-seta.next{right:8px}.nl-lightbox-fechar{top:10px;right:10px}}',
    ].join('');
    document.head.appendChild(estilo);

    var overlay = document.createElement('div');
    overlay.className = 'nl-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button type="button" class="nl-lightbox-fechar" aria-label="Fechar">✕</button>' +
      '<button type="button" class="nl-lightbox-seta prev" aria-label="Anterior">‹</button>' +
      '<button type="button" class="nl-lightbox-seta next" aria-label="Próxima">›</button>' +
      '<div class="nl-lightbox-fig">' +
        '<img alt="">' +
        '<div class="nl-lightbox-legenda"></div>' +
        '<div class="nl-lightbox-contador"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var elImg = overlay.querySelector('img');
    var elLegenda = overlay.querySelector('.nl-lightbox-legenda');
    var elContador = overlay.querySelector('.nl-lightbox-contador');
    var btnFechar = overlay.querySelector('.nl-lightbox-fechar');
    var btnPrev = overlay.querySelector('.prev');
    var btnNext = overlay.querySelector('.next');

    var atual = 0;
    var gatilho = null;

    function render() {
      var item = itens[atual];
      elImg.src = item.src;
      elImg.alt = item.alt;
      elLegenda.textContent = item.alt;
      elContador.textContent = (atual + 1) + ' / ' + itens.length;
    }

    function abrir(indice, origem) {
      atual = indice;
      gatilho = origem || null;
      render();
      overlay.classList.add('on');
      document.body.style.overflow = 'hidden';
      btnFechar.focus();
    }

    function fechar() {
      overlay.classList.remove('on');
      document.body.style.overflow = '';
      if (gatilho) gatilho.focus();
    }

    function anterior() { atual = (atual - 1 + itens.length) % itens.length; render(); }
    function proxima() { atual = (atual + 1) % itens.length; render(); }

    btnFechar.addEventListener('click', fechar);
    btnPrev.addEventListener('click', anterior);
    btnNext.addEventListener('click', proxima);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) fechar();
    });
    var focaveis = [btnFechar, btnPrev, btnNext];

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('on')) return;
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key === 'ArrowLeft') { anterior(); return; }
      if (e.key === 'ArrowRight') { proxima(); return; }
      if (e.key !== 'Tab') return;
      // Prisão de foco: enquanto o lightbox estiver aberto, Tab/Shift+Tab
      // circula só entre os botões dele — nunca escapa pro conteúdo atrás.
      e.preventDefault();
      var atualIndice = focaveis.indexOf(document.activeElement);
      var proximoIndice = e.shiftKey
        ? (atualIndice <= 0 ? focaveis.length - 1 : atualIndice - 1)
        : (atualIndice === -1 || atualIndice === focaveis.length - 1 ? 0 : atualIndice + 1);
      focaveis[proximoIndice].focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
