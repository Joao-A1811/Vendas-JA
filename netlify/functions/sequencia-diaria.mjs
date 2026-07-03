// ============================================================
// Roda TODO DIA às 12:00 UTC (9h de Brasília) — agendada pelo
// próprio Netlify (export const config lá embaixo, sem cron externo).
// Percorre a lista "sequencia-automatica" no Brevo e:
//   - 2+ dias após o cadastro → envia o e-mail 2 (dica prática)
//   - 4+ dias após o cadastro → envia o e-mail 3 (oferta) e tira o
//     contato da lista (a sequência dele acabou; a lista só guarda
//     quem ainda está no meio do fluxo, então a varredura fica leve).
// Contatos descadastrados (blacklist) são pulados e removidos.
// ============================================================
import {
  api, garantirInfra, enviarEmailSequencia, atualizarContato, removerDaLista,
} from './lib/brevo.mjs';
import { PRODUTOS } from './lib/produtos-email.mjs';

const DIA_MS = 86400000;

export default async () => {
  const listaId = await garantirInfra();
  const resumo = { analisados: 0, email2: 0, email3: 0, removidos: 0, erros: 0 };

  // Baixa TODAS as páginas antes de processar: como o processamento remove
  // contatos da lista, remover durante a paginação deslocaria os offsets e
  // pularia contatos quando a lista passar de 500.
  const todos = [];
  for (let offset = 0; ; offset += 500) {
    const pagina = await api(`/contacts/lists/${listaId}/contacts?limit=500&offset=${offset}`);
    const contatos = pagina.contacts || [];
    todos.push(...contatos);
    if (contatos.length < 500) break;
  }

  for (const c of todos) {
    resumo.analisados++;
    try {
      const attrs = c.attributes || {};
      const email = c.email;
      const slug = attrs.PRODUTO_SLUG;
      const idioma = attrs.IDIOMA;

      if (c.emailBlacklisted || !PRODUTOS[slug]?.[idioma]) {
        await removerDaLista(email, listaId);
        resumo.removidos++;
        continue;
      }

      const cadastro = Date.parse(attrs.DATA_CADASTRO);
      if (Number.isNaN(cadastro)) { await removerDaLista(email, listaId); resumo.removidos++; continue; }
      const dias = Math.floor((Date.now() - cadastro) / DIA_MS);
      const contato = { email, nome: attrs.FIRSTNAME || '', slug, idioma };

      if (dias >= 2 && attrs.EMAIL2_ENVIADO !== 'sim') {
        await enviarEmailSequencia(2, contato);
        await atualizarContato(email, { EMAIL2_ENVIADO: 'sim' });
        resumo.email2++;
      }
      if (dias >= 4 && attrs.EMAIL3_ENVIADO !== 'sim') {
        await enviarEmailSequencia(3, contato);
        await atualizarContato(email, { EMAIL3_ENVIADO: 'sim' });
        await removerDaLista(email, listaId);
        resumo.email3++;
        resumo.removidos++;
      }
    } catch (e) {
      resumo.erros++;
      console.error('sequencia-diaria contato:', c.email, e.message);
    }
  }

  console.log('sequencia-diaria:', JSON.stringify(resumo));
  return new Response(JSON.stringify(resumo), { headers: { 'content-type': 'application/json' } });
};

export const config = { schedule: '0 12 * * *' };
