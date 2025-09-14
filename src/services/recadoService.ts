import Recado from "../models/Recado.js";
import { getPaginationParams } from "../types/pagination.js";
import { criarRegistro } from "../utils/registroLogger.js";
export default class RecadoService {
  static verificaTexto(texto: string) {
    const erros: string[] = [];
    if (!texto || texto.trim() === "") {
      erros.push("Texto do recado é obrigatório");
    }
    if (texto.length > 1000) {
      erros.push("Texto do recado não pode exceder 1000 caracteres");
    }
    return erros;
  }

  static async getAllRecados(offset?: number, limit?: number) {
    try {
      const recados = await Recado.findAll({
        ...getPaginationParams(offset, limit),
      });

      if (!recados) {
        return {
          erros: ["Nenhum recado encontrado"],
          data: [],
        };
      }
      return {
        erros: [],
        data: recados,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar recados"],
        data: [],
      };
    }
  }

  static async getRecadoById(id: number) {
    try {
      const recado = await Recado.findByPk(id);

      if (!recado) {
        return {
          erros: ["Recado não encontrado"],
          data: [],
        };
      }
      return {
        erros: [],
        data: recado,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar recado"],
        data: [],
      };
    }
  }

  static async createRecado(texto: string, idUsuario?: number) {
    try {
      const erros: string[] = this.verificaTexto(texto);
      if (erros.length > 0) {
        return {
          erros: erros,
          data: [],
        };
      }

      const recado = await Recado.create({ texto });
      await criarRegistro(idUsuario, `Recado criado`);
      return { erros: [], data: recado };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao criar recado"],
        data: [],
      };
    }
  }

  static async updateRecado(id: number, texto: string, idUsuario?: number) {
    try {
      const recado = await Recado.findByPk(id);
      if (!recado) {
        return {
          erros: ["Recado não encontrado"],
          data: [],
        };
      }
      const erros: string[] = this.verificaTexto(texto);
      if (erros.length > 0) {
        return {
          erros: erros,
          data: [],
        };
      }

      recado.texto = texto;
      await recado.save();
      await criarRegistro(idUsuario, `Recado atualizado: id=${id}`);
      return { erros: [], data: recado };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar recado"],
        data: [],
      };
    }
  }

  static async deleteRecado(id: number, idUsuario?: number) {
    try {
      const recado = await Recado.findByPk(id);
      if (!recado) {
        return {
          erros: ["Recado não encontrado"],
          data: [],
        };
      }
      await recado.destroy();
      await criarRegistro(idUsuario, `Recado removido: id=${id}`);
      return { erros: [], data: recado };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao deletar recado"],
        data: [],
      };
    }
  }

  static async getCount() {
    try {
      const count = await Recado.count();
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
