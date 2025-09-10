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
  if (token) {
    try {
      const decoded = jwt.verify(token, config.secret as string) as IUsuario;
      console.log(decoded);
      (req as UsuarioRequest).usuario = {
        id: decoded.id,
        nome: decoded.nome,
        login: decoded.login,
        ativo: decoded.ativo,
        idPermissao: decoded.idPermissao,
        permissaoUsuario: {
          id: decoded.idPermissao,
          nomePermissao: decoded.permissaoUsuario.nomePermissao,
          geral: decoded.permissaoUsuario.geral,
          cadastro: decoded.permissaoUsuario.cadastro,
          alteracao: decoded.permissaoUsuario.alteracao,
          relatorio: decoded.permissaoUsuario.relatorio,
          advertencia: decoded.permissaoUsuario.advertencia
        }
      };
      const estaAtivo = await UsuarioService.verificaAtivo(decoded.id, decoded.nome, decoded.login);
      if (!estaAtivo) {
        res.status(codes.UNAUTHORIZED).json({ erros: ["Usuário inativo"], data: null });
        return;
      }
    } catch (error) {
      res.status(codes.UNAUTHORIZED).json({ erros: ["Token inválido"], data: null });
    }
  }
  next();
}

