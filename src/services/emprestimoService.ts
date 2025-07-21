import Laboratorio from "../models/Laboratorio";
import Aluno from "../models/Aluno";
import Usuario from "../models/Usuario";
import Emprestimo from "../models/Emprestimo";
import Orientacao from "../models/Orientacao";
import codes from "../types/responseCodes";

export default class EmprestimoService {
  static async getAllEmprestimos() {
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
      });
      return {
        status: codes.OK,
        data: emprestimos,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          data: null,
          erros: ["Empréstimo não encontrado"],
        };
      }
      return {
        status: codes.OK,
        data: emprestimo,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.BAD_REQUEST,
          data: null,
          erros: ["Laboratório não encontrado"],
        };
      }
      const usuario = await Usuario.findByPk(idUsuario);
      if (!usuario || (usuario && usuario.ativo === false)) {
        return {
          status: codes.BAD_REQUEST,
          data: null,
          erros: ["Usuário não encontrado ou inativo"],
        };
      }

      const aluno = await Aluno.findByPk(idAluno);
      if (!aluno || (aluno && aluno.ativo === false)) {
        return {
          status: codes.BAD_REQUEST,
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
            status: codes.BAD_REQUEST,
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
        status: codes.CREATED,
        data: emprestimo,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          data: null,
          erros: ["Empréstimo não encontrado"],
        };
      }
      const usuarioSaida = await Usuario.findByPk(idUsuarioSaida);
      if (!usuarioSaida || (usuarioSaida && usuarioSaida.ativo === false)) {
        return {
          status: codes.BAD_REQUEST,
          data: null,
          erros: ["Usuário de saída não encontrado ou inativo"],
        };
      }

      const emprestimoAtualizado = await emprestimo.update({
        dataHoraSaida: new Date(),
        idUsuarioSaida: idUsuarioSaida,
      });

      return {
        status: codes.OK,
        data: emprestimoAtualizado,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          data: null,
          erros: ["Empréstimo não encontrado"],
        };
      }

      emprestimo.advertencia = advertencia;
      await emprestimo.save();

      return {
        status: codes.OK,
        data: emprestimo,
        erros: [],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        data: null,
        erros: ["Erro ao atualizar advertência"],
      };
    }
  }
}
