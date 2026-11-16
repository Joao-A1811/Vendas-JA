// ============================================================
// Login com Google (OAuth 2.0, fluxo implícito, sem biblioteca
// externa) pra proteger páginas internas de admin, como o
// /.netlify/functions/diagnostico. Verifica a assinatura do ID token
// do Google com as chaves públicas dele e confere a claim de e-mail
// contra um e-mail autorizado — depois guarda a sessão num cookie
// assinado (HMAC), sem precisar de banco de dados.
//
// Variáveis de ambiente necessárias (Netlify → Environment variables):
//   GOOGLE_CLIENT_ID      — Client ID OAuth criado no Google Cloud Console.
//   ADMIN_EMAIL           — único e-mail autorizado a entrar.
//   SESSAO_ADMIN_SECRET   — string aleatória qualquer, só pra assinar o
//                            cookie de sessão (não precisa decorar nem é
//                            a mesma coisa que o Client ID).
// ============================================================
import crypto from 'node:crypto';
import { compararSeguro } from './seguranca.mjs';

const URL_CERTIFICADOS_GOOGLE = 'https://www.googleapis.com/oauth2/v3/certs';
const NOME_COOKIE = 'nl_admin_sessao';
const DURACAO_SESSAO_SEGUNDOS = 60 * 60; // 1 hora

let certsCache = null;
let certsCacheExpiraEm = 0;

function base64urlParaBuffer(str) {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function base64urlParaJson(str) {
  return JSON.parse(base64urlParaBuffer(str).toString('utf8'));
}

async function buscarCertificadosGoogle() {
  const agora = Date.now();
  if (certsCache && agora < certsCacheExpiraEm) return certsCache;
  const resposta = await fetch(URL_CERTIFICADOS_GOOGLE);
  if (!resposta.ok) throw new Error('não consegui buscar as chaves públicas do Google');
  const dados = await resposta.json();
  certsCache = dados.keys || [];
  certsCacheExpiraEm = agora + 10 * 60 * 1000; // 10 min — as chaves do Google rotacionam devagar
  return certsCache;
}

// Verifica assinatura + claims de um ID token do Google. Lança erro com
// mensagem curta (sem dado sensível) se qualquer checagem falhar.
// Retorna as claims (payload) do token se tudo bater.
export async function verificarIdTokenGoogle(idToken, { clientId, nonceEsperado }) {
  const partes = String(idToken || '').split('.');
  if (partes.length !== 3) throw new Error('token mal formado');
  const [headerB64, payloadB64, assinaturaB64] = partes;

  const header = base64urlParaJson(headerB64);
  const payload = base64urlParaJson(payloadB64);
  if (header.alg !== 'RS256') throw new Error('algoritmo inesperado');

  const chaves = await buscarCertificadosGoogle();
  const jwk = chaves.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('chave pública do Google não encontrada (kid desconhecido)');

  const chavePublica = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const assinaturaValida = crypto.verify(
    'RSA-SHA256',
    Buffer.from(`${headerB64}.${payloadB64}`),
    chavePublica,
    base64urlParaBuffer(assinaturaB64)
  );
  if (!assinaturaValida) throw new Error('assinatura inválida');

  const agora = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < agora) throw new Error('token expirado');
  if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') {
    throw new Error('emissor inesperado');
  }
  if (payload.aud !== clientId) throw new Error('audiência inesperada (client_id não bate)');
  if (!payload.email_verified) throw new Error('e-mail não verificado pelo Google');
  if (nonceEsperado && payload.nonce !== nonceEsperado) throw new Error('nonce não confere');

  return payload;
}

function segredoSessao() {
  const s = process.env.SESSAO_ADMIN_SECRET;
  if (!s) throw new Error('SESSAO_ADMIN_SECRET não configurada no Netlify');
  return s;
}

function assinar(valor) {
  return crypto.createHmac('sha256', segredoSessao()).update(valor).digest('hex');
}

// Monta o cabeçalho Set-Cookie da sessão já autenticada.
export function criarCookieSessao(email, caminho) {
  const expiraEm = Math.floor(Date.now() / 1000) + DURACAO_SESSAO_SEGUNDOS;
  const valor = `${Buffer.from(email).toString('base64url')}.${expiraEm}`;
  const cookie = `${valor}.${assinar(valor)}`;
  return `${NOME_COOKIE}=${cookie}; HttpOnly; Secure; SameSite=Lax; Path=${caminho}; Max-Age=${DURACAO_SESSAO_SEGUNDOS}`;
}

// Cabeçalho pra derrubar a sessão (logout / cookie corrompido).
export function cookieLogout(caminho) {
  return `${NOME_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=${caminho}; Max-Age=0`;
}

// Lê e valida o cookie de sessão da requisição. Retorna o e-mail da
// sessão se válido e autorizado, ou null (sem distinguir o motivo pro
// chamador — só "não tem sessão válida, mostra login de novo").
export function lerSessaoValida(req, emailPermitido) {
  const cabecalho = req.headers.get('cookie') || '';
  const match = cabecalho.match(new RegExp(`(?:^|;\\s*)${NOME_COOKIE}=([^;]+)`));
  if (!match) return null;

  const partes = match[1].split('.');
  if (partes.length !== 3) return null;
  const [emailB64, expiraStr, assinaturaRecebida] = partes;

  let assinaturaEsperada;
  try {
    assinaturaEsperada = assinar(`${emailB64}.${expiraStr}`);
  } catch {
    return null; // SESSAO_ADMIN_SECRET não configurada
  }
  if (!compararSeguro(assinaturaRecebida, assinaturaEsperada)) return null;

  const expiraEm = Number(expiraStr);
  if (!Number.isFinite(expiraEm) || expiraEm < Math.floor(Date.now() / 1000)) return null;

  let email;
  try {
    email = Buffer.from(emailB64, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (emailPermitido && email.toLowerCase() !== emailPermitido.toLowerCase()) return null;
  return email;
}
