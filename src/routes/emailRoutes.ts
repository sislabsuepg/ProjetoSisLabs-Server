import express from "express";
import EmailController from "../controllers/EmailController.js";
import lockPath from "../middlewares/lockPath.js";

const router = express.Router();
const emailController = new EmailController();

router.post("/", lockPath("advertencia"), (req, res) => {
  emailController.enviarAdvertencia(req, res);
});

export default router;
