import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { ApiError } from "../helpers/api-errors";
import { createToken, verifyToken } from "../helpers/jwt";
import { threadId } from "worker_threads";
import { error } from "console";

const getProjects = async (req: Request, res: Response) => {
    
    res.json({ "mensagem": "teste" })
}

export {
    getProjects,
}