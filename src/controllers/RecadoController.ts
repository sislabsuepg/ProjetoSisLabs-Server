import RecadoService from "../services/recadoService";
import { Request, Response } from "express";
import codes from "../types/responseCodes";

class RecadoController {
  async index(req: Request, res: Response) {
    const { page, items } = req.query;
    const { erros, data } = await RecadoService.getAllRecados(
      Number(page),
      Number(items)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const { erros, data } = await RecadoService.getRecadoById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async store(req: Request, res: Response) {
    const { texto } = req.body;
    const { erros, data } = await RecadoService.createRecado(texto);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const { texto } = req.body;
    const { erros, data } = await RecadoService.updateRecado(Number(id), texto);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const id = req.params.id;
    const { erros, data } = await RecadoService.deleteRecado(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const count = await RecadoService.getCount();
    res.status(codes.OK).json({ count });
  }
}

export default new RecadoController();
