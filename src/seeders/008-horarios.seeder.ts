import Horario from "../models/Horario.js";
import Professor from "../models/Professor.js";
import Laboratorio from "../models/Laboratorio.js";

// Nova regra: GERAR TODOS os horários possíveis (todos os slots semanais) para cada laboratório ativo.
// Apenas ~18% dos registros terão um professor associado; os demais ficam com idProfessor = null (vago).
// Dias considerados: 1 (segunda) a 6 (sábado). Domingo (0) ignorado.
// Slots:
//   Seg-Sex: 14 slots
//   Sáb: 4 slots
// Total por laboratório: 74 registros garantidos.

const PROFESSOR_RATE = 0.18; // probabilidade de atribuir professor
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
const saturdaySlots = ["08:15", "09:10", "10:05", "11:00"];
const TOTAL_SLOTS_POR_LAB = weekdaySlots.length * 5 + saturdaySlots.length; // 74

export async function seedHorarios() {
  const professores = await Professor.findAll({ attributes: ["id"] });
  const laboratorios = await Laboratorio.findAll({
    attributes: ["id", "ativo"],
  });
  if (!professores.length || !laboratorios.length) {
    console.warn(
      "[seed] Faltam professores ou laboratórios para gerar horários"
    );
    return;
  }

  const labsAtivos = laboratorios.filter((l: any) => l.ativo !== false);
  if (!labsAtivos.length) {
    console.warn("[seed] Nenhum laboratório ativo para gerar horários");
    return;
  }

  // Busca existentes para não duplicar
  const existentes = await Horario.findAll({
    attributes: ["diaSemana", "horario", "idLaboratorio"],
  });
  const cacheExistentes = new Set(
    existentes.map((h: any) => `${h.diaSemana}|${h.horario}|${h.idLaboratorio}`)
  );

  const inserts: any[] = [];

  for (const lab of labsAtivos) {
    for (let dia = 1; dia <= 6; dia++) {
      const slots = dia === 6 ? saturdaySlots : weekdaySlots;
      for (const hora of slots) {
        const key = `${dia}|${hora}|${lab.id}`;
        if (cacheExistentes.has(key)) continue; // já existe

        // Decide se este slot terá professor
        let idProfessor: number | null = null;
        if (professores.length && Math.random() < PROFESSOR_RATE) {
          const prof =
            professores[Math.floor(Math.random() * professores.length)];
          idProfessor = prof?.id ?? null;
        }

        inserts.push({
          diaSemana: dia,
          horario: hora,
          semestral: false,
          idProfessor,
          idLaboratorio: lab.id,
        });
      }
    }
  }

  if (!inserts.length) {
    console.log("[seed] Todos os slots já existiam");
    return;
  }

  await Horario.bulkCreate(inserts as any[]);
  // Estatística simples da ocupação criada nesta rodada
  const ocupadosNovos = inserts.filter((i) => i.idProfessor !== null).length;
  const taxa = ((ocupadosNovos / inserts.length) * 100).toFixed(2);
  console.log(
    `[seed] Horários gerados: ${inserts.length} (com professor: ${ocupadosNovos} = ${taxa}% desta inserção)`
  );
}
