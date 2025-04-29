import Curso from '../models/Curso'

import CursoService from '../services/cursoService'
import { Request, Response } from 'express'

class CursoController{

    async index(req: Request, res: Response){
        const listaCursos = await CursoService.getAllCursos()
        res.status(listaCursos.status).json(listaCursos)
    }

    async show(req: Request, res: Response){
        const id = parseInt(req.params.id)
        const curso = await CursoService.getCursoById(id)
        res.status(curso.status).json(curso)
    }

    async store(req: Request, res: Response){
        const { nome } = req.body
        const curso = await CursoService.createCurso(nome)
        res.status(curso.status).json(curso)
    }

    async update(req: Request, res: Response){
        const id = parseInt(req.params.id)
        const { nome } = req.body
        const curso = await CursoService.updateCurso(id, nome)
        res.status(curso.status).json(curso)
    }

    async destroy(req: Request, res: Response){
        const id = parseInt(req.params.id)
        const curso = await CursoService.deleteCurso(id)
        res.status(curso.status).json(curso)
    }
}


export default new CursoController()