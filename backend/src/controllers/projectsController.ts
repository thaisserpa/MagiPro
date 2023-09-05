import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { ApiError } from "../helpers/api-errors";
import { createToken, verifyToken } from "../helpers/jwt";
import { error } from "console";
import { ExtendedRequest } from "../middlewares/authJWT";

const IsTeacher = (user?: { role: string }) => {
    if (!user || user.role !== 'TEACHER') {
        throw new ApiError("Somente professores podem criar projetos", 401);
    }
}

const createProjects = async (req:ExtendedRequest, res:Response) =>{
    const userId = req.user?.userId
    console.log(req.user?.role)
    IsTeacher(req.user)
    const {title, 
        description, 
        objectives, 
        timeline, 
        studentCount, 
        resources, 
        interestArea}  = req.body

    const project = await prisma.project.create({
        data:{title, 
            description, 
            objectives, 
            timeline, 
            studentCount, 
            resources, 
            interestArea,
            userId}
    })
    res.status(201).json({"Mensagem": "Projeto criado com sucesso."})

}

export {
    createProjects,
}