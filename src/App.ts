import express from "express"
import connection from "./database"
import homeRoutes from "./routes/homeRoutes"
import cursoRoutes from  './routes/cursoRoutes'
import alunoRoutes from './routes/alunoRoutes'
import tipoUsuarioRoutes from './routes/tipoUsuarioRoutes'
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
        this.app.use("/cursos/", cursoRoutes)
        this.app.use("/alunos/", alunoRoutes)
        this.app.use("/tipoUsuario/", tipoUsuarioRoutes)
    }

}

export default new App().app