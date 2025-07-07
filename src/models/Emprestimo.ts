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
  BelongsTo,
} from "sequelize-typescript";
import Aluno from "./Aluno";
import Usuario from "./Usuario";
import Laboratorio from "./Laboratorio";

interface EmprestimoAtributos {
  id: number;
  dataHoraEntrada: Date;
  dataHoraSaida: Date;
  posseChave: boolean;
  advertencia: boolean;
  idLaboratorio: string;
  idAluno: string;
  idUsuarioEntrada: string;
  idUsuarioSaida: string;
}

interface EmprestimoCreationAtributos
  extends Optional<
    EmprestimoAtributos,
    "id" | "dataHoraSaida" | "posseChave" | "advertencia" | "idUsuarioSaida"
  > {}

@Table({
  tableName: "emprestimo",
  modelName: "Emprestimo",
  timestamps: false,
})
export default class Emprestimo extends Model<
  EmprestimoAtributos,
  EmprestimoCreationAtributos
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
  declare dataHoraEntrada: Date;

  @Column({
    type: DataType.DATE,
  })
  declare dataHoraSaida: Date;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare posseChave: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare advertencia: boolean;

  @BelongsTo(() => Laboratorio, {
    foreignKey: "idLaboratorio",
    targetKey: "id",
  })
  declare laboratorio: Laboratorio;

  @BelongsTo(() => Aluno, {
    foreignKey: "idAluno",
    targetKey: "id",
  })
  declare aluno: Aluno;

  @BelongsTo(() => Usuario, {
    foreignKey: "idUsuarioEntrada",
    targetKey: "id",
  })
  declare usuarioEntrada: Usuario;

  @BelongsTo(() => Usuario, {
    foreignKey: "idUsuarioSaida",
    targetKey: "id",
  })
  declare usuarioSaida: Usuario;
}
