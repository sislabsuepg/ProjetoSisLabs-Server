import { Router } from "express";

import CursoController from "../controllers/CursoController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", CursoController.index);

router.get("/count", CursoController.count);

router.get("/:id", CursoController.show);

router.post("/", lockPath("geral"), CursoController.store);

router.put("/:id", lockPath("geral"), CursoController.update);

router.delete("/:id", lockPath("geral"), CursoController.destroy);

export default router;
