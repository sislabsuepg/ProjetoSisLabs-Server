import { Router } from "express";
import HorarioController from "../controllers/HorarioController.js";

const router: Router = Router();

router.get("/", HorarioController.index);
router.get("/laboratorio/:id", HorarioController.showLaboratorio);
router.get("/dia/:diaSemana", HorarioController.showDiaSemana);
router.get("/:id", HorarioController.show);
router.post("/", HorarioController.create);
router.put("/:id", HorarioController.update);
router.delete("/:id", HorarioController.delete);

export default router;
