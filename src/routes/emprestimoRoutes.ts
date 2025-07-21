import { Router } from "express";
import EmprestimoController from "../controllers/EmprestimoController";

const router: Router = Router();

router.get("/", EmprestimoController.index);
router.get("/:id", EmprestimoController.show);
router.post("/", EmprestimoController.create);
router.put("/:id", EmprestimoController.update);
router.put("/close/:id", EmprestimoController.close);

export default router;
