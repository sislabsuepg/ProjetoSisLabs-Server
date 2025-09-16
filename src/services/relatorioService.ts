import PDFDocument from "pdfkit";
import { Response } from "express";
import { addTabela, addCabecalho, CORES } from "../utils/pdfGenerator.js";
import Emprestimo from "../models/Emprestimo.js";
import Aluno from "../models/Aluno.js";
import Laboratorio from "../models/Laboratorio.js";
import Curso from "../models/Curso.js";
import { Op } from "sequelize";
import { criarRegistro } from "../utils/registroLogger.js";

export default class RelatorioService {
  async gerarRelatorioAcademicoPorCurso(
    cursoId: number,
    res: Response,
    idUsuario?: number
  ) {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    let pageNumber = 0;

    //Função auxiliar para o rodapé
    const addRodape = (currentPage: number) => {
      const bottom = doc.page.margins.bottom;
      const oldY = doc.y;
      const oldX = doc.x;

      doc.page.margins.bottom = 0;

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(CORES.cinzaMedio)
        .text(
          `Página ${currentPage}`,
          0, //Posição fixa do rodapé
          doc.page.height - 50,
          {
            align: "center",
          }
        );

      doc.page.margins.bottom = bottom;

      //Voltar o cursor para onde estava
      doc.x = oldX;
      doc.y = oldY;
    };

    //Listener para adicionar o rodapé a cada vez que uma nova página é criada pelo PDFKIT
    doc.on("pageAdded", () => {
      pageNumber++;
      addRodape(pageNumber);
    });

    //Chamada manual para a primeira página somente
    pageNumber++;
    addRodape(pageNumber);

    try {
      await criarRegistro(
        idUsuario,
        `Relatorio academico por curso: curso: ${cursoId}`
      );
      const curso = await Curso.findByPk(cursoId);
      const nomeCurso = curso ? curso.nome : `Curso ID ${cursoId}`;
      const tituloCabacalho = `Acadêmicos de ${nomeCurso}`;

      addCabecalho(doc, tituloCabacalho);

      const emprestimos = await Emprestimo.findAll({
        include: [
          {
            model: Aluno,
            as: "aluno",
            where: { idCurso: cursoId },
            required: true,
          },
          {
            model: Laboratorio,
            as: "laboratorio",
            required: true,
          },
        ],
        order: [["dataHoraEntrada", "DESC"]],
      });

      //Se não tiver encontrado nada vai retornar um pdf informando
      if (emprestimos.length === 0) {
        doc.moveDown(5);
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("Nenhum Dado Encontrado", { align: "center" });

        doc.moveDown(1);

        doc
          .fontSize(11)
          .font("Helvetica")
          .text(
            `A busca por registros de empréstimos para alunos do curso de "${nomeCurso}" não retornou resultados.`,
            { align: "center" }
          );
      } else {
        const dadosFormatados = emprestimos.map((emp) => {
          const formatarData = (data: Date | null) => {
            if (!data) return "Em aberto";
            return new Date(data).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return {
            nome: emp.aluno.nome,
            ra: emp.aluno.ra,
            posseChave: emp.posseChave ? "Sim" : "Não",
            dataHoraEntrada: formatarData(emp.dataHoraEntrada),
            dataHoraSaida: formatarData(emp.dataHoraSaida),
            laboratorio: emp.laboratorio.nome,
          };
        });

        addTabela(doc, dadosFormatados, nomeCurso);
      }
    } catch (error) {
      console.error("Erro ao buscar dados para o relatório:", error);
      doc
        .fontSize(16)
        .text("Ocorreu um erro ao gerar o relatório.", { align: "center" });
    } finally {
      doc.end();
    }
  }

  async gerarRelatorioAcademico(
    alunoId: number,
    res: Response,
    idUsuario?: number
  ) {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    let pageNumber = 0;

    const addRodape = (currentPage: number) => {
      const bottom = doc.page.margins.bottom;
      const oldY = doc.y;
      const oldX = doc.x;

      doc.page.margins.bottom = 0;

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(CORES.cinzaMedio)
        .text(`Página ${currentPage}`, 0, doc.page.height - 50, {
          align: "center",
        });

      doc.page.margins.bottom = bottom;

      doc.x = oldX;
      doc.y = oldY;
    };

    doc.on("pageAdded", () => {
      pageNumber++;
      addRodape(pageNumber);
    });

    pageNumber++;
    addRodape(pageNumber);

    try {
  await criarRegistro(idUsuario, `Relatorio academico: aluno: ${alunoId}`);
      const aluno = await Aluno.findByPk(alunoId);
      const nomeAluno = aluno ? aluno.nome : `Aluno ID ${alunoId}`;

      addCabecalho(doc, `Acadêmico: ${nomeAluno}`);

      const emprestimos = await Emprestimo.findAll({
        include: [
          {
            model: Aluno,
            as: "aluno",
            where: { id: alunoId },
            required: true,
          },
          {
            model: Laboratorio,
            as: "laboratorio",
            required: true,
          },
        ],
        order: [["dataHoraEntrada", "DESC"]],
      });

      if (emprestimos.length === 0) {
        doc.moveDown(5);
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("Nenhum Dado Encontrado", { align: "center" });

        doc.moveDown(1);

        doc
          .fontSize(11)
          .font("Helvetica")
          .text(
            `A busca por registros de empréstimos para o acadêmico de RA: "${nomeAluno}" não retornou resultados.`,
            { align: "center" }
          );
      } else {
        const dadosFormatados = emprestimos.map((emp) => {
          const formatarData = (data: Date | null) => {
            if (!data) return "Em aberto";
            return new Date(data).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return {
            nome: emp.aluno.nome,
            ra: emp.aluno.ra,
            posseChave: emp.posseChave ? "Sim" : "Não",
            dataHoraEntrada: formatarData(emp.dataHoraEntrada),
            dataHoraSaida: formatarData(emp.dataHoraSaida),
            laboratorio: emp.laboratorio.nome,
          };
        });

        addTabela(doc, dadosFormatados, nomeAluno);
      }
    } catch (error) {
      console.error("Erro ao buscar dados para o relatório:", error);
      doc
        .fontSize(16)
        .text("Ocorreu um erro ao gerar o relatório.", { align: "center" });
    } finally {
      doc.end();
    }
  }

  //Se não fornecer os dados retorna tudo
  async gerarRelatorioEmprestimo(
    laboratorioId: number | null,
    dataInicio: Date | null,
    dataFim: Date | null,
    res: Response,
    idUsuario?: number
  ) {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    let pageNumber = 0;

    const addRodape = (currentPage: number) => {
      const bottom = doc.page.margins.bottom;
      const oldY = doc.y;
      const oldX = doc.x;

      doc.page.margins.bottom = 0;

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(CORES.cinzaMedio)
        .text(`Página ${currentPage}`, 0, doc.page.height - 50, {
          align: "center",
        });

      doc.page.margins.bottom = bottom;

      doc.x = oldX;
      doc.y = oldY;
    };

    doc.on("pageAdded", () => {
      pageNumber++;
      addRodape(pageNumber);
    });

    pageNumber++;
    addRodape(pageNumber);

    try {
      await criarRegistro(
        idUsuario,
        `Relatorio emprestimo: lab: ${laboratorioId || "todos"}`
      );
      const whereClause: any = {};
      if (laboratorioId) {
        whereClause["$laboratorio.id$"] = laboratorioId;
      }
      if (dataInicio && dataFim) {
        whereClause.dataHoraEntrada = {
          [Op.between]: [dataInicio, dataFim],
        };
      }

      const nomeLaboratorio = laboratorioId
        ? await Laboratorio.findByPk(laboratorioId).then((lab) => lab?.nome)
        : "Todos os Laboratórios";
      const tituloCabacalho = `Empréstimos - ${nomeLaboratorio}`;

      addCabecalho(doc, tituloCabacalho);

      const emprestimos = await Emprestimo.findAll({
        include: [
          {
            model: Aluno,
            as: "aluno",
            required: true,
          },
          {
            model: Laboratorio,
            as: "laboratorio",
            required: true,
          },
        ],
        where: whereClause,
        order: [["dataHoraEntrada", "DESC"]],
      });

      if (emprestimos.length === 0) {
        doc.moveDown(5);
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("Nenhum Dado Encontrado", { align: "center" });

        doc.moveDown(1);

        doc
          .fontSize(11)
          .font("Helvetica")
          .text(
            `A busca por registros de empréstimos não retornou resultados.`,
            { align: "center" }
          );
      } else {
        const dadosFormatados = emprestimos.map((emp) => {
          const formatarData = (data: Date | null) => {
            if (!data) return "Em aberto";
            return new Date(data).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return {
            nome: emp.aluno.nome,
            ra: emp.aluno.ra,
            posseChave: emp.posseChave ? "Sim" : "Não",
            dataHoraEntrada: formatarData(emp.dataHoraEntrada),
            dataHoraSaida: formatarData(emp.dataHoraSaida),
            laboratorio: emp.laboratorio.nome,
          };
        });

        addTabela(doc, dadosFormatados, tituloCabacalho);
      }
    } catch (error) {
      console.error("Erro ao buscar dados para o relatório:", error);
      doc
        .fontSize(16)
        .text("Ocorreu um erro ao gerar o relatório.", { align: "center" });
    } finally {
      doc.end();
    }
  }
}
