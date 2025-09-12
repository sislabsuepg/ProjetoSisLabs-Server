import { faker } from "@faker-js/faker";
import Emprestimo from "../models/Emprestimo.js";
import Aluno from "../models/Aluno.js";
import Laboratorio from "../models/Laboratorio.js";
import Usuario from "../models/Usuario.js";

export async function seedEmprestimos() {
  const count = await Emprestimo.count();
  if (count >= 80) {
    console.log("[seed] Emprestimos suficientes já existem, pulando");
    return;
  }
  const alunos = await Aluno.findAll({ attributes: ["id"], limit: 500 });
  const labs = await Laboratorio.findAll({ attributes: ["id"] });
  const usuarios = await Usuario.findAll({ attributes: ["id"] });
  if (!alunos.length || !labs.length || !usuarios.length) {
    console.warn("[seed] Faltam dados para empréstimos");
    return;
  }
  const emprestimos = Array.from({ length: 80 - count }).map(() => {
    const aluno = faker.helpers.arrayElement(alunos);
    const lab = faker.helpers.arrayElement(labs);
    const userEntrada = faker.helpers.arrayElement(usuarios);
    const entrada = faker.date.past({ years: 0.3 });
    const closed = faker.datatype.boolean();
    const saida = closed
      ? faker.date.soon({ days: 7, refDate: entrada })
      : null;
    return {
      dataHoraEntrada: entrada,
      dataHoraSaida: saida,
      posseChave: closed,
      advertencia: faker.helpers.arrayElement([
        null,
        null,
        null,
        "Chave atrasada",
        "Porta aberta",
      ]),
      idLaboratorio: lab.id,
      idAluno: aluno.id,
      idUsuarioEntrada: userEntrada.id,
      idUsuarioSaida: closed ? faker.helpers.arrayElement(usuarios).id : null,
    };
  });
  await Emprestimo.bulkCreate(emprestimos);
  console.log("[seed] Emprestimos inseridos");
}
