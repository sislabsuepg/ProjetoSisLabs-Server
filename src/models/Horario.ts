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

import Professor from "./Professor";
import Laboratorio from "./Laboratorio";
interface HorarioAtributos {
  id: number;
  diaSemana: number;
  horario: string;
  semestral: boolean;
  idLaboratorio: number;
}

interface HorarioCreationAtributos
  extends Optional<HorarioAtributos, "id" | "semestral"> {}

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare semestral: boolean;

  @BelongsTo(() => Professor, {
    foreignKey: "idProfessor",
    targetKey: "id",
  })
  declare professor: Professor;

  @BelongsTo(() => Laboratorio, {
    foreignKey: "idLaboratorio",
    targetKey: "id",
  })
  declare laboratorio: Laboratorio;
}
