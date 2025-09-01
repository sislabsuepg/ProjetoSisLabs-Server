import { Router, RouterOptions } from "express";
import OrientacaoController from "../controllers/OrientacaoController";

const router: Router = Router();

router.get("/", OrientacaoController.index);

router.get("/count", OrientacaoController.count);

router.get("/:id", OrientacaoController.show);
router.post("/", OrientacaoController.store);
router.put("/:id", OrientacaoController.update);
router.delete("/:id", OrientacaoController.destroy);

export default router;
