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
    const { ra } = req.params;
    if (!ra) {
      const { status, erros, data } = await AlunoService.getAlunoByRa(ra);
      res.status(status).json({ erros, data });
    }
  }

  async store(req: Request, res: Response) {
    const { nome, ra, telefone, ano, email, senha, idCurso } = req.body;
    const { status, erros, data } = await AlunoService.createAluno(
      nome,
      ra,
      telefone,
      ano,
      email,
      senha,
      idCurso
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const { ra } = req.params;
    const { nome, telefone, ano, email, ativo, idCurso } = req.body;
    const { status, erros, data } = await AlunoService.updateAluno(
      ra,
      req.body
    );
    res.status(status).json({ erros, data });
  }

  async updateSenha(req: Request, res: Response) {
    const { ra } = req.params;
    const { novaSenha } = req.body;
    const { status, erros, data } = await AlunoService.updateSenhaAluno(
      ra,
      novaSenha
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const { ra } = req.params;
    const { status, erros, data } = await AlunoService.deleteAluno(ra);
    res.status(status).json({ erros, data });
  }

  async login(req: Request, res: Response) {
    const { ra, senha } = req.body;
    const { status, erros, data } = await AlunoService.loginAluno(ra, senha);
    res.status(status).json({ erros, data });
  }
}

export default new AlunoController();
