import { Router } from "express";

import AlunoController from "../controllers/AlunoController.js";
import { interceptUserCookie } from "../middlewares/interceptUserCookie.js";
import { interceptAlunoCookie } from "../middlewares/interceptAlunoCookie.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", interceptUserCookie, AlunoController.index);

router.get("/count", interceptUserCookie, AlunoController.count);

router.get("/:ra", interceptUserCookie, AlunoController.show);

router.get(
  "/laboratorios/:idAluno",
  AlunoController.buscaLaboratoriosDisponiveis
);

router.put(
  "/perfil/:idAluno",
  interceptAlunoCookie,
  AlunoController.updateProfile
);

router.put(
  "/senha/:idAluno",
  interceptAlunoCookie,
  AlunoController.updatePassword
);

router.post("/verificasenha", AlunoController.verifyPassword);

router.post(
  "/",
  interceptUserCookie,
  lockPath("cadastro"),
  AlunoController.store
);

router.post("/login", AlunoController.login);

router.put(
  "/:id",
  interceptUserCookie,
  lockPath("alteracao"),
  AlunoController.update
);

router.delete(
  "/:id",
  interceptUserCookie,
  lockPath("alteracao"),
  AlunoController.destroy
);

export default router;
