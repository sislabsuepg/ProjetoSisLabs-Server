import { Router } from "express";

import AlunoController from "../controllers/AlunoController";

const router: Router = Router();

router.get("/", AlunoController.index);

router.get("/:ra", AlunoController.show);

router.post("/", AlunoController.store);

router.post("/login", AlunoController.login);

router.put("/senha/:ra", AlunoController.updateSenha);

router.put("/:ra", AlunoController.update);

router.delete("/:ra", AlunoController.destroy);

export default router;
