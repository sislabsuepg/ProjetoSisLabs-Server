import AlunoService from "../services/alunoService";

import { Request, Response } from "express";

class AlunoController {
  async index(req: Request, res: Response) {
    const { nome, ra } = req.query;

    if (!nome && !ra) {
      const { status, erros, data } = await AlunoService.getAllAlunos();
      res.status(status).json({ erros, data });
    } else {
      const { status, erros, data } = await AlunoService.searchAlunos(
        String(nome) || "",
        String(ra) || ""
      );
      res.status(status).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await AlunoService.getAlunoById(Number(id));
    res.status(status).json({ erros, data });
  }

  async store(req: Request, res: Response) {
    const { nome, ra, telefone, anoCurso, email, senha, idCurso } = req.body;
    const { status, erros, data } = await AlunoService.createAluno(
      nome,
      ra,
      telefone,
      anoCurso,
      email,
      senha,
      idCurso
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, telefone, anoCurso, email, ativo } = req.body;
    const { status, erros, data } = await AlunoService.updateAluno(
      Number(id),
      nome,
      telefone,
      anoCurso,
      email,
      ativo
    );
    res.status(status).json({ erros, data });
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
    const { status, erros, data } = await AlunoService.deleteAluno(id);
    res.status(status).json({ erros, data });
  }

  async login(req: Request, res: Response) {
    const { ra, senha } = req.body;
    const { status, erros, data } = await AlunoService.loginAluno(ra, senha);
    if (data?.token) {
            res.cookie("authToken", data.token, {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                expires: new Date(Date.now() + (4 * 60 * 60 * 1000)), // 4 horas
            });
        }
    res.status(status).json({ erros, data: data?.aluno });
  }
}

export default new AlunoController();
