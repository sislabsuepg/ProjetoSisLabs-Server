import { faker } from "@faker-js/faker";
import Recado from "../models/Recado.js";

export async function seedRecados() {
  const count = await Recado.count();
  if (count >= 10) {
    console.log("[seed] Recados suficientes já existem, pulando");
    return;
  }
  const recados = Array.from({ length: 10 - count }).map(() => ({
    texto: faker.lorem.sentence({ min: 10, max: 20 }),
  }));
  await Recado.bulkCreate(recados);
  console.log("[seed] Recados inseridos");
}
