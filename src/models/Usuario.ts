import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
  NotEmpty,
  BelongsTo,
} from "sequelize-typescript";

import TipoUsuario from "./TipoUsuario";

interface UsuarioAtributos {
  login: string;
  senha: string;
  nome: string;
  idTipoUsuario: number;
}

@Table({
  tableName: "Usuarios",
  modelName: "Usuario",
  timestamps: false,
})
export default class Usuario extends Model<UsuarioAtributos> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(20),
  })
  declare login: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(12),
  })
  declare senha: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(40),
  })
  declare nome: string;

  @BelongsTo(() => TipoUsuario, {
    foreignKey: "idTipoUsuario",
    targetKey: "idTipoUsuario",
  })
  declare tipoUsuario: TipoUsuario;
}
