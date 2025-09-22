import Registro from "../models/Registro.js";

/**
 * Cria um registro de auditoria.
 * Ignora erros silenciosamente para não afetar fluxo da API.
 * @param idUsuario id do usuário (deve existir)
 * @param descricao descrição objetiva da ação
 */
export async function criarRegistro(
  idUsuario: number | undefined,
  descricao: string
) {
  try {
    if (!idUsuario) return; // sem usuário não registra
    if (!descricao || !descricao.trim()) return;
    // Normaliza booleanos para 'sim'/'não' quando usados como valores de chave (=true/false)
    const descricaoNormalizada = descricao.replace(
      /(=)\s*(true|false)(?=($|[;,\s]))/gi,
      (_match, igual: string, bool: string) =>
        `${igual}${bool.toLowerCase() === "true" ? "sim" : "não"}`
    );
    await Registro.create({
      dataHora: new Date(),
      descricao: descricaoNormalizada.substring(0, 100),
      idUsuario: idUsuario as any,
    } as any);
  } catch (e) {
    console.log(e);
  }
}

export default { criarRegistro };
