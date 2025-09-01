import AlunoRequest from "../types/alunoRequest.js";
import { Response } from "express";
import UsuarioRequest from "../types/usuarioRequest.js";

class testController {
  public async alunoTest(req: AlunoRequest, res: Response) {
    try {
      res.status(200).json(req.aluno);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async usuarioTest(req: UsuarioRequest, res: Response) {
    try {
      res.status(200).json(req.usuario);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new testController();
