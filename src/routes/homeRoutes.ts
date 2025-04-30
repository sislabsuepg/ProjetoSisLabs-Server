import { response, Router } from "express";
import Curso from "../models/Curso";
import { Response } from "express";


const router:Router = Router()

router.get('/', (req, res)=>{
    res.send('Operante')
})

router.get('/test', (req, res)=>{

    res.send('Testando')
})

export default router