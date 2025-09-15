import Laboratorio from "../models/Laboratorio";
import Orientacao from "../models/Orientacao";
import Aluno from "../models/Aluno";
import { Op } from "sequelize";
import md5 from "md5";

export default class AtualizacoesService {
  static async atualizaSenhaAluno(ra: string, novaSenha: string) {
    const aluno = await Aluno.findOne({ where: { ra } });
    if (!aluno) {
      return {
        erros: ["Aluno não encontrado"],
        data: [],
      };
    }

    aluno.senha = md5(novaSenha);
    await aluno.save();

    return {
      erros: [],
      data: aluno,
    };
  }

  static async atualizaPerfilAluno(
    ra: string,
    telefone?: string,
    email?: string
  ) {
    const aluno = await Aluno.findOne({ where: { ra } });
    if (!aluno) {
      return {
        erros: ["Aluno não encontrado"],
        data: [],
      };
    }

    if (telefone) {
      aluno.telefone = telefone;
    }
    if (email) {
      aluno.email = email;
    }
    await aluno.save();

    return {
      erros: [],
      data: aluno,
    };
  }
}
