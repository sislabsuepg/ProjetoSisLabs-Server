import { Router } from "express";
import EmprestimoController from "../controllers/EmprestimoController.js";
import lockPath from "../middlewares/lockPath.js";
const router: Router = Router();

router.get("/", EmprestimoController.index);

router.get("/count", EmprestimoController.count);

router.get("/:id", EmprestimoController.show);

router.post("/", lockPath("cadastro"), EmprestimoController.create);

router.put("/:id", lockPath("advertencia"), EmprestimoController.update);

router.put("/close/:id", lockPath("alteracao"), EmprestimoController.close);

export default router;
