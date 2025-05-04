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

interface EmprestimoAtributos {
    id: number;
    dataHoraEntrada: Date;
    dataHoraSaida: Date;
    posse_chave: boolean;
    advertencia: boolean;
    idLaboratorio: string;
    raAluno: string;
    loginUsuario: string;
}

interface EmprestimoCreationAtributos
    extends Optional<EmprestimoAtributos, "id"|"dataHoraEntrada"|"dataHoraSaida"|"posse_chave"|"advertencia"> {}

@Table({
    tableName: "Emprestimos",
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
    declare posse_chave: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    declare advertencia: boolean;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(8),
    })
    declare idLaboratorio: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(13),
    })
    declare raAluno: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
    })
    declare loginUsuario: string;


}