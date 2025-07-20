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

import Laboratorio from "./Laboratorio";

interface EventoAtributos {
  id: number;
  nome: string;
  data: Date;
  duracao: number; // Duração em minutos
  responsavel: string;
  idLaboratorio: number;
}

interface EventoCreationAtributos extends Optional<EventoAtributos, "id"> {}

@Table({
  tableName: "evento",
  modelName: "Evento",
  timestamps: false,
})
export default class Evento extends Model<
  EventoAtributos,
  EventoCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(40),
  })
  declare nome: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare data: Date;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare duracao: number;

  @Column({
    type: DataType.STRING(40),
  })
  declare responsavel: string;

  @BelongsTo(() => Laboratorio, {
    foreignKey: "idLaboratorio",
    targetKey: "id",
  })
  declare laboratorio: Laboratorio;
}
