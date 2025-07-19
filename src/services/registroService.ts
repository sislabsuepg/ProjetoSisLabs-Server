import Registro from "../models/Registro";
import Usuario from "../models/Usuario";

export default class RegistroService {
  static async getAllRegistros() {
    try {
      const registros = await Registro.findAll({
        include: [
          {
            model: Usuario,
            as: "usuario",
          },
        ],
      });
      if (!registros) {
        return {
          status: 404,
          erros: ["Nenhum registro encontrado"],
          data: null,
        };
      }
      return { status: 200, erros: [], data: registros };
    } catch (e) {
      console.log(e);
      return { status: 500, erros: ["Erro ao buscar registros"], data: null };
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
        return { status: 404, erros: ["Registro não encontrado"], data: null };
      }
      return { status: 200, erros: [], data: registro };
    } catch (e) {
      console.log(e);
      return { status: 500, erros: ["Erro ao buscar registro"], data: null };
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
      });
      if (!registros) {
        return {
          status: 404,
          erros: ["Nenhum registro encontrado"],
          data: null,
        };
      }
      return { status: 200, erros: [], data: registros };
    } catch (e) {
      console.log(e);
      return { status: 500, erros: ["Erro ao buscar registros"], data: null };
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
        return { status: 404, erros: ["Usuário não encontrado"], data: null };
      }
      const registro = await Registro.create({
        dataHora,
        descricao,
        idUsuario,
      });
      return { status: 201, erros: [], data: registro };
    } catch (e) {
      console.log(e);
      return { status: 500, erros: ["Erro ao criar registro"], data: null };
    }
  }
}
