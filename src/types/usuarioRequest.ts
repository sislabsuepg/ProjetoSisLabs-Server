import { Request } from "express";

export default interface UsuarioRequest extends Request {
  usuario: {
    login: string;
    senha: string;
    nome: string;
    tipo: {
      id: number;
      nome: string;
      cadastr: boolean;
      alteracao: boolean;
      relatorio: boolean;
      advertencia: boolean;
    };
  };
}
