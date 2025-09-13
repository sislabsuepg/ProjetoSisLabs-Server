import Laboratorio from "../models/Laboratorio.js";

export async function seedLaboratorios() {
  const count = await Laboratorio.count();
  if (count > 0) {
    console.log("[seed] Laboratorios já existem, pulando");
    return;
  }
  const nomes = ["Redes", "Hardware", "Robótica", "Pesquisa", "IA", "Dados"];
  const labs = nomes.map((n, i) => ({
    numero: (100 + i).toString(),
    nome: `Lab ${n}`,
    restrito: i % 3 === 0,
    ativo: true,
  }));
  await Laboratorio.bulkCreate(labs);
  console.log("[seed] Laboratorios inseridos");
}
