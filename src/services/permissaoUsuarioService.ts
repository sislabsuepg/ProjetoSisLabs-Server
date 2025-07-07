import PermissaoUsuario from "../models/PermissaoUsuario";

import { Op } from "sequelize";

export default class PermissaoUsuarioService {
  static async getAllPermissoes() {
    try {
      const permissoes = await PermissaoUsuario.findAll();

      if (!permissoes) {
        return {
          status: 404,
          erros: ["Nenhuma permissão encontrada"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: permissoes,
      };
    } catch (e) {
      return {
        status: 500,
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
          status: 404,
          erros: ["Permissão não encontrada"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
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
          status: 404,
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao buscar permissao de usuario"],
        data: [],
      };
    }
  }

  static async createPermissaoUsuario(
    nomePermissao: string,
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
          status: 400,
          erros: ["Permissão de usuario já existe"],
          data: [],
        };
      }
      if (!nomePermissao) {
        return {
          status: 400,
          erros: ["Nome da permissão é obrigatório"],
          data: [],
        };
      }

      const novaPermissaoUsuario: any = {
        nomePermissao,
        cadastro: cadastro || false,
        alteracao: alteracao || false,
        relatorio: relatorio || false,
        excluir: excluir || false,
      };

      const permissaoUsuario = await PermissaoUsuario.create(
        novaPermissaoUsuario
      );

      if (!permissaoUsuario) {
        return {
          status: 404,
          erros: ["Permissão de usuario não criada"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao criar permissão de usuario"],
        data: [],
      };
    }
  }

  static async updatePermissaoUsuario(id: number, requisicao: any) {
    try {
      const permissaoUsuario = await PermissaoUsuario.findByPk(id);
      if (!permissaoUsuario) {
        return {
          status: 404,
          erros: ["Permissão de usuario não encontrada"],
          data: [],
        };
      }

      if (requisicao.nomePermissao) {
        requisicao.nomePermissao = permissaoUsuario.nomePermissao;
      }
      if (requisicao.cadastro) {
        requisicao.cadastro = permissaoUsuario.cadastro;
      }
      if (requisicao.alteracao) {
        requisicao.alteracao = permissaoUsuario.alteracao;
      }
      if (requisicao.relatorio) {
        requisicao.relatorio = permissaoUsuario.relatorio;
      }
      if (requisicao.advertencia) {
        requisicao.advertencia = permissaoUsuario.advertencia;
      }

      await permissaoUsuario.save();

      return {
        status: 200,
        erros: [],
        data: permissaoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
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
          status: 404,
          erros: ["Permissão de usuario não encontrada"],
          data: [],
        };
      }

      await permissaoUsuario.destroy();

      return {
        status: 200,
        erros: [],
        data: ["Permissão de usuario deletada com sucesso"],
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao deletar permissão de usuario"],
        data: [],
      };
    }
  }
}
