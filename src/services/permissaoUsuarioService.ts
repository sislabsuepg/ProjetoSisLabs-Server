import PermissaoUsuario from "../models/PermissaoUsuario";

import { Op } from "sequelize";

import codes from "../types/responseCodes";
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

  static async getAllPermissoes() {
    try {
      const permissoes = await PermissaoUsuario.findAll();

      if (!permissoes) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhuma permissão encontrada"],
          data: [],
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: permissoes,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          erros: ["Permissão não encontrada"],
          data: [],
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar permissão"],
        data: [],
      };
    }
  }

  static async getPermissaoUsuarioByNome(nome: string) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findOne({
        where: {
          nomePermissao: { [Op.like]: `%${nome}%` },
        },
      });

      if (!permissaoUsuario) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.CONFLICT,
          erros: ["Permissão de usuario já existe"],
          data: [],
        };
      }
      if (!nomePermissao) {
        return {
          status: codes.BAD_REQUEST,
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
        status: codes.CREATED,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
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
          status: codes.BAD_REQUEST,
          erros: ["Nenhum campo para atualização foi fornecido"],
          data: [],
        };
      }

      const erros = [
        ...(nomePermissao ? this.verificaNomePermissao(nomePermissao) : []),
      ];
      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
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
        status: codes.OK,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
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
          status: codes.NO_CONTENT,
          erros: ["Permissão de usuario não encontrada"],
          data: [],
        };
      }

      await permissaoUsuario.destroy();

      return {
        status: codes.OK,
        erros: [],
        data: ["Permissão de usuario deletada com sucesso"],
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar permissão de usuario"],
        data: [],
      };
    }
  }
}
