import { Router } from "express";

import CursoController from "../controllers/CursoController.js";

const router: Router = Router();

router.get("/", CursoController.index);

router.get("/count", CursoController.count);

router.get("/:id", CursoController.show);

router.post("/", CursoController.store);

router.put("/:id", CursoController.update);

router.delete("/:id", CursoController.destroy);

export default router;
