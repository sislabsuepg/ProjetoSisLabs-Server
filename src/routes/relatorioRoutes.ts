import express from "express";
import RelatorioController from "../controllers/RelatorioController";

const router = express.Router();
const relatorioController = new RelatorioController();

router.get("/academicoPorCurso", (req, res) => {
  relatorioController.gerarRelatorioAcademicoPorCurso(req, res);
});

router.get("/academico", (req, res) => {
  relatorioController.gerarRelatorioAcademico(req, res);
});

router.get("/emprestimo", (req, res) => {
  relatorioController.gerarRelatorioEmprestimo(req, res);
})



export default router;