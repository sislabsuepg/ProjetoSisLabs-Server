import Horario from "../models/Horario.js";

export default async function horarioCreatorHelper(idLaboratorio: number) {
    const diasSemana = [1, 2, 3, 4, 5, 6]; // Segunda a Sábado
    const horariosSemana: string[] = [
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

    const horariosSabado: string[] = ["08:15", "09:10", "10:05", "11:00"];

    const registros: { idLaboratorio: number; diaSemana: number; horario: string }[] = [];
    for (const dia of diasSemana) {
        const horarios = dia === 6 ? horariosSabado : horariosSemana;
        for (const horario of horarios) {
            registros.push({ idLaboratorio, diaSemana: dia, horario });
        }
    }

    const criados = await Horario.bulkCreate(registros, { returning: true });
    return criados.map((h) => ({
        id: h.id,
        diaSemana: h.diaSemana,
        horario: h.horario,
        laboratorio: { id: idLaboratorio },
    }));
}