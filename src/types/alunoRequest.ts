import { Request } from "express";

export default interface AlunoRequest extends Request {
  aluno?: {
    ra: string;
    nome: string;
    telefone?: string;
    email?: string;
    ano: number;
    nomeCurso: string;
  };
}
