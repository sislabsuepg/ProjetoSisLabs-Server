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
    HasMany,
} from "sequelize-typescript";

import Horario from "./Horario";
import Aula from "./Aula";

interface AulaHorarioAtributos {
    idAula: number;
    idHorario: number;
}

@Table({
    tableName: "AulaHorario",
    modelName: "AulaHorario",
    timestamps: false,
})
export default class AulaHorario extends Model<AulaHorarioAtributos> {
    
    @HasMany(() => Aula, {
        foreignKey: "id",
    })
    declare aulas: Aula[];

    @HasMany(() => Horario, {
        foreignKey: "id",
    })
    declare horarios: Horario[];
}