import TipoUsuario from "../models/TipoUsuario";

import { Op } from "sequelize";

export default class TipoUsuarioService {
  static async getAllTipoUsuarios() {
    try {
      const tipoUsuarios = await TipoUsuario.findAll();

      if (!tipoUsuarios) {
        return {
          status: 404,
          erros: ["Nenhum tipo de usuario encontrado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: tipoUsuarios,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao buscar tipos de usuario"],
        data: [],
      };
    }
  }

  static async getTipoUsuarioById(id: number) {
    try {
      const tipoUsuario = await TipoUsuario.findByPk(id);

      if (!tipoUsuario) {
        return {
          status: 404,
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: tipoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao buscar tipo de usuario"],
        data: [],
      };
    }
  }

  static async getTipoUsuarioByNome(nome: string) {
    try {
      const tipoUsuario = await TipoUsuario.findOne({
        where: {
          nome: { [Op.like]: `%${nome}%` },
        },
      });

      if (!tipoUsuario) {
        return {
          status: 404,
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: tipoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao buscar tipo de usuario"],
        data: [],
      };
    }
  }

  static async createTipoUsuario(
    nome: string,
    cadastro?: boolean,
    alteracao?: boolean,
    relatorio?: boolean,
    excluir?: boolean
  ) {
    try {
      const tipoUsuarioExistente = await TipoUsuario.findOne({
        where: { nome },
      });
      if (tipoUsuarioExistente) {
        return {
          status: 400,
          erros: ["Tipo de usuario já existe"],
          data: [],
        };
      }
      if (!nome) {
        return {
          status: 400,
          erros: ["Nome do tipo de usuario é obrigatório"],
          data: [],
        };
      }

      const novoTipoUsuario: any = {
        nome,
        cadastro: cadastro || false,
        alteracao: alteracao || false,
        relatorio: relatorio || false,
        excluir: excluir || false,
      };

      const tipoUsuario = await TipoUsuario.create(novoTipoUsuario);

      if (!tipoUsuario) {
        return {
          status: 404,
          erros: ["Tipo de usuario não criado"],
          data: [],
        };
      }
      return {
        status: 200,
        erros: [],
        data: tipoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao criar tipo de usuario"],
        data: [],
      };
    }
  }

  static async updateTipoUsuario(id: number, requisicao: any) {
    try {
      const tipoUsuario = await TipoUsuario.findByPk(id);
      if (!tipoUsuario) {
        return {
          status: 404,
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }

      if (requisicao.nome) {
        requisicao.nome = tipoUsuario.nome;
      }
      if (requisicao.cadastro) {
        requisicao.cadastro = tipoUsuario.cadastro;
      }
      if (requisicao.alteracao) {
        requisicao.alteracao = tipoUsuario.alteracao;
      }
      if (requisicao.relatorio) {
        requisicao.relatorio = tipoUsuario.relatorio;
      }
      if (requisicao.advertencia) {
        requisicao.advertencia = tipoUsuario.advertencia;
      }

      await tipoUsuario.save();

      return {
        status: 200,
        erros: [],
        data: tipoUsuario,
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao atualizar tipo de usuario"],
        data: [],
      };
    }
  }

  static async deleteTipoUsuario(id: number) {
    try {
      const tipoUsuario = await TipoUsuario.findByPk(id);
      if (!tipoUsuario) {
        return {
          status: 404,
          erros: ["Tipo de usuario não encontrado"],
          data: [],
        };
      }

      await tipoUsuario.destroy();

      return {
        status: 200,
        erros: [],
        data: ["Tipo de usuario deletado com sucesso"],
      };
    } catch (e) {
      return {
        status: 500,
        erros: ["Erro ao deletar tipo de usuario"],
        data: [],
      };
    }
  }
}
