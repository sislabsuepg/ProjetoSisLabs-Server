import Registro from "../models/Registro";
import Usuario from "../models/Usuario";
import { getPaginationParams } from "../types/pagination";
export default class RegistroService {
  static async getAllRegistros(offset?: number, limit?: number) {
    try {
      const registros = await Registro.findAll({
        ...getPaginationParams(offset, limit),
        include: [
          {
            model: Usuario,
            as: "usuario",
          },
        ],
        order: [["dataHora", "DESC"]],
      });
      if (!registros || registros.length === 0) {
        return {
          erros: ["Nenhum registro encontrado"],
          data: null,
        };
      }
      return { erros: [], data: registros };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar registros"],
        data: null,
      };
    }
  }

  static async getRegistroById(id: number) {
    try {
      const registro = await Registro.findOne({
        where: { id },
        include: [
          {
            model: Usuario,
            as: "usuario",
          },
        ],
      });
      if (!registro) {
        return {
          erros: ["Registro não encontrado"],
          data: null,
        };
      }
      return { erros: [], data: registro };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar registro"],
        data: null,
      };
    }
  }

  static async getRegistroByUserId(userId: number) {
    try {
      const registros = await Registro.findAll({
        where: { idUsuario: userId },
        include: [
          {
            model: Usuario,
            as: "usuario",
          },
        ],
        order: [["dataHora", "DESC"]],
      });
      if (!registros || registros.length === 0) {
        return {
          erros: ["Nenhum registro encontrado"],
          data: null,
        };
      }
      return { erros: [], data: registros };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar registros"],
        data: null,
      };
    }
  }

  static async createRegistro(
    dataHora: Date,
    descricao: string,
    idUsuario: number
  ) {
    try {
      const usuario = await Usuario.findByPk(idUsuario);
      if (!usuario) {
        return {
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      const registro = await Registro.create({
        dataHora,
        descricao,
        idUsuario,
      });
      return { erros: [], data: registro };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao criar registro"],
        data: null,
      };
    }
  }

  static async getCount(userId?: number) {
    try {
      const count = await Registro.count({
        where: {
          ...(userId !== undefined && { idUsuario: userId }),
        },
      });
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
