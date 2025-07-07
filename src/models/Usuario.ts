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
} from "sequelize-typescript";

import PermissaoUsuario from "./PermissaoUsuario";

interface UsuarioAtributos {
  id: number;
  login: string;
  senha: string;
  nome: string;
  ativo: boolean;
  idpermissao: number;
}

@Table({
  tableName: "Usuario",
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
    foreignKey: "idpermissao",
    targetKey: "id",
  })
  declare permissaoUsuario: PermissaoUsuario;
}

//modificado
