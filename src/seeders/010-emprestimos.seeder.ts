import { faker } from "@faker-js/faker";
import Emprestimo from "../models/Emprestimo.js";
import Aluno from "../models/Aluno.js";
import Laboratorio from "../models/Laboratorio.js";
import Usuario from "../models/Usuario.js";

export async function seedEmprestimos() {
  const TARGET_TOTAL = 80; // total de empréstimos desejados
  const TARGET_ATIVOS = 8; // máximo de empréstimos abertos simultaneamente

  // Total já existente
  const totalExistente = await Emprestimo.count();
  if (totalExistente >= TARGET_TOTAL) {
    console.log("[seed] Empréstimos suficientes já existem, pulando");
    return;
  }

  // Quantos ainda faltam para chegar em 80
  const faltam = TARGET_TOTAL - totalExistente;

  // Quantos ativos (dataHoraSaida = null) já existem
  const ativosExistentes = await Emprestimo.count({
    where: { dataHoraSaida: null },
  });

  // Quantos ativos ainda podemos criar (não negativo e não maior que faltam)
  const ativosParaCriar = Math.max(
    0,
    Math.min(TARGET_ATIVOS - ativosExistentes, faltam)
  );
  const fechadosParaCriar = faltam - ativosParaCriar; // o restante será fechado

  const alunos = await Aluno.findAll({ attributes: ["id"], limit: 500 });
  const labs = await Laboratorio.findAll({ attributes: ["id"] });
  const usuarios = await Usuario.findAll({ attributes: ["id"] });
  if (!alunos.length || !labs.length || !usuarios.length) {
    console.warn("[seed] Faltam dados para empréstimos");
    return;
  }

  const emprestimos: any[] = [];

  // Criar ativos (sem dataHoraSaida). Mantemos a mesma semântica original:
  // closed = false => dataHoraSaida = null
  for (let i = 0; i < ativosParaCriar; i++) {
    const aluno = faker.helpers.arrayElement(alunos);
    const lab = faker.helpers.arrayElement(labs);
    const userEntrada = faker.helpers.arrayElement(usuarios);
    const entrada = faker.date.recent({ days: 30 });
    const closed = false; // aberto
    emprestimos.push({
      dataHoraEntrada: entrada,
      dataHoraSaida: null,
      posseChave: closed, // preservando a lógica pré-existente
      advertencia: false,
      idLaboratorio: lab.id,
      idAluno: aluno.id,
      idUsuarioEntrada: userEntrada.id,
      idUsuarioSaida: null,
    });
  }

  // Criar fechados (com dataHoraSaida)
  for (let i = 0; i < fechadosParaCriar; i++) {
    const aluno = faker.helpers.arrayElement(alunos);
    const lab = faker.helpers.arrayElement(labs);
    const userEntrada = faker.helpers.arrayElement(usuarios);
    const entrada = faker.date.past({ years: 0.3 });
    // saida alguns minutos/horas/dias após entrada (até 7 dias)
    const saida = faker.date.soon({ days: 7, refDate: entrada });
    const closed = lab.restrito; // fechado
    emprestimos.push({
      dataHoraEntrada: entrada,
      dataHoraSaida: saida,
      posseChave: closed, // preservando a lógica pré-existente
      advertencia: false,
      idLaboratorio: lab.id,
      idAluno: aluno.id,
      idUsuarioEntrada: userEntrada.id,
      idUsuarioSaida: faker.helpers.arrayElement(usuarios).id,
    });
  }

  await Emprestimo.bulkCreate(emprestimos);
  console.log(
    `[seed] Empréstimos inseridos: ${emprestimos.length} (ativos novos: ${ativosParaCriar}, fechados novos: ${fechadosParaCriar})`
  );
}
