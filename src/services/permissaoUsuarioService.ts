import PermissaoUsuario from "../models/PermissaoUsuario.js";

import { Op } from "sequelize";

import { getPaginationParams } from "../types/pagination.js";
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

  static async getAllPermissoes(page?: number, items?: number) {
    try {
      const permissoes = await PermissaoUsuario.findAll({
        order: [["id", "ASC"]],
        ...getPaginationParams(page, items),
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
    items?: number
  ) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findOne({
        where: {
          nomePermissao: { [Op.iLike]: `%${nome}%` },
        },
        ...getPaginationParams(page, items),
      });

      if (!permissaoUsuario) {
        return {
          erros: ["Tipo de usuario não encontrado"],
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
    excluir?: boolean
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

      return {
        erros: [],
        data: permissaoUsuario,
      };
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
    advertencia?: boolean
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
        !geral
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
        nomePermissao || permissaoUsuario.nomePermissao;
      permissaoUsuario.cadastro = cadastro || permissaoUsuario.cadastro;
      permissaoUsuario.alteracao = alteracao || permissaoUsuario.alteracao;
      permissaoUsuario.relatorio = relatorio || permissaoUsuario.relatorio;
      permissaoUsuario.advertencia =
        advertencia || permissaoUsuario.advertencia;
      permissaoUsuario.geral = geral || permissaoUsuario.geral;

      await permissaoUsuario.save();

      return {
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar permissão de usuario"],
        data: [],
      };
    }
  }

  static async deletePermissaoUsuario(id: number) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findByPk(id);
      if (!permissaoUsuario) {
        return {
          erros: ["Permissão de usuario não encontrada"],
          data: [],
        };
      }

      await permissaoUsuario.destroy();

      return {
        erros: [],
        data: ["Permissão de usuario deletada com sucesso"],
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao deletar permissão de usuario"],
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
