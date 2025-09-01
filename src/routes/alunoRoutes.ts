import { Router } from "express";

import AlunoController from "../controllers/AlunoController.js";

const router: Router = Router();

router.get("/", AlunoController.index);

router.get("/count", AlunoController.count);

router.get("/:id", AlunoController.show);

router.post("/", AlunoController.store);

router.post("/login", AlunoController.login);

/* router.put("/senha/:id", AlunoController.updateSenha); */

router.put("/:id", AlunoController.update);

router.delete("/:id", AlunoController.destroy);

export default router;
