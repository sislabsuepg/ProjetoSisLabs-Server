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

interface TipoUsuarioAtributos {
  idTipoUsuario: number;
  nome: string;
  cadastro: boolean;
  alteracao: boolean;
  relatorio: boolean;
  advertencia: boolean;
}

@Table({
  tableName: "TipoUsuarios",
  modelName: "TipoUsuario",
  timestamps: false,
})
export default class TipoUsuario extends Model<TipoUsuarioAtributos> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare idTipoUsuario: number;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column({
    type: DataType.STRING(20),
  })
  declare nome: string;

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
    foreignKey: "idTipoUsuario",
    sourceKey: "idTipoUsuario",
  })
  declare usuarios: Usuario[];
}
