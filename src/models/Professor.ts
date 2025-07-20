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
  HasMany,
} from "sequelize-typescript";

import Orientacao from "./Orientacao";
import Horario from "./Horario";

interface ProfessorAttributes {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

interface ProfessorCreationAttributes
  extends Optional<ProfessorAttributes, "id"> {}

@Table({
  tableName: "professor",
  modelName: "Professor",
  timestamps: false,
})
export default class Professor extends Model<
  ProfessorAttributes,
  ProfessorCreationAttributes
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
    type: DataType.STRING(40),
  })
  declare nome: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.STRING(40),
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare ativo: boolean;

  @HasMany(() => Orientacao, {
    foreignKey: "idProfessor",
    sourceKey: "id",
  })
  declare orientacoes: Orientacao[];

  @HasMany(() => Horario, {
    foreignKey: "idProfessor",
    sourceKey: "id",
  })
  declare horarios: Horario[];
}
