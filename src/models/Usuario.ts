import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  BelongsTo,
  AutoIncrement,
  Unique,
  HasMany,
  BeforeCreate,
} from "sequelize-typescript";

import PermissaoUsuario from "./PermissaoUsuario.js";
import Registro from "./Registro.js";
import Emprestimo from "./Emprestimo.js";
import { Optional } from "sequelize";
import md5 from "md5";

interface UsuarioAtributos {
  id: number;
  login: string;
  senha: string;
  nome: string;
  ativo: boolean;
  idPermissao: number;
}

interface UsuarioCreationAtributos extends Optional<UsuarioAtributos, "id"> {}

@Table({
  tableName: "usuario",
  modelName: "Usuario",
  timestamps: false,
})
export default class Usuario extends Model<
  UsuarioAtributos,
  UsuarioCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column({
    type: DataType.STRING(20),
  })
  declare login: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(32),
  })
  declare senha: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(40),
  })
  declare nome: string;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare ativo: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare idPermissao: number;

  @BelongsTo(() => PermissaoUsuario, {
    foreignKey: "idPermissao",
    targetKey: "id",
  })
  declare permissaoUsuario: PermissaoUsuario;

  @HasMany(() => Registro, {
    foreignKey: "idUsuario",
    sourceKey: "id",
  })
  declare registros: Registro[];

  @HasMany(() => Emprestimo, {
    foreignKey: "idUsuarioEntrada",
    sourceKey: "id",
  })
  declare emprestimosEntrada: Emprestimo[];

  @HasMany(() => Emprestimo, {
    foreignKey: "idUsuarioSaida",
    sourceKey: "id",
  })
  declare emprestimosSaida: Emprestimo[];

  @BeforeCreate
  static preparaNome(instance: Usuario) {
    instance.nome = instance.nome
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
      .join(" ");
  }

  @BeforeCreate
  static hashSenha(instance: Usuario) {
    instance.senha = md5(instance.senha);
  }

  verificaSenha(senhaInserida: string) {
    return md5(senhaInserida) === this.senha;
  }

  atualizaSenha(senha: string) {
    this.senha = md5(senha);
  }
}
//modificado
