import { Sequelize } from "sequelize-typescript";
import databaseConfig from "../config/database";
import Aluno from "../models/Aluno";
import Curso from "../models/Curso";
import Emprestimo from "../models/Emprestimo";
import Evento from "../models/Evento";
import Horario from "../models/Horario";
import Laboratorio from "../models/Laboratorio";
import Orientacao from "../models/Orientacao";
import PermissaoUsuario from "../models/PermissaoUsuario";
import Professor from "../models/Professor";
import Registro from "../models/Registro";
import Usuario from "../models/Usuario";
import Recado from "../models/Recado";

const connection: Sequelize = new Sequelize({
  ...databaseConfig,
  dialect: "postgres",
  models: [
    Aluno,
    Curso,
    Emprestimo,
    Evento,
    Horario,
    Laboratorio,
    Orientacao,
    PermissaoUsuario,
    Professor,
    Recado,
    Registro,
    Usuario,
  ],
});

export default connection;
