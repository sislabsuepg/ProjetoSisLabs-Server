import { Optional } from "sequelize";

import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    BelongsTo,
} from "sequelize-typescript";

import Laboratorio from "./Laboratorio";

interface EventoAtributos {
    id: number;
    idLaboratorio: string;
    dataInicio: Date;
    dataFim: Date;
    descricao: string;
}

interface EventoCreationAtributos extends Optional<EventoAtributos, "id"> {}

@Table({
    tableName: "Eventos",
    modelName: "Evento",
    timestamps: false,
})
export default class Evento extends Model<EventoAtributos, EventoCreationAtributos> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(8),
    })
    declare idLaboratorio: string;

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

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
    })
    declare descricao: string;

    @BelongsTo(() => Laboratorio, {
        foreignKey: "idLaboratorio",
        targetKey: "id",
    })
    declare laboratorio: Laboratorio;

}