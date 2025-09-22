import PermissaoUsuario from "../models/PermissaoUsuario.js";
import { Op } from "sequelize";
import { getPaginationParams } from "../types/pagination.js";
import { criarRegistro } from "../utils/registroLogger.js";
export default class PermissaoUsuarioService {
  static verificaNomePermissao(nomePermissao: string): string[] {
    const erros: string[] = [];
    if (!nomePermissao) {
      erros.push("O nome da permissão é obrigatório.");
    }
    if (nomePermissao.length < 3 || nomePermissao.length > 40) {
      erros.push("O nome da permissão deve ter entre 3 e 40 caracteres.");
    }
    if (!/^[a-zA-Z\u00C0-\u00FF0-9 ]+$/.test(nomePermissao)) {
      erros.push("O nome da permissão deve conter apenas letras e números.");
    }
    return erros;
  }

  static async getAllPermissoes(
    page?: number,
    items?: number,
    ativo?: boolean
  ) {
    try {
      const permissoes = await PermissaoUsuario.findAll({
        order: [["nomePermissao", "ASC"]],
        ...getPaginationParams(page, items),
        ...(ativo !== undefined && { where: { ativo } }),
      });

      if (!permissoes || permissoes.length === 0) {
        return {
          erros: ["Nenhuma permissão encontrada"],
          data: [],
        };
      }
      return {
        erros: [],
        data: permissoes,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar permissoes"],
        data: [],
      };
    }
  }

  static async getPermissaoUsuarioById(id: number) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findByPk(id);

      if (!permissaoUsuario) {
        return {
          erros: ["Permissão não encontrada"],
          data: [],
        };
      }
      return {
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar permissão"],
        data: [],
      };
    }
  }

  static async getPermissaoUsuarioByNome(
    nome: string,
    page?: number,
    items?: number,
    ativo?: boolean
  ) {
    try {
      const { rows: permissaoUsuario, count: total } =
        await PermissaoUsuario.findAndCountAll({
          where: {
            nomePermissao: { [Op.iLike]: `%${nome}%` },
            ...(ativo !== undefined && { ativo }),
          },
          order: [["nomePermissao", "ASC"]],
          ...getPaginationParams(page, items),
        });

      if (!permissaoUsuario || permissaoUsuario.length === 0) {
        return {
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }
      return {
        erros: [],
        data: { permissaoUsuario, total },
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar permissao de usuario"],
        data: [],
      };
    }
  }

  static async createPermissaoUsuario(
    nomePermissao: string,
    geral?: boolean,
    cadastro?: boolean,
    alteracao?: boolean,
    relatorio?: boolean,
    excluir?: boolean,
    idUsuario?: number
  ) {
    try {
      const permissaoUsuarioExistente = await PermissaoUsuario.findOne({
        where: { nomePermissao },
      });
      if (permissaoUsuarioExistente) {
        return {
          erros: ["Permissão de usuario já existe"],
          data: [],
        };
      }
      if (!nomePermissao) {
        return {
          erros: ["Nome da permissão é obrigatório"],
          data: [],
        };
      }

      const novaPermissaoUsuario: any = {
        nomePermissao,
        geral: geral || false,
        cadastro: cadastro || false,
        alteracao: alteracao || false,
        relatorio: relatorio || false,
        advertencia: excluir || false,
      };

      const permissaoUsuario = await PermissaoUsuario.create(
        novaPermissaoUsuario
      );
      await criarRegistro(idUsuario, `Criou permissão: nome=${nomePermissao}`);
      return { erros: [], data: permissaoUsuario };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao criar permissão de usuario"],
        data: [],
      };
    }
  }

  static async updatePermissaoUsuario(
    id: number,
    nomePermissao?: string,
    geral?: boolean,
    cadastro?: boolean,
    alteracao?: boolean,
    relatorio?: boolean,
    advertencia?: boolean,
    ativo?: boolean,
    idUsuario?: number
  ) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findByPk(id);
      if (!permissaoUsuario) {
        return {
          erros: ["Permissão de usuario não encontrada"],
          data: [],
        };
      }

      if (
        !nomePermissao &&
        !cadastro &&
        !alteracao &&
        !relatorio &&
        !advertencia &&
        !geral &&
        ativo === undefined
      ) {
        return {
          erros: ["Nenhum campo para atualização foi fornecido"],
          data: [],
        };
      }

      const erros = [
        ...(nomePermissao ? this.verificaNomePermissao(nomePermissao) : []),
      ];
      if (erros.length > 0) {
        return {
          erros,
          data: [],
        };
      }

      permissaoUsuario.nomePermissao =
        nomePermissao == undefined
          ? permissaoUsuario.nomePermissao
          : nomePermissao;
      permissaoUsuario.cadastro =
        cadastro == undefined ? permissaoUsuario.cadastro : cadastro;
      permissaoUsuario.alteracao =
        alteracao == undefined ? permissaoUsuario.alteracao : alteracao;
      permissaoUsuario.relatorio =
        relatorio == undefined ? permissaoUsuario.relatorio : relatorio;
      permissaoUsuario.advertencia =
        advertencia == undefined ? permissaoUsuario.advertencia : advertencia;
      permissaoUsuario.geral =
        geral == undefined ? permissaoUsuario.geral : geral;
      permissaoUsuario.ativo =
        ativo == undefined ? permissaoUsuario.ativo : ativo;

      await permissaoUsuario.save();
      await criarRegistro(
        idUsuario,
        `Atualizou permissão: nome=${permissaoUsuario.nomePermissao}; ativo=${permissaoUsuario.ativo}`
      );
      return { erros: [], data: permissaoUsuario };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar permissão de usuario"],
        data: [],
      };
    }
  }

  static async deletePermissaoUsuario(id: number, idUsuario?: number) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findByPk(id);
      if (!permissaoUsuario) {
        return {
          erros: ["Permissão de usuario não encontrada"],
          data: [],
        };
      }

      permissaoUsuario.ativo = false;
      await permissaoUsuario.save();
      await criarRegistro(
        idUsuario,
        `Desativou permissão: nome=${permissaoUsuario.nomePermissao}`
      );
      return {
        erros: [],
        data: ["Permissão de usuario desativada com sucesso"],
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao desativar permissão de usuario"],
        data: [],
      };
    }
  }

  static async getCount(ativo?: boolean) {
    try {
      const count = await PermissaoUsuario.count();
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
