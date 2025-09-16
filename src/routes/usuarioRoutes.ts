import UsuarioController from "../controllers/UsuarioController.js";

import { Router } from "express";
import { interceptUserCookie } from "../middlewares/interceptUserCookie.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", interceptUserCookie, UsuarioController.index);

router.get("/count", interceptUserCookie, UsuarioController.count);

router.get("/:id", interceptUserCookie, UsuarioController.show);

router.put("/senha/:id", interceptUserCookie, UsuarioController.updateSenha);

router.post(
  "/resetarsenha/:id",
  interceptUserCookie,
  UsuarioController.resetSenha
);

router.post(
  "/",
  interceptUserCookie,
  lockPath("cadastro"),
  UsuarioController.store
);

router.put(
  "/:id",
  interceptUserCookie,
  lockPath("alteracao"),
  UsuarioController.update
);

router.delete(
  "/:id",
  interceptUserCookie,
  lockPath("alteracao"),
  UsuarioController.destroy
);

router.post("/login", UsuarioController.login);

export default router;
