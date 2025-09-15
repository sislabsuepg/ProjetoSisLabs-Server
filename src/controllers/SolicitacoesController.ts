import SolicitacoesService from "../services/solicitacesService";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class SolicitacoesController {
  async criarSolicitacao(req: Request, res: Response) {
    const { idAluno, idLaboratorio } = req.body;
    const { erros, data } = await SolicitacoesService.solicitarLaboratorio(
      idAluno,
      idLaboratorio
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async responderSolicitacao(req: Request, res: Response) {
    const { id, aceita } = req.body;
    const { erros, data } = await SolicitacoesService.responderSolicitacao(
      id,
      aceita
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async listarSolicitacoes(req: Request, res: Response) {
    const { erros, data } = await SolicitacoesService.listarSolicitacoes();
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }
}

export default new SolicitacoesController();
