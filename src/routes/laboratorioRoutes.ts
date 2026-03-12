import { Router } from "express";
import LaboratorioController from "../controllers/LaboratorioController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", LaboratorioController.index);

router.get("/count", LaboratorioController.count);

router.get("/:id", LaboratorioController.show);
router.post("/", lockPath("geral"), LaboratorioController.create);
router.put("/:id", lockPath("geral"), LaboratorioController.update);
router.delete("/:id", lockPath("geral"), LaboratorioController.destroy);

export default router;
