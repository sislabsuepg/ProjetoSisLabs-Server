import { Router } from "express";

import AlunoController from "../controllers/AlunoController";

const router: Router = Router();

router.get("/", AlunoController.index);

router.get("/:id", AlunoController.show);

router.post("/", AlunoController.store);

router.put("/:id", AlunoController.update);

router.put("/senha/:id", AlunoController.updateSenha);

router.delete("/:id", AlunoController.destroy);

export default router;
