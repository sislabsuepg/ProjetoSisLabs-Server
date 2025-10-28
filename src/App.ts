import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection from "./database/index.js";
import alunoRoutes from "./routes/alunoRoutes.js";
import cursoRoutes from "./routes/cursoRoutes.js";
import emprestimoRoutes from "./routes/emprestimoRoutes.js";
import eventoRoutes from "./routes/eventoRoutes.js";
import horarioRoutes from "./routes/horarioRoutes.js";
import laboratorioRoutes from "./routes/laboratorioRoutes.js";
import orientacaoRoutes from "./routes/orientacaoRoutes.js";
import permissaoUsuarioRoutes from "./routes/permissaoUsuarioRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";
import recadoRoutes from "./routes/recadoRoutes.js";
import registroRoutes from "./routes/registroRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";
import reseterRoutes from "./routes/reseterRoutes.js";
import soliciacoesRoutes from "./routes/solicitacoesRoutes.js";
import { ReseterService } from "./services/reseterService.js";
import { interceptUserCookie } from "./middlewares/interceptUserCookie.js";

class App {
  app: any;

  constructor() {
    connection.sync({ alter: true }); //remover em produção, essa linha força a recriação do banco de dados, apagando os dados existentes
    this.app = express();
    this.middlewares();
    this.routes();
    ReseterService.scheduledReset();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: "http://localhost:3000", // permite apenas requisições do localhost
        methods: "GET,PUT,POST,DELETE", // Métodos permitidos
        allowedHeaders: "Content-Type, Authorization, Cookie", // Cabeçalhos permitidos
        credentials: true,
      })
    );
  }

  routes() {
    this.app.use("/aluno/", alunoRoutes);
    this.app.use("/curso/", interceptUserCookie, cursoRoutes);
    this.app.use("/emprestimo/", interceptUserCookie, emprestimoRoutes);
    this.app.use("/evento/", interceptUserCookie, eventoRoutes);
    this.app.use("/horario/", interceptUserCookie, horarioRoutes);
    this.app.use("/laboratorio/", interceptUserCookie, laboratorioRoutes);
    this.app.use("/orientacao/", interceptUserCookie, orientacaoRoutes);
    this.app.use("/permissao/", interceptUserCookie, permissaoUsuarioRoutes);
    this.app.use("/professor/", interceptUserCookie, professorRoutes);
    this.app.use("/recado/", interceptUserCookie, recadoRoutes);
    this.app.use("/registro/", interceptUserCookie, registroRoutes);
    this.app.use("/usuario/", usuarioRoutes);
    this.app.use("/email/", interceptUserCookie, emailRoutes);
    this.app.use("/relatorio/", interceptUserCookie, relatorioRoutes);
    this.app.use("/solicitacoes/", soliciacoesRoutes);
    this.app.use("/reseter/", interceptUserCookie, reseterRoutes);
  }
}

export default new App().app;
