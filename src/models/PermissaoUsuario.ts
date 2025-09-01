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
} from "sequelize-typescript";

import Usuario from "./Usuario.js";

interface PermissaoUsuarioAtributos {
  id: number;
  nomePermissao: string;
  geral: boolean;
  cadastro: boolean;
  alteracao: boolean;
  relatorio: boolean;
  advertencia: boolean;
}

interface PermissaoUsuarioCreationAtributos
  extends Optional<PermissaoUsuarioAtributos, "id"> {}

@Table({
  tableName: "permissaoUsuario",
  modelName: "PermissaoUsuario",
  timestamps: false,
})
export default class PermissaoUsuario extends Model<
  PermissaoUsuarioAtributos,
  PermissaoUsuarioCreationAtributos
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
    type: DataType.STRING(30),
  })
  declare nomePermissao: string;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare geral: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare cadastro: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare alteracao: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare relatorio: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare advertencia: boolean;

  @HasMany(() => Usuario, {
    foreignKey: "idPermissao",
    sourceKey: "id",
  })
  declare usuarios: Usuario[];
}

// modificado
