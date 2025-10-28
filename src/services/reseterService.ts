import Reseter from "../models/Reseter.js";
import Horario from "../models/Horario.js";

export class ReseterService {
  static async getReseter(): Promise<Reseter | null> {
    let reseter = await Reseter.findByPk(1);
    if (!reseter) {
      reseter = await Reseter.create({ id: 1, lastReset: new Date(0) });
    }
    return reseter;
  }

  static async reset(): Promise<void> {
    const reseter = await ReseterService.getReseter();

    await Horario.update(
      {
        idProfessor: null as any,
        semestral: false,
      },
      { where: {} }
    );

    if (reseter) {
      reseter.lastReset = new Date();
      await reseter.save();
    }
  }
}
