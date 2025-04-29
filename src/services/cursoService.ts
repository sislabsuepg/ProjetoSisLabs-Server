import Curso from "../models/Curso";

export default class CursoService {
  static verificaNome(nome: string) {
    if (!nome) {
      return ["Nome do curso é obrigatório"];
    }
    if (nome.length < 3 || nome.length > 40) {
      return ["Nome do curso deve ter entre 3 e 40 caracteres"];
    }
    if (!/^[a-zA-Z\u00C0-\u00FF ]+$/.test(nome)) {
      return ["Nome do curso deve conter apenas letras e números"];
    }
    return [];
  }

  static async getAllCursos() {
    const cursos = await Curso.findAll();
    if (!cursos) {
      return {
        status: 404,
        erros: ["Nenhum curso encontrado"],
        data: null,
      };
    }
    return {
      status: 200,
      erros: [],
      data: cursos,
    };
  }

  static async getCursoById(id: number) {
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return {
        status: 404,
        erros: ["Curso não encontrado"],
        data: null,
      };
    }
    return {
      status: 200,
      erros: [],
      data: curso,
    };
  }

  static async getCursoByNome(nome: string) {
    const erros: string[] = this.verificaNome(nome);
    if (erros.length > 0) {
      return {
        status: 400,
        erros: erros,
        data: null,
      };
    }
    const curso = await Curso.findOne({ where: { nome: nome } });
    if (!curso) {
      return {
        status: 404,
        erros: ["Curso não encontrado"],
        data: null,
      };
    }
    return {
      status: 200,
      erros: [],
      data: curso,
    };
  }

  static async createCurso(nome: string) {
    const erros: string[] = this.verificaNome(nome);
    if (erros.length > 0) {
      return {
        status: 400,
        erros: erros,
        data: null,
      };
    }

    const existe = await Curso.findOne({ where: { nome: nome } });
    if (existe) {
      return {
        status: 400,
        erros: ["Curso já existe"],
        data: null,
      };
    }

    const curso = await Curso.create({ nome: nome });
    if (!curso) {
      return {
        status: 500,
        erros: ["Erro ao criar curso"],
        data: null,
      };
    }
    return {
      status: 201,
      erros: [],
      data: curso,
    };
  }

  static async updateCurso(id: number, nome: string) {
    const erros: string[] = this.verificaNome(nome);
    if (erros.length > 0) {
      return {
        status: 400,
        erros: erros,
        data: null,
      };
    }
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return {
        status: 404,
        erros: ["Curso não encontrado"],
        data: null,
      };
    }
    curso.nome = nome;
    await curso.save();
    return {
      status: 200,
      erros: [],
      data: curso,
    };
  }

  static async deleteCurso(id: number) {
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return {
        status: 404,
        erros: ["Curso não encontrado"],
        data: null,
      };
    }
    await curso.destroy();
    return {
      status: 200,
      erros: [],
      data: null,
    };
  }
}
