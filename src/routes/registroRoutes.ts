import { Router } from "express";
import RegistroController from "../controllers/RegistroController.js";
import lockPath from "../middlewares/lockPath.js";

const router: Router = Router();

router.get("/", lockPath("geral"), RegistroController.index);

router.get("/count", lockPath("geral"), RegistroController.count);

router.get("/:id", lockPath("geral"), RegistroController.show);

router.get("/user/:userId", lockPath("geral"), RegistroController.showByUserId);

router.post("/", lockPath("geral"), RegistroController.create);

export default router;
