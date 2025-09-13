import { Router } from "express";
import EventoController from "../controllers/EventoController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", EventoController.index);

router.get("/count", EventoController.count);

router.get("/:id", EventoController.show);
router.post("/", lockPath("cadastro"), EventoController.create);
router.put("/:id", lockPath("alteracao"), EventoController.update);
router.delete("/:id", lockPath("alteracao"), EventoController.destroy);

export default router;
