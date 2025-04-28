import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  AutoIncrement,
  HasMany,
  Unique,
} from "sequelize-typescript";
import Aluno from "./Aluno";

interface CursoAtributos {
  id: number;
  nome: string;
}

interface CursoCreationAtributos extends Optional<CursoAtributos, "id"> {}

@Table({
  tableName: "Cursos",
  modelName: "Curso",
  timestamps: false,
})
export default class Curso extends Model<
  CursoAtributos,
  CursoCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @NotEmpty
  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(40),
  })
  declare nome: string;

  @HasMany(() => Aluno)
  declare alunos: Aluno[];
}
