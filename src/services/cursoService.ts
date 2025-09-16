import { Op } from "sequelize";
import Curso from "../models/Curso.js";
import { getPaginationParams } from "../types/pagination.js";
import { criarRegistro } from "../utils/registroLogger.js";
export default class CursoService {
  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (nome.length < 3 || nome.length > 40) {
      erros.push("Nome do curso deve ter entre 3 e 40 caracteres");
    }
    if (!/^[a-zA-Z \u00C0-\u00FF]+$/.test(nome)) {
      erros.push("Nome do curso deve conter apenas letras");
    }
    return erros;
  }

  static verificaAnosMaximo(anosMaximo: number): string[] {
    const erros: string[] = [];
    if (anosMaximo < 1 || anosMaximo > 8) {
      erros.push("Anos máximos deve ser entre 1 e 8");
    }
    return erros;
  }

  static async getAllCursos(offset?: number, limit?: number, ativo?: boolean) {
    try {
      const cursos: Curso[] = await Curso.findAll({
        ...getPaginationParams(offset, limit),
        where: {
          ...(ativo !== undefined && { ativo }),
        },
      });
      if (cursos.length === 0) {
        return {
          erros: ["Nenhum curso encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: cursos,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar cursos"],
        data: null,
      };
    }
  }

  static async getCursoById(id: number) {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar curso"],
        data: null,
      };
    }
  }

  static async getCursosByNome(
    nomeBusca: string,
    offset?: number,
    limit?: number,
    ativo?: boolean
  ) {
    try {
      const erros: string[] = this.verificaNome(nomeBusca);
      if (erros.length > 0) {
        return {
          erros: erros,
          data: null,
        };
      }
      const { rows: cursos, count: total } = await Curso.findAndCountAll({
        where: {
          [Op.and]: {
            nome: { [Op.iLike]: `%${nomeBusca}%` },
            ...(ativo !== undefined && { ativo }),
          },
        },
        ...getPaginationParams(offset, limit),
      });
      if (!cursos || cursos.length === 0) {
        return {
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: { cursos, total },
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar curso"],
        data: null,
      };
    }
  }

  static async createCurso(nome: string, anosMaximo: number, idUsuario?: number) {
    try {
      const erros: string[] = [
        ...CursoService.verificaNome(nome),
        ...CursoService.verificaAnosMaximo(anosMaximo),
      ];
      if (erros.length > 0) {
        return {
          erros: erros,
          data: null,
        };
      }

      const existe = await Curso.findOne({ where: { nome: nome } });
      if (existe) {
        return {
          erros: ["Curso já existe"],
          data: null,
        };
      }

      const curso = await Curso.create({ nome: nome, anosMaximo: anosMaximo });
      await criarRegistro(
        idUsuario,
        `Curso criado: nome: ${nome} anosMax: ${anosMaximo}`
      );
      return {
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao criar curso"],
        data: null,
      };
    }
  }

  static async updateCurso(
    id: number,
    nome?: string,
    anosMaximo?: number,
    ativo?: boolean,
    idUsuario?: number
  ) {
    try {
      if (!nome && !anosMaximo && ativo === undefined) {
        return {
          erros: ["Nenhum dado para atualizar"],
          data: null,
        };
      }

      const erros: string[] = [
        ...(nome ? CursoService.verificaNome(nome) : []),
        ...(anosMaximo ? CursoService.verificaAnosMaximo(anosMaximo) : []),
      ];
      if (erros.length > 0) {
        return {
          erros: erros,
          data: null,
        };
      }
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      curso.nome = nome == undefined ? curso.nome : nome;
      curso.anosMaximo =
        anosMaximo == undefined ? curso.anosMaximo : anosMaximo;
      curso.ativo = ativo === undefined ? curso.ativo : ativo;
      await curso.save();
      await criarRegistro(
        idUsuario,
        `Curso atualizado: nome: ${curso.nome} anosMax: ${curso.anosMaximo} ativo: ${curso.ativo}`
      );
      return {
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar curso"],
        data: null,
      };
    }
  }

  static async deleteCurso(id: number, idUsuario?: number) {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      curso.ativo = false;
      await curso.save();
      await criarRegistro(
        idUsuario,
        `Curso desativado: nome: ${curso.nome}`
      );
      return {
        erros: [],
        data: null,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao desativar curso"],
        data: null,
      };
    }
  }

  static async getCount(ativo?: boolean) {
    try {
      const count: number = await Curso.count({
        ...(ativo !== undefined && { where: { ativo } }),
      });
      return count;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
}
