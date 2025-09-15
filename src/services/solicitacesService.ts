import Laboratorio from "../models/Laboratorio";
import Aluno from "../models/Aluno";

interface Solicitacao {
  id: string;
  idAluno: number;
  idLaboratorio: number;
  aluno: {
    id: number;
    nome: string;
    ra: string;
  };
  laboratorio: {
    id: number;
    nome: string;
    numero: string;
  };
}

export default class SolicitacoesService {
  private static solicitacoes: Solicitacao[] = [];

  static async solicitarLaboratorio(idAluno: number, idLaboratorio: number) {
    try {
      const aluno = await Aluno.findByPk(idAluno);
      if (!aluno) {
        return {
          erros: ["Aluno não encontrado"],
          data: [],
        };
      }

      const laboratorio = await Laboratorio.findByPk(idLaboratorio);
      if (!laboratorio) {
        return {
          erros: ["Laboratório não encontrado"],
          data: [],
        };
      }

      const solicitacao: Solicitacao = {
        id: crypto.randomUUID() as unknown as string,
        idAluno,
        idLaboratorio,
        aluno: {
          id: aluno.id,
          nome: aluno.nome,
          ra: aluno.ra,
        },
        laboratorio: {
          id: laboratorio.id,
          nome: laboratorio.nome,
          numero: laboratorio.numero,
        },
      };
      this.solicitacoes.push(solicitacao);
      return {
        erros: [],
        data: solicitacao,
      };
    } catch (error) {
      console.error("Erro ao solicitar laboratório:", error);
      return {
        erros: ["Erro ao solicitar laboratório"],
        data: [],
      };
    }
  }

  static async responderSolicitacao(id: string, aceita: boolean) {
    const index = this.solicitacoes.findIndex((s) => s.id === id);
    if (index === -1) {
      return {
        erros: ["Solicitação não encontrada"],
        data: [],
      };
    }
    this.solicitacoes.splice(index, 1);
    return {
      erros: [],
      data: { message: `Solicitação ${aceita ? "aceita" : "rejeitada"}` },
    };
  }

  static async listarSolicitacoes() {
    return {
      erros: [],
      data: this.solicitacoes,
    };
  }
}
