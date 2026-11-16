// ============================================================
// Comparação de tokens/segredos em tempo constante — evita que um
// atacante consiga inferir, pelo tempo de resposta, quantos caracteres
// do começo de um token ele já acertou (timing attack). Usado por
// qualquer function que confere um token recebido contra o valor
// esperado (webhook da Hotmart, link de descadastro).
// ============================================================
import crypto from 'node:crypto';

export function compararSeguro(recebido, esperado) {
  const bufRecebido = Buffer.from(String(recebido ?? ''));
  const bufEsperado = Buffer.from(String(esperado ?? ''));
  if (bufRecebido.length !== bufEsperado.length) {
    // Ainda gasta um tempo comparável a uma comparação real, em vez de
    // retornar na hora — só o tamanho diferente já não vaza nada útil
    // sozinho, mas evita que esse caminho seja visivelmente mais rápido.
    crypto.timingSafeEqual(bufRecebido, bufRecebido);
    return false;
  }
  return crypto.timingSafeEqual(bufRecebido, bufEsperado);
}
