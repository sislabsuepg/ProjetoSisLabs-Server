import { Op } from "sequelize";
import Aluno from "../models/Aluno";
import config from "../config/config";
import jwt, { SignOptions } from "jsonwebtoken";
import Curso from "../models/Curso";

export default class AlunoService {
  static verificaRa(ra: string): string[] {
    const erros: string[] = [];
    if (!ra || ra.trim() === "") {
      erros.push("RA do aluno é obrigatório");
    }
    if (ra.length < 5 || ra.length > 13) {
      erros.push("RA do aluno deve ter entre 5 e 13 caracteres");
    }
    if (!/^[0-9]+$/.test(ra)) {
      erros.push("RA do aluno deve conter apenas números");
    }
    return erros;
  }

  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (!nome) {
      erros.push("Nome do aluno é obrigatório");
    }
    if (nome.length < 3 || nome.length > 40) {
      erros.push("Nome do aluno deve ter entre 3 e 40 caracteres");
    }
    if (!/^[a-zA-Z\u00C0-\u00FF ]+$/.test(nome)) {
      erros.push("Nome do aluno deve conter apenas letras");
    }
    return erros;
  }

  static verificaTelefone(telefone: string): string[] {
    const erros: string[] = [];
    if (!telefone) {
      erros.push("Telefone do aluno é obrigatório");
    }
    if (!/\(\d\d\) \d\d\d\d\d-\d\d\d\d/.test(telefone)) {
      erros.push("Telefone inválido");
    }
    return erros;
  }

  static verificaAnoCurso(ano: number): string[] {
    const erros: string[] = [];
    if (ano < 1) {
      erros.push("Ano do curso nao pode ser inferior a 1");
    }
    if (ano > 8) {
      erros.push("Ano do curso nao pode ser superior à 8");
    }
    return erros;
  }

  static verificaEmail(email: string): string[] {
    const erros: string[] = [];
    if (!email) {
      erros.push("Email do aluno é obrigatório");
    }
    if (
      !/[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/.test(
        email
      )
    ) {
      erros.push("Email inválido");
    }
    return erros;
  }

  static verificaSenha(senha: string): string[] {
    const erros: string[] = [];
    if (!senha) {
      erros.push("Senha do aluno é obrigatória");
    }
    if (senha.length < 4 || senha.length > 6) {
      erros.push("Senha do aluno deve ter entre 4 e 6 caracteres");
    }
    if (!/^[0-9]+$/.test(senha)) {
      erros.push("Senha do aluno deve conter apenas números");
    }
    return erros;
  }

  static async getAllAlunos() {
    try {
      const alunos = await Aluno.findAll({
        attributes: ["ra", "nome", "telefone", "anoCurso", "email", "ativo"],
        include: {
          model: Curso,
        },
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
      console.log(e);
      return { status: 500, erros: e, data: [] };
    }
  }

  static async searchAlunos(nome?: string, ra?: string) {
    try {
      if (!nome && !ra) {
        return {
          status: 400,
          erros: ["Nome ou RA devem ser informados para busca"],
          data: [],
        };
      }
      const erros: string[] = [];
      if (nome && this.verificaNome(nome).length > 0) {
        erros.push(...this.verificaNome(nome));
      }
      if (ra && this.verificaRa(ra).length > 0) {
        erros.push(...this.verificaRa(ra));
      }
      if (erros.length > 0) {
        return {
          status: 400,
          erros: erros,
          data: [],
        };
      }
      const alunos = await Aluno.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${nome || ""}%` } },
            { ra: { [Op.like]: `%${ra || ""}%` } },
          ],
        },
        attributes: ["ra", "nome", "telefone", "anoCurso", "email", "ativo"],
        include: [
          {
            model: Curso,
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
      console.log(e);
      return { status: 500, erros: ["Erro ao buscar alunos"], data: [] };
    }
  }

  static async getAlunoById(id: number) {
    try {
      const aluno = await Aluno.findByPk(id, {
        attributes: ["ra", "nome", "telefone", "anoCurso", "email", "ativo"],
        include: [
          {
            model: Curso,
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
      console.log(e);
      return { status: 500, erros: ["Erro ao buscar aluno"], data: [] };
    }
  }

  static async createAluno(
    nome: string,
    ra: string,
    telefone: string,
    anoCurso: number,
    email: string,
    senha: string,
    idCurso: number
  ) {
    try {
      const erros: string[] = [
        ...this.verificaRa(ra),
        ...this.verificaNome(nome),
        ...this.verificaAnoCurso(anoCurso),
        ...this.verificaSenha(senha),
      ];

      if (telefone) {
        erros.push(...this.verificaTelefone(telefone));
      }
      if (email) {
        erros.push(...this.verificaEmail(email));
      }

      if (erros.length > 0) {
        return {
          status: 400,
          erros: erros,
          data: [],
        };
      }

      const alunoExiste = await Aluno.findOne({
        where: {
          ra: ra,
        },
      });

      if (alunoExiste) {
        return {
          status: 400,
          erros: ["RA já cadastrado"],
          data: [],
        };
      }

      const novoAluno: any = {};

      if (ra) {
        novoAluno["ra"] = ra;
      }
      if (nome) {
        novoAluno["nome"] = nome;
      }
      if (telefone) {
        novoAluno["telefone"] = telefone;
      }
      if (anoCurso) {
        novoAluno["anoCurso"] = anoCurso;
      }
      if (email) {
        novoAluno["email"] = email;
      }
      if (senha) {
        novoAluno["senha"] = senha;
      }
      if (idCurso) {
        novoAluno["idCurso"] = idCurso;
      }

      const aluno = await Aluno.create(novoAluno);
      if (!aluno) {
        return {
          status: 400,
          erros: ["Erro ao criar aluno"],
          data: [],
        };
      }

      return {
        status: 201,
        erros: [],
        data: aluno,
      };
    } catch (e) {
      console.log(e);
      return { status: 500, erros: ["Erro ao criar aluno"], data: [] };
    }
  }

  static async updateAluno(
    id: number,
    nome?: string,
    telefone?: string,
    anoCurso?: number,
    email?: string,
    ativo?: boolean
  ) {
    try {
      const aluno = await Aluno.findByPk(id, {
        attributes: [
          "id",
          "ra",
          "nome",
          "telefone",
          "anoCurso",
          "email",
          "ativo",
        ],
        include: [
          {
            model: Curso,
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

      const erros: string[] = [];

      if (!nome && !telefone && !anoCurso && !email && ativo === undefined) {
        return {
          status: 400,
          erros: ["Pelo menos um campo deve ser informado"],
          data: [],
        };
      }

      if (nome) {
        const erro = this.verificaNome(nome);
        if (erro.length > 0) {
          erros.push(...erro);
        }
      }
      if (telefone) {
        const erro = this.verificaTelefone(telefone);
        if (erro.length > 0) {
          erros.push(...erro);
        }
      }
      if (email) {
        const erro = this.verificaEmail(email);
        if (erro.length > 0) {
          erros.push(...erro);
        }
      }
      if (anoCurso) {
        const erro = this.verificaAnoCurso(anoCurso);
        if (anoCurso > aluno.curso.anosMaximo) {
          erro.push("Ano do curso excede o limite máximo");
        }
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

      aluno.nome = nome || aluno.nome;
      aluno.telefone = telefone || aluno.telefone;
      aluno.anoCurso = anoCurso || aluno.anoCurso;
      aluno.email = email || aluno.email;
      aluno.ativo = ativo === undefined ? aluno.ativo : ativo;

      const alunoAtualizado = await aluno.save();

      return {
        status: 200,
        erros: [],
        data: alunoAtualizado,
      };
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
      console.log(e);
      return { status: 500, erros: ["Erro ao excluir aluno"], data: [] };
    }
  }

  static async loginAluno(ra: string, senha: string) {
    try {
      const aluno: Aluno | null = await Aluno.findOne({
        where: {
          ra,
        },
      });
      if (!aluno) {
        return {
          status: 404,
          erros: ["RA não encontrado"],
          data: [],
        };
      }

      if (!aluno.verificaSenha(senha)) {
        return {
          status: 401,
          erros: ["senha inválida"],
          data: [],
        };
      }
      aluno.senha = "";
      if (!aluno.ativo) {
        return {
          status: 401,
          erros: ["Aluno não está ativo"],
          data: [],
        };
      }

      const token: string = jwt.sign({ aluno }, config.secret as string, {
        expiresIn: (config.expires as string) || "30min",
      });

      return {
        status: 200,
        erros: [],
        data: { aluno, token },
      };
    } catch (e) {
      console.log(e);
      return { status: 500, erros: ["Erro ao fazer login"], data: [] };
    }
  }
}
