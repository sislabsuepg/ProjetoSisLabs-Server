import express from "express";
import cors from "cors";
import connection from "./database";
import homeRoutes from "./routes/homeRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import alunoRoutes from "./routes/alunoRoutes";
import permissaoUsuarioRoutes from "./routes/permissaoUsuarioRoutes";
import UsuarioRoutes from "./routes/usuarioRoutes";
import RecadoRoutes from "./routes/recadoRoutes";

class App {
  app: any;

  constructor() {
    connection.sync({ force: true }); //remover em produção, essa linha força a recriação do banco de dados, apagando os dados existentes
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use("/", homeRoutes);
    this.app.use("/curso/", cursoRoutes);
    this.app.use("/aluno/", alunoRoutes);
    this.app.use("/permissao/", permissaoUsuarioRoutes);
    this.app.use("/usuario/", UsuarioRoutes);
    this.app.use("/recado/", RecadoRoutes);
  }
}

export default new App().app;
