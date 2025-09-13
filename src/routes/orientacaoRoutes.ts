import { Router, RouterOptions } from "express";
import OrientacaoController from "../controllers/OrientacaoController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", OrientacaoController.index);

router.get("/count", OrientacaoController.count);

router.get("/:id", OrientacaoController.show);
router.get("/aluno/:idAluno", OrientacaoController.showByAluno);
router.post("/", lockPath("cadastro"), OrientacaoController.store);
router.put("/:id", lockPath("alteracao"), OrientacaoController.update);
router.delete("/:id", lockPath("alteracao"), OrientacaoController.destroy);

export default router;
