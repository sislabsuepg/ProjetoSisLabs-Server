import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  NotEmpty,
} from "sequelize-typescript";

import { Optional } from "sequelize";

interface RecadoAtributos {
  id: number;
  texto: string;
}

interface RecadoCreationAtributos extends Optional<RecadoAtributos, "id"> {}

@Table({
  tableName: "recado",
  modelName: "Recado",
  timestamps: false,
})
export default class Recado extends Model<
  RecadoAtributos,
  RecadoCreationAtributos
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.TEXT,
    validate: {
      notEmpty: true,
      len: [1, 1000],
    },
  })
  declare texto: string;
}
