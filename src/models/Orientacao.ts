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
import { Optional } from "sequelize";
import Laboratorio from "./Laboratorio";
import Professor from "./Professor";
import Aluno from "./Aluno";

interface OrientacaoAtributos {
  id: number;
  dataInicio: Date;
  dataFim: Date;
  idAluno: number;
  idProfessor: number;
  idLaboratorio: number;
}

interface OrientacaoCreationAtributos
  extends Optional<OrientacaoAtributos, "id"> {}

@Table({
  tableName: "orientacao",
  modelName: "Orientacao",
  timestamps: false,
})
export default class Orientacao extends Model<
  OrientacaoAtributos,
  OrientacaoCreationAtributos
> {
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
  declare dataInicio: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare dataFim: Date;

  @BelongsTo(() => Aluno, {
    foreignKey: "idAluno",
    targetKey: "id",
  })
  declare aluno: Aluno;

  @BelongsTo(() => Professor, {
    foreignKey: "idProfessor",
    targetKey: "id",
  })
  declare professor: Professor;

  @BelongsTo(() => Laboratorio, {
    foreignKey: "idLaboratorio",
    targetKey: "id",
  })
  declare laboratorio: Laboratorio;
}
