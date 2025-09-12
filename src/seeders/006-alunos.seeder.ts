import { faker } from "@faker-js/faker";
import Aluno from "../models/Aluno.js";
import Curso from "../models/Curso.js";

export async function seedAlunos() {
  const count = await Aluno.count();
  if (count >= 500) {
    console.log("[seed] Alunos suficientes já existem, pulando");
    return;
  }
  const cursos = await Curso.findAll({ attributes: ["id", "anosMaximo"] });
  if (cursos.length === 0) {
    console.warn("[seed] Nenhum curso encontrado para gerar alunos");
    return;
  }
  const total = 500 - count;
  const batchSize = 100;
  let created = 0;

  while (created < total) {
    const size = Math.min(batchSize, total - created);
    const alunos = Array.from({ length: size }).map(() => {
      const curso = faker.helpers.arrayElement(cursos);
      const anoCurso = faker.number.int({ min: 1, max: curso.anosMaximo || 8 });
      const nome = faker.person.fullName();
      const ra = faker.number
        .int({ min: 10 ** 12, max: 10 ** 13 - 1 })
        .toString();
      return {
        ra,
        nome,
        senha: "123456",
        telefone: `(${faker.number.int({
          min: 41,
          max: 49,
        })}) 9${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({
          min: 1000,
          max: 9999,
        })}`,
        anoCurso,
        email: "", // hook gera
        ativo: true,
        idCurso: curso.id,
      };
    });
    // Usamos individualHooks para disparar @BeforeCreate (formata nome, gera email e hash da senha)
    await Aluno.bulkCreate(alunos, { individualHooks: true });
    created += size;
    console.log(`[seed] Alunos inseridos: ${created}/${total}`);
  }
  console.log("[seed] Alunos finalizados");
}
