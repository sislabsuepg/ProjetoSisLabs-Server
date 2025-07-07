import { Request } from "express";

export default interface UsuarioRequest extends Request {
  usuario: {
    login: string;
    senha: string;
    nome: string;
    permissao: {
      id: number;
      nome: string;
      cadastr: boolean;
      alteracao: boolean;
      relatorio: boolean;
      advertencia: boolean;
    };
  };
}
