import codes from "../types/responseCodes.js";
import { Request, Response, NextFunction, RequestHandler } from "express";

export default function lockPath(requiredPermission: string): RequestHandler {
  const perm = requiredPermission.toLowerCase();
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = (req.body && (req.body as any).usuario) || undefined;
    if (!usuario) {
      res
        .status(codes.UNAUTHORIZED)
        .json({ erros: ["Usuário não autenticado"], data: null });
      return;
    }
    const perms = usuario.permissaoUsuario;
    if (!perms || perms[perm] !== true) {
      res
        .status(codes.FORBIDDEN)
        .json({ erros: ["Acesso negado"], data: null });
      return;
    }
    req.body.idUsuario = usuario.id;
    next();
  };
}
