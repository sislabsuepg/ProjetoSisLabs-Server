import { Op } from "sequelize";
import Aluno from "../models/Aluno";
import Laboratorio from "../models/Laboratorio";
import Orientacao from "../models/Orientacao";
import Professor from "../models/Professor";
import { getPaginationParams } from "../types/pagination";

function getActive(active: boolean | undefined): {} {
  if (active === true) {
    return { where: { [Op.and]: [{ dataFim: { [Op.gt]: new Date() } }] } };
  }
  return {};
}

export default class OrientacaoService {
  static async getAllOrientacoes(
    offset?: number,
    limit?: number,
    active?: boolean
  ) {
    try {
      const orientacoes = await Orientacao.findAll({
        include: [
          {
            model: Aluno,
            as: "aluno",
          },
          {
            model: Professor,
            as: "professor",
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
        ...getActive(active),
        ...getPaginationParams(offset, limit),
      });

      if (!orientacoes || orientacoes.length === 0) {
        return {
          erros: ["Nenhuma orientação encontrada"],
          data: [],
        };
      }
      return {
        erros: [],
        data: orientacoes,
      };
    } catch (error) {
      return {
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
          erros: ["Orientação não encontrada"],
          data: [],
        };
      }
      return {
        erros: [],
        data: orientacao,
      };
    } catch (error) {
      console.log(error);
      return {
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

      if (!orientacoes || orientacoes.length === 0) {
        return {
          erros: ["Nenhuma orientação encontrada para este aluno"],
          data: [],
        };
      }
      return {
        erros: [],
        data: orientacoes,
      };
    } catch (error) {
      console.log(error);
      return {
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
        erros: [],
        data: novaOrientacao,
      };
    } catch (error) {
      console.log(error);
      return {
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
          erros: ["Nenhum campo para atualização foi fornecido"],
          data: [],
        };
      }

      const orientacao = await Orientacao.findByPk(id);
      if (!orientacao) {
        return {
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
        console.log(dataInicio, dataFim, orientacao.dataFim);
        return {
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
          erros: ["Data de fim deve ser posterior à data de início"],
          data: [],
        };
      }

      if (idAluno) {
        const aluno = await Aluno.findByPk(idAluno);
        if (!aluno) {
          return {
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
        erros: [],
        data: orientacao,
      };
    } catch (error) {
      console.log(error);
      return {
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
          erros: ["Orientação não encontrada"],
          data: [],
        };
      }

      await orientacao.destroy();

      return {
        erros: [],
        data: ["Orientação deletada com sucesso"],
      };
    } catch (error) {
      console.log(error);
      return {
        erros: ["Erro ao deletar orientação"],
        data: [],
      };
    }
  }

  static async getCount(active?: boolean) {
    try {
      let where: any = {};
      if (active === true) {
        where.dataFim = { [Op.gt]: Date.now() };
      }
      if (active === false) {
        where.dataFim = { [Op.lt]: Date.now() };
      }
      const count = await Orientacao.count({
        where,
      });
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
