import codes from "../types/responseCodes";
import { Request, Response, NextFunction } from "express";
import { permissionCodes } from "../types/permissionCodes";
import UsuarioRequest from "../types/usuarioRequest.js";

export default async function lockPath(
    requiredPermission: keyof typeof permissionCodes,
) {
    return (req: UsuarioRequest, res: Response, next: NextFunction) => {
        const usuario = req.usuario;
        if (!usuario) {
            return res.status(codes.UNAUTHORIZED).json({ erros: ["Usuário não autenticado"], data: null });
        }

        const userPermission = usuario.permissaoUsuario;
        const { geral, cadastro, alteracao, relatorio, advertencia } = usuario.permissaoUsuario;
        const requiredPermissionLevel: string = permissionCodes[requiredPermission];

        if (userPermission[requiredPermissionLevel as keyof typeof userPermission] === false) {
            res.status(codes.FORBIDDEN).json({ erros: ["Acesso negado"], data: null });
        } else {
            next();
        }
    }
}
