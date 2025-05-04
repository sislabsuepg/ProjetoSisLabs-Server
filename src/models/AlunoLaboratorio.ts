import {
    Model,
    HasMany,
    Table,
} from "sequelize-typescript";

import Aluno from "./Aluno";
import Laboratorio from "./Laboratorio";

interface AlunoLaboratorioAtributos {
    raAluno: string;
    idLaboratorio: string;
}

@Table({
    tableName: "AlunoLaboratorio",
    modelName: "AlunoLaboratorio",
    timestamps: false,
})
export default class AlunoLaboratorio extends Model<AlunoLaboratorioAtributos> {

    @HasMany(() => Aluno, {
        foreignKey: "ra",
    })
    declare alunos: Aluno[];

    @HasMany(() => Laboratorio, {
        foreignKey: "id",
    })
    declare laboratorios: Laboratorio[];

}