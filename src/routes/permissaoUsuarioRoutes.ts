import { Router } from "express";
import PermissaoUsuarioController from "../controllers/PermissaoUsuarioController.js";
const router: Router = Router();

router.get("/", PermissaoUsuarioController.index);

router.get("/count", PermissaoUsuarioController.count);

router.get("/:id", PermissaoUsuarioController.show);

router.post("/", PermissaoUsuarioController.store);

router.put("/:id", PermissaoUsuarioController.update);

router.delete("/:id", PermissaoUsuarioController.destroy);

export default router;
