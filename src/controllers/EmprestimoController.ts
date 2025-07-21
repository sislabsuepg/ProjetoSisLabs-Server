import EmprestimoService from "../services/emprestimoService";
import { Request, Response } from "express";

class EmprestimoController {
  async index(req: Request, res: Response) {
    const { status, data, erros } = await EmprestimoService.getAllEmprestimos();
    res.status(status).json({ data, erros });
  }

  async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, data, erros } = await EmprestimoService.getEmprestimoById(
      id
    );
    res.status(status).json({ data, erros });
  }

  async create(req: Request, res: Response) {
    const { idLaboratorio, idAluno, idUsuario } = req.body;
    const { status, data, erros } = await EmprestimoService.createEmprestimo(
      idLaboratorio,
      idAluno,
      idUsuario
    );
    res.status(status).json({ data, erros });
  }

  async close(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { idUsuario } = req.body;
    const { status, data, erros } = await EmprestimoService.closeEmprestimo(
      id,
      parseInt(idUsuario)
    );
    res.status(status).json({ data, erros });
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { advertencia } = req.body;
    const { status, data, erros } = await EmprestimoService.updateAdvertencia(
      id,
      advertencia
    );
    res.status(status).json({ data, erros });
  }
}
export default new EmprestimoController();
