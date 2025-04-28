import Curso from './Curso'

import { Optional } from "sequelize";

import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    BelongsTo,
    NotNull
} from "sequelize-typescript"
import { Col } from "sequelize/types/utils";
import { NumericLiteral } from 'typescript';
import { isAlphanumericLocales } from "validator";

interface AlunoAtributos {
    id: number,
    nome: string,
    telefone: string,
    ano: number,
    email: string,
    senha: string,
    ativo: boolean
}

interface AlunoCreationAtributos extends Optional<AlunoAtributos, 'id' | 'telefone' | 'senha' | 'ativo'> {}

@Table({
    tableName: 'Alunos',
    modelName: 'Aluno',
    timestamps:false
})
export default class Aluno extends Model<AlunoAtributos, AlunoCreationAtributos>{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number

    @Column({
        type: DataType.STRING
    })
    declare nome: string

    @Column({
        type: DataType.STRING
    })
    declare telefone:string

    @Column({
        type: DataType.INTEGER
    })
    declare ano: number

    @Column({
        type: DataType.STRING
    })
    declare email:string

    @Column({
        type: DataType.STRING
    })
    declare senha:string

    @Column({
        type: DataType.BOOLEAN
    })
    declare ativo: boolean

    @BelongsTo(()=>Curso, 'idCurso')
    @Column({
        type: DataType.INTEGER
    })
    @NotNull
    declare idCurso: number
    

}