import { Router } from "express";
import TipoUsuarioController from "../controllers/tipoUsuarioController";
const router: Router = Router();

router.get("/", TipoUsuarioController.index);

router.get("/:id", TipoUsuarioController.show);

router.post("/", TipoUsuarioController.store);

router.put("/:id", TipoUsuarioController.update);

router.delete("/:id", TipoUsuarioController.destroy);

export default router;
