import OrientacaoService from "../services/orientacaoService";
import { Request, Response } from "express";
import codes from "..//types/responseCodes"; // Adjust the path if needed

class OrientacaoController {
  async index(req: Request, res: Response) {
    const { status, erros, data } = await OrientacaoService.getAllOrientacoes();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await OrientacaoService.getOrientacaoById(
      Number(id)
    );
    res.status(status).json({ erros, data });
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
    if (exists.status === codes.OK) {
      res.status(codes.CONFLICT).json({
        erros: ["Já existe uma orientação ativa para este aluno"],
        data: [],
      });
      return;
    }

    const { status, erros, data } = await OrientacaoService.createOrientacao(
      dataInicio,
      dataFim,
      idAluno,
      idProfessor,
      idLaboratorio
    );
    res.status(status).json({ erros, data });
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
    const { status, erros, data } = await OrientacaoService.updateOrientacao(
      Number(id),

      dataInicio,
      dataFim,
      idAluno,
      idLaboratorio,
      idProfessor
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await OrientacaoService.deleteOrientacao(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }
}

export default new OrientacaoController();
