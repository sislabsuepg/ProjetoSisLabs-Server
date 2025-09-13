import { Router } from "express";
import PermissaoUsuarioController from "../controllers/PermissaoUsuarioController.js";
import lockPath from "../middlewares/lockPath.js";
const router: Router = Router();

router.get("/", PermissaoUsuarioController.index);

router.get("/count", PermissaoUsuarioController.count);

router.get("/:id", PermissaoUsuarioController.show);

router.post("/", lockPath("geral"), PermissaoUsuarioController.store);

router.put("/:id", lockPath("geral"), PermissaoUsuarioController.update);

router.delete("/:id", lockPath("geral"), PermissaoUsuarioController.destroy);

export default router;
