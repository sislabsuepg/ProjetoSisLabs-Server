import Evento from "../models/Evento";
import Laboratorio from "../models/Laboratorio";
import codes from "../types/responseCodes";
export default class EventoService {
  static verificaData(data: Date): string[] {
    const erros: string[] = [];
    if (!data) {
      erros.push("Data do evento é obrigatória");
    } else if (data <= new Date()) {
      erros.push("Data do evento não pode ser no passado");
    }
    return erros;
  }

  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (!nome || nome.trim() === "") {
      erros.push("Nome do evento é obrigatório");
    } else if (nome.length < 5 || nome.length > 40) {
      erros.push("Nome do evento deve ter entre 5 e 40 caracteres");
    }
    return erros;
  }

  static verificaDuracao(duracao: number): string[] {
    const erros: string[] = [];
    if (!duracao) {
      erros.push("Duração do evento é obrigatória");
    } else if (duracao <= 0) {
      erros.push("Duração do evento deve ser maior que zero");
    }
    return erros;
  }

  static verificaResponsavel(responsavel: string): string[] {
    const erros: string[] = [];
    if (!responsavel || responsavel.trim() === "") {
      erros.push("Responsável do evento é obrigatório");
    } else if (responsavel.length < 5 || responsavel.length > 40) {
      erros.push("Responsável do evento deve ter entre 5 e 40 caracteres");
    }
    return erros;
  }

  static async getAllEventos() {
    try {
      const eventos = await Evento.findAll({
        include: [
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nome", "numero"],
          },
        ],
      });
      if (!eventos) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhum evento encontrado"],
          data: [],
        };
      }

      return {
        status: codes.OK,
        erros: [],
        data: eventos,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar eventos"],
        data: [],
      };
    }
  }

  static async getEventoById(id: number) {
    try {
      const evento = await Evento.findByPk(id, {
        include: [
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nome", "numero"],
          },
        ],
      });
      if (!evento) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Evento não encontrado"],
          data: [],
        };
      }

      return {
        status: codes.OK,
        erros: [],
        data: evento,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar evento"],
        data: [],
      };
    }
  }

  static async createEvento(
    nome: string,
    data: Date,
    duracao: number,
    responsavel: string,
    idLaboratorio: number
  ) {
    try {
      if (!data || !nome || !duracao || !responsavel || !idLaboratorio) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Dados incompletos"],
          data: [],
        };
      }
      const erros: string[] = [
        ...this.verificaNome(nome),
        ...this.verificaData(data),
        ...this.verificaDuracao(duracao),
        ...this.verificaResponsavel(responsavel),
      ];
      const laboratorio = await Laboratorio.findByPk(idLaboratorio);
      if (!laboratorio) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Laboratório não encontrado"],
          data: [],
        };
      }

      const evento = await Evento.create({
        nome,
        data,
        duracao,
        responsavel,
        idLaboratorio,
      });
      return {
        status: codes.CREATED,
        erros: [],
        data: evento,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar evento"],
        data: [],
      };
    }
  }

  static async updateEvento(
    id: number,
    nome?: string,
    data?: Date,
    duracao?: number,
    responsavel?: string,
    idLaboratorio?: number
  ) {
    try {
      const evento = await Evento.findByPk(id);
      if (!evento) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Evento não encontrado"],
          data: [],
        };
      }

      if (!data && !nome && !duracao && !responsavel && !idLaboratorio) {
        return {
          status: codes.BAD_REQUEST,
          erros: ["Dados não foram fornecidos"],
          data: [],
        };
      }

      const erros: string[] = [
        ...(nome ? this.verificaNome(nome) : []),
        ...(data ? this.verificaData(data) : []),
        ...(duracao ? this.verificaDuracao(duracao) : []),
        ...(responsavel ? this.verificaResponsavel(responsavel) : []),
      ];

      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: erros,
          data: [],
        };
      }
      if (idLaboratorio) {
        const laboratorio = await Laboratorio.findByPk(idLaboratorio);
        if (!laboratorio) {
          return {
            status: codes.NOT_FOUND,
            erros: ["Laboratório não encontrado"],
            data: [],
          };
        }
        evento.laboratorio = laboratorio;
      }
      evento.data = data || evento.data;
      evento.duracao = duracao || evento.duracao;
      evento.responsavel = responsavel || evento.responsavel;
      evento.nome = nome || evento.nome;

      await evento.save();
      return {
        status: codes.OK,
        erros: [],
        data: evento,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar evento"],
        data: [],
      };
    }
  }

  static async deleteEvento(id: number) {
    try {
      const evento = await Evento.findByPk(id);
      if (!evento) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Evento não encontrado"],
          data: [],
        };
      }
      await evento.destroy();
      return {
        status: codes.OK,
        erros: [],
        data: [],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar evento"],
        data: [],
      };
    }
  }
}
