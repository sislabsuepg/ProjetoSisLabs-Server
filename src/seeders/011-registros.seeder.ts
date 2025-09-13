import { faker } from "@faker-js/faker";
import Registro from "../models/Registro.js";
import Usuario from "../models/Usuario.js";

export async function seedRegistros() {
  const count = await Registro.count();
  if (count >= 50) {
    console.log("[seed] Registros suficientes já existem, pulando");
    return;
  }
  const usuarios = await Usuario.findAll({ attributes: ["id"] });
  if (!usuarios.length) {
    console.warn("[seed] Sem usuarios para registros");
    return;
  }
  const acoes = [
    "Login",
    "Logout",
    "Criou Aluno",
    "Atualizou Curso",
    "Gerou Relatório",
    "Reiniciou Sistema",
    "Alterou Permissão",
  ];
  const registros = Array.from({ length: 50 - count }).map(() => {
    const user = faker.helpers.arrayElement(usuarios);
    return {
      dataHora: faker.date.past({ years: 0.5 }),
      descricao: faker.helpers.arrayElement(acoes),
      idUsuario: user.id,
    };
  });
  await Registro.bulkCreate(registros);
  console.log("[seed] Registros inseridos");
}
