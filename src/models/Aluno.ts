import Curso from "./Curso";

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
} from "sequelize-typescript";

interface AlunoAtributos {
  ra: string;
  nome: string;
  telefone: string;
  ano: number;
  email: string;
  senha: string;
  ativo: boolean;
  idCurso: number;
}

interface AlunoCreationAtributos
  extends Optional<AlunoAtributos, "telefone" | "senha" | "ativo" | "email"> {}

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


  @NotEmpty
  @Column({
    type: DataType.STRING(50),
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

  
/*   @ForeignKey(() => Curso)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare idCurso: number; */

  @BelongsTo(() => Curso, {
    foreignKey: "idCurso",
    targetKey: "id",
  })
  declare curso: Curso;

  @BeforeCreate
  static preparaNome(instance: Aluno) {
    instance.nome = instance.nome
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
      .join(" ");
  }

  @BeforeCreate
  static defineEmail(instance: Aluno) {
    if (!instance.email) {
      instance.email = instance.ra + "@uepg.br";
    }
  }

  @BeforeCreate
  static async hashSenha(instance: Aluno) {
    instance.senha = await md5(instance.senha);
  }

  verificaSenha(senhaInserida: string) {
    return md5(senhaInserida) == this.senha;
  }

  atualizaSenha(senha: string) {
    this.senha = md5(senha);
  }
}
