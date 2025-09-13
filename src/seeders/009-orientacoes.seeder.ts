import { faker } from "@faker-js/faker";
import Orientacao from "../models/Orientacao.js";
import Professor from "../models/Professor.js";
import Aluno from "../models/Aluno.js";
import Laboratorio from "../models/Laboratorio.js";

export async function seedOrientacoes() {
  const count = await Orientacao.count();
  if (count >= 30) {
    console.log("[seed] Orientacoes suficientes já existem, pulando");
    return;
  }
  const professores = await Professor.findAll({ attributes: ["id"] });
  const alunos = await Aluno.findAll({ attributes: ["id"], limit: 500 });
  const labs = await Laboratorio.findAll({ attributes: ["id"] });
  if (!professores.length || !alunos.length || !labs.length) {
    console.warn("[seed] Faltam dados para orientações");
    return;
  }
  const orientacoes = Array.from({ length: 30 - count }).map(() => {
    const prof = faker.helpers.arrayElement(professores);
    const aluno = faker.helpers.arrayElement(alunos);
    const lab = faker.helpers.arrayElement(labs);
    const inicio = faker.date.past({ years: 1 });
    const fim = faker.date.soon({ days: 120, refDate: inicio });
    return {
      dataInicio: inicio,
      dataFim: fim,
      idAluno: aluno.id,
      idProfessor: prof.id,
      idLaboratorio: lab.id,
    };
  });
  await Orientacao.bulkCreate(orientacoes);
  console.log("[seed] Orientacoes inseridas");
}
