import { Router } from "express";
import LaboratorioController from "../controllers/LaboratorioController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", LaboratorioController.index);

router.get("/count", LaboratorioController.count);

router.get("/:id", LaboratorioController.show);
router.post("/", lockPath("cadastro"), LaboratorioController.create);
router.put("/:id", lockPath("alteracao"), LaboratorioController.update);
router.delete("/:id", lockPath("alteracao"), LaboratorioController.destroy);

export default router;
