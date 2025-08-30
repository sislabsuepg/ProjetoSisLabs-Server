import AlunoService from "../services/alunoService";

import { Request, Response } from "express";
import codes from "../types/responseCodes";

class AlunoController {
  async index(req: Request, res: Response) {
    const { nome, ra, page, limit, ativo } = req.query;
    const ativado = ativo === "true";
    if (!nome && !ra) {
      const { erros, data } = await AlunoService.getAllAlunos(
        Number.parseInt(page as string),
        Number.parseInt(limit as string),
        ativo === undefined ? undefined : ativado
      );
      if ((Array.isArray(erros) ? erros.length : 0) > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    } else {
      const { erros, data } = await AlunoService.searchAlunos(
        String(nome) || "",
        String(ra) || ""
      );
      if ((Array.isArray(erros) ? erros.length : 0) > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await AlunoService.getAlunoById(Number(id));
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async store(req: Request, res: Response) {
    const { nome, ra, telefone, anoCurso, email, senha, idCurso } = req.body;
    const { erros, data } = await AlunoService.createAluno(
      nome,
      ra,
      telefone,
      anoCurso,
      email,
      senha,
      idCurso
    );
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, telefone, anoCurso, email, ativo } = req.body;
    const { erros, data } = await AlunoService.updateAluno(
      Number(id),
      nome,
      telefone,
      anoCurso,
      email,
      ativo
    );
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  /* async updateSenha(req: Request, res: Response) {
    const { id } = req.params;
    const { novaSenha } = req.body;
    const { status, erros, data } = await AlunoService.updateSenhaAluno(
      id,
      novaSenha
    );
    res.status(status).json({ erros, data });
  } */

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await AlunoService.deleteAluno(id);
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async login(req: Request, res: Response) {
    const { ra, senha } = req.body;
    const { erros, data } = await AlunoService.loginAluno(ra, senha);
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      if (data?.token) {
        res.cookie("authToken", data.token, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas
        });
        res.status(codes.OK).json({ erros, data: data?.aluno });
      } else {
        res.status(codes.FORBIDDEN).json({ erros, data: null });
      }
    }
  }
}

export default new AlunoController();
