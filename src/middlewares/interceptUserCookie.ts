import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UsuarioRequest from "../types/usuarioRequest.js";
import config from "../config/config.js";
import codes from "../types/responseCodes.js";
import IUsuario from "../types/userInterface.js";
import UsuarioService from "../services/usuarioService.js";

export async function interceptUserCookie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["authToken"];

  if (!token) {
    res
      .status(codes.UNAUTHORIZED)
      .json({ erros: ["Token não fornecido"], data: null });
  } else {
    if (token) {
      try {
        const decoded = jwt.verify(token, config.secret as string) as {
          usuario: IUsuario;
        };
        const estaAtivo = await UsuarioService.verificaAtivo(
          decoded.usuario.id,
          decoded.usuario.nome,
          decoded.usuario.login
        );
        if (!estaAtivo) {
          res
            .status(codes.UNAUTHORIZED)
            .json({ erros: ["Usuário inativo"], data: null });
          return;
        }
        const usuario = decoded.usuario;

        if (req.body == null || req.body == undefined) {
          req.body = {};
        }

        req.body.usuario = {
          id: usuario.id,
          nome: usuario.nome,
          login: usuario.login,
          ativo: usuario.ativo,
          idPermissao: usuario.idPermissao,
          permissaoUsuario: {
            id: usuario.idPermissao,
            nomePermissao: usuario.permissaoUsuario.nomePermissao,
            geral: usuario.permissaoUsuario.geral,
            cadastro: usuario.permissaoUsuario.cadastro,
            alteracao: usuario.permissaoUsuario.alteracao,
            relatorio: usuario.permissaoUsuario.relatorio,
            advertencia: usuario.permissaoUsuario.advertencia,
          },
        };

        next();
      } catch (error) {
        res
          .status(codes.UNAUTHORIZED)
          .json({ erros: ["Token inválido"], data: null });
      }
    }
  }
}
