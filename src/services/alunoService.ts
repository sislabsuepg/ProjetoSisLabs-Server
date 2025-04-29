import Aluno from "../models/Aluno";

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
  }
}
