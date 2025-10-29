import { Response, Request } from "express";
import { ReseterService } from "../services/reseterService.js";

class testController {
  public async reset(req: Request, res: Response) {
    try {
      await ReseterService.reset();
      res.status(200).json({ message: "Reset realizado com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao realizar o reset." });
    }
  }
}

export default new testController();
