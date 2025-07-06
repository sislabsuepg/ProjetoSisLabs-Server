import { Sequelize } from "sequelize-typescript";
import databaseConfig from "../config/database";
import Curso from "../models/Curso";
import Aluno from "../models/Aluno";
import Usuario from "../models/Usuario";
import TipoUsuario from "../models/PermissaoUsuario";
import Laboratorio from "../models/Laboratorio";
import Aula from "../models/Aula";
import Professor from "../models/Professor";
import Emprestimo from "../models/Emprestimo";
import Horario from "../models/Horario";
import Evento from "../models/Evento";
import AlunoLaboratorio from "../models/AlunoLaboratorio";
import AlunoProfessor from "../models/AlunoProfessor";
import AulaHorario from "../models/AulaHorario";

const connection: Sequelize = new Sequelize({
  ...databaseConfig,
  dialect: "postgres",
  models: [
    Curso,
    Aluno,
    Usuario,
    TipoUsuario,
    Laboratorio,
    Aula,
    Professor,
    Emprestimo,
    Horario,
    Evento,
    AlunoLaboratorio,
    AlunoProfessor,
    AulaHorario,
  ],
});

export default connection;
