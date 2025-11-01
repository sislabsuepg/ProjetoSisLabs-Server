import Laboratorio from "../models/Laboratorio.js";
import Orientacao from "../models/Orientacao.js";
import horarioCreatorHelper from "../utils/horarioCreatorHelper.js";
import { Op } from "sequelize";
import { getPaginationParams } from "../types/pagination.js";
import { criarRegistro } from "../utils/registroLogger.js";

export default class laboratorioService {
  static verificaNumero(numero: string): string[] {
    const erros: string[] = [];
    if (!numero) {
      erros.push("O número do laboratório é obrigatório.");
    }
    if (!/^[\dA-Za-z]+$/.test(numero)) {
      erros.push("O número deve conter apenas dígitos e letras.");
    }
    if (numero.length > 8) {
      erros.push("O número deve ter no máximo 8 caracteres.");
    }
    return erros;
  }

  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (!nome) {
      erros.push("O nome do laboratório é obrigatório.");
    }
    if (nome.length < 3 || nome.length > 60) {
      erros.push("O nome deve ter entre 3 e 60 caracteres.");
    }
    if (!/^[a-zA-Z\u00C0-\u00FF0-9 ]+$/.test(nome)) {
      erros.push("O nome deve conter apenas letras e números.");
    }
    return erros;
  }

  static async getAllLaboratorios(
    restrito?: boolean,
    offset?: number,
    limit?: number,
    nome?: string,
    ativo?: boolean
  ) {
    try {
      const { rows: laboratorios, count: total } =
        await Laboratorio.findAndCountAll({
          ...getPaginationParams(offset, limit),
          where: {
            ...(restrito !== undefined && { restrito }),
            ...(nome && { nome: { [Op.iLike]: `%${nome}%` } }),
            ...(ativo !== undefined && { ativo }),
          },
          order: [["nome", "ASC"]],
        });
      if (!laboratorios || laboratorios.length === 0) {
        return {
          erros: ["Nenhum laboratório encontrado"],
          data: null,
        };
      } else {
        if (nome) {
          return {
            erros: [],
            data: { laboratorios, total },
          };
        } else {
        }
        return {
          erros: [],
          data: laboratorios,
        };
      }
    } catch (error) {
      return {
        erros: ["Erro ao buscar laboratórios"],
        data: null,
      };
    }
  }

  static async getLaboratorioById(id: number) {
    try {
      const laboratorio = await Laboratorio.findByPk(id);
      if (!laboratorio) {
        return {
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: laboratorio,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar laboratório"],
        data: null,
      };
    }
  }

  static async createLaboratorio(
    numero: string,
    nome: string,
    restrito?: boolean,
    gerarHorarios?: boolean,
    idUsuario?: number
  ) {
    try {
      const erros = [
        ...laboratorioService.verificaNumero(numero),
        ...laboratorioService.verificaNome(nome),
      ];
      if (erros.length > 0) {
        return {
          erros,
          data: null,
        };
      }
      const existe = await Laboratorio.findOne({
        where: {
          [Op.or]: [{ numero }, { nome }],
        },
      });
      if (existe) {
        return {
          erros: ["Laboratório com o mesmo número ou nome já existe"],
          data: null,
        };
      }
      const laboratorio = await Laboratorio.create({
        numero,
        nome,
        restrito: restrito === true,
      });
      let horarios: any[] = [];
      if (gerarHorarios) {
        try {
          horarios = await horarioCreatorHelper(laboratorio.id);
        } catch (e) {
          console.error("Falha ao gerar horários automaticamente", e);
        }
      }
      await criarRegistro(
        idUsuario,
        `Criou laboratório: numero=${numero}; nome=${nome}; restrito=${laboratorio.restrito}`
      );
      return { erros: [], data: { laboratorio, horarios } };
    } catch (error) {
      return {
        erros: ["Erro ao criar laboratório"],
        data: null,
      };
    }
  }

  static async updateLaboratorio(
    id: number,
    numero?: string,
    nome?: string,
    restrito?: boolean,
    ativo?: boolean,
    idUsuario?: number
  ) {
    try {
      const laboratorio = await Laboratorio.findByPk(id);
      if (!laboratorio) {
        return {
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }
      if (!numero && !nome && restrito === undefined && ativo === undefined) {
        return {
          erros: ["Nenhum dado para atualizar"],
          data: null,
        };
      }
      const erros = [
        ...(numero ? laboratorioService.verificaNumero(numero) : []),
        ...(nome ? laboratorioService.verificaNome(nome) : []),
      ];
      if (erros.length > 0) {
        return {
          erros,
          data: null,
        };
      }
      laboratorio.numero = numero == undefined ? laboratorio.numero : numero;
      laboratorio.nome = nome == undefined ? laboratorio.nome : nome;
      laboratorio.restrito =
        restrito == undefined ? laboratorio.restrito : restrito;
      laboratorio.ativo = ativo === undefined ? laboratorio.ativo : ativo;
      await laboratorio.save();
      await criarRegistro(
        idUsuario,
        `Atualizou laboratório: numero=${laboratorio.numero}; nome=${laboratorio.nome}; ativo=${laboratorio.ativo}`
      );
      return { erros: [], data: laboratorio };
    } catch (error) {
      return {
        erros: ["Erro ao atualizar laboratório"],
        data: null,
      };
    }
  }

  static async deleteLaboratorio(id: number, idUsuario?: number) {
    try {
      const laboratorio = await Laboratorio.findByPk(id, {
        include: [{ model: Orientacao }],
      });
      if (!laboratorio) {
        return {
          erros: ["Laboratório não encontrado"],
          data: null,
        };
      }

      laboratorio.ativo = false;
      await laboratorio.save();

      // Desativa todas as orientações ativas do laboratório (dataFim no futuro)
      if (laboratorio.orientacoes && laboratorio.orientacoes.length > 0) {
        const hoje = new Date();
        const orientacoesAbertas = laboratorio.orientacoes.filter(
          (orientacao) => orientacao.dataFim > hoje
        );

        for (const orientacao of orientacoesAbertas) {
          // Se a orientação ainda não começou, ajusta a data de início
          if (orientacao.dataInicio > hoje) {
            orientacao.dataInicio = hoje;
          }
          orientacao.dataFim = hoje;
          await orientacao.save();
        }

        if (orientacoesAbertas.length > 0) {
          await criarRegistro(
            idUsuario,
            `Desativou laboratório: numero=${laboratorio.numero}; nome=${laboratorio.nome} e ${orientacoesAbertas.length} orientação(ões) ativa(s)`
          );
        } else {
          await criarRegistro(
            idUsuario,
            `Desativou laboratório: numero=${laboratorio.numero}; nome=${laboratorio.nome}`
          );
        }
      } else {
        await criarRegistro(
          idUsuario,
          `Desativou laboratório: numero=${laboratorio.numero}; nome=${laboratorio.nome}`
        );
      }

      return { erros: [], data: null };
    } catch (error) {
      console.log(error);
      return {
        erros: ["Erro ao desativar laboratório"],
        data: null,
      };
    }
  }

  static async getCount() {
    try {
      const count = await Laboratorio.count();
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
