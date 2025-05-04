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
    BelongsToMany,
} from "sequelize-typescript";

import Aula from "./Aula";

interface HorarioAtributos {
    id: number;
    diaSemana: number;
    hora: string;
}

interface HorarioCreationAtributos extends Optional<HorarioAtributos, "id"> {}

@Table({
    tableName: "Horarios",
    modelName: "Horario",
    timestamps: false,
})
export default class Horario extends Model<HorarioAtributos, HorarioCreationAtributos> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER, // 0 a 6, sendo 0 = domingo e 6 = sabado
    })
    declare diaSemana: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(5),// formato HH:MM
    })
    declare hora: string;

    @BelongsToMany(() => Aula, {
            through: "AulaHorario",
            foreignKey: "idAula",
            otherKey: "idHorario",
        })
        declare horarios: Aula[];

}