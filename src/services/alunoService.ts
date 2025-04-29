import { Op } from "sequelize";
import Aluno from "../models/Aluno";
import md5 from "md5";

export default class AlunoService {
  static verificaRa(ra: string): string[] {
    if (!ra) {
      return ["RA do aluno é obrigatório"];
    }
    if (ra.length < 5 || ra.length > 13) {
      return ["RA do aluno deve ter entre 5 e 13 caracteres"];
    }
    if (!/^[0-9]+$/.test(ra)) {
      return ["RA do aluno deve conter apenas números"];
    }
    return [];
  }

  static verificaNome(nome: string): string[] {
    if (!nome) {
      return ["Nome do aluno é obrigatório"];
    }
    if (nome.length < 3 || nome.length > 40) {
      return ["Nome do aluno deve ter entre 3 e 40 caracteres"];
    }
    if (!/^[a-zA-Z\u00C0-\u00FF ]+$/.test(nome)) {
      return ["Nome do curso deve conter apenas letras"];
    }
    return [];
  }

  static verificaTelefone(telefone: string): string[] {
    if (!telefone) {
      return [];
    }
    if (!/\(\d\d\) \d\d\d\d\d-\d\d\d\d/.test(telefone)) {
      return ["Telefone inválido"];
    }
    return [];
  }

  static verificaEmail(email: string): string[] {
    if (
      !/[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/.test(
        email
      )
    ) {
      return ["Email inválido"];
    }
    return [];
  }

  static verificaSenha(senha: string): string[] {
    if (!senha) {
      return ["Senha do aluno é obrigatória"];
    }
    if (senha.length < 4 || senha.length > 6) {
      return ["Senha do aluno deve ter entre 4 e 6 caracteres"];
    }
    if (!/^[0-9]+$/.test(senha)) {
      return ["Senha do aluno deve conter apenas números"];
    }
    return [];
  }

  static async getAllAlunos() {
    try {
      const alunos = await Aluno.findAll({
        attributes: ["ra", "nome", "telefone", "ano", "email", "ativo"],
        include: [
          {
            association: "curso",
            attributes: ["id", "nome"],
          },
        ],
      });

      if (!alunos) {
        return {
          status: 404,
          erros: ["Nenhum aluno encontrado"],
          data: [],
        };
      }

      return {
        status: 200,
        erros: [],
        data: alunos,
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao buscar alunos"], data: [] };
    }
  }

  static async searchAlunos(nome: string, ra: string) {
    try {
      const alunos = await Aluno.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${nome}%` } },
            { ra: { [Op.like]: `%${ra}%` } },
          ],
        },
        attributes: ["ra", "nome", "telefone", "ano", "email", "ativo"],
        include: [
          {
            association: "curso",
            attributes: ["id", "nome"],
          },
        ],
      });

      if (!alunos) {
        return {
          status: 404,
          erros: ["Nenhum aluno encontrado"],
          data: [],
        };
      }

      return {
        status: 200,
        erros: [],
        data: alunos,
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao buscar alunos"], data: [] };
    }
  }

  static async getAlunoByRa(ra: string) {
    try {
      const aluno = await Aluno.findByPk(ra, {
        attributes: ["ra", "nome", "telefone", "ano", "email", "ativo"],
        include: [
          {
            association: "curso",
            attributes: ["id", "nome"],
          },
        ],
      });

      if (!aluno) {
        return {
          status: 404,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      return {
        status: 200,
        erros: [],
        data: aluno,
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao buscar aluno"], data: [] };
    }
  }

  static async createAluno(
    nome: string,
    ra: string,
    telefone: string,
    ano: number,
    email: string,
    senha: string,
    idCurso: number
  ) {
    try {
      const erros: string[] = [
        ...this.verificaRa(ra),
        ...this.verificaNome(nome),
        ...this.verificaTelefone(telefone),
        ...this.verificaEmail(email),
        ...this.verificaSenha(senha),
      ];

      if (erros.length > 0) {
        return {
          status: 400,
          erros: erros,
          data: [],
        };
      }

      const aluno = await Aluno.create({
        ra,
        nome,
        telefone,
        ano,
        email,
        senha,
        idCurso,
      });

      return {
        status: 201,
        erros: [],
        data: aluno,
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao criar aluno"], data: [] };
    }
  }

  static async updateAluno(ra: string, requisicao: any) {
    try {
      const aluno = await Aluno.findByPk(ra);
      if (!aluno) {
        return {
          status: 404,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      const erros: string[] = [];

      if (requisicao.nome) {
        const erro = this.verificaNome(requisicao.nome);
        if (erro.length > 0) {
          erros.push(...erro);
        }
      }
      if (requisicao.telefone) {
        const erro = this.verificaTelefone(requisicao.telefone);
        if (erro.length > 0) {
          erros.push(...erro);
        }
      }
      if (requisicao.email) {
        const erro = this.verificaEmail(requisicao.email);
        if (erro.length > 0) {
          erros.push(...erro);
        }
      }

      if (erros.length > 0) {
        return {
          status: 400,
          erros: erros,
          data: [],
        };
      }

      const alunoAtualizado = await aluno.update(requisicao);

      return {
        status: 200,
        erros: [],
        data: alunoAtualizado,
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao atualizar aluno"], data: [] };
    }
  }

  static async updateSenhaAluno(ra: string, novaSenha: string) {
    try {
      const aluno = await Aluno.findByPk(ra);
      if (!aluno) {
        return {
          status: 404,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      if (this.verificaSenha(novaSenha).length > 0) {
        return {
          status: 400,
          erros: this.verificaSenha(novaSenha),
          data: [],
        };
      }

      aluno.atualizaSenha(novaSenha);
      await aluno.save();

      return {
        status: 200,
        erros: [],
        data: ["Senha atualizada com sucesso"],
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao atualizar senha"], data: [] };
    }
  }

  static async deleteAluno(ra: string) {
    try {
      const aluno = await Aluno.findByPk(ra);
      if (!aluno) {
        return {
          status: 404,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      await aluno.destroy();

      return {
        status: 200,
        erros: [],
        data: ["Aluno excluído com sucesso"],
      };
    } catch (e) {
      return { status: 500, erros: ["Erro ao excluir aluno"], data: [] };
    }
  }
}
