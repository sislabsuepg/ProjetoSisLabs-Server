import express from "express"
import connection from "./database"
import homeRoutes from "./routes/homeRoutes"
import cursoRoutes from  './routes/cursoRoutes'
import alunoRoutes from './routes/alunoRoutes'
import tipoUsuarioRoutes from './routes/tipoUsuarioRoutes'
import UsuarioRoutes from './routes/usuarioRoutes'
class App{
    app: any

    constructor(){
        connection.sync({force:true})
        this.app = express()
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.app.use(express.urlencoded({extended:true}))
        this.app.use(express.json())
    }

    routes(){
        this.app.use("/", homeRoutes)
        this.app.use("/curso/", cursoRoutes)
        this.app.use("/aluno/", alunoRoutes)
        this.app.use("/tipoUsuario/", tipoUsuarioRoutes)
        this.app.use("/usuario/", UsuarioRoutes)
    }

}

export default new App().app