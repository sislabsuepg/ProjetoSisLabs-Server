import Recado from "../models/Recado";

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

  static async getAllRecados() {
    try {
      const recados = await Recado.findAll();

      if (!recados) {
        return {
          status: 404,
          erros: ["Nenhum recado encontrado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: recados,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
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
          status: 404,
          erros: ["Recado não encontrado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: recado,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        erros: ["Erro ao buscar recado"],
        data: [],
      };
    }
  }

  static async createRecado(texto: string) {
    try {
      const erros: string[] = this.verificaTexto(texto);
      if (erros.length > 0) {
        return {
          status: 400,
          erros: erros,
          data: [],
        };
      }

      const recado = await Recado.create({ texto });
      return {
        status: 201,
        erros: [],
        data: recado,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        erros: ["Erro ao criar recado"],
        data: [],
      };
    }
  }

  static async updateRecado(id: number, texto: string) {
    try {
      const recado = await Recado.findByPk(id);
      if (!recado) {
        return {
          status: 404,
          erros: ["Recado não encontrado"],
          data: [],
        };
      }
      const erros: string[] = this.verificaTexto(texto);
      if (erros.length > 0) {
        return {
          status: 400,
          erros: erros,
          data: [],
        };
      }

      recado.texto = texto;
      await recado.save();
      return {
        status: 200,
        erros: [],
        data: recado,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        erros: ["Erro ao atualizar recado"],
        data: [],
      };
    }
  }

  static async deleteRecado(id: number) {
    try {
      const recado = await Recado.findByPk(id);
      if (!recado) {
        return {
          status: 404,
          erros: ["Recado não encontrado"],
          data: [],
        };
      }
      await recado.destroy();
      return {
        status: 200,
        erros: [],
        data: recado,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        erros: ["Erro ao deletar recado"],
        data: [],
      };
    }
  }
}
