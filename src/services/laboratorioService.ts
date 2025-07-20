import Laboratorio from "../models/Laboratorio";
import { Op } from "sequelize";
import codes from "../types/responseCodes";

export default class laboratorioService {
  static verificaNumero(numero: string): string[] {
    const erros: string[] = [];
    if (!numero) {
      erros.push("O número do laboratório é obrigatório.");
    }
    if (!/^[\dA-Za-z]+$/.test(numero)) {
      erros.push("O número deve conter apenas dígitos e letras.");
    }
    if (numero.length > 8) {
      erros.push("O número deve ter no máximo 8 caracteres.");
    }
    return erros;
  }

  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (!nome) {
      erros.push("O nome do laboratório é obrigatório.");
    }
    if (nome.length < 3 || nome.length > 40) {
      erros.push("O nome deve ter entre 3 e 40 caracteres.");
    }
    if (!/^[a-zA-Z\u00C0-\u00FF0-9 ]+$/.test(nome)) {
      erros.push("O nome deve conter apenas letras e números.");
    }
    return erros;
  }

  static async getAllLaboratorios() {
    try {
      const laboratorios = await Laboratorio.findAll();
      if (!laboratorios) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhum laboratório encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: laboratorios,
      };
    } catch (error) {
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar laboratórios"],
        data: null,
      };
    }
  }

  static async getLaboratorioById(id: number) {
    try {
      const laboratorio = await Laboratorio.findByPk(id);
      if (!laboratorio) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: laboratorio,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar laboratório"],
        data: null,
      };
    }
  }

  static async createLaboratorio(
    numero: string,
    nome: string,
    restrito?: boolean
  ) {
    try {
      const erros = [
        ...laboratorioService.verificaNumero(numero),
        ...laboratorioService.verificaNome(nome),
      ];
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros,
          data: null,
        };
      }
      const existe = await Laboratorio.findOne({
        where: {
          [Op.or]: [{ numero }, { nome }],
        },
      });
      if (existe) {
        return {
          status: codes.CONFLICT,
          erros: ["Laboratório com o mesmo número ou nome já existe"],
          data: null,
        };
      }
      const laboratorio = await Laboratorio.create({
        numero,
        nome,
        restrito: restrito || false,
      });
      return {
        status: codes.CREATED,
        erros: [],
        data: laboratorio,
      };
    } catch (error) {
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar laboratório"],
        data: null,
      };
    }
  }

  static async updateLaboratorio(
    id: number,
    numero?: string,
    nome?: string,
    restrito?: boolean
  ) {
    try {
      const laboratorio = await Laboratorio.findByPk(id);
      if (!laboratorio) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }
      if (!numero && !nome && restrito === undefined) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Nenhum dado para atualizar"],
          data: null,
        };
      }
      const erros = [
        ...(numero ? laboratorioService.verificaNumero(numero) : []),
        ...(nome ? laboratorioService.verificaNome(nome) : []),
      ];
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros,
          data: null,
        };
      }
      laboratorio.numero = numero ? numero : laboratorio.numero;
      laboratorio.nome = nome ? nome : laboratorio.nome;
      laboratorio.restrito =
        restrito == undefined ? laboratorio.restrito : restrito;
      await laboratorio.save();
      return {
        status: codes.OK,
        erros: [],
        data: laboratorio,
      };
    } catch (error) {
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar laboratório"],
        data: null,
      };
    }
  }

  static async deleteLaboratorio(id: number) {
    try {
      const laboratorio = await Laboratorio.findByPk(id);
      if (!laboratorio) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }
      await laboratorio.destroy();
      return {
        status: codes.OK,
        erros: [],
        data: null,
      };
    } catch (error) {
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar laboratório"],
        data: null,
      };
    }
  }
}
