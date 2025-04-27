import { response, Router } from "express";
import Curso from "../models/Curso";
import { Response } from "express";


const router:Router = Router()

router.get('/', (req, res)=>{
    try{
        Curso.create({nome: "gabriel"}).then((a)=>{
            console.log(a)
        })
    }catch(e){
        console.log(e)
    }
    res.json({'bah': 1})
})

router.get('/test', (req, res)=>{

    let cursos:Curso[] = []

    console.log(cursos)

})

export default router