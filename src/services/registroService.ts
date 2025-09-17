import { Op, where } from "sequelize";
import Registro from "../models/Registro.js";
import Usuario from "../models/Usuario.js";
import { getPaginationParams } from "../types/pagination.js";
export default class RegistroService {
  static async getAllRegistros(
    data1?: Date | undefined,
    data2?: Date | undefined,
    page?: number,
    itens?: number
  ) {
    try {
      let where = {};
      if (data1 !== undefined && data2 !== undefined) {
        where = {
          dataHora: {
            [Op.between]: [data1, data2],
          },
        };
      }

      const { rows: registros, count: total } = await Registro.findAndCountAll({
        where,
        ...getPaginationParams(page, itens),
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
      return { erros: [], data: { registros, total } };
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

  static async getRegistroByUserId(
    userId: number,
    data1?: Date | undefined,
    data2?: Date | undefined,
    itens?: number,
    page?: number
  ) {
    try {
      let where: any = { idUsuario: userId };
      if (data1 !== undefined && data2 !== undefined) {
        where.dataHora = {
          [Op.between]: [data1, data2],
        };
      }
      if (itens && page) {
        where = {
          ...where,
        };
      }
      const { rows: registros, count: total } = await Registro.findAndCountAll({
        where,
        ...getPaginationParams(page, itens),
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
      return { erros: [], data: { registros, total } };
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
      const count = await Registro.count();
      if (count > 400) {
        for (let i = 0; i < 20; i++) {
          const oldestRegistro = await Registro.findOne({
            order: [["dataHora", "ASC"]],
          });
          if (oldestRegistro) {
            await oldestRegistro.destroy();
          }
        }
      }

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
