// ============================================================
// CONFIGURAÇÃO GLOBAL DO SITE — NextLevel
// Este é o ÚNICO lugar onde se cola o Pixel do Meta e as
// credenciais do Firebase. Todas as páginas leem daqui.
// Alterou aqui + commit + push = site inteiro atualizado.
// ============================================================
window.SITE = {

  // Pixel do Meta (Facebook Ads).
  // Onde pegar: business.facebook.com/events_manager → seu Pixel → ID (número).
  // Enquanto estiver 'COLE_AQUI', as páginas funcionam normalmente, só não medem conversão.
  pixelId: '1817037532617722',

  // E-mail de contato mostrado na política de privacidade e nos termos de uso
  // (necessário pra LGPD: é por ele que a pessoa pede acesso/exclusão dos dados).
  // Enquanto estiver 'COLE_AQUI', as páginas legais mostram um texto genérico.
  emailContato: 'ja.investimentos@outlook.com',

  // Projeto Firebase que guarda os leads (formulários preenchidos).
  firebase: {
    apiKey: 'AIzaSyDhGANcA5y7KGgLVF3fY-IX9s7qqWw1fvM',
    authDomain: 'vendas-ja-99317.firebaseapp.com',
    databaseURL: 'https://vendas-ja-99317-default-rtdb.firebaseio.com',
    projectId: 'vendas-ja-99317',
    storageBucket: 'vendas-ja-99317.firebasestorage.app',
    messagingSenderId: '101750111486',
    appId: '1:101750111486:web:a24c06daf344fafdff39af'
  }
};
