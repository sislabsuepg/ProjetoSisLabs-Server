import Usuario from "../models/Usuario";
import PermissaoUsuario from "../models/PermissaoUsuario";
import config from "../config/config";
import jwt from "jsonwebtoken";
import codes from "../types/responseCodes";
export default class UsuarioService {
  static verificaLogin(login: string): string[] {
    const erros: string[] = [];
    if (login.length < 3 || login.length > 20) {
      erros.push("Login deve ter entre 3 e 20 caracteres");
    }
    if (!/^[a-zA-Z]+$/.test(login)) {
      erros.push("Login deve conter apenas letras");
    }
    return erros;
  }

  static verificaSenha(senha: string): string[] {
    const erros: string[] = [];
    if (senha.length < 6 || senha.length > 20) {
      erros.push("Senha deve ter entre 6 e 20 caracteres");
    }
    if (!/^[0-9a-zA-Z]+$/.test(senha)) {
      erros.push("Senha deve conter apenas números e letras");
    }
    return erros;
  }

  static verificaNome(nome: string): string[] {
    const erros: string[] = [];
    if (nome.length < 3 || nome.length > 40) {
      erros.push("Nome deve ter entre 3 e 40 caracteres");
    }
    if (!/^[a-zA-Z \u00C0-\u00FF]+$/.test(nome)) {
      erros.push("Nome deve conter apenas letras");
    }
    return erros;
  }

  static async getAllUsuarios() {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nome", "login", "ativo"],
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuarios) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Nenhum usuário encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: usuarios,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar usuários"],
        data: null,
      };
    }
  }

  static async getUsuarioById(id: number) {
    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: ["id", "nome", "login", "ativo"],
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuario) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      return {
        status: codes.OK,
        erros: [],
        data: usuario,
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao buscar usuário"],
        data: null,
      };
    }
  }

  static async createUsuario(
    login: string,
    senha: string,
    nome: string,
    idPermissao: number
  ) {
    const erros: string[] = [
      ...this.verificaLogin(login),
      ...this.verificaSenha(senha),
      ...this.verificaNome(nome),
    ];
    if (erros.length > 0) {
      return { status: codes.BAD_REQUEST, erros, data: null };
    }

    try {
      const usuarioExistente = await Usuario.findOne({ where: { login } });
      if (usuarioExistente) {
        return {
          status: codes.CONFLICT,
          erros: ["Login já existe"],
          data: null,
        };
      }
      const permissao = await PermissaoUsuario.findByPk(idPermissao);
      if (!permissao) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Permissão não encontrada"],
          data: null,
        };
      }
      const usuario = await Usuario.create({
        login,
        senha,
        nome,
        idPermissao,
        ativo: true,
      });
      return {
        status: codes.CREATED,
        erros: [],
        data: {
          id: usuario.id,
          nome: usuario.nome,
          login: usuario.login,
          ativo: usuario.ativo,
          permissaoUsuario: permissao,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao criar usuário"],
        data: null,
      };
    }
  }

  static async updateUsuario(
    id: number,
    nome?: string,
    ativo?: boolean,
    idPermissao?: number
  ) {
    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: ["id", "nome", "login", "ativo"],
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuario) {
        return {
          status: codes.NO_CONTENT,
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }

      const erros: string[] = [...(nome ? this.verificaNome(nome) : [])];

      if (erros.length > 0) {
        return {
          status: codes.BAD_REQUEST,
          erros: erros,
          data: null,
        };
      }

      usuario.nome = nome || usuario.nome;
      usuario.ativo = ativo === undefined ? usuario.ativo : ativo;

      if (idPermissao !== undefined) {
        const permissao = await PermissaoUsuario.findByPk(idPermissao);
        if (!permissao) {
          return {
            status: codes.NO_CONTENT,
            erros: ["Permissão não encontrada"],
            data: null,
          };
        }
        usuario.permissaoUsuario = permissao;
      }
      await usuario.save();
      return { status: codes.OK, erros: [], data: usuario };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao atualizar usuário"],
        data: null,
      };
    }
  }

  static async deleteUsuario(id: number) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      await usuario.destroy();
      return { status: codes.OK, erros: [], data: null };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao deletar usuário"],
        data: null,
      };
    }
  }

  static async loginUsuario(login: string, senha: string) {
    try {
      const usuario: Usuario | null = await Usuario.findOne({
        where: { login },
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuario) {
        return {
          status: codes.NOT_FOUND,
          erros: ["Login inválido"],
          data: null,
        };
      }
      if (!usuario.verificaSenha(senha)) {
        return {
          status: codes.UNAUTHORIZED,
          erros: ["Senha inválida"],
          data: null,
        };
      }
      if (!usuario.ativo) {
        return {
          status: codes.FORBIDDEN,
          erros: ["Usuário inativo"],
          data: null,
        };
      }
      usuario.senha = "";

      let expires: number = parseInt(config.expires as string) || 1800;

      const token: string = jwt.sign({ usuario }, config.secret as string, {
        expiresIn: expires,
      });

      return { status: codes.OK, erros: [], data: { usuario, token } };
    } catch (e) {
      console.log(e);
      return {
        status: codes.INTERNAL_SERVER_ERROR,
        erros: ["Erro ao realizar login"],
        data: null,
      };
    }
  }
}
