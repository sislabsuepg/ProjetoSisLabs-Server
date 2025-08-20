import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection from "./database";
import alunoRoutes from "./routes/alunoRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import emprestimoRoutes from "./routes/emprestimoRoutes";
import eventoRoutes from "./routes/eventoRoutes";
import horarioRoutes from "./routes/horarioRoutes";
import laboratorioRoutes from "./routes/laboratorioRoutes";
import orientacaoRoutes from "./routes/orientacaoRoutes";
import permissaoUsuarioRoutes from "./routes/permissaoUsuarioRoutes";
import professorRoutes from "./routes/professorRoutes";
import recadoRoutes from "./routes/recadoRoutes";
import registroRoutes from "./routes/registroRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import emailRoutes from "./routes/emailRoutes";

class App {
  app: any;

  constructor() {
    connection.sync({ alter: true }); //remover em produção, essa linha força a recriação do banco de dados, apagando os dados existentes
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: "http://localhost:3000", // Permite requisições de qualquer origem
        methods: "GET,PUT,POST,DELETE", // Métodos permitidos
        allowedHeaders: "Content-Type, Authorization, Cookie", // Cabeçalhos permitidos
        credentials: true,
      })
    );
  }

  routes() {
    this.app.use("/aluno/", alunoRoutes);
    this.app.use("/curso/", cursoRoutes);
    this.app.use("/emprestimo/", emprestimoRoutes);
    this.app.use("/evento/", eventoRoutes);
    this.app.use("/horario/", horarioRoutes);
    this.app.use("/laboratorio/", laboratorioRoutes);
    this.app.use("/orientacao/", orientacaoRoutes);
    this.app.use("/permissao/", permissaoUsuarioRoutes);
    this.app.use("/professor/", professorRoutes);
    this.app.use("/recado/", recadoRoutes);
    this.app.use("/registro/", registroRoutes);
    this.app.use("/usuario/", usuarioRoutes);
    this.app.use("/email/", emailRoutes);
  }
}

export default new App().app;
