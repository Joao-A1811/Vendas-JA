// ============================================================
// SELETOR DE IDIOMA — NextLevel
// Três responsabilidades, no mesmo arquivo pra carregar uma vez só:
//
// 1) Detecta o idioma/local do navegador do visitante e redireciona pra
//    versão certa da página na primeira visita — nunca de novo depois
//    disso (a escolha, automática ou manual, fica guardada em
//    localStorage `nl_idioma_escolhido`). Rastreadores/bots nunca são
//    redirecionados.
// 2) Monta em JS a lista completa de idiomas do mundo dentro do menu
//    suspenso "idioma-seletor" do cabeçalho — em vez de repetir ~100
//    itens no HTML de cada uma das 105 páginas públicas, o menu nasce
//    vazio no HTML e é preenchido por aqui, uma função só de manter.
// 3) O SITE só existe de verdade em 3 idiomas (pt/en/es — CONTEUDO_SITE).
//    Qualquer outro idioma da lista grande é só pra o visitante se sentir
//    em casa ao abrir o menu; ao clicar, sempre cai numa dessas 3 versões
//    reais (pt/es quando bate exatamente, inglês pra todos os outros).
// ============================================================
(function () {
  var CONTEUDO_SITE = ['pt', 'en', 'es'];

  // Idiomas do mundo pro menu — código, nome nativo, bandeira
  // representativa e um "apelido" em letras latinas (nome em
  // português/inglês + variações comuns) só pra busca funcionar mesmo
  // quando a pessoa digita em vez de reconhecer a escrita nativa (ex:
  // buscar "japones" ou "japan" encontra 日本語). Cobre os principais
  // idiomas nacionais/oficiais do mundo; dialetos/variantes regionais
  // sem um país "dono" claro (ex: catalão, curdo, tibetano) foram
  // deixados de fora de propósito, pra não entrar em território
  // sensível sem necessidade. pt/en/es NÃO entram aqui — já aparecem
  // fixos no topo do menu.
  var IDIOMAS_MUNDO = [
    ['af', 'Afrikaans', '🇿🇦', 'afrikaans'], ['sq', 'Shqip', '🇦🇱', 'albanes albanian'],
    ['am', 'አማርኛ', '🇪🇹', 'amarico amharic etiope'], ['ar', 'العربية', '🇸🇦', 'arabe arabic'],
    ['hy', 'Հայերեն', '🇦🇲', 'armenio armenian'], ['az', 'Azərbaycan dili', '🇦🇿', 'azerbaijano azerbaijani'],
    ['be', 'Беларуская', '🇧🇾', 'bielorusso belarusian'], ['bn', 'বাংলা', '🇧🇩', 'bengali bangla'],
    ['bs', 'Bosanski', '🇧🇦', 'bosnio bosnian'], ['bg', 'Български', '🇧🇬', 'bulgaro bulgarian'],
    ['my', 'မြန်မာဘာသာ', '🇲🇲', 'birmanes burmese myanmar'], ['zh', '中文', '🇨🇳', 'chines chinese mandarim mandarin'],
    ['zh-TW', '繁體中文', '🇹🇼', 'chines tradicional traditional chinese taiwan'], ['hr', 'Hrvatski', '🇭🇷', 'croata croatian'],
    ['cs', 'Čeština', '🇨🇿', 'tcheco checo czech'], ['da', 'Dansk', '🇩🇰', 'dinamarques danish'],
    ['nl', 'Nederlands', '🇳🇱', 'holandes dutch neerlandes'], ['et', 'Eesti', '🇪🇪', 'estonio estonian'],
    ['fi', 'Suomi', '🇫🇮', 'finlandes finnish'], ['fr', 'Français', '🇫🇷', 'frances french'],
    ['ka', 'ქართული', '🇬🇪', 'georgiano georgian'], ['de', 'Deutsch', '🇩🇪', 'alemao german'],
    ['el', 'Ελληνικά', '🇬🇷', 'grego greek'], ['gu', 'ગુજરાતી', '🇮🇳', 'guzerate gujarati'],
    ['ht', 'Kreyòl Ayisyen', '🇭🇹', 'crioulo haitiano haitian creole'], ['ha', 'Hausa', '🇳🇬', 'hauca hausa'],
    ['he', 'עברית', '🇮🇱', 'hebraico hebrew'], ['hi', 'हिन्दी', '🇮🇳', 'hindi'],
    ['hu', 'Magyar', '🇭🇺', 'hungaro hungarian magiar'], ['is', 'Íslenska', '🇮🇸', 'islandes icelandic'],
    ['ig', 'Igbo', '🇳🇬', 'igbo'], ['id', 'Bahasa Indonesia', '🇮🇩', 'indonesio indonesian'],
    ['ga', 'Gaeilge', '🇮🇪', 'irlandes irish gaelico'], ['it', 'Italiano', '🇮🇹', 'italiano italian'],
    ['ja', '日本語', '🇯🇵', 'japones japanese japan'], ['jv', 'Basa Jawa', '🇮🇩', 'javanes javanese'],
    ['kn', 'ಕನ್ನಡ', '🇮🇳', 'canares kannada'], ['kk', 'Қазақ тілі', '🇰🇿', 'cazaque kazakh'],
    ['km', 'ភាសាខ្មែរ', '🇰🇭', 'khmer cambojano cambodian'], ['ko', '한국어', '🇰🇷', 'coreano korean korea'],
    ['ky', 'Кыргызча', '🇰🇬', 'quirguiz kyrgyz'], ['lo', 'ລາວ', '🇱🇦', 'laociano lao laos'],
    ['lv', 'Latviešu', '🇱🇻', 'letao latvian'], ['lt', 'Lietuvių', '🇱🇹', 'lituano lithuanian'],
    ['lb', 'Lëtzebuergesch', '🇱🇺', 'luxemburgues luxembourgish'], ['mk', 'Македонски', '🇲🇰', 'macedonio macedonian'],
    ['mg', 'Malagasy', '🇲🇬', 'malgaxe malagasy madagascar'], ['ms', 'Bahasa Melayu', '🇲🇾', 'malaio malay malaysia'],
    ['ml', 'മലയാളം', '🇮🇳', 'malaiala malayalam'], ['mt', 'Malti', '🇲🇹', 'maltes maltese'],
    ['mi', 'Māori', '🇳🇿', 'maori'], ['mr', 'मराठी', '🇮🇳', 'marata marathi'],
    ['mn', 'Монгол', '🇲🇳', 'mongol mongolian'], ['ne', 'नेपाली', '🇳🇵', 'nepales nepali'],
    ['no', 'Norsk', '🇳🇴', 'norueguês norueges norwegian'], ['pa', 'ਪੰਜਾਬੀ', '🇮🇳', 'panjabi punjabi'],
    ['fa', 'فارسی', '🇮🇷', 'persa farsi persian iraniano'], ['pl', 'Polski', '🇵🇱', 'polones polish'],
    ['ro', 'Română', '🇷🇴', 'romeno romanian'], ['ru', 'Русский', '🇷🇺', 'russo russian'],
    ['sm', 'Gagana Sāmoa', '🇼🇸', 'samoano samoan'], ['sr', 'Српски', '🇷🇸', 'servio serbio serbian'],
    ['sk', 'Slovenčina', '🇸🇰', 'eslovaco slovak'], ['sl', 'Slovenščina', '🇸🇮', 'esloveno slovenian'],
    ['so', 'Af-Soomaali', '🇸🇴', 'somali somalio somalian'], ['sw', 'Kiswahili', '🇰🇪', 'suaili swahili'],
    ['sv', 'Svenska', '🇸🇪', 'sueco swedish'], ['tl', 'Filipino', '🇵🇭', 'filipino tagalog'],
    ['ta', 'தமிழ்', '🇮🇳', 'tamil'], ['te', 'తెలుగు', '🇮🇳', 'telugo telugu'],
    ['th', 'ไทย', '🇹🇭', 'tailandes thai tailandia'], ['tr', 'Türkçe', '🇹🇷', 'turco turkish'],
    ['uk', 'Українська', '🇺🇦', 'ucraniano ukrainian'], ['ur', 'اردو', '🇵🇰', 'urdu'],
    ['uz', 'Oʻzbekcha', '🇺🇿', 'usbeque uzbek'], ['vi', 'Tiếng Việt', '🇻🇳', 'vietnamita vietnamese'],
    ['cy', 'Cymraeg', '🏴', 'gales welsh'], ['xh', 'isiXhosa', '🇿🇦', 'xhosa'],
    ['yo', 'Yorùbá', '🇳🇬', 'ioruba yoruba'], ['zu', 'isiZulu', '🇿🇦', 'zulu'],
    ['si', 'සිංහල', '🇱🇰', 'cingales sinhala sri lanka'], ['ps', 'پښتو', '🇦🇫', 'pashto pashtun afeganistao'],
    ['ku', 'کوردی', '🇮🇶', 'curdo kurdish'], ['dv', 'ދިވެހި', '🇲🇻', 'divehi maldivas maldivian'],
    ['fy', 'Frysk', '🇳🇱', 'frisao frisian'], ['gl', 'Galego', '🇪🇸', 'galego galician'],
    ['haw', 'ʻŌlelo Hawaiʻi', '🇺🇸', 'havaiano hawaiian'], ['la', 'Latina', '🇻🇦', 'latim latin'],
    ['lu', 'Luganda', '🇺🇬', 'luganda uganda'], ['su', 'Basa Sunda', '🇮🇩', 'sundanes sundanese'],
    ['tg', 'Тоҷикӣ', '🇹🇯', 'tajique tajik'], ['tk', 'Türkmençe', '🇹🇲', 'turcomeno turkmen'],
    ['yi', 'ייִדיש', '🇮🇱', 'idiche yiddish'], ['co', 'Corsu', '🇫🇷', 'corso corsican'],
    ['eo', 'Esperanto', '🌐', 'esperanto'], ['fo', 'Føroyskt', '🇫🇴', 'feroes faroese'],
    ['gd', 'Gàidhlig', '🏴', 'gaelico escoces scottish gaelic'], ['hmn', 'Hmoob', '🇱🇦', 'hmong'],
    ['ny', 'Chichewa', '🇲🇼', 'niania chichewa malawi'], ['sn', 'chiShona', '🇿🇼', 'xona shona zimbabue'],
    ['st', 'Sesotho', '🇱🇸', 'soto sesotho'], ['ceb', 'Cebuano', '🇵🇭', 'cebuano'],
    ['ckb', 'سۆرانی', '🇮🇶', 'curdo sorani kurdish sorani']
  ];

  var TEXTOS = {
    pt: { busca: 'Buscar idioma…', site: 'Idiomas do site', outros: 'Outros idiomas', vazio: 'Nenhum idioma encontrado', aviso: 'Conteúdo disponível em português' },
    en: { busca: 'Search language…', site: 'Site languages', outros: 'Other languages', vazio: 'No language found', aviso: 'Content available in English' },
    es: { busca: 'Buscar idioma…', site: 'Idiomas del sitio', outros: 'Otros idiomas', vazio: 'Ningún idioma encontrado', aviso: 'Contenido disponible en español' },
  };

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

  function normalizar(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function montarMenu(menu, idiomaAtual) {
    var t = TEXTOS[idiomaAtual] || TEXTOS.pt;
    var checkSvg = '<svg class="idioma-check" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7L5.5 10.5L12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var html = '<div class="idioma-busca-wrap"><input type="text" class="idioma-busca" id="idioma-busca" placeholder="' + escaparHtml(t.busca) + '" autocomplete="off" aria-label="' + escaparHtml(t.busca) + '"></div>';
    html += '<div class="idioma-lista" id="idioma-lista">';
    html += '<div class="idioma-grupo-titulo">' + escaparHtml(t.site) + '</div>';

    CONTEUDO_SITE.forEach(function (cod) {
      var href = urlNoIdioma(cod);
      var atual = cod === idiomaAtual;
      html += '<a href="' + escaparHtml(href) + '" class="idioma-item' + (atual ? ' atual' : '') + '" data-idioma-link="' + cod + '" role="menuitem" lang="' + cod + '">' +
        '<span class="idioma-bandeira">' + BANDEIRAS_SITE[cod] + '</span>' + NOMES_SITE[cod] +
        (atual ? checkSvg : '') + '</a>';
    });

    html += '<div class="idioma-divisor"></div>';
    html += '<div class="idioma-grupo-titulo">' + escaparHtml(t.outros) + '</div>';

    var hrefIngles = urlNoIdioma('en');
    IDIOMAS_MUNDO.forEach(function (item) {
      var cod = item[0], nome = item[1], bandeira = item[2], apelido = item[3] || '';
      var busca = normalizar(nome + ' ' + apelido + ' ' + cod);
      html += '<a href="' + escaparHtml(hrefIngles) + '" class="idioma-item idioma-outro" data-idioma-link="en" data-busca="' + escaparHtml(busca) + '" role="menuitem">' +
        '<span class="idioma-bandeira">' + bandeira + '</span>' + escaparHtml(nome) + '</a>';
    });

    html += '</div>';
    html += '<div class="idioma-vazio" id="idioma-vazio" hidden>' + escaparHtml(t.vazio) + '</div>';

    menu.innerHTML = html;
  }

  function iniciarMenu() {
    var raiz = document.getElementById('idioma-seletor');
    if (!raiz) return;
    var btn = document.getElementById('idioma-btn');
    var menu = document.getElementById('idioma-menu');
    if (!btn || !menu) return;

    var idiomaAtual = idiomaDaPagina();
    montarMenu(menu, idiomaAtual);
    var campoBusca = document.getElementById('idioma-busca');
    var lista = document.getElementById('idioma-lista');
    var vazio = document.getElementById('idioma-vazio');

    function fechar() {
      raiz.classList.remove('aberto');
      btn.setAttribute('aria-expanded', 'false');
    }
    // Com a lista mundial o menu ficou largo (260px) — num celular estreito,
    // se ele continuasse "colado" na borda direita do botão (como fazia um
    // menu de 3 itens), vazaria pra fora da tela pela esquerda. Ao abrir,
    // vira position:fixed e a posição é calculada em pixels de viewport,
    // sempre dentro da tela.
    function posicionarMenu() {
      var margem = 10;
      var rBtn = btn.getBoundingClientRect();
      var largura = Math.min(260, window.innerWidth - margem * 2);
      menu.style.position = 'fixed';
      menu.style.width = largura + 'px';
      menu.style.maxWidth = largura + 'px';
      var esquerda = rBtn.right - largura;
      var maxEsquerda = window.innerWidth - largura - margem;
      if (esquerda > maxEsquerda) esquerda = maxEsquerda;
      if (esquerda < margem) esquerda = margem;
      menu.style.left = esquerda + 'px';
      menu.style.right = 'auto';
      menu.style.top = (rBtn.bottom + 8) + 'px';
    }

    function abrir() {
      raiz.classList.add('aberto');
      btn.setAttribute('aria-expanded', 'true');
      posicionarMenu();
      if (campoBusca) {
        campoBusca.value = '';
        aplicarBusca();
        setTimeout(function () { campoBusca.focus(); }, 10);
      }
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

    function aplicarBusca() {
      if (!campoBusca || !lista) return;
      var q = normalizar(campoBusca.value.trim());
      var itens = lista.querySelectorAll('.idioma-item');
      var titulos = lista.querySelectorAll('.idioma-grupo-titulo');
      var algumVisivel = false;
      itens.forEach(function (item) {
        var texto = item.getAttribute('data-busca') || normalizar(item.textContent);
        var bate = !q || texto.indexOf(q) !== -1;
        item.style.display = bate ? '' : 'none';
        if (bate) algumVisivel = true;
      });
      if (q) {
        titulos.forEach(function (tt) { tt.style.display = 'none'; });
        var divisor = lista.querySelector('.idioma-divisor');
        if (divisor) divisor.style.display = 'none';
      } else {
        titulos.forEach(function (tt) { tt.style.display = ''; });
        var divisor2 = lista.querySelector('.idioma-divisor');
        if (divisor2) divisor2.style.display = '';
      }
      if (vazio) vazio.hidden = algumVisivel;
    }

    if (campoBusca) {
      campoBusca.addEventListener('input', aplicarBusca);
      campoBusca.addEventListener('click', function (e) { e.stopPropagation(); });
      campoBusca.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          fechar();
          btn.focus();
          e.stopPropagation();
        }
      });
    }
  }

  redirecionamentoAutomatico();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMenu);
  } else {
    iniciarMenu();
  }
})();
