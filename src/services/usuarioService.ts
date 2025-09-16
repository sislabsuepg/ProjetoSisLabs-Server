import Usuario from "../models/Usuario.js";
import PermissaoUsuario from "../models/PermissaoUsuario.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { getPaginationParams } from "../types/pagination.js";
import { Op } from "sequelize";
import { criarRegistro } from "../utils/registroLogger.js";
import md5 from "md5";
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
    if (!nome) {
      erros.push("Nome é obrigatório");
      return erros;
    }
    if (nome.length < 3 || nome.length > 40) {
      erros.push("Nome deve ter entre 3 e 40 caracteres");
    }
    if (!/^[a-zA-Z \u00C0-\u00FF]+$/.test(nome)) {
      erros.push("Nome deve conter apenas letras");
    }
    return erros;
  }

  static async getAllUsuarios(
    offset?: number,
    limit?: number,
    ativo?: boolean,
    nome?: string
  ) {
    try {
      const { rows: usuarios, count: total } = await Usuario.findAndCountAll({
        ...getPaginationParams(offset, limit),
        attributes: ["id", "nome", "login", "ativo", "idPermissao"],
        include: {
          model: PermissaoUsuario,
        },
        where: {
          ...(nome && {
            [Op.or]: {
              nome: { [Op.iLike]: `%${nome}%` },
              login: { [Op.iLike]: `%${nome}%` },
            },
          }),
          ...(ativo !== undefined && { ativo }),
        },
        order: [["nome", "ASC"]],
      });
      if (!usuarios || usuarios.length === 0) {
        return {
          erros: ["Nenhum usuário encontrado"],
          data: null,
        };
      }
      if (!nome) {
        return {
          erros: [],
          data: usuarios,
        };
      } else {
        return {
          erros: [],
          data: { usuarios, total },
        };
      }
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar usuários"],
        data: null,
      };
    }
  }

  static async getUsuarioById(id: number) {
    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: ["id", "nome", "login", "ativo", "idPermissao"],
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuario) {
        return {
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      return {
        erros: [],
        data: usuario,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar usuário"],
        data: null,
      };
    }
  }

  static async createUsuario(
    login: string,
    senha: string,
    nome: string,
    idPermissao: number,
    idUsuario?: number
  ) {
    if (!idPermissao || !senha || !login || !nome) {
      return {
        erros: ["Todos os campos são obrigatórios"],
        data: null,
      };
    }

    const erros: string[] = [
      ...this.verificaLogin(login),
      ...this.verificaSenha(senha),
      ...this.verificaNome(nome),
    ];
    if (erros.length > 0) {
      return {
        erros,
        data: null,
      };
    }

    try {
      const usuarioExistente = await Usuario.findOne({ where: { login } });
      if (usuarioExistente) {
        return {
          erros: ["Login já existe"],
          data: null,
        };
      }
      const permissao = await PermissaoUsuario.findByPk(idPermissao);
      if (!permissao || (permissao && !permissao.ativo)) {
        return {
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
      // auditoria
      await criarRegistro(
        idUsuario,
        `Usuario criado: login: ${login} nome: ${nome}`
      );
      return {
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
        erros: ["Erro ao criar usuário"],
        data: null,
      };
    }
  }

  static async updateUsuario(
    id: number,
    nome?: string,
    ativo?: boolean,
    idPermissao?: number,
    idUsuario?: number
  ) {
    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: ["id", "nome", "login", "ativo", "idPermissao"],
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuario) {
        return {
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }

      const erros: string[] = [...(nome ? this.verificaNome(nome) : [])];

      if (erros.length > 0) {
        return {
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
            erros: ["Permissão não encontrada"],
            data: null,
          };
        }

        if (permissao.ativo === false) {
          return {
            erros: ["Permissão inativa"],
            data: null,
          };
        }

        usuario.idPermissao = idPermissao;
        usuario.permissaoUsuario = permissao;
      }
      await usuario.save();
      await criarRegistro(
        idUsuario,
        `Usuario atualizado: login: ${usuario.login} nome: ${usuario.nome} ativo: ${usuario.ativo}`
      );
      return { erros: [], data: usuario };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar usuário"],
        data: null,
      };
    }
  }

  static async deleteUsuario(id: number, idUsuario?: number) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return {
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      usuario.ativo = false;
      await usuario.save();
      await criarRegistro(
        idUsuario,
        `Usuario desativado: login: ${usuario.login} nome: ${usuario.nome}`
      );
      return { erros: [], data: null };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao desativar usuário"],
        data: null,
      };
    }
  }

  static async updateSenhaUsuario(
    id: number,
    novaSenha: string,
    idUsuario?: number
  ) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return {
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      usuario.senha = md5(novaSenha);
      await usuario.save();
      await criarRegistro(
        idUsuario,
        `Usuario atualizado senha: login: ${usuario.login}`
      );
      return { erros: [], data: usuario };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar senha"],
        data: null,
      };
    }
  }

  static async loginUsuario(login: string, senha: string, idUsuario?: number) {
    try {
      const usuario: Usuario | null = await Usuario.findOne({
        where: { login },
        include: {
          model: PermissaoUsuario,
        },
      });
      if (!usuario) {
        return {
          erros: ["Login inválido"],
          data: null,
        };
      }
      if (!usuario.verificaSenha(senha)) {
        return {
          erros: ["Senha inválida"],
          data: null,
        };
      }
      if (!usuario.ativo) {
        return {
          erros: ["Usuário inativo"],
          data: null,
        };
      }
      usuario.senha = "";

      let expires = parseInt(config.expires as string) || 3600;

      const token: string = jwt.sign({ usuario }, config.secret as string, {
        expiresIn: expires,
      });
  await criarRegistro(idUsuario, `Usuario login: login: ${login} nome: ${usuario.nome}`);
      return { erros: [], data: { usuario, token } };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao realizar login"],
        data: null,
      };
    }
  }

  static async verificaAtivo(id: number, nome: string, login: string) {
    try {
      const usuario: Usuario | null = await Usuario.findOne({
        where: {
          [Op.and]: [
            { id: id },
            { nome: nome },
            { login: login },
            { ativo: true },
          ],
        },
      });
      return usuario !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async resetSenhaUsuario(id: number, idUsuario?: number) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return {
          erros: ["Usuário não encontrado"],
          data: null,
        };
      }
      usuario.senha = md5("123456");
      await usuario.save();
      await criarRegistro(
        idUsuario,
        `Usuario resetar senha: login: ${usuario.login}`
      );
      return { erros: [], data: usuario };
    } catch (error) {
      console.log(error);
      return {
        erros: ["Erro ao resetar senha"],
        data: null,
      };
    }
  }

  static async getCount(ativo?: boolean) {
    try {
      const count = await Usuario.count({
        where: {
          ...(ativo !== undefined && { ativo }),
        },
      });
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
