import RecadoController from "../controllers/RecadoController.js";

import { Router } from "express";

const router: Router = Router();

router.get("/", RecadoController.index);

router.get("/count", RecadoController.count);

router.get("/:id", RecadoController.show);

router.post("/", RecadoController.store);

router.put("/:id", RecadoController.update);

router.delete("/:id", RecadoController.destroy);

export default router;
