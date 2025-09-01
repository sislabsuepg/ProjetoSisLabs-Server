import { Router } from "express";
import EventoController from "../controllers/EventoController.js";

const router: Router = Router();

router.get("/", EventoController.index);

router.get("/count", EventoController.count);

router.get("/:id", EventoController.show);
router.post("/", EventoController.create);
router.put("/:id", EventoController.update);
router.delete("/:id", EventoController.destroy);

export default router;
