import { Request, Response, response } from "express";
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
    IsTeacher(req.user)

    const {title, 
            description, 
            objectives, 
            timeline, 
            studentCount, 
            resources, 
            interestArea
    }  = req.body

    const project = await prisma.project.create({
        data:{
            title, 
            description, 
            objectives, 
            timeline, 
            studentCount, 
            resources, 
            interestArea,
            userId
        }
    })
    res.status(201).json({"Mensagem": "Projeto criado com sucesso."})

}

const getProjects = async (req:ExtendedRequest, res:Response) =>{
    const project = await prisma.project.findMany()
    res.status(200).json({project})
}

const getProjectById = async(req:ExtendedRequest, res:Response) => {
    const {id} = req.params
    const project = await prisma.project.findUnique({
        where : { id :id},
    })
    
    if(project != null){
        res.status(200).json(project)
    }
    else{
        res.status(204).json({"Mensagem": "Usuário não encontrado."})
    } 
}

const putProjects = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.params
    const {title, 
        description,
        objectives,
        timeline,
        studentCount,
        resources,
        interestArea
    } = req.body
    
    const projects = await prisma.project.update({
        where: {id :id},
        data: {title, 
            description,
            objectives,
            timeline,
            studentCount,
            resources,
            interestArea
        }
    })
    res.status(202).json(projects)
}

const deleteProjects = async (req: ExtendedRequest, res: Response) =>{
    const {id} = req.params
    await prisma.project.delete({
        where: { id: id},
    })
    res.status(204).json({"Mensagem": "Projeto deletado com sucesso"})
}

export {
    createProjects,
    getProjects,
    getProjectById,
    putProjects,
    deleteProjects
}