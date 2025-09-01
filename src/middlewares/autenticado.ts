import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import AlunoRequest from "../types/alunoRequest.js";
import UsuarioRequest from "../types/usuarioRequest.js";
export function alunoAutenticado(
  req: AlunoRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"]?.split(" ")[1] || "";

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Token inválido" });
    }
    req.aluno = decoded as AlunoRequest["aluno"];
    console.log(decoded);
    next();
  });
}

export function usuarioAutenticado(
  req: UsuarioRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"]?.split(" ")[1] || "";

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Token inválido" });
    }
    req.usuario = decoded as UsuarioRequest["usuario"];
    console.log(decoded);
    next();
  });
}
