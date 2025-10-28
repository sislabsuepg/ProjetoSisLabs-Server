import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dadosRelatorio } from "../types/Relatorio";

export const CORES = {
  cinzaEscuro: "#2c3e50",
  cinzaMedio: "#555555",
  cinzaClaro: "#ecf0f1",
  borda: "#bdc3c7",
  branco: "#ffffff",
  cabecalhoTabela: "#34495e",
};

//Capturar o path da logo da uepg
function getDirname() {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
}

export function addCabecalho(doc: PDFKit.PDFDocument, titulo: string) {
  // Resolve logo path for both src and dist runtimes
  const baseDir = getDirname();
  const primaryPath = path.resolve(baseDir, "assets", "logo_uepg.png");
  const fallbackPath = path.resolve(
    baseDir,
    "../../src/utils/assets/logo_uepg.png"
  );
  const imagePath = fs.existsSync(primaryPath) ? primaryPath : fallbackPath;
  if (!fs.existsSync(imagePath)) {
    throw new Error(
      `Logo não encontrada. Procurei em: ${primaryPath} e ${fallbackPath}`
    );
  }

  doc.image(imagePath, 50, 50, { width: 100 });

  doc
    .fontSize(19)
    .font("Helvetica-Bold")
    .fillColor(CORES.cinzaEscuro)
    .text("Coordenação dos Laboratórios - DEINFO", 160, 60)
    .moveDown(0.5);

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(CORES.cinzaMedio)
    .text("Relatório de Atividades do Laboratório", 160, 90)
    .text(`Referente a: ${titulo}`, 160, 105)
    .text(`Data: ${dataAtual}`, 400, 90, { align: "right" })
    .moveTo(50, 130)
    .lineTo(550, 130)
    .strokeColor(CORES.borda)
    .stroke()
    .moveDown(2);
}

//função auxiliar para desenhar apenas o cabeçalho da tabela
function desenharCabecalhoTabela(doc: PDFKit.PDFDocument, y: number) {
  const colWidths = [170, 70, 60, 100, 100];
  const tableHeaders = ["Nome do Aluno", "RA", "Chave", "Entrada", "Saída"];
  const itemHeight = 25;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .rect(
      50,
      y,
      colWidths.reduce((a, b) => a + b),
      itemHeight
    )
    .fill(CORES.cabecalhoTabela)
    .fillColor(CORES.branco);

  let currentX = 55;
  tableHeaders.forEach((header, i) => {
    doc.text(header, currentX, y + 8);
    currentX += colWidths[i];
  });

  doc.fillColor(CORES.cinzaEscuro);
}

export function addTabela(
  doc: PDFKit.PDFDocument,
  data: dadosRelatorio[],
  titulo: string
) {
  const tableTop = 170;
  const itemHeight = 25;
  const colWidths = [160, 80, 60, 100, 100];
  const pageBottom = doc.page.height - doc.page.margins.bottom;

  let y = tableTop;

  desenharCabecalhoTabela(doc, y);
  y += itemHeight;

  doc.fontSize(9).font("Helvetica-Bold");

  for (const row of data) {
    //Verifica se a próxima linha vai além da margem inferior
    if (y + itemHeight > pageBottom) {
      doc.addPage();
      addCabecalho(doc, titulo);
      y = tableTop;
      desenharCabecalhoTabela(doc, y);
      y += itemHeight;
    }

    //Colorir alternadamente as linhas para mais legibilidade
    const isEvenRow = data.indexOf(row) % 2 !== 0;
    if (isEvenRow) {
      doc
        .rect(
          50,
          y,
          colWidths.reduce((a, b) => a + b),
          itemHeight
        )
        .fill(CORES.cinzaClaro);
    }

    const rowData = [
      row.nome,
      row.ra,
      row.posseChave,
      row.dataHoraEntrada,
      row.dataHoraSaida,
    ];
    let currentX = 55;

    rowData.forEach((cell, i) => {
      doc
        .fillColor(CORES.cinzaEscuro)
        .text(cell.toString(), currentX, y + 8, {
          width: colWidths[i] - 10,
          align: "left",
        });
      currentX += colWidths[i];
    });

    y += itemHeight;
  }
}
