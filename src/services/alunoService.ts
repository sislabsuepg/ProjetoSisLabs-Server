import { Op } from "sequelize";
import Aluno from "../models/Aluno.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import Curso from "../models/Curso.js";
import { getPaginationParams } from "../types/pagination.js";
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
    let telefoneLimpo = telefone.replace(/\D/g, "");
    if (!telefoneLimpo) {
      return []
    }
    if (!/^\d{10,15}$/.test(telefoneLimpo)) {
      erros.push(
        "Telefone inválido (deve conter entre 10 e 15 dígitos numéricos)"
      );
    }
    return erros;
  }

  static verificaAnoCurso(ano: number): string[] {
    const erros: string[] = [];
    if (ano < 1) {
      erros.push("Ano do curso não pode ser inferior a 1");
    }
    if (ano > 8) {
      erros.push("Ano do curso não pode ser superior a 8");
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

  static async getCount(ativo?: boolean) {
    try {
      const count: number = await Aluno.count({
        where: {
          ativo: {
            [Op.or]: ativo === undefined ? [true, false] : [ativo],
          },
        },
      });
      return count;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  static async getAllAlunos(offset?: number, limit?: number, ativo?: boolean) {
    try {
      const alunos: Aluno[] = await Aluno.findAll({
        attributes: [
          "id",
          "ra",
          "nome",
          "telefone",
          "anoCurso",
          "email",
          "ativo",
        ],
        include: {
          model: Curso,
        },
        order: [["nome", "ASC"]],
        where: {
          ativo: {
            [Op.or]: ativo === undefined ? [true, false] : [ativo],
          },
        },
        ...getPaginationParams(offset, limit),
      });

      if (alunos.length === 0) {
        return {
          erros: ["Nenhum aluno encontrado"],
          data: [],
        };
      }

      return {
        erros: [],
        data: alunos,
      };
    } catch (e) {
      console.log(e);
      return { erros: e, data: [] };
    }
  }

  static async searchAlunos(
    nome?: string,
    ra?: string,
    ativo?: boolean,
    offset?: number,
    limit?: number
  ) {
    try {
      if (!nome && !ra) {
        return {
          erros: ["Nome ou RA devem ser informados para busca"],
          data: [],
        };
      }
      const erros: string[] = [
        ...(nome ? this.verificaNome(nome as string) : []),
        ...(ra ? this.verificaRa(ra as string) : []),
      ];

      if (erros.length > 0) {
        return {
          erros: erros,
          data: [],
        };
      }
      const alunos: Aluno[] = await Aluno.findAll({
        where: {
          [Op.or]: [
            ...(nome ? [{ nome: { [Op.like]: `%${nome}%` } }] : []),
            ...(ra ? [{ ra: { [Op.like]: `${ra || ""}` } }] : []),
          ],
          [Op.and]: [
              { ativo: { [Op.eq]: ativo === undefined ? true : ativo } },
            ],
        },
        order: [["nome", "ASC"]],
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
        ...getPaginationParams(offset, limit),
      });

      if (!alunos || alunos.length === 0) {
        return {
          erros: ["Nenhum aluno encontrado"],
          data: [],
        };
      }

      return {
        erros: [],
        data: alunos,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar alunos"],
        data: [],
      };
    }
  }

  static async getAlunoById(id: number) {
    try {
      const aluno: Aluno | null = await Aluno.findByPk(id, {
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
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      return {
        erros: [],
        data: aluno,
      };
    } catch (e) {
      console.log(e);
      return {
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
          erros: erros,
          data: [],
        };
      }

      const curso = await Curso.findByPk(idCurso);
      if (!curso) {
        return {
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
          erros: ["RA já cadastrado"],
          data: [],
        };
      }

      const novoAluno: any = {};

      const telefoneLimpo = telefone ? telefone.replace(/\D/g, "") : null;

      for (const [key, value] of Object.entries({
        ra,
        nome,
        telefone: telefoneLimpo,
        anoCurso,
        email,
        senha,
        idCurso,
      })) {
        if (value) {
          novoAluno[key] = value;
        }
      }

      const aluno: Aluno | null = await Aluno.create(novoAluno);
      if (!aluno) {
        return {
          erros: ["Erro ao criar aluno"],
          data: [],
        };
      }

      aluno.senha = ""; // Não retornar a senha no response
      aluno.curso = curso; // Incluir o curso no response

      return {
        erros: [],
        data: aluno,
      };
    } catch (e) {
      console.log(e);
      return {
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
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      if (!nome && !telefone && !anoCurso && !email && ativo === undefined) {
        return {
          erros: ["Pelo menos um campo deve ser informado"],
          data: [],
        };
      }

      const erros: string[] = [
        ...(nome ? this.verificaNome(nome) : []),
        ...(telefone ? this.verificaTelefone(telefone) : []),
        ...(email ? this.verificaEmail(email) : []),
        ...(anoCurso ? this.verificaAnoCurso(anoCurso) : []),
        ...((anoCurso && anoCurso > aluno.curso.anosMaximo) ? ["Ano do curso inválido"] : [])
      ];

      if (erros.length > 0) {
        return {
          erros: erros,
          data: [],
        };
      }

      aluno.nome = nome == undefined ? aluno.nome : nome;
      aluno.telefone = telefone == undefined ? "" : telefone.replace(/\D/g, "");
      aluno.anoCurso = anoCurso == undefined ? aluno.anoCurso : anoCurso;
      aluno.email = email == undefined ? aluno.email : email;
      aluno.ativo = ativo === undefined ? aluno.ativo : ativo;

      const alunoAtualizado = await aluno.save();

      return {
        erros: [],
        data: alunoAtualizado,
      };
    } catch (e) {
      console.log(e);
      return {
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
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      if (this.verificaSenha(novaSenha).length > 0) {
        return {
          erros: this.verificaSenha(novaSenha),
          data: [],
        };
      }

      aluno.atualizaSenha(novaSenha);
      await aluno.save();

      return {
        erros: [],
        data: ["Senha atualizada com sucesso"],
      };
    } catch (e) {
      console.log(e);
      return {
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
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      aluno.ativo = false;
      await aluno.save();

      return {
        erros: [],
        data: null,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao desativar aluno"],
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
          erros: ["RA não encontrado"],
          data: null,
        };
      }

      if (!aluno.verificaSenha(senha)) {
        return {
          erros: ["Senha inválida"],
          data: null,
        };
      }
      aluno.senha = "";
      if (!aluno.ativo) {
        return {
          erros: ["Aluno não está ativo"],
          data: null,
        };
      }

      let expires: number = parseInt(config.expires as string) || 1800;

      const token: string = jwt.sign({ aluno }, config.secret as string, {
        expiresIn: expires,
      });

      return {
        erros: [],
        data: { aluno, token },
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao fazer login"],
        data: null,
      };
    }
  }
}
