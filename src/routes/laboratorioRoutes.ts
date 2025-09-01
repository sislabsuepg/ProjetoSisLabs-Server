import { Router } from "express";
import LaboratorioController from "../controllers/LaboratorioController";

const router: Router = Router();

router.get("/", LaboratorioController.index);

router.get("/count", LaboratorioController.count);

router.get("/:id", LaboratorioController.show);
router.post("/", LaboratorioController.create);
router.put("/:id", LaboratorioController.update);
router.delete("/:id", LaboratorioController.destroy);

export default router;
