import Usuario from "../models/Usuario";
import PermissaoUsuario from "../models/PermissaoUsuario";
import config from "../config/config";
import jwt from "jsonwebtoken";

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
                    model: PermissaoUsuario
                }
            });
            if (!usuarios) {
                return {
                    status: 404,
                    erros: ["Nenhum usuário encontrado"],
                    data: null,
                };
            }
            return {
                status: 200,
                erros: [],
                data: usuarios,
            };
        } catch (e) {
            console.log(e);
            return { status: 500, erros: ["Erro ao buscar usuários"], data: null };
        }
    }

    static async getUsuarioById(id: number) {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: ["id", "nome", "login", "ativo"],
                include: {
                    model: PermissaoUsuario
                }
            });
            if (!usuario) {
                return {
                    status: 404,
                    erros: ["Usuário não encontrado"],
                    data: null,
                };
            }
            return {
                status: 200,
                erros: [],
                data: usuario,
            };
        } catch (e) {
            console.log(e);
            return { status: 500, erros: ["Erro ao buscar usuário"], data: null };
        }
    }

    static async createUsuario(login: string, senha: string, nome: string, idPermissao: number) {
        const erros: string[] = [...this.verificaLogin(login), ...this.verificaSenha(senha), ...this.verificaNome(nome)];
        if (erros.length > 0) {
            return { status: 400, erros, data: null };
        }

        try {
            const usuarioExistente = await Usuario.findOne({ where: { login } });
            if (usuarioExistente) {
                return { status: 400, erros: ["Login já existe"], data: null };
            }
            const permissao = await PermissaoUsuario.findByPk(idPermissao);
            if (!permissao) {
                return { status: 400, erros: ["Permissão não encontrada"], data: null };
            }
            const usuario = await Usuario.create({ login, senha, nome, idPermissao, ativo: true });
            return { status: 201, erros: [], data: { id: usuario.id, nome: usuario.nome, login: usuario.login, ativo: usuario.ativo, permissaoUsuario: permissao } };
        } catch (e) {
            console.log(e);
            return { status: 500, erros: ["Erro ao criar usuário"], data: null };
        }
    }

    static async updateUsuario(id: number, nome?: string, ativo?: boolean, idPermissao?: number) {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: ["id", "nome", "login", "ativo"],
                include: {
                    model: PermissaoUsuario
                }
            });
            if (!usuario) {
                return { status: 404, erros: ["Usuário não encontrado"], data: null };
            }

            if (nome) {
                const erros = this.verificaNome(nome);
                if (erros.length > 0) {
                    return { status: 400, erros, data: null };
                }
                usuario.nome = nome || usuario.nome;
            }

            if (ativo !== undefined) {
                usuario.ativo = ativo == usuario.ativo ? usuario.ativo : ativo;
            }

            if (idPermissao !== undefined) {
                const permissao = await PermissaoUsuario.findByPk(idPermissao);
                if (!permissao) {
                    return { status: 400, erros: ["Permissão não encontrada"], data: null };
                }
                usuario.permissaoUsuario = permissao;
            }
            await usuario.save();
            return { status: 200, erros: [], data: usuario };
        } catch (e) {
            console.log(e);
            return { status: 500, erros: ["Erro ao atualizar usuário"], data: null };
        }
    }

    static async deleteUsuario(id: number) {
        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return { status: 404, erros: ["Usuário não encontrado"], data: null };
            }
            await usuario.destroy();
            return { status: 200, erros: [], data: null };
        } catch (e) {
            console.log(e);
            return { status: 500, erros: ["Erro ao deletar usuário"], data: null };
        }
    }

    static async loginUsuario(login: string, senha: string) {
        try {
            const usuario: Usuario | null = await Usuario.findOne({ where: { login } });
            if (!usuario) {
                return { status: 401, erros: ["Login inválido"], data: null };
            }
            if (!usuario.verificaSenha(senha)) {
                return { status: 401, erros: ["Senha inválida"], data: null };
            }
            if (!usuario.ativo) {
                return { status: 403, erros: ["Usuário inativo"], data: null };
            }
            usuario.senha = "";

            const token: string = jwt.sign({ usuario }, config.secret as string, { expiresIn: config.expires as string || "30min" });

            return { status: 200, erros: [], data: { usuario, token } };
        } catch (e) {
            console.log(e);
            return { status: 500, erros: ["Erro ao realizar login"], data: null };
        }
    }

}

