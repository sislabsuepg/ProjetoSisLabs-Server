import { Request, Response } from "express";
import RelatorioService from "../services/relatorioService.js";
import codes from "../types/responseCodes.js";

const relatorioService = new RelatorioService();

//já envia o pdf diretamente na resposta
class RelatorioController {
  async gerarRelatorioAcademicoPorCurso(req: Request, res: Response) {
    const { cursoId } = req.query;

    if (!cursoId) {
      return res.status(codes.BAD_REQUEST).json({
        erros: ["O parâmetro 'cursoId' é obrigatório."],
        data: null,
      });
    }

    try {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=relatorio_academicos_curso_${cursoId}.pdf`
      );

      await relatorioService.gerarRelatorioAcademicoPorCurso(
        Number(cursoId),
        res,
        (req.body as any)?.idUsuario
      );
    } catch (error) {
      if (!res.headersSent) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send("Erro ao gerar o relatório de Acadêmicos por Curso.");
      }
    }
  }

  async gerarRelatorioAcademico(req: Request, res: Response) {
    const { alunoId } = req.query;

    if (!alunoId) {
      return res.status(codes.BAD_REQUEST).json({
        erros: ["O parâmetro 'alunoId' é obrigatório."],
        data: null,
      });
    }

    try {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=relatorio_academico_RA_${alunoId}.pdf`
      );
      await relatorioService.gerarRelatorioAcademico(
        Number(alunoId),
        res,
        (req.body as any)?.idUsuario
      );
    } catch (error) {
      if (!res.headersSent) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send("Erro ao gerar o relatório de Acadêmico.");
      }
    }
  }

  async gerarRelatorioEmprestimo(req: Request, res: Response) {
    const { laboratorioId, dataInicio, dataFim } = req.query;

    try {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=relatorio_emprestimos.pdf`
      );

      await relatorioService.gerarRelatorioEmprestimo(
        laboratorioId ? Number(laboratorioId) : null,
        dataInicio ? new Date(dataInicio as string) : null,
        dataFim ? new Date(dataFim as string) : null,
        res,
        (req.body as any)?.idUsuario
      );
    } catch (error) {
      if (!res.headersSent) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send("Erro ao gerar o relatório de Empréstimos.");
      }
    }
  }
}

export default new RelatorioController();
