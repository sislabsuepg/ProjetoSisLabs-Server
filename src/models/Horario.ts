import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";

import Professor from "./Professor.js";
import Laboratorio from "./Laboratorio.js";
interface HorarioAtributos {
  id: number;
  diaSemana: number;
  horario: string;
  idLaboratorio: number;
  idProfessor: number;
}

interface HorarioCreationAtributos
  extends Optional<HorarioAtributos, "id" | "idProfessor"> {}

@Table({
  tableName: "horario",
  modelName: "Horario",
  timestamps: false,
})
export default class Horario extends Model<
  HorarioAtributos,
  HorarioCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER, // 0 a 6, sendo 0 = domingo e 6 = sabado
  })
  declare diaSemana: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(5), // formato HH:MM
  })
  declare horario: string;

  @BelongsTo(() => Professor, {
    foreignKey: "idProfessor",
    targetKey: "id",
  })
  declare professor: Professor | null;

  @BelongsTo(() => Laboratorio, {
    foreignKey: "idLaboratorio",
    targetKey: "id",
  })
  declare laboratorio: Laboratorio;
}
