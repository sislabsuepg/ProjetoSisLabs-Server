import Curso from "./Curso";

import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  NotNull,
  NotEmpty,
  Default,
} from "sequelize-typescript";

interface AlunoAtributos {
  id: number;
  nome: string;
  telefone: string;
  ano: number;
  email: string;
  senha: string;
  ativo: boolean;
}

interface AlunoCreationAtributos
  extends Optional<AlunoAtributos, "id" | "telefone" | "senha" | "ativo"> {}

@Table({
  tableName: "Alunos",
  modelName: "Aluno",
  timestamps: false,
})
export default class Aluno extends Model<
  AlunoAtributos,
  AlunoCreationAtributos
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(13),
  })
  declare ra: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(40),
  })
  declare nome: string;

  @Column({
    type: DataType.STRING(15),
  })
  declare telefone: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare ano: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(50),
  })
  declare email: string;

  @NotEmpty
  @Column({
    type: DataType.STRING(6),
  })
  declare senha: string;

  @Default(true)
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare ativo: boolean;

  @ForeignKey(() => Curso)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare idCurso: number;
}
