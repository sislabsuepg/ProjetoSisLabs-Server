import { Router } from "express";
import HorarioController from "../controllers/HorarioController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", HorarioController.index);
router.get("/laboratorio/:id", HorarioController.showLaboratorio);
router.get("/dia/:diaSemana", HorarioController.showDiaSemana);
router.get("/:id", HorarioController.show);
router.post("/", lockPath("geral"), HorarioController.create);
router.put("/:id", lockPath("alteracao"), HorarioController.update);
router.delete("/:id", lockPath("geral"), HorarioController.delete);

export default router;
