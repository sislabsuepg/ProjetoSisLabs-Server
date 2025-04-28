import { Sequelize } from 'sequelize-typescript';
import databaseConfig from "../config/database"
import Curso from '../models/Curso';
import Aluno from '../models/Aluno'
const connection: Sequelize = new Sequelize(
  {
    ...databaseConfig,
    dialect: 'postgres',
    models: [Curso, Aluno]
}
);

export default connection