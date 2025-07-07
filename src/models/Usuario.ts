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
} from "sequelize-typescript";

import PermissaoUsuario from "./PermissaoUsuario";
import Registro from "./Registro";
import Emprestimo from "./Emprestimo";
import { Optional } from "sequelize";

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
export default class Usuario extends Model<UsuarioAtributos> {
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
}
//modificado
