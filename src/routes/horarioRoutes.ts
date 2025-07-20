import { Router } from "express";
import HorarioController from "../controllers/HorarioController";

const router: Router = Router();

router.get("/", HorarioController.index);
router.get("/:id", HorarioController.show);
router.post("/", HorarioController.create);
router.put("/:id", HorarioController.update);
router.delete("/:id", HorarioController.delete);

export default router;
