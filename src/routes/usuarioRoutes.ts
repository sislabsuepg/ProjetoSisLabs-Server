import UsuarioController from "../controllers/UsuarioController.js";

import { Router } from "express";
import { interceptUserCookie } from "../middlewares/interceptUserCookie.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get(
  "/",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.index,
);

router.get(
  "/count",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.count,
);

router.get(
  "/:id",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.show,
);

router.put("/senha/:id", interceptUserCookie, UsuarioController.updateSenha);

router.post(
  "/resetarsenha/:id",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.resetSenha,
);

router.post(
  "/",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.store,
);

router.put(
  "/:id",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.update,
);

router.delete(
  "/:id",
  interceptUserCookie,
  lockPath("geral"),
  UsuarioController.destroy,
);

router.post("/login", UsuarioController.login);

export default router;
