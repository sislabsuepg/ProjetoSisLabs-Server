import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import codes from "../types/responseCodes.js";
import IAluno from "../types/alunoInterface.js";
import AlunoService from "../services/alunoService.js";

export async function interceptAlunoCookie(
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
          aluno: IAluno;
        };
        const estaAtivo = await AlunoService.verificaAtivo(
          decoded.aluno.id,
          decoded.aluno.nome,
          decoded.aluno.ra
        );
        if (!estaAtivo) {
          res
            .status(codes.UNAUTHORIZED)
            .json({ erros: ["Aluno inativo"], data: null });
          return;
        }

        const aluno = decoded.aluno;

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
