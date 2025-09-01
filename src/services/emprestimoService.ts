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
        ...getPaginationParams(offset, limit),
        order: [["dataHoraEntrada", "DESC"]],
      });
      if (emprestimos.length === 0) {
        return {
          data: null,
          erros: ["Nenhum empréstimo encontrado"],
        };
      } else {
        return {
          data: emprestimos,
          erros: [],
        };
      }
    } catch (e) {
      console.log(e);
      return {
        data: [],
        erros: ["Erro ao buscar empréstimos"],
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
          data: null,
          erros: ["Empréstimo não encontrado"],
        };
      }
      return {
        data: emprestimo,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        data: null,
        erros: ["Erro ao buscar empréstimo"],
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
          data: null,
          erros: ["Laboratório não encontrado"],
        };
      }
      const usuario = await Usuario.findByPk(idUsuario);
      if (!usuario || (usuario && usuario.ativo === false)) {
        return {
          data: null,
          erros: ["Usuário não encontrado ou inativo"],
        };
      }

      const aluno = await Aluno.findByPk(idAluno);
      if (!aluno || (aluno && aluno.ativo === false)) {
        return {
          data: null,
          erros: ["Aluno não encontrado ou inativo"],
        };
      }
      if (laboratorio.restrito) {
        const orientacao = await Orientacao.findOne({
          where: { idLaboratorio: idLaboratorio, idAluno: idAluno },
        });
        if (!orientacao) {
          return {
            data: null,
            erros: ["Aluno não possui orientação no laboratório"],
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
        data: emprestimo,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        data: null,
        erros: ["Erro ao criar empréstimo"],
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
          data: null,
          erros: ["Empréstimo não encontrado"],
        };
      }
      if (emprestimo.dataHoraSaida && emprestimo.usuarioSaida) {
        return {
          data: null,
          erros: ["Empréstimo já fechado"],
        };
      }
      const usuarioSaida = await Usuario.findByPk(idUsuarioSaida);
      if (!usuarioSaida || (usuarioSaida && usuarioSaida.ativo === false)) {
        return {
          data: null,
          erros: ["Usuário de saída não encontrado ou inativo"],
        };
      }

      const emprestimoAtualizado = await emprestimo.update({
        dataHoraSaida: new Date(),
        idUsuarioSaida: idUsuarioSaida,
      });

      return {
        data: emprestimoAtualizado,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        data: null,
        erros: ["Erro ao fechar empréstimo"],
      };
    }
  }

  static async updateAdvertencia(id: number, advertencia: string) {
    try {
      const emprestimo = await Emprestimo.findByPk(id);
      if (!emprestimo) {
        return {
          data: null,
          erros: ["Empréstimo não encontrado"],
        };
      }

      emprestimo.advertencia = advertencia;
      await emprestimo.save();

      return {
        data: emprestimo,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        data: null,
        erros: ["Erro ao atualizar advertência"],
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
