import { Request, Response } from "express";
import UsuarioService from "../services/usuarioService.js";
import codes from "../types/responseCodes.js";
class UsuarioController {
  public async index(req: Request, res: Response) {
    const { page, items } = req.query;
    const { erros, data } = await UsuarioService.getAllUsuarios(
      Number(page),
      Number(items)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await UsuarioService.getUsuarioById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async store(req: Request, res: Response) {
    const { login, senha, nome, idPermissao } = req.body;
    const { erros, data } = await UsuarioService.createUsuario(
      login,
      senha,
      nome,
      idPermissao
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, ativo, idPermissao } = req.body;
    const { erros, data } = await UsuarioService.updateUsuario(
      Number(id),
      nome,
      ativo,
      idPermissao
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await UsuarioService.deleteUsuario(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async login(req: Request, res: Response) {
    const { login, senha } = req.body;
    const { erros, data } = await UsuarioService.loginUsuario(login, senha);
    if (!data?.token) {
      res.status(codes.UNAUTHORIZED).json({ erros, data });
    } else {
      res
        .status(codes.OK)
        .cookie("authToken", data.token, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas
        })
        .json({ erros, data: data?.usuario });
    }
  }

  public async count(req: Request, res: Response) {
    const { ativo } = req.query;
    let ativado = undefined;
    if (typeof ativo === "undefined") ativado = undefined;
    else {
      ativado = ativo === "true";
    }
    const count = await UsuarioService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}

export default new UsuarioController();
