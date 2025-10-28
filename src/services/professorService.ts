import Professor from "../models/Professor.js";
import { Op } from "sequelize";
import { getPaginationParams } from "../types/pagination.js";
import { criarRegistro } from "../utils/registroLogger.js";
import Horario from "../models/Horario.js";

export default class professorService {
  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (!nome) {
      erros.push("Nome do professor é obrigatório");
    }
    if (nome.length < 3 || nome.length > 40) {
      erros.push("Nome do professor deve ter entre 3 e 40 caracteres");
    }
    if (!/^[a-zA-Z\u00C0-\u00FF ]+$/.test(nome)) {
      erros.push("Nome do professor deve conter apenas letras");
    }
    return erros;
  }

  static verificaEmail(email: string) {
    const erros: string[] = [];
    if (!email) {
      erros.push("Email do professor é obrigatório");
    }
    if (
      !/[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/.test(
        email
      )
    ) {
      erros.push("Email inválido");
    }
    if (email.length > 40) {
      erros.push("Email do professor deve ter no máximo 40 caracteres");
    }
    return erros;
  }

  static preparaNome(nome: string): string {
    return nome
      .trim()
      .toLowerCase()
      .split(" ")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  }

  static async getAllProfessores(
    offset?: number,
    limit?: number,
    nome?: string,
    ativo?: boolean
  ) {
    try {
      const { rows: professores, count: total } =
        await Professor.findAndCountAll({
          ...getPaginationParams(offset, limit),
          where: {
            ...(nome ? { nome: { [Op.iLike]: `%${nome}%` } } : {}),
            ...(ativo !== undefined ? { ativo: { [Op.eq]: ativo } } : {}),
          },
        });
      if (!professores) {
        return {
          erros: ["Nenhum professor encontrado"],
          data: null,
        };
      }
      if (!nome) {
        return {
          erros: [],
          data: { professores },
        };
      } else {
        return {
          erros: [],
          data: { professores, total },
        };
      }
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar professores"],
        data: null,
      };
    }
  }

  static async getProfessorById(id: number) {
    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return {
          erros: ["Professor não encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: professor,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar professor"],
        data: null,
      };
    }
  }

  static async createProfessor(
    nome: string,
    email: string,
    idUsuario?: number
  ) {
    try {
      const erros = [...this.verificaNome(nome), ...this.verificaEmail(email)];
      if (erros.length > 0) {
        return {
          erros: erros,
          data: null,
        };
      }
      nome = this.preparaNome(nome);
      const existe = await Professor.findOne({
        where: {
          [Op.or]: [{ nome }, { email }],
        },
      });
      if (existe) {
        return {
          erros: ["Professor já cadastrado"],
          data: null,
        };
      }
      const professor = await Professor.create({ nome, email, ativo: true });
      await criarRegistro(
        idUsuario,
        `Criou professor: nome=${nome}; email=${email}`
      );
      return { erros: [], data: professor };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao criar professor"],
        data: null,
      };
    }
  }

  static async updateProfessor(
    id: number,
    nome?: string,
    email?: string,
    ativo?: boolean,
    idUsuario?: number
  ) {
    try {
      if (!nome && !email && ativo === undefined) {
        return {
          erros: ["Nenhum dado para atualizar"],
          data: null,
        };
      }
      const erros = [
        ...(nome ? this.verificaNome(nome) : []),
        ...(email ? this.verificaEmail(email) : []),
      ];
      if (erros.length > 0) {
        return {
          erros: erros,
          data: null,
        };
      }
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return {
          erros: ["Professor não encontrado"],
          data: null,
        };
      }
      professor.nome = nome == undefined ? professor.nome : nome;
      professor.email = email == undefined ? professor.email : email;
      professor.ativo = ativo == undefined ? professor.ativo : ativo;

      await professor.save();
      await criarRegistro(
        idUsuario,
        `Atualizou professor: nome=${professor.nome}; ativo=${professor.ativo}`
      );
      return { erros: [], data: professor };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar professor"],
        data: null,
      };
    }
  }

  static async deleteProfessor(id: number, idUsuario?: number) {
    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return {
          erros: ["Professor não encontrado"],
          data: null,
        };
      }
      professor.ativo = false;
      await professor.save();
      Horario.update({
        idProfessor: null as any,
      }, {
        where: {
          idProfessor: id,
        },
      });


      await criarRegistro(
        idUsuario,
        `Desativou professor: nome=${professor.nome}`
      );
      return { erros: [], data: null };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao desativar professor"],
        data: null,
      };
    }
  }

  static async getCount(ativo?: boolean) {
    try {
      const count = await Professor.count({
        where: {
          ...(ativo !== undefined && { ativo }),
        },
      });
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
