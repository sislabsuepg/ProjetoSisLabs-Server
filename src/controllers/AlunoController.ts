import AlunoService from "../services/alunoService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class AlunoController {
  async index(req: Request, res: Response) {
    const { nome, ra, page, items, ativo } = req.query;
    const ativado = ativo === "true";
    if (!nome && !ra) {
      const { erros, data } = await AlunoService.getAllAlunos(
        Number.parseInt(page as string),
        Number.parseInt(items as string),
        ativo === undefined ? undefined : ativado
      );
      if ((Array.isArray(erros) ? erros.length : 0) > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    } else {
      const { erros, data } = await AlunoService.searchAlunos(
        nome === undefined ? undefined : String(nome),
        ra === undefined ? undefined : String(ra),
        ativo === undefined ? undefined : ativado,
        Number.parseInt(page as string),
        Number.parseInt(items as string)
      );
      if ((Array.isArray(erros) ? erros.length : 0) > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    }
  }

  async show(req: Request, res: Response) {
    const { ra } = req.params;
    const { erros, data } = await AlunoService.getAlunoByRa(String(ra));
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
      idCurso,
      req.body.idUsuario
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
      ativo,
      req.body.idUsuario
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
    const { erros, data } = await AlunoService.deleteAluno(
      id,
      req.body.idUsuario
    );
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async login(req: Request, res: Response) {
    const { login, senha } = req.body;
    const { erros, data } = await AlunoService.loginAluno(
      login,
      senha,
      req.body.idUsuario
    );
    console.log(req.body);
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

  async verifyPassword(req: Request, res: Response) {
    const { login, senha } = req.body;
    const { erros, data } = await AlunoService.loginAluno(
      login,
      senha,
      req.body.idUsuario
    );
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      if (data?.token) {
        res.status(codes.OK).json({ erros, data: data?.aluno });
      } else {
        res.status(codes.FORBIDDEN).json({ erros, data: null });
      }
    }
  }

  async buscaLaboratoriosDisponiveis(req: Request, res: Response) {
    const { idAluno } = req.params;
    const { erros, data } = await AlunoService.buscaLaboratoriosDisponiveis(
      Number(idAluno)
    );
    if ((Array.isArray(erros) ? erros.length : 0) > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data: null });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const { ativo } = req.query;
    let ativado = undefined;
    if (typeof ativo === "undefined") ativado = undefined;
    else {
      ativado = ativo === "true";
    }
    const count = await AlunoService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}

export default new AlunoController();
