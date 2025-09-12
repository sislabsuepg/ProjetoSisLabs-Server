import Curso from "../models/Curso.js";

export async function seedCursos() {
  const count = await Curso.count();
  if (count > 0) {
    console.log("[seed] Cursos já existem, pulando");
    return;
  }
  await Curso.bulkCreate([
    { nome: "Ciência da Computação", anosMaximo: 8, ativo: true },
    { nome: "Engenharia de Software", anosMaximo: 8, ativo: true },
    { nome: "Sistemas de Informação", anosMaximo: 8, ativo: true },
    { nome: "Tecnologia em Análise de Sistemas", anosMaximo: 6, ativo: true },
  ]);
  console.log("[seed] Cursos inseridos");
}
