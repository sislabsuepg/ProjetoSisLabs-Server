import permissaoUsuarioService from "../services/permissaoUsuarioService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class PermissaoUsuarioController {
  async index(req: Request, res: Response) {
    const { page, items, ativo } = req.query;
    if (!req.query.nome) {
      const { erros, data } = await permissaoUsuarioService.getAllPermissoes(
        Number(page),
        Number(items),
        ativo === undefined ? undefined : ativo === "true"
      );
      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    } else {
      const { erros, data } =
        await permissaoUsuarioService.getPermissaoUsuarioByNome(
          req.query.nomePermissao as string,
          Number(page),
          Number(items),
          ativo === undefined ? undefined : ativo === "true"
        );
      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    }
  }

  async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { erros, data } =
      await permissaoUsuarioService.getPermissaoUsuarioById(id);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async store(req: Request, res: Response) {
    const {
      nomePermissao,
      geral,
      cadastro,
      alteracao,
      relatorio,
      advertencia,
    } = req.body;
    const { erros, data } =
      await permissaoUsuarioService.createPermissaoUsuario(
        nomePermissao,
        geral,
        cadastro,
        alteracao,
        relatorio,
        advertencia
      );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const {
      nomePermissao,
      geral,
      cadastro,
      alteracao,
      relatorio,
      advertencia,
      ativo
    } = req.body;
    const { erros, data } =
      await permissaoUsuarioService.updatePermissaoUsuario(
        id,
        nomePermissao,
        geral,
        cadastro,
        alteracao,
        relatorio,
        advertencia,
        ativo
      );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { erros, data } =
      await permissaoUsuarioService.deletePermissaoUsuario(id);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const count = await permissaoUsuarioService.getCount();
    res.status(codes.OK).json({ count });
  }
}

export default new PermissaoUsuarioController();
