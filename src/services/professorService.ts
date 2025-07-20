import Professor from "../models/Professor";
import { Op } from "sequelize";
import codes from "../types/responseCodes";
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

  static async getAllProfessores() {
    try {
      const professores = await Professor.findAll();
      if (!professores) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhum professor encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: professores,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          erros: ["Professor não encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: professor,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar professor"],
        data: null,
      };
    }
  }

  static async createProfessor(nome: string, email: string) {
    try {
      const erros = [...this.verificaNome(nome), ...this.verificaEmail(email)];
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
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
          status: codes.CONFLICT,
          erros: ["Professor já cadastrado"],
          data: null,
        };
      }
      const professor = await Professor.create({ nome, email, ativo: true });
      return {
        status: codes.CREATED,
        erros: [],
        data: professor,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar professor"],
        data: null,
      };
    }
  }

  static async updateProfessor(
    id: number,
    nome?: string,
    email?: string,
    ativo?: boolean
  ) {
    try {
      if (!nome && !email && ativo === undefined) {
        return {
          status: codes.BAD_REQUEST,
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
          status: codes.BAD_REQUEST,
          erros: erros,
          data: null,
        };
      }
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Professor não encontrado"],
          data: null,
        };
      }
      professor.nome = nome || professor.nome;
      professor.email = email || professor.email;
      professor.ativo = ativo !== undefined ? ativo : professor.ativo;

      await professor.save();
      return {
        status: codes.OK,
        erros: [],
        data: professor,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar professor"],
        data: null,
      };
    }
  }

  static async deleteProfessor(id: number) {
    try {
      const professor = await Professor.findByPk(id);
      if (!professor) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Professor não encontrado"],
          data: null,
        };
      }
      await professor.destroy();
      return {
        status: codes.OK,
        erros: [],
        data: "Professor deletado com sucesso",
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar professor"],
        data: null,
      };
    }
  }
}
