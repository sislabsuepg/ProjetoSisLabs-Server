import express from "express";
import RelatorioController from "../controllers/RelatorioController.js";
import lockPath from "../middlewares/lockPath.js";

const router = express.Router();

router.get("/academicoPorCurso", lockPath("relatorio"), (req, res) => {
  RelatorioController.gerarRelatorioAcademicoPorCurso(req, res);
});

router.get("/academico", lockPath("relatorio"), (req, res) => {
  RelatorioController.gerarRelatorioAcademico(req, res);
});

router.get("/emprestimo", lockPath("relatorio"), (req, res) => {
  RelatorioController.gerarRelatorioEmprestimo(req, res);
});

export default router;
