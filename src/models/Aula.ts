import { Optional } from "sequelize";

import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    BelongsToMany
} from "sequelize-typescript";

import Horario from "./Horario";

interface AulaAtributos {
    id: number;
    idProfessor: number;
    idLaboratorio: string;
}

interface AulaCreationAtributos extends Optional<AulaAtributos, "id"> {}

@Table({
    tableName: "Aulas",
    modelName: "Aula",
    timestamps: false,
})
export default class Aula extends Model<AulaAtributos, AulaCreationAtributos> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    declare idProfessor: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(8),
    })
    declare idLaboratorio: string;

   @BelongsToMany(() => Horario, {
        through: "AulaHorario",
        foreignKey: "idHorario",
        otherKey: "idAula",
    })
    declare horarios: Horario[];
 
}
