import { faker } from "@faker-js/faker";
import Evento from "../models/Evento.js";
import Laboratorio from "../models/Laboratorio.js";

export async function seedEventos() {
  const count = await Evento.count();
  if (count >= 20) {
    console.log("[seed] Eventos suficientes já existem, pulando");
    return;
  }
  const labs = await Laboratorio.findAll({ attributes: ["id"] });
  if (!labs.length) {
    console.warn("[seed] Sem laboratorios para eventos");
    return;
  }
  const eventos = Array.from({ length: 20 - count }).map(() => {
    const lab = faker.helpers.arrayElement(labs);
    const data = faker.date.soon({ days: 30 });
    return {
      nome:
        faker.helpers.arrayElement([
          "Workshop",
          "Treinamento",
          "Reunião",
          "Apresentação",
        ]) +
        " " +
        faker.word.noun(),
      data,
      duracao: faker.number.int({ min: 30, max: 240 }),
      responsavel: faker.person.lastName(),
      idLaboratorio: lab.id,
    };
  });
  await Evento.bulkCreate(eventos);
  console.log("[seed] Eventos inseridos");
}
