import { Op } from "sequelize";
import Aluno from "../models/Aluno";
import Laboratorio from "../models/Laboratorio";
import Orientacao from "../models/Orientacao";
import Professor from "../models/Professor";

import codes from "../types/responseCodes";

export default class OrientacaoService {
  static async getAllOrientacoes() {
    try {
      const orientacoes = await Orientacao.findAll();

      if (!orientacoes) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhuma orientação encontrada"],
          data: [],
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: orientacoes,
      };
    } catch (error) {
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar orientações"],
        data: [],
      };
    }
  }

  static async getOrientacaoById(id: number) {
    try {
      const orientacao = await Orientacao.findByPk(id);

      if (!orientacao) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Orientação não encontrada"],
          data: [],
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: orientacao,
      };
    } catch (error) {
      console.log(error);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar orientação"],
        data: [],
      };
    }
  }

  static async getOrientacaoByAluno(idAluno: number) {
    try {
      const orientacoes = await Orientacao.findAll({
        where: {
          [Op.and]: [{ idAluno }, { dataFim: { [Op.gt]: new Date() } }],
        },
      });

      if (!orientacoes) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhuma orientação encontrada para este aluno"],
          data: [],
        };
      }

      return {
        status: codes.OK,
        erros: [],
        data: orientacoes,
      };
    } catch (error) {
      console.log(error);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar orientações do aluno"],
        data: [],
      };
    }
  }

  static async createOrientacao(
    dataInicio: Date,
    dataFim: Date,
    idAluno: number,
    idProfessor: number,
    idLaboratorio: number
  ) {
    try {
      if (!dataFim || !idAluno || !idProfessor || !idLaboratorio) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Dados faltantes"],
          data: [],
        };
      }

      dataInicio = dataInicio || new Date();

      const erros: string[] = [
        ...(dataInicio && dataFim && dataInicio >= dataFim
          ? ["Data de início deve ser anterior à data de fim"]
          : []),
      ];

      const aluno = await Aluno.findByPk(idAluno);
      if (!aluno) {
        erros.push("Aluno não encontrado");
      }
      const professor = await Professor.findByPk(idProfessor);
      if (!professor) {
        erros.push("Professor não encontrado");
      }
      const laboratorio = await Laboratorio.findByPk(idLaboratorio);
      if (!laboratorio) {
        erros.push("Laboratório não encontrado");
      }

      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros,
          data: [],
        };
      }

      const novaOrientacao = await Orientacao.create({
        dataInicio,
        dataFim,
        idAluno,
        idProfessor,
        idLaboratorio,
      });

      return {
        status: codes.CREATED,
        erros: [],
        data: novaOrientacao,
      };
    } catch (error) {
      console.log(error);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar orientação"],
        data: [],
      };
    }
  }

  static async updateOrientacao(
    id: number,
    dataInicio: Date,
    dataFim: Date,
    idAluno: number,
    idProfessor: number,
    idLaboratorio: number
  ) {
    try {
      if (
        !dataInicio &&
        !dataFim &&
        !idAluno &&
        !idProfessor &&
        !idLaboratorio
      ) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Nenhum campo para atualização foi fornecido"],
          data: [],
        };
      }

      const orientacao = await Orientacao.findByPk(id);
      if (!orientacao) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Orientação não encontrada"],
          data: [],
        };
      }

      if (
        dataInicio &&
        (dataInicio.getTime() <= Date.now() - 1000 * 60 * 60 * 24 ||
          dataInicio >= orientacao.dataFim ||
          (dataFim && dataInicio >= dataFim))
      ) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Data de início deve ser anterior à data de fim"],
          data: [],
        };
      }

      if (
        dataFim &&
        (dataFim.getTime() <= Date.now() ||
          dataFim <= orientacao.dataInicio ||
          (dataInicio && dataFim <= dataInicio))
      ) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Data de fim deve ser posterior à data de início"],
          data: [],
        };
      }

      if (idAluno) {
        const aluno = await Aluno.findByPk(idAluno);
        if (!aluno) {
          return {
            status: codes.BAD_REQUEST,
            erros: ["Aluno não encontrado"],
            data: [],
          };
        }
        orientacao.aluno = aluno;
      }

      if (idProfessor) {
        const professor = await Professor.findByPk(idProfessor);
        if (!professor) {
          return {
            status: codes.BAD_REQUEST,
            erros: ["Professor não encontrado"],
            data: [],
          };
        }
        orientacao.professor = professor;
      }

      if (idLaboratorio) {
        const laboratorio = await Laboratorio.findByPk(idLaboratorio);
        if (!laboratorio) {
          return {
            status: codes.BAD_REQUEST,
            erros: ["Laboratório não encontrado"],
            data: [],
          };
        }
        orientacao.laboratorio = laboratorio;
      }

      orientacao.dataInicio = dataInicio || orientacao.dataInicio;
      orientacao.dataFim = dataFim || orientacao.dataFim;

      await orientacao.save();

      return {
        status: codes.OK,
        erros: [],
        data: orientacao,
      };
    } catch (error) {
      console.log(error);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar orientação"],
        data: [],
      };
    }
  }

  static async deleteOrientacao(id: number) {
    try {
      const orientacao = await Orientacao.findByPk(id);
      if (!orientacao) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Orientação não encontrada"],
          data: [],
        };
      }

      await orientacao.destroy();

      return {
        status: codes.OK,
        erros: [],
        data: ["Orientação deletada com sucesso"],
      };
    } catch (error) {
      console.log(error);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar orientação"],
        data: [],
      };
    }
  }
}
