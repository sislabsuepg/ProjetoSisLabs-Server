import OrientacaoService from "../services/orientacaoService";
import { Request, Response } from "express";
import codes from "..//types/responseCodes"; // Adjust the path if needed

class OrientacaoController {
  async index(req: Request, res: Response) {
    const { page, items, ativo } = req.query;
    const { erros, data } = await OrientacaoService.getAllOrientacoes(
      Number(page),
      Number(items),
      ativo === "true"
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
    if (exists.erros.length === 0 && exists.data.length > 0) {
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
      idLaboratorio
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
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
    const { erros, data } = await OrientacaoService.updateOrientacao(
      Number(id),

      dataInicio,
      dataFim,
      idAluno,
      idLaboratorio,
      idProfessor
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
      Number(id)
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
