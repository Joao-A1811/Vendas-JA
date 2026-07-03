// ============================================================
// Cliente mínimo da API do Brevo + montagem dos e-mails.
// Usado pelas funções lead-email, sequencia-diaria e descadastrar.
// A única configuração necessária é a variável de ambiente
// BREVO_API_KEY (Netlify → Site configuration → Environment variables).
// ============================================================
import crypto from 'node:crypto';
import { EMAILS } from './emails-conteudo.mjs';
import { PRODUTOS } from './produtos-email.mjs';

const API = 'https://api.brevo.com/v3';
const NOME_LISTA = 'sequencia-automatica';
const NOME_PASTA = 'NextLevel';
const ATRIBUTOS = ['PRODUTO_SLUG', 'IDIOMA', 'DATA_CADASTRO', 'EMAIL2_ENVIADO', 'EMAIL3_ENVIADO'];

export const REMETENTE = {
  name: process.env.NOME_REMETENTE || 'NextLevel',
  email: process.env.EMAIL_REMETENTE || 'ja.investimentos@outlook.com',
};
const URL_SITE = process.env.SITE_URL || 'https://nextlevelbr.app.br';

export function chaveApi() {
  const chave = process.env.BREVO_API_KEY;
  if (!chave) throw new Error('BREVO_API_KEY não configurada (Netlify → Environment variables)');
  return chave;
}

export async function api(caminho, metodo = 'GET', corpo) {
  const resposta = await fetch(API + caminho, {
    method: metodo,
    headers: { 'api-key': chaveApi(), 'content-type': 'application/json', accept: 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const texto = await resposta.text();
  let dados = {};
  try { dados = texto ? JSON.parse(texto) : {}; } catch { dados = { bruto: texto }; }
  if (!resposta.ok) {
    const erro = new Error(`Brevo ${metodo} ${caminho} → ${resposta.status}: ${dados.message || texto}`);
    erro.status = resposta.status;
    erro.codigo = dados.code;
    throw erro;
  }
  return dados;
}

// Garante que os atributos de contato e a lista da sequência existem no
// Brevo (cria na primeira execução). Retorna o id da lista.
let listaIdCache = null;
export async function garantirInfra() {
  if (listaIdCache) return listaIdCache;

  for (const nome of ATRIBUTOS) {
    try {
      await api(`/contacts/attributes/normal/${nome}`, 'POST', { type: 'text' });
    } catch (e) {
      if (e.status !== 400 && e.status !== 409) throw e; // já existe → ok
    }
  }

  const listas = await api('/contacts/lists?limit=50&offset=0');
  const existente = (listas.lists || []).find(l => l.name === NOME_LISTA);
  if (existente) { listaIdCache = existente.id; return listaIdCache; }

  const pastas = await api('/contacts/folders?limit=50&offset=0');
  let pastaId = (pastas.folders || [])[0]?.id;
  if (!pastaId) pastaId = (await api('/contacts/folders', 'POST', { name: NOME_PASTA })).id;

  const nova = await api('/contacts/lists', 'POST', { name: NOME_LISTA, folderId: pastaId });
  listaIdCache = nova.id;
  return listaIdCache;
}

export async function upsertContato({ email, nome, slug, idioma, listaId }) {
  await api('/contacts', 'POST', {
    email,
    updateEnabled: true,
    listIds: [listaId],
    attributes: {
      FIRSTNAME: (nome || '').split(' ')[0],
      PRODUTO_SLUG: slug,
      IDIOMA: idioma,
      DATA_CADASTRO: new Date().toISOString(),
      EMAIL2_ENVIADO: '',
      EMAIL3_ENVIADO: '',
    },
  });
}

export async function atualizarContato(email, atributos) {
  await api(`/contacts/${encodeURIComponent(email)}`, 'PUT', { attributes: atributos });
}

export async function removerDaLista(email, listaId) {
  await api(`/contacts/lists/${listaId}/contacts/remove`, 'POST', { emails: [email] });
}

export async function bloquearContato(email) {
  await api(`/contacts/${encodeURIComponent(email)}`, 'PUT', { emailBlacklisted: true });
}

// Token de descadastro: HMAC do e-mail, pra ninguém descadastrar terceiros.
export function tokenDescadastro(email) {
  return crypto.createHmac('sha256', chaveApi()).update(email.toLowerCase()).digest('hex').slice(0, 32);
}

// Monta assunto + HTML do e-mail N (1, 2 ou 3) já com os dados do produto,
// o nome do contato e o link de descadastro próprio (exigência LGPD).
export function montarEmail(n, { email, nome, slug, idioma }) {
  const produto = PRODUTOS[slug]?.[idioma];
  const modelo = EMAILS[idioma]?.[n];
  if (!produto || !modelo) throw new Error(`sem conteúdo pra ${slug}/${idioma}/email${n}`);

  const linkDescadastro = `${URL_SITE}/.netlify/functions/descadastrar` +
    `?e=${encodeURIComponent(email)}&t=${tokenDescadastro(email)}&l=${idioma}`;

  const mapa = {
    '[[TEMA]]': produto.tema,
    '[[LINK_EBOOK]]': produto.linkEbook,
    '[[NOME_DO_PRODUTO]]': produto.nomeProduto,
    '[[PRECO_DE]]': produto.precoDe,
    '[[PRECO_POR]]': produto.precoPor,
    '[[LINK_PAGINA]]': produto.linkPagina,
    '[[SLUG]]': slug,
    '{{ contact.FIRSTNAME }}': (nome || '').split(' ')[0],
    '{{ unsubscribe }}': linkDescadastro,
  };
  let html = modelo.html;
  for (const [token, valor] of Object.entries(mapa)) html = html.split(token).join(valor);
  html = html.replace(/\[\[DICA_PRINCIPAL[^\]]*\]\]/g, produto.dica);
  // Se o nome vier vazio, limpa a saudação ("Olá, !" → "Olá!")
  html = html.replace(/,\s+!/g, '!').replace(/Hi\s+,/g, 'Hi,');
  return { assunto: modelo.assunto, html, linkDescadastro };
}

// Versão em texto puro do e-mail: mensagens só-HTML pontuam pior nos
// filtros de spam; enviar as duas versões (multipart) melhora a entrega.
export function textoSimples(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h1|h2|h3|table)>/gi, '\n')
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ( $1 )')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function enviarEmailSequencia(n, contato) {
  const { assunto, html, linkDescadastro } = montarEmail(n, contato);
  await api('/smtp/email', 'POST', {
    sender: REMETENTE,
    replyTo: REMETENTE,
    to: [{ email: contato.email, name: contato.nome || undefined }],
    subject: assunto,
    htmlContent: html,
    textContent: textoSimples(html),
    // Descadastro de 1 clique (RFC 8058): Gmail/Outlook exigem de quem envia
    // em volume e mostram o botão nativo "Cancelar inscrição" — melhora a
    // entrega e evita que a pessoa marque como spam por não achar a saída.
    headers: {
      'List-Unsubscribe': `<${linkDescadastro}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    tags: [`sequencia-${n}`, contato.slug],
  });
}
