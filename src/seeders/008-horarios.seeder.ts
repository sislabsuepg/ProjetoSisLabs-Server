import { faker } from "@faker-js/faker";
import Horario from "../models/Horario.js";
import Professor from "../models/Professor.js";
import Laboratorio from "../models/Laboratorio.js";

// Slots informados:
// Segunda a sexta: 08:15, 09:10, 10:05, 11:00, 13:30, 14:20, 15:10, 16:00, 17:05, 17:55, 18:45, 19:40, 20:35, 21:30
// Sábado: 08:15, 09:10, 10:05, 11:00
// Sábado: 08:00,08:55,09:40,10:35,11:30
const weekdaySlots = [
  "08:15",
  "09:10",
  "10:05",
  "11:00",
  "13:30",
  "14:20",
  "15:10",
  "16:00",
  "17:05",
  "17:55",
  "18:45",
  "19:40",
  "20:35",
  "21:30",
];
const saturdaySlots = [
  "08:15",
  "09:10",
  "10:05",
  "11:00",
];

export async function seedHorarios() {
  const existing = await Horario.count();
  const TARGET = 80;
  if (existing >= TARGET) {
    console.log("[seed] Horarios suficientes já existem, pulando");
    return;
  }
  const professores = await Professor.findAll({ attributes: ["id"] });
  const labsAll = await Laboratorio.findAll({ attributes: ["id"] });
  if (!professores.length || !labsAll.length) {
    console.warn("[seed] Faltam professores ou laboratórios para horários");
    return;
  }
  const labs = labsAll.slice(0, Math.min(4, labsAll.length));

  const combos: {
    diaSemana: number;
    horario: string;
    idLaboratorio: number;
    idProfessor: number;
    semestral: boolean;
  }[] = [];
  const used = new Set<string>();

  const dias = [1, 2, 3, 4, 5, 6];
  for (const dia of dias) {
    const slots = dia === 6 ? saturdaySlots : weekdaySlots;
    for (const lab of labs) {
      const desiredCount =
        dia === 6
          ? faker.number.int({ min: 2, max: 5 })
          : faker.number.int({ min: 5, max: 8 });
      const shuffled = faker.helpers.shuffle(slots.slice());
      const pick = shuffled.slice(0, desiredCount);
      for (const hora of pick) {
        if (combos.length + existing >= TARGET) break;
        const prof = faker.helpers.arrayElement(professores);
        const key = `${dia}-${hora}-${lab.id}`;
        if (used.has(key)) continue;
        used.add(key);
        combos.push({
          diaSemana: dia,
          horario: hora,
          semestral: Math.random() < 0.3,
          idProfessor: prof.id,
          idLaboratorio: lab.id,
        });
      }
      if (combos.length + existing >= TARGET) break;
    }
    if (combos.length + existing >= TARGET) break;
  }

  if (!combos.length) {
    console.log("[seed] Nenhum novo horário gerado");
    return;
  }
  await Horario.bulkCreate(combos as any[]);
  console.log(`[seed] Horarios inseridos: ${combos.length}`);
}
