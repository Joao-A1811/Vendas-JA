// ============================================================
// Limite de tentativas simples (em memória) pra barrar flood no
// formulário de lead. Não é distribuído (cada instância da função tem seu
// próprio contador, e reinicia se a instância "esfria"), mas barra a
// maioria dos scripts de spam, que batem várias vezes seguidas na mesma
// instância quente. Não depende de nenhuma conta ou serviço externo.
// ============================================================
const JANELA_MS = 10 * 60 * 1000; // 10 minutos
const LIMITE = 5; // no máx. 5 tentativas por chave (e-mail ou IP) na janela

const registros = new Map();

export function permitido(chave) {
  if (!chave) return true;
  const agora = Date.now();
  const tentativas = (registros.get(chave) || []).filter(t => agora - t < JANELA_MS);
  if (tentativas.length >= LIMITE) {
    registros.set(chave, tentativas);
    return false;
  }
  tentativas.push(agora);
  registros.set(chave, tentativas);
  return true;
}
