import {
    Table,
    HasMany,
    Model
} from "sequelize-typescript";

import Aluno from "./Aluno";
import Professor from "./Professor";

interface AlunoProfessorAtributos {
    raAluno: string;
    idProfessor: number;
}

@Table({
    tableName: "AlunoProfessor",
    modelName: "AlunoProfessor",
    timestamps: false,
})
export default class AlunoProfessor extends Model<AlunoProfessorAtributos> {

    @HasMany(() => Aluno, {
        foreignKey: "ra",
    })
    declare alunos: Aluno[];

    @HasMany(() => Professor, {
        foreignKey: "id",
    })
    declare professor: Professor[];
}