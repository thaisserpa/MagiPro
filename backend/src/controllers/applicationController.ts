import { Request, Response, application, response } from "express";
import { prisma } from "../database/prisma";
import { ApiError } from "../helpers/api-errors";
import { createToken, verifyToken } from "../helpers/jwt";
import { error } from "console";
import { ExtendedRequest } from "../middlewares/authJWT";

const createApplication = async (req:ExtendedRequest, res:Response) =>{
    const {id,
            summary,
            resumePath,
            status,
            comment,
            responseProfessorMessage,
            projectId,
            Project,
            userId,
            user,
            Notification
    } = req.body

    const application = await prisma.application.create({
        data:{id,
            summary,
            resumePath,
            status,
            comment,
            responseProfessorMessage,
            projectId,
            Project,
            userId,
            user,
            Notification
        }
    })
    res.status(201).json({"Mensagem":"Candidatura realizada com sucesso."})
}

const getApplication = async(req:ExtendedRequest, res:Response) =>{
    const application = await prisma.project.findMany()
    res.status(200).json(application)
}

const getApplicationById = async(req:ExtendedRequest, res:Response) =>{
    const {id} = req.params

    const application = await prisma.project.findUnique({
        where: {id :id}
    })

    if(application != null){
        res.status(200).json(application)
    }
    else{
        res.status(204).json({"Mensagem":"Candidatura não encontrada."})
    }
}

const putApplication = async (req: ExtendedRequest, res: Response) =>{
    const {id} = req.params
    const{summary,
            resumePath,
            status,
            comment,
            responseProfessorMessage,
            projectId,
            Project,
            userId,
            user,
            Notification
    } = req.body

    const application = await prisma.application.update({
        where: {id :id},
        data: {summary,
            resumePath,
            status,
            comment,
            responseProfessorMessage,
            projectId,
            Project,
            userId,
            user,
            Notification
        }
    })
    res.status(202).json(application)
}

const deleteApplication = async (req:ExtendedRequest, res: Response) =>{
    const {id} = req.params
    await prisma.application.delete({
        where: {id :id}
    })
    res.status(204).json({"Mensagem":"Candidatura cancelada com sucesso."})
}

export{
    createApplication,
    getApplication,
    getApplicationById,
    putApplication,
    deleteApplication
}