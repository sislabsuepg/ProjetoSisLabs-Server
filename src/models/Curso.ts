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
  Unique,
  HasMany,
  Max,
  Min,
} from "sequelize-typescript";
import Aluno from "./Aluno";

interface CursoAtributos {
  id: number;
  nome: string;
  anosMaximo: number;
}

interface CursoCreationAtributos extends Optional<CursoAtributos, "id"> {}

@Table({
  tableName: "curso",
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

  @AllowNull(false)
  @NotEmpty
  @Min(1)
  @Max(8)
  @Column({
    type: DataType.INTEGER,
  })
  declare anosMaximo: number;

  @HasMany(() => Aluno, {
    foreignKey: "idCurso",
    sourceKey: "id",
  })
  declare alunos: Aluno[];
}
