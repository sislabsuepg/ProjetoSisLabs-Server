import permissaoUsuarioService from "../services/permissaoUsuarioService";
import { Request, Response } from "express";

class PermissaoUsuarioController {
  async index(req: Request, res: Response) {
    if (!req.query.nome) {
      const { status, erros, data } =
        await permissaoUsuarioService.getAllPermissoes();
      res.status(status).json({ erros, data });
    } else {
      const { status, erros, data } =
        await permissaoUsuarioService.getPermissaoUsuarioByNome(
          req.query.nomePermissao as string
        );
      res.status(status).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } =
      await permissaoUsuarioService.getPermissaoUsuarioById(id);
    res.status(status).json({ erros, data });
  }

  async store(req: Request, res: Response) {
    const { nomePermissao, cadastro, alteracao, relatorio, advertencia } =
      req.body;
    const { status, erros, data } =
      await permissaoUsuarioService.createPermissaoUsuario(
        nomePermissao,
        cadastro,
        alteracao,
        relatorio,
        advertencia
      );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nomePermissao, cadastro, alteracao, relatorio, advertencia } =
      req.body;
    const { status, erros, data } =
      await permissaoUsuarioService.updatePermissaoUsuario(
        id,
        nomePermissao,
        cadastro,
        alteracao,
        relatorio,
        advertencia
      );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } =
      await permissaoUsuarioService.deletePermissaoUsuario(id);
    res.status(status).json({ erros, data });
  }
}

export default new PermissaoUsuarioController();
