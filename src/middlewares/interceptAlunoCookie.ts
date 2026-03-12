import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import codes from "../types/responseCodes.js";
import AlunoService from "../services/alunoService.js";

type AlunoTokenPayload = jwt.JwtPayload & {
  aluno?: {
    id?: number;
  };
  sub?: string;
};

export async function interceptAlunoCookie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies["authToken"];

  if (!token) {
    res
      .status(codes.UNAUTHORIZED)
      .json({ erros: ["Token não fornecido"], data: null });
  } else {
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          config.secret as string,
        ) as AlunoTokenPayload;
        const alunoId = decoded.aluno?.id ?? Number(decoded.sub);

        if (!alunoId || Number.isNaN(alunoId)) {
          res
            .status(codes.UNAUTHORIZED)
            .json({ erros: ["Token inválido"], data: null });
          return;
        }

        const aluno = await AlunoService.getAuthenticatedAlunoById(alunoId);

        if (!aluno) {
          res
            .status(codes.UNAUTHORIZED)
            .json({ erros: ["Aluno inativo"], data: null });
          return;
        }

        if (req.body == null || req.body == undefined) {
          req.body = {};
        }

        req.body.aluno = {
          id: aluno.id,
          nome: aluno.nome,
          ra: aluno.ra,
          telefone: aluno.telefone,
          anoCurso: aluno.anoCurso,
          email: aluno.email,
          ativo: aluno.ativo,
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
