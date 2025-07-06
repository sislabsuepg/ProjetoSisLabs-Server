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

import Usuario from "./Usuario";

interface PermissaoUsuarioAtributos {
  id: number;
  nomepermissao: string;
  cadastro: boolean;
  alteracao: boolean;
  relatorio: boolean;
  advertencia: boolean;
}

interface PermissaoUsuarioCreationAtributos
  extends Optional<PermissaoUsuarioAtributos, "id"> {}

@Table({
  tableName: "PermissaoUsuario",
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
    type: DataType.STRING(20),
  })
  declare nomepermissao: string;

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
    foreignKey: "idpermissao",
    sourceKey: "id",
  })
  declare usuarios: Usuario[];
}
