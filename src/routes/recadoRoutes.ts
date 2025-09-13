import RecadoController from "../controllers/RecadoController.js";

import { Router } from "express";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", RecadoController.index);

router.get("/count", RecadoController.count);

router.get("/:id", RecadoController.show);

router.post("/", lockPath("cadastro"), RecadoController.store);

router.put("/:id", lockPath("alteracao"), RecadoController.update);

router.delete("/:id", lockPath("alteracao"), RecadoController.destroy);

export default router;
