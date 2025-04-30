import { Sequelize } from "sequelize-typescript";
import databaseConfig from "../config/database";
import Curso from "../models/Curso";
import Aluno from "../models/Aluno";
import Usuario from "../models/Usuario";
import TipoUsuario from "../models/TipoUsuario";

const connection: Sequelize = new Sequelize({
  ...databaseConfig,
  dialect: "postgres",
  models: [Curso, Aluno, Usuario, TipoUsuario],
});

export default connection;
