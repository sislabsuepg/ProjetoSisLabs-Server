import { Request } from "express";
import IUsuario from "./userInterface";

export default interface UsuarioRequest extends Request {
  usuario: IUsuario;
}
