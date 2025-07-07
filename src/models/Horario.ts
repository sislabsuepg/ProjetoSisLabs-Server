import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";

import Professor from "./Professor";
import Laboratorio from "./Laboratorio";
interface HorarioAtributos {
  id: number;
  diaSemana: number;
  horario: string;
  semestral: boolean;
  idProfessor: number;
  idLaboratorio: number;
}

interface HorarioCreationAtributos
  extends Optional<
    HorarioAtributos,
    "id" | "semestral" | "idProfessor" | "idLaboratorio"
  > {}

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
  declare hora: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare semestral: boolean;

  @AllowNull(true)
  @ForeignKey(() => Professor)
  @Column({
    type: DataType.INTEGER,
  })
  declare idProfessor: number;

  @AllowNull(false)
  @ForeignKey(() => Laboratorio)
  @Column({
    type: DataType.INTEGER,
  })
  declare idLaboratorio: number;
}
