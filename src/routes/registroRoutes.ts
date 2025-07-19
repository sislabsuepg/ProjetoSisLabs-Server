import { Router } from "express";
import RegistroController from "../controllers/RegistroController";

const router: Router = Router();

router.get("/", RegistroController.index);

router.get("/:id", RegistroController.show);

router.get("/user/:userId", RegistroController.showByUserId);

router.post("/", RegistroController.create);

export default router;
