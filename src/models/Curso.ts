import { Optional } from "sequelize"

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  NotNull,
  NotEmpty,
  Length,
  AllowNull,
  UpdatedAt,
  AutoIncrement,
  HasMany
} from "sequelize-typescript"
import Aluno from "./Aluno"

interface CursoAtributos {
  id:number,
  nome:string
}

interface CursoCreationAtributos extends Optional<CursoAtributos, 'id'> {}

@Table(
  {
    tableName: 'Cursos',
    modelName: 'Curso',
    timestamps:false
  }
)
export default class Curso extends Model<CursoAtributos, CursoCreationAtributos>{
  @PrimaryKey
  @AutoIncrement
  @Column({
      type: DataType.INTEGER,
  })
  declare id: number

  @Length({msg: "Tamanho invalido", min:4, max:40})
  @Column({
    type: DataType.STRING,    
  })
  declare nome: string

  @HasMany(()=>Aluno)
  declare alunos:Aluno[]
}