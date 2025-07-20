import { Op } from "sequelize";
import Curso from "../models/Curso";
import codes from "../types/responseCodes";
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

  static verificaAnosMaximo(anosMax: number): string[] {
    const erros: string[] = [];
    if (anosMax < 1 || anosMax > 8) {
      erros.push("Anos máximos deve ser entre 1 e 8");
    }
    return erros;
  }

  static async getAllCursos() {
    try {
      const cursos = await Curso.findAll();
      if (!cursos) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhum curso encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: cursos,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar curso"],
        data: null,
      };
    }
  }

  static async getCursosByNome(nomeBusca: string) {
    try {
      const erros: string[] = this.verificaNome(nomeBusca);
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: erros,
          data: null,
        };
      }
      const curso = await Curso.findAll({
        where: { nome: { [Op.like]: `%${nomeBusca}%` } },
      });
      if (!curso) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar curso"],
        data: null,
      };
    }
  }

  static async createCurso(nome: string, anosMax: number) {
    try {
      const erros: string[] = [
        ...CursoService.verificaNome(nome),
        ...CursoService.verificaAnosMaximo(anosMax),
      ];
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: erros,
          data: null,
        };
      }

      const existe = await Curso.findOne({ where: { nome: nome } });
      if (existe) {
        return {
          status: codes.CONFLICT,
          erros: ["Curso já existe"],
          data: null,
        };
      }

      const curso = await Curso.create({ nome: nome, anosMaximo: anosMax });
      return {
        status: codes.CREATED,
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar curso"],
        data: null,
      };
    }
  }

  static async updateCurso(id: number, nome?: string, anosMax?: number) {
    try {
      if (!nome && !anosMax) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Nome ou anos máximos devem ser informados"],
          data: null,
        };
      }

      const erros: string[] = [
        ...(nome ? CursoService.verificaNome(nome) : []),
        ...(anosMax ? CursoService.verificaAnosMaximo(anosMax) : []),
      ];
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: erros,
          data: null,
        };
      }
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      if (nome) {
        curso.nome = nome;
      }
      if (anosMax) {
        curso.anosMaximo = anosMax;
      }
      await curso.save();
      return {
        status: codes.OK,
        erros: [],
        data: curso,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar curso"],
        data: null,
      };
    }
  }

  static async deleteCurso(id: number) {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Curso não encontrado"],
          data: null,
        };
      }
      await curso.destroy();
      return {
        status: codes.OK,
        erros: [],
        data: null,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar curso"],
        data: null,
      };
    }
  }
}
