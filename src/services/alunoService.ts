import { Op } from "sequelize";
import Aluno from "../models/Aluno";
import config from "../config/config";
import jwt from "jsonwebtoken";
import Curso from "../models/Curso";
import codes from "../types/responseCodes";
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
    if (!/\d{10}/.test(telefone)) {
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
    if (email.length > 40) {
      erros.push("Email do aluno deve ter no máximo 40 caracteres");
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
          status: codes.NO_CONTENT,
          erros: ["Nenhum aluno encontrado"],
          data: [],
        };
      }

      return {
        status: codes.OK,
        erros: [],
        data: alunos,
      };
    } catch (e) {
      console.log(e);
      return { status: codes.INTERNAL_SERVER_ERROR, erros: e, data: [] };
    }
  }

  static async searchAlunos(nome?: string, ra?: string) {
    try {
      if (!nome && !ra) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Nome ou RA devem ser informados para busca"],
          data: [],
        };
      }
      const erros: string[] = [
        ...(nome ? this.verificaNome(nome) : []),
        ...(ra ? this.verificaRa(ra) : []),
      ];

      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
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
          status: codes.NO_CONTENT,
          erros: ["Nenhum aluno encontrado"],
          data: [],
        };
      }

      return {
        status: codes.OK,
        erros: [],
        data: alunos,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar alunos"],
        data: [],
      };
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
          status: codes.NO_CONTENT,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      return {
        status: codes.OK,
        erros: [],
        data: aluno,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar aluno"],
        data: [],
      };
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
      if (!nome || !ra || !anoCurso || !senha || !idCurso) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Todos os campos obrigatórios devem ser preenchidos"],
          data: [],
        };
      }

      const erros: string[] = [
        ...this.verificaRa(ra),
        ...this.verificaNome(nome),
        ...this.verificaAnoCurso(anoCurso),
        ...this.verificaSenha(senha),
        ...(telefone ? this.verificaTelefone(telefone) : []),
        ...(email ? this.verificaEmail(email) : []),
        ...(idCurso ? [] : ["ID do curso é obrigatório"]),
      ];

      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: erros,
          data: [],
        };
      }

      const curso = await Curso.findByPk(idCurso);
      if (!curso) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["ID do curso inválido"],
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
          status: codes.CONFLICT,
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
          status: codes.BAD_REQUEST,
          erros: ["Erro ao criar aluno"],
          data: [],
        };
      }

      aluno.senha = ""; // Não retornar a senha no response
      aluno.curso = curso; // Incluir o curso no response

      return {
        status: codes.CREATED,
        erros: [],
        data: aluno,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar aluno"],
        data: [],
      };
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
          status: codes.NOT_FOUND,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      if (!nome && !telefone && !anoCurso && !email && ativo === undefined) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Pelo menos um campo deve ser informado"],
          data: [],
        };
      }

      const erros: string[] = [
        ...(nome ? this.verificaNome(nome) : []),
        ...(telefone ? this.verificaTelefone(telefone) : []),
        ...(email ? this.verificaEmail(email) : []),
        ...(anoCurso || (anoCurso && anoCurso > aluno.curso.anosMaximo)
          ? this.verificaAnoCurso(anoCurso)
          : []),
      ];

      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
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
        status: codes.OK,
        erros: [],
        data: alunoAtualizado,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar aluno"],
        data: [],
      };
    }
  }

  static async updateSenhaAluno(ra: string, novaSenha: string) {
    try {
      const aluno = await Aluno.findByPk(ra);
      if (!aluno) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      if (this.verificaSenha(novaSenha).length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: this.verificaSenha(novaSenha),
          data: [],
        };
      }

      aluno.atualizaSenha(novaSenha);
      await aluno.save();

      return {
        status: codes.OK,
        erros: [],
        data: ["Senha atualizada com sucesso"],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar senha"],
        data: [],
      };
    }
  }

  static async deleteAluno(ra: string) {
    try {
      const aluno = await Aluno.findByPk(ra);
      if (!aluno) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      await aluno.destroy();

      return {
        status: codes.OK,
        erros: [],
        data: ["Aluno excluído com sucesso"],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao excluir aluno"],
        data: [],
      };
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
          status: codes.NOT_FOUND,
          erros: ["RA não encontrado"],
          data: null,
        };
      }

      if (!aluno.verificaSenha(senha)) {
        return {
          status: codes.UNAUTHORIZED,
          erros: ["senha inválida"],
          data: null,
        };
      }
      aluno.senha = "";
      if (!aluno.ativo) {
        return {
          status: codes.UNAUTHORIZED,
          erros: ["Aluno não está ativo"],
          data: null,
        };
      }

      let expires: number = parseInt(config.expires as string) || 1800;

      const token: string = jwt.sign({ aluno }, config.secret as string, {
        expiresIn: expires,
      });

      return {
        status: codes.OK,
        erros: [],
        data: { aluno, token },
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao fazer login"],
        data: null,
      };
    }
  }
}
