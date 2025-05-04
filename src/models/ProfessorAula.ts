import{
    Table,
    Model,
    HasMany,
} from "sequelize-typescript";

import Professor from "./Professor";
import Aula from "./Aula";

interface ProfessorAulaAtributos {
    idProfessor: number;
    idAula: number;
}

@Table({
    tableName: "ProfessorAula",
    modelName: "ProfessorAula",
    timestamps: false,
})
export default class ProfessorAula extends Model<ProfessorAulaAtributos> {
    
        @HasMany(() => Professor, {
            foreignKey: "id",
        })
        declare professores: Professor[];
    
        @HasMany(() => Aula, {
            foreignKey: "id",
        })
        declare aulas: Aula[];
    }