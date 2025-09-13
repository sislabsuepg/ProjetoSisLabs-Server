import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
  BelongsToMany,
  HasMany,
  AutoIncrement,
} from "sequelize-typescript";
import Evento from "./Evento.js";
import Orientacao from "./Orientacao.js";
import Horario from "./Horario.js";
interface LaboratorioAtributos {
  id: string;
  nome: string;
  numero: string;
  restrito: boolean;
  ativo: boolean;
}

interface LaboratorioCreationAtributos
  extends Optional<LaboratorioAtributos, "id" | "ativo"> {}

@Table({
  tableName: "laboratorio",
  modelName: "Laboratorio",
  timestamps: false,
})
export default class Laboratorio extends Model<
  LaboratorioAtributos,
  LaboratorioCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.STRING(8),
  })
  declare numero: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.STRING(60),
  })
  declare nome: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare restrito: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare ativo: boolean;

  @HasMany(() => Evento, {
    foreignKey: "idLaboratorio",
    sourceKey: "id",
  })
  declare eventos: Evento[];

  @HasMany(() => Orientacao, {
    foreignKey: "idLaboratorio",
    sourceKey: "id",
  })
  declare orientacoes: Orientacao[];

  @HasMany(() => Horario, {
    foreignKey: "idLaboratorio",
    sourceKey: "id",
  })
  declare horarios: Horario[];
}
