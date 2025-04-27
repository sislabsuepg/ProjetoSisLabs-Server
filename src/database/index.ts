import { Sequelize } from 'sequelize-typescript';
import databaseConfig from "../config/database"
import Curso from '../models/Curso';
const connection: Sequelize = new Sequelize(
  {
    ...databaseConfig,
    dialect: 'postgres',
    models: [Curso]
}
);

export default connection