import Curso from "../models/Curso";

export default class CursoService {
  static verificaNome(nome: string) {
    if (!nome) {
      return ["Nome do curso é obrigatório"];
    }
    if (nome.length < 3 || nome.length > 40) {
      return ["Nome do curso deve ter entre 3 e 40 caracteres"];
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(nome)) {
      return ["Nome do curso deve conter apenas letras e números"];
    }
    return [];
  }

  static async getAllCursos() {
    return (
      (await Curso.findAll({
        order: [["nome", "ASC"]],
      })) || []
    );
  }

  static async getCursoById(id: number) {
    return await Curso.findByPk(id);
  }

  static async getCursoByNome(nome: string) {
    let erros = this.verificaNome(nome);
    if (erros.length > 0) {
      return Promise.reject(erros);
    }
    return await Curso.findOne({ where: { nome } });
  }

  static async createCurso(nome: string) {
    let erros = this.verificaNome(nome);
    if (erros.length > 0) {
      return Promise.reject(erros);
    }

    const cursoExistente = await Curso.findOne({ where: { nome } });
    if (cursoExistente) {
      return Promise.reject(["Curso já existe"]);
    }

    return await Curso.create({ nome });
  }

  static async updateCurso(id: number, nome: string) {
    let erros = this.verificaNome(nome);
    if (erros.length > 0) {
      return Promise.reject(erros);
    }
    const curso = await Curso.findByPk(id);
    if (curso) {
      curso.nome = nome;
      return await curso.save();
    }
    return Promise.reject(["Curso não encontrado"]);
  }

  static async deleteCurso(id: number) {
    const curso = await Curso.findByPk(id);
    if (curso) {
      return await curso.destroy();
    }
    return Promise.reject(["Curso não encontrado"]);
  }
}
