import { Request, Response } from "express";
import UsuarioService from "../services/usuarioService.js";
import codes from "../types/responseCodes.js";
import config from "../config/config.js";
class UsuarioController {
  public async index(req: Request, res: Response) {
    const { page, items, ativo, nome } = req.query;
    const { erros, data } = await UsuarioService.getAllUsuarios(
      Number(page),
      Number(items),
      ativo === undefined ? undefined : ativo === "true",
      nome === undefined ? undefined : String(nome),
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
      idPermissao,
      req.body.idUsuario,
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
      idPermissao,
      req.body.idUsuario,
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await UsuarioService.deleteUsuario(
      Number(id),
      req.body.idUsuario,
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async login(req: Request, res: Response) {
    const { login, senha } = req.body;
    const { erros, data } = await UsuarioService.loginUsuario(
      login,
      senha,
      req.body.idUsuario,
    );
    if (!data?.token) {
      res.status(codes.UNAUTHORIZED).json({ erros, data });
    } else {
      res
        .status(codes.OK)
        .cookie("authToken", data.token, {
          httpOnly: true,
          sameSite: "strict",
          secure: config.nodeEnv === "production",
          path: "/",
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas
        })
        .json({ erros, data: data?.usuario });
    }
  }

  public async updateSenha(req: Request, res: Response) {
    const { id } = req.params;
    const usuarioAutenticado = req.body?.usuario;

    if (!usuarioAutenticado || usuarioAutenticado.id !== Number(id)) {
      res.status(codes.FORBIDDEN).json({
        erros: ["Você só pode alterar a sua própria senha"],
        data: null,
      });
      return;
    }

    const { novaSenha } = req.body;
    const { erros, data } = await UsuarioService.updateSenhaUsuario(
      Number(id),
      novaSenha,
      req.body.idUsuario,
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  public async resetSenha(req: Request, res: Response) {
    const { id } = req.params;
    const { idUsuario } = req.body;
    const solicitanteEhGeral =
      req.body?.usuario?.permissaoUsuario?.geral === true;
    const { erros, data } = await UsuarioService.resetSenhaUsuario(
      Number(id),
      Number(idUsuario),
      solicitanteEhGeral,
    );
    if (erros.length > 0) {
      const status = erros.some((erro) =>
        erro.includes("Apenas um usuário com permissão geral"),
      )
        ? codes.FORBIDDEN
        : codes.BAD_REQUEST;
      res.status(status).json({ erros, data: null });
    } else {
      res.status(codes.OK).json({ erros, data });
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
