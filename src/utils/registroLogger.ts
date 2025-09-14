import Registro from "../models/Registro.js";

/**
 * Cria um registro de auditoria.
 * Ignora erros silenciosamente para não afetar fluxo da API.
 * @param idUsuario id do usuário (deve existir)
 * @param descricao descrição objetiva da ação
 */
export async function criarRegistro(idUsuario: number | undefined, descricao: string) {
  try {
    if (!idUsuario) return; // sem usuário não registra
    if (!descricao || !descricao.trim()) return;
    await Registro.create({
      dataHora: new Date(),
      descricao: descricao.substring(0, 100),
      idUsuario: idUsuario as any,
    } as any);
  } catch (e) {
    // opcionalmente poderia fazer console.debug
  }
}

export default { criarRegistro };