import { Sequelize } from "sequelize-typescript";
import databaseConfig from "../config/database";
import Curso from "../models/Curso";
import Aluno from "../models/Aluno";
import Usuario from "../models/Usuario";
import TipoUsuario from "../models/TipoUsuario";
import Laboratorio from "../models/Laboratorio";
import Aula from "../models/Aula";
import Professor from "../models/Professor";
import Emprestimo from "../models/Emprestimo";
import Horario from "../models/Horario";
import AulaHorario from "../models/AulaHorario";


const connection: Sequelize = new Sequelize({
  ...databaseConfig,
  dialect: "postgres",
  models: [Curso, Aluno, Usuario, TipoUsuario, Laboratorio, Aula, Professor, Emprestimo, Horario, AulaHorario],
});

export default connection;
