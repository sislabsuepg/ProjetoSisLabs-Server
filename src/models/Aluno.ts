import Curso from "./Curso.js";

import md5 from "md5";

import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  NotEmpty,
  Default,
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  AutoIncrement,
  Unique,
  HasMany,
} from "sequelize-typescript";

import Orientacao from "./Orientacao.js";
import Emprestimo from "./Emprestimo.js";

interface AlunoAtributos {
  id: number;
  ra: string;
  nome: string;
  senha: string;
  telefone: string;
  anoCurso: number;
  email: string;
  ativo: boolean;
  idCurso: number;
}

interface AlunoCreationAtributos
  extends Optional<
    AlunoAtributos,
    "id" | "telefone" | "senha" | "ativo" | "email"
  > {}

@Table({
  tableName: "aluno",
  modelName: "Aluno",
  timestamps: false,
})
export default class Aluno extends Model<
  AlunoAtributos,
  AlunoCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @NotEmpty
  @Unique(true)
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
    type: DataType.STRING(15), //"(dd) 99999-9999""
  })
  declare telefone: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare anoCurso: number;

  @NotEmpty
  @Column({
    type: DataType.STRING(40),
  })
  declare email: string;

  @Default("")
  @Column({
    type: DataType.STRING(32),
  })
  declare senha: string;

  @Default(true)
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare ativo: boolean;

  @BelongsTo(() => Curso, {
    foreignKey: "idCurso",
    targetKey: "id",
  })
  declare curso: Curso;

  @HasMany(() => Orientacao, {
    foreignKey: "idAluno",
    sourceKey: "id",
  })
  declare orientacoes: Orientacao[];

  @HasMany(() => Emprestimo, {
    foreignKey: "idAluno",
    sourceKey: "id",
  })
  declare emprestimos: Emprestimo[];

  @BeforeCreate
  static preparaNome(instance: Aluno) {
    instance.nome = instance.nome
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
      .join(" ");
  }

  @BeforeCreate
  static defineEmail(instance: Aluno) {
    if (!instance.email || instance.email.trim() === "") {
      instance.email = instance.ra + "@uepg.br";
    }
  }

  @BeforeCreate
  static async hashSenha(instance: Aluno) {
    instance.senha = await md5(instance.senha);
  }

  verificaSenha(senhaInserida: string) {
    return md5(senhaInserida) === this.senha;
  }

  atualizaSenha(senha: string) {
    this.senha = md5(senha);
  }
}
