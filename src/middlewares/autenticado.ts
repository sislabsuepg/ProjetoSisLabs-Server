import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default function alunoAutenticado(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"]?.split(" ")[1]||"";

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Token inválido" });
    }
    console.log(decoded);
    next();
  });
}