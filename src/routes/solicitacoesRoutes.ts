import SolicitacoesController from "../controllers/SolicitacoesController.js";
import { Router } from "express";
import { interceptAlunoCookie } from "../middlewares/interceptAlunoCookie.js";
import { interceptUserCookie } from "../middlewares/interceptUserCookie.js";

const router: Router = Router();

router.post("/", interceptAlunoCookie, SolicitacoesController.criarSolicitacao);

router.put(
  "/",
  interceptUserCookie,
  SolicitacoesController.responderSolicitacao
);

router.get("/", interceptUserCookie, SolicitacoesController.listarSolicitacoes);

export default router;
