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
import Aluno from "./Aluno";
import Evento from "./Evento";
import Orientacao from "./Orientacao";
import Horario from "./Horario";
interface LaboratorioAtributos {
  id: string;
  nome: string;
  numero: string;
  restrito: boolean;
}

interface LaboratorioCreationAtributos
  extends Optional<LaboratorioAtributos, "id"> {}

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
