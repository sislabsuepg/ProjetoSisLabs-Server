import { NextFunction } from "express";
import { Request, Response } from "express";
import Aluno from "../models/Aluno";
import md5 from "md5";
import jwt from "jsonwebtoken";

