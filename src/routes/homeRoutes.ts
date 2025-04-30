import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Operante");
});

router.get("/test", (req, res) => {
  res.send("Tudo certo :)");
});

export default router;
