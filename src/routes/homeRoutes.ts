import { response, Router } from "express";
import Curso from "../models/Curso";
import { Response } from "express";
import alunoAutenticado from "../middlewares/autenticado";


const router:Router = Router()

router.get('/', alunoAutenticado,(req, res)=>{
    res.send('Operante')
})

router.get('/test',(req, res)=>{

    res.send('Testando')
})

export default router