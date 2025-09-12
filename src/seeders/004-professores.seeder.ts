import { faker } from "@faker-js/faker";
import Professor from "../models/Professor.js";

export async function seedProfessores() {
  const count = await Professor.count();
  if (count > 0) {
    console.log("[seed] Professores já existem, pulando");
    return;
  }
  const professores = Array.from({ length: 15 }).map(() => ({
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    ativo: true,
  }));
  await Professor.bulkCreate(professores);
  console.log("[seed] Professores inseridos");
}
