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
import Aluno from "./Aluno.js";
import Usuario from "./Usuario.js";
import Laboratorio from "./Laboratorio.js";

interface EmprestimoAtributos {
  id: number;
  dataHoraEntrada: Date;
  dataHoraSaida: Date | null;
  posseChave: boolean;
  advertencia: string | null;
  idLaboratorio: number;
  idAluno: number;
  idUsuarioEntrada: number;
  idUsuarioSaida: number | null;
}

interface EmprestimoCreationAtributos
  extends Optional<
    EmprestimoAtributos,
    "id" | "dataHoraSaida" | "advertencia" | "idUsuarioSaida"
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

  @AllowNull(true)
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

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
  })
  declare advertencia: string;

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
