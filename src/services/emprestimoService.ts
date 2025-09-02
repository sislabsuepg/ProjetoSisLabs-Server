import Laboratorio from "../models/Laboratorio.js";
import Aluno from "../models/Aluno.js";
import Usuario from "../models/Usuario.js";
import Emprestimo from "../models/Emprestimo.js";
import Orientacao from "../models/Orientacao.js";
import { getPaginationParams } from "../types/pagination.js";
import { Op } from "sequelize";
export default class EmprestimoService {
  static async getAllEmprestimos(offset?: number, limit?: number) {
    try {
      const emprestimos = await Emprestimo.findAll({
        include: [
          {
            model: Usuario,
            as: "usuarioSaida",
            attributes: {
              exclude: ["senha"],
            },
          },
          {
            model: Usuario,
            as: "usuarioEntrada",
            attributes: {
              exclude: ["senha"],
            },
          },
          {
            model: Laboratorio,
          },
          {
            model: Aluno,
            attributes: {
              exclude: ["senha"],
            },
          },
        ],
        where:{
          idUsuarioSaida: { [Op.eq]: null }
        },
        ...getPaginationParams(offset, limit),
        order: [["dataHoraEntrada", "DESC"]],
      });
      if (emprestimos.length === 0) {
        return {
          erros: ["Nenhum empréstimo encontrado"],
          data: null,
        };
      } else {
        return {
          erros: [],
          data: emprestimos,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar empréstimos"],
        data: null,
      };
    }
  }

  static async getEmprestimoById(id: number) {
    try {
      const emprestimo = await Emprestimo.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuarioSaida",
          },
          {
            model: Usuario,
            as: "usuarioEntrada",
          },
          {
            model: Laboratorio,
          },
          {
            model: Aluno,
          },
        ],
      });
      if (!emprestimo) {
        return {
          erros: ["Empréstimo não encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: emprestimo,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar empréstimo"],
        data: null,
      };
    }
  }

  static async createEmprestimo(
    idLaboratorio: number,
    idAluno: number,
    idUsuario: number
  ) {
    try {
      const laboratorio = await Laboratorio.findByPk(idLaboratorio);
      if (!laboratorio) {
        return {
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }
      const usuario = await Usuario.findByPk(idUsuario);
      if (!usuario || (usuario && usuario.ativo === false)) {
        return {
          erros: ["Usuário não encontrado ou inativo"],
          data: null,
        };
      }

      const aluno = await Aluno.findByPk(idAluno);
      if (!aluno || (aluno && aluno.ativo === false)) {
        return {
          erros: ["Aluno não encontrado ou inativo"],
          data: null,
        };
      }
      if (laboratorio.restrito) {
        const orientacao = await Orientacao.findOne({
          where: { idLaboratorio: idLaboratorio, idAluno: idAluno },
        });
        if (!orientacao) {
          return {
            erros: ["Aluno não possui orientação no laboratório"],
            data: null,
          };
        }
      }

      const emprestimo = await Emprestimo.create({
        dataHoraEntrada: new Date(),
        posseChave: laboratorio.restrito,
        idLaboratorio: idLaboratorio,
        idAluno: idAluno,
        idUsuarioEntrada: idUsuario,
      });

      return {
  erros: [],
  data: emprestimo,
      };
    } catch (e) {
      console.log(e);
      return {
  erros: ["Erro ao criar empréstimo"],
  data: null,
      };
    }
  }

  static async closeEmprestimo(id: number, idUsuarioSaida: number) {
    try {
      const emprestimo = await Emprestimo.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuarioSaida",
          },
          {
            model: Usuario,
            as: "usuarioEntrada",
          },
          {
            model: Laboratorio,
          },
          {
            model: Aluno,
          },
        ],
      });
      if (!emprestimo) {
        return {
          erros: ["Empréstimo não encontrado"],
          data: null,
        };
      }
      if (emprestimo.dataHoraSaida && emprestimo.usuarioSaida) {
        return {
          erros: ["Empréstimo já fechado"],
          data: null,
        };
      }
      const usuarioSaida = await Usuario.findByPk(idUsuarioSaida);
      if (!usuarioSaida || (usuarioSaida && usuarioSaida.ativo === false)) {
        return {
          erros: ["Usuário de saída não encontrado ou inativo"],
          data: null,
        };
      }

      const emprestimoAtualizado = await emprestimo.update({
        dataHoraSaida: new Date(),
        idUsuarioSaida: idUsuarioSaida,
      });

      return {
  erros: [],
  data: emprestimoAtualizado,
      };
    } catch (e) {
      console.log(e);
      return {
  erros: ["Erro ao fechar empréstimo"],
  data: null,
      };
    }
  }

  static async updateAdvertencia(id: number, advertencia: string) {
    try {
      const emprestimo = await Emprestimo.findByPk(id);
      if (!emprestimo) {
        return {
          erros: ["Empréstimo não encontrado"],
          data: null,
        };
      }

      emprestimo.advertencia = advertencia;
      await emprestimo.save();

      return {
  erros: [],
  data: emprestimo,
      };
    } catch (e) {
      console.log(e);
      return {
  erros: ["Erro ao atualizar advertência"],
  data: null,
      };
    }
  }

  static async getCount(ativo?: boolean) {
    try {
      const where: any = {};
      if (ativo !== undefined) {
        where.dataHoraSaida = {
          [Op.eq]: null,
        };
      }

      const count: number = await Emprestimo.count({
        where,
      });
      return count;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
}
