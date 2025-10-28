import { Sequelize } from "sequelize-typescript";
import databaseConfig from "../config/database.js";
import Aluno from "../models/Aluno.js";
import Curso from "../models/Curso.js";
import Emprestimo from "../models/Emprestimo.js";
import Evento from "../models/Evento.js";
import Horario from "../models/Horario.js";
import Laboratorio from "../models/Laboratorio.js";
import Orientacao from "../models/Orientacao.js";
import PermissaoUsuario from "../models/PermissaoUsuario.js";
import Professor from "../models/Professor.js";
import Registro from "../models/Registro.js";
import Usuario from "../models/Usuario.js";
import Recado from "../models/Recado.js";
import Reseter from "../models/Reseter.js";

const connection: Sequelize = new Sequelize({
  ...databaseConfig,
  dialect: "postgres",
  timezone: "+00:00",
  models: [
    Curso,
    Aluno,
    Laboratorio,
    Professor,
    PermissaoUsuario,
    Usuario,
    Emprestimo,
    Evento,
    Horario,
    Orientacao,
    Recado,
    Registro,
    Reseter,
  ],
});

export default connection;
