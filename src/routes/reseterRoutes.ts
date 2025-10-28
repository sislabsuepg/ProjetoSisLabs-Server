import express from "express";
import ReseterController from "../controllers/ReseterController.js";
import lockPath from "../middlewares/lockPath.js";

const router = express.Router();

router.post("/reset", lockPath("geral"), (req, res) => {
  ReseterController.reset(req, res);
});

export default router;
