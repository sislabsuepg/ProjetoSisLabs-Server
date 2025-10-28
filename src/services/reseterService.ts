import Reseter from "../models/Reseter.js";
import Horario from "../models/Horario.js";
import cron from "node-cron";

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
      },
      { where: {} }
    );

    if (reseter) {
      reseter.lastReset = new Date();
      await reseter.save();
    }
  }

  static async scheduledReset(): Promise<void> {
    const reseter = await ReseterService.getReseter();
    if (!reseter) return;
    if (reseter?.lastReset.getFullYear() < new Date().getFullYear()) {
      await ReseterService.reset();
    }

    cron.schedule("0 0 1 1 *", async () => {
      await ReseterService.reset();
    });
  }
}
