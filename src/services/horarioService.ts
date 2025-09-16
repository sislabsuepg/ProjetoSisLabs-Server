import Horario from "../models/Horario.js";
import Professor from "../models/Professor.js";
import Laboratorio from "../models/Laboratorio.js";
import { criarRegistro } from "../utils/registroLogger.js";

export default class HorarioService {
  static verificaDiaSemana(diaSemana: number): string[] {
    const erros: string[] = [];
    if (diaSemana < 0 || diaSemana > 6) {
      erros.push("Dia da semana deve ser entre 0 (Segunda-feira) e 6 (Sábado)");
    }
    return erros;
  }

  static verificaHorario(horario: string): string[] {
    const erros: string[] = [];
    const regex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
    console.log(horario, regex.test(horario));
    if (!regex.test(horario)) {
      erros.push("Horário deve estar no formato HH:mm");
    }
    return erros;
  }

  static async getAllHorarios() {
    try {
      const labsComHorarios = await Laboratorio.findAll({
        include: [{ model: Horario, as: "horarios" }],
      });

      if (!labsComHorarios || labsComHorarios.length === 0) {
        return {
          erros: ["Nenhum horario encontrado"],
          data: [],
        };
      }

      const labsFiltrados = labsComHorarios.filter(
        (lab) => lab.horarios && lab.horarios.length > 0
      );

      return {
        erros: [],
        data: labsFiltrados,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar horarios"],
        data: null,
      };
    }
  }

  static async getHorarioById(id: number) {
    try {
      const horario = await Horario.findByPk(id, {
        include: [
          { model: Professor, as: "professor" },
          { model: Laboratorio, as: "laboratorio" },
        ],
      });
      if (!horario) {
        return {
          erros: ["Nenhum horario encontrado"],
          data: [],
        };
      }

      return {
        erros: [],
        data: horario,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar horario"],
        data: null,
      };
    }
  }

  static async getHorariosByLaboratorio(idLaboratorio: number) {
    try {
      const horarios = await Horario.findAll({
        where: { idLaboratorio },
        include: [
          { model: Professor, as: "professor" },
          { model: Laboratorio, as: "laboratorio" },
        ],
      });
      if (!horarios || horarios.length === 0) {
        return {
          erros: ["Nenhum horario encontrado"],
          data: [],
        };
      }

      return {
        erros: [],
        data: horarios,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar horarios"],
        data: null,
      };
    }
  }

  static async getHorariosByDiaSemana(diaSemana: number) {
    try {
      const horarios = await Horario.findAll({
        where: { diaSemana },
        include: [
          { model: Professor, as: "professor" },
          { model: Laboratorio, as: "laboratorio" },
        ],
      });
      if (!horarios || horarios.length === 0) {
        return {
          erros: ["Nenhum horario encontrado"],
          data: [],
        };
      }

      return {
        erros: [],
        data: horarios,
      };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao buscar horarios"],
        data: null,
      };
    }
  }

  static async createHorario(
    diaSemana: number,
    horario: string,
    idLaboratorio: number,
    idUsuario?: number
  ) {
    try {
      const laboratorio = await Laboratorio.findByPk(idLaboratorio);
      if (!laboratorio) {
        return {
          erros: ["Laboratorio não encontrado"],
          data: null,
        };
      }

      const erros: string[] = [
        ...HorarioService.verificaDiaSemana(diaSemana),
        ...HorarioService.verificaHorario(horario),
      ];

      if (erros.length > 0) {
        return {
          erros,
          data: null,
        };
      }

      const horarioExistente = await Horario.findOne({
        where: {
          diaSemana,
          horario,
          idLaboratorio,
        },
      });

      if (horarioExistente) {
        return {
          erros: ["Horario já existe para este laboratorio, dia e horário"],
          data: null,
        };
      }

      const novoHorario = await Horario.create({
        diaSemana,
        horario,
        idLaboratorio,
      });
      await criarRegistro(
        idUsuario,
        `Horario criado: dia: ${diaSemana} hora: ${horario} lab: ${idLaboratorio}`
      );
      return { erros: [], data: novoHorario };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao criar horario"],
        data: null,
      };
    }
  }

  static async updateHorario(
    id: number,
    idProfessor?: number,
    semestral?: boolean,
    idUsuario?: number
  ) {
    try {
      const horarioExistente = await Horario.findByPk(id);
      if (!horarioExistente) {
        return {
          erros: ["Horario não encontrado"],
          data: null,
        };
      }

      let professor: Professor | null = null;

      if (idProfessor) {
        professor = await Professor.findByPk(idProfessor);
        if (!professor) {
          return {
            erros: ["Professor não encontrado"],
            data: null,
          };
        }
      }

      await horarioExistente.update({
        idProfessor,
        semestral: semestral || false,
      });
      await criarRegistro(
        idUsuario,
        `Horario atualizado: prof: ${idProfessor ?? "none"} semestral: ${
          semestral ?? false
        }`
      );
      return { erros: [], data: horarioExistente };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao atualizar horario"],
        data: null,
      };
    }
  }

  static async deleteHorario(id: number, idUsuario?: number) {
    try {
      const horario = await Horario.findByPk(id);
      if (!horario) {
        return {
          erros: ["Horario não encontrado"],
          data: null,
        };
      }

      await horario.destroy();
  await criarRegistro(idUsuario, `Horario removido: id=${id}`);
      return { erros: [], data: null };
    } catch (e) {
      console.log(e);
      return {
        erros: ["Erro ao deletar horario"],
        data: null,
      };
    }
  }
}
