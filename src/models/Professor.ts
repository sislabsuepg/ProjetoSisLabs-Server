import {
    Optional
} from 'sequelize';

import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
    BelongsTo,
    BelongsToMany,
} from 'sequelize-typescript';

import Aluno from './Aluno';

interface ProfessorAttributes {
    id: number;
    nome: string;
    email: string;
}

interface ProfessorCreationAttributes extends Optional<ProfessorAttributes, 'id'> { }

@Table({
    tableName: 'Professores',
    modelName: 'Professor',
    timestamps: false,
})
export default class Professor extends Model<ProfessorAttributes, ProfessorCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number;

    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataType.STRING(40),
    })
    declare nome: string;

    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataType.STRING(40),
    })
    declare email: string;

    @BelongsToMany(() => Aluno, {
        through: 'AlunoProfessor',
        foreignKey: 'idProfessor',
        otherKey: 'raAluno',
    })
    declare alunos: Aluno[];

}