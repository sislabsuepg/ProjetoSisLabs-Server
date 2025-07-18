import { Request, Response } from "express";
import UsuarioService from "../services/usuarioService";
class UsuarioController {
    public async index(req: Request, res: Response) {
        const { status, erros, data } = await UsuarioService.getAllUsuarios();
        res.status(status).json({ erros, data });
    }

    public async show(req: Request, res: Response) {
        const { id } = req.params;
        const { status, erros, data } = await UsuarioService.getUsuarioById(Number(id));
        res.status(status).json({ erros, data });
    }

    public async store(req: Request, res: Response) {
        const { login, senha, nome, idPermissao } = req.body;
        const { status, erros, data } = await UsuarioService.createUsuario(login, senha, nome, idPermissao);
        res.status(status).json({ erros, data });
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, ativo, idPermissao } = req.body;
        const { status, erros, data } = await UsuarioService.updateUsuario(Number(id), nome, ativo, idPermissao);
        res.status(status).json({ erros, data });
    }

    public async destroy(req: Request, res: Response) {
        const { id } = req.params;
        const { status, erros, data } = await UsuarioService.deleteUsuario(Number(id));
        res.status(status).json({ erros, data });
    }

    public async login(req: Request, res: Response) {
        const { login, senha } = req.body;
        const { status, erros, data } = await UsuarioService.loginUsuario(login, senha);
        res.status(status).json({ erros, data });
    }
}

export default new UsuarioController();