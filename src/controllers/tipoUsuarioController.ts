import tipoUsuarioService from "../services/tipoUsuarioService";
import { Request, Response } from "express";

class TipoUsuarioController {
  async index(req: Request, res: Response) {
    if (!req.query.nome) {
      const { status, erros, data } =
        await tipoUsuarioService.getAllTipoUsuarios();
      res.status(status).json({ erros, data });
    } else {
      const { status, erros, data } =
        await tipoUsuarioService.getTipoUsuarioByNome(req.query.nome as string);
      res.status(status).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } = await tipoUsuarioService.getTipoUsuarioById(
      id
    );
    res.status(status).json({ erros, data });
  }

  async store(req: Request, res: Response) {
    const { nome, cadastro, alteracao, relatorio, advertencia } = req.body;
    const { status, erros, data } = await tipoUsuarioService.createTipoUsuario(
      nome,
      cadastro,
      alteracao,
      relatorio,
      advertencia
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } = await tipoUsuarioService.updateTipoUsuario(
      id,
      req.body
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } = await tipoUsuarioService.deleteTipoUsuario(
      id
    );
    res.status(status).json({ erros, data });
  }
}

export default new TipoUsuarioController();
