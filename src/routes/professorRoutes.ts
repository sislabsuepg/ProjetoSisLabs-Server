import { Router } from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", ProfessorController.index);

router.get("/count", ProfessorController.count);

router.get("/:id", ProfessorController.show);
router.post("/", lockPath("geral"), ProfessorController.create);
router.put("/:id", lockPath("geral"), ProfessorController.update);
router.delete("/:id", lockPath("geral"), ProfessorController.destroy);

export default router;
