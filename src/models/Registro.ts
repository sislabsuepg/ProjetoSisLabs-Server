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
import { Optional } from "sequelize";

interface RegistroAtributos {
  id: number;
  dataHora: Date;
  descricao: string;
  idUsuario: number;
}

interface RegistroCreationAtributos extends Optional<RegistroAtributos, "id"> {}

@Table({
  tableName: "registro",
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
  declare dataHora: Date;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(100),
  })
  declare descricao: string;

  @BelongsTo(() => Usuario, {
    foreignKey: "idUsuario",
    targetKey: "id",
  })
  declare usuario: Usuario;
}

//criado recentemente
