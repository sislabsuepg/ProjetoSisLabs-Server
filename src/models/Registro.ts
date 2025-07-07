import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  NotEmpty,
  BelongsTo,
} from "sequelize-typescript";

import Usuario from "./Usuario";

interface RegistroAtributos {
  id: number;
  datahora: Date;
  descricao: string;
  idusuario: number;
}

@Table({
  tableName: "Registro",
  modelName: "Registro",
  timestamps: false,
})
export default class Registro extends Model<RegistroAtributos> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare datahora: Date;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(100),
  })
  declare descricao: string;

  @BelongsTo(() => Usuario, {
    foreignKey: "idusuario",
    targetKey: "id",
  })
  declare usuario: Usuario;
}

//criado recentemente
