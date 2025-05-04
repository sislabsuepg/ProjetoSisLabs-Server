import { Optional } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
} from "sequelize-typescript";

interface LaboratorioAtributos {
  id: string;
  nome: string;
  restrito: boolean;
}

interface LaboratorioCreationAtributos
  extends Optional<LaboratorioAtributos, "id"|"restrito"> {}

@Table({
    tableName: "Laboratorios",
    modelName: "Laboratorio",
    timestamps: false,
})

export default class Laboratorio extends Model<
  LaboratorioAtributos,
  LaboratorioCreationAtributos
> {
    @PrimaryKey
    @Column({
        type: DataType.STRING(8),
    })
    declare id: string;
    
    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataType.STRING(60),
    })
    declare nome: string;
    
    @AllowNull(false)
    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare restrito: boolean;

}
