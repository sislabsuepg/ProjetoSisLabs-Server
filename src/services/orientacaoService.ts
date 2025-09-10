import { Op } from "sequelize";
import Aluno from "../models/Aluno.js";
import Laboratorio from "../models/Laboratorio.js";
import Orientacao from "../models/Orientacao.js";
import Professor from "../models/Professor.js";
import { getPaginationParams } from "../types/pagination.js";

function getAtivo(ativo: boolean | undefined): {} {
  if (ativo === true) {
    return { [Op.and]: [{ dataFim: { [Op.gt]: new Date() } }] };
  }else{
    return { [Op.and]: [{ dataFim: { [Op.lt]: new Date() } }] };
  }
}

export default class OrientacaoService {
  static async getAllOrientacoes(
    offset?: number,
    limit?: number,
    ativo?: boolean,
    nome?: string
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
        where: {
          ...getAtivo(ativo),
        },
        ...getPaginationParams(offset, limit),
      });

      if (!orientacoes || orientacoes.length === 0) {
        return {
          erros: ["Nenhuma orientação encontrada"],
          data: [],
        };
      }

      if (nome) {
        const orientacoesFiltradas = orientacoes.filter((orientacao) =>
          orientacao.aluno.nome.toLowerCase().includes(nome.toLowerCase())
        );
        if (orientacoesFiltradas.length === 0) {
          return {
            erros: ["Nenhuma orientação encontrada com o nome informado"],
            data: [],
          };
        }
        return {
          erros: [],
          data: orientacoesFiltradas,
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
      const orientacao = await Orientacao.findByPk(id, {
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
      });

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
      });

      if (orientacoes.length === 0) {
        return {
          erros: ["Nenhuma orientação encontrada para este aluno"],
          data: [],
        };
      }
      return {
        erros: [],
        data: orientacoes[0],
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
    dataInicio?: Date,
    dataFim?: Date,
  ) {
    try {
      if (
        !dataInicio &&
        !dataFim
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

      if( dataInicio && dataFim && dataInicio >= dataFim ) {
        return {
          erros: ["Data de início deve ser anterior à data de fim"],
          data: [],
        };
      }
      if (
          dataInicio && !dataFim &&
            (dataInicio.getTime() <= Date.now() - 1000 * 60 * 60 * 24 ||
              dataInicio >= orientacao.dataFim
            )) {
          return {
            erros: ["Data de início deve ser anterior à data de fim"],
            data: [],
          };
          }
      if (
        dataFim && !dataInicio &&
        (dataFim.getTime() <= Date.now() ||
          dataFim <= orientacao.dataInicio)
      ) {
        return {
          erros: ["Data de fim deve ser posterior à data de início"],
          data: [],
        };
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

      if( orientacao.dataFim < new Date() ){
        return {
          erros: ["Não é possível desativar uma orientação já finalizada"],
          data: [],
        };
      }

      if( orientacao.dataInicio > new Date() ){
        orientacao.dataInicio = new Date();
      }
      orientacao.dataFim = new Date();
      await orientacao.save();

      return {
        erros: [],
        data: ["Orientação desativada com sucesso"],
      };
    } catch (error) {
      console.log(error);
      return {
        erros: ["Erro ao desativar orientação"],
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
