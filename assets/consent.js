// ============================================================
// BANNER DE CONSENTIMENTO DE COOKIES — NextLevel
// O Pixel do Meta só é ativado depois que o visitante aceita.
// A escolha fica salva no navegador (localStorage) e o banner
// não aparece de novo. Recusar não quebra nada: a página, o
// formulário e a entrega do ebook continuam funcionando.
//
// As páginas que usam Pixel definem window.iniciarPixel() e
// carregam este arquivo. O idioma vem do atributo lang do HTML.
// ============================================================
(function () {
  var CHAVE = 'nl-consentimento';
  var escolha = null;
  try { escolha = localStorage.getItem(CHAVE); } catch (e) { /* navegação privada */ }

  if (escolha === 'sim' && window.iniciarPixel) { window.iniciarPixel(); return; }
  if (escolha === 'nao') return;

  var lang = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();
  var T = {
    pt: {
      texto: 'Usamos cookies de medição (Pixel do Meta) para entender como você chegou até aqui e melhorar nossos anúncios. Você aceita?',
      politica: 'Política de privacidade',
      linkPolitica: '/legal/privacidade.html',
      aceitar: 'Aceitar',
      recusar: 'Recusar'
    },
    en: {
      texto: 'We use measurement cookies (Meta Pixel) to understand how you found us and improve our ads. Do you accept?',
      politica: 'Privacy policy',
      linkPolitica: '/legal/privacidade-en.html',
      aceitar: 'Accept',
      recusar: 'Decline'
    },
    es: {
      texto: 'Usamos cookies de medición (Píxel de Meta) para entender cómo llegaste hasta aquí y mejorar nuestros anuncios. ¿Aceptas?',
      politica: 'Política de privacidad',
      linkPolitica: '/legal/privacidade-es.html',
      aceitar: 'Aceptar',
      recusar: 'Rechazar'
    }
  };
  var t = T[lang] || T.pt;

  var css = document.createElement('style');
  css.textContent =
    '#nl-consent{position:fixed;left:14px;right:14px;bottom:14px;z-index:99;background:#fff;border:1px solid #eee2f7;' +
    'border-radius:14px;box-shadow:0 10px 40px rgba(28,20,40,.18);padding:16px 18px;max-width:560px;margin:0 auto;' +
    'font-family:Inter,Arial,sans-serif;font-size:13.5px;color:#1c1428;line-height:1.5}' +
    '#nl-consent a{color:#5b21b6;font-weight:600}' +
    '#nl-consent .nl-botoes{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}' +
    '#nl-consent button{cursor:pointer;border:none;border-radius:9px;padding:9px 20px;font-size:13.5px;font-weight:700;font-family:inherit}' +
    '#nl-consent .nl-sim{background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#2b1a00}' +
    '#nl-consent .nl-nao{background:#f4effc;color:#5b21b6}';

  var box = document.createElement('div');
  box.id = 'nl-consent';
  box.setAttribute('role', 'dialog');
  box.innerHTML =
    '<span>' + t.texto + ' <a href="' + t.linkPolitica + '" target="_blank" rel="noopener">' + t.politica + '</a></span>' +
    '<div class="nl-botoes">' +
    '<button type="button" class="nl-sim">' + t.aceitar + '</button>' +
    '<button type="button" class="nl-nao">' + t.recusar + '</button>' +
    '</div>';

  function guardar(valor) {
    try { localStorage.setItem(CHAVE, valor); } catch (e) { /* sem armazenamento, só fecha */ }
    box.remove();
  }

  function montar() {
    document.head.appendChild(css);
    document.body.appendChild(box);
    box.querySelector('.nl-sim').addEventListener('click', function () {
      guardar('sim');
      if (window.iniciarPixel) window.iniciarPixel();
    });
    box.querySelector('.nl-nao').addEventListener('click', function () { guardar('nao'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
