import { Router } from "express";
import ProfessorController from "../controllers/ProfessorController.js";

const router: Router = Router();

router.get("/", ProfessorController.index);

router.get("/count", ProfessorController.count);

router.get("/:id", ProfessorController.show);
router.post("/", ProfessorController.create);
router.put("/:id", ProfessorController.update);
router.delete("/:id", ProfessorController.destroy);

export default router;
