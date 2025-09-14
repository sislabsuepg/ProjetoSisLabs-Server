import OrientacaoService from "../services/orientacaoService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class OrientacaoController {
  async index(req: Request, res: Response) {
    const { page, items, ativo, nome } = req.query;
    const { erros, data } = await OrientacaoService.getAllOrientacoes(
      Number(page),
      Number(items),
      ativo === undefined ? undefined : ativo === "true",
      nome === undefined ? undefined : String(nome)
    );
    if (erros.length) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await OrientacaoService.getOrientacaoById(
      Number(id)
    );
    if (erros.length) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async showByAluno(req: Request, res: Response) {
    const { idAluno } = req.params;
    const { erros, data } = await OrientacaoService.getOrientacaoByAluno(
      Number(idAluno)
    );
    if (erros.length) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async store(req: Request, res: Response) {
    let { dataInicio, dataFim, idAluno, idLaboratorio, idProfessor } = req.body;
    if (isNaN(Date.parse(dataInicio))) {
      dataInicio = undefined;
    } else {
      dataInicio = new Date(dataInicio);
    }

    if (isNaN(Date.parse(dataFim))) {
      dataFim = undefined;
    } else {
      dataFim = new Date(dataFim);
    }

    const exists = await OrientacaoService.getOrientacaoByAluno(idAluno);
    if (exists.erros.length === 0 && exists.data) {
      res.status(codes.CONFLICT).json({
        erros: ["Já existe uma orientação ativa para este aluno"],
        data: [],
      });
    }

    const { erros, data } = await OrientacaoService.createOrientacao(
      dataInicio,
      dataFim,
      idAluno,
      idProfessor,
      idLaboratorio,
      req.body.idUsuario
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    let { dataInicio, dataFim } = req.body;
    if (isNaN(Date.parse(dataInicio))) {
      dataInicio = undefined;
    } else {
      dataInicio = new Date(dataInicio);
    }

    if (isNaN(Date.parse(dataFim))) {
      dataFim = undefined;
    } else {
      dataFim = new Date(dataFim);
    }
    const { erros, data } = await OrientacaoService.updateOrientacao(
      Number(id),
      dataInicio,
      dataFim,
      req.body.idUsuario
    );

    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await OrientacaoService.deleteOrientacao(
      Number(id),
      req.body.idUsuario
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
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
    const count = await OrientacaoService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}

export default new OrientacaoController();
