import UsuarioController from "../controllers/UsuarioController.js";

import { Router } from "express";

const router: Router = Router();

router.get("/", UsuarioController.index);

router.get("/count", UsuarioController.count);

router.get("/:id", UsuarioController.show);

router.post("/", UsuarioController.store);

router.put("/:id", UsuarioController.update);

router.delete("/:id", UsuarioController.destroy);

router.post("/login", UsuarioController.login);

export default router;
