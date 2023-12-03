import { Request, Response, response } from "express";
import { prisma } from "../database/prisma";
import { ApiError } from "../helpers/api-errors";
import { createToken, verifyToken } from "../helpers/jwt";
import { error } from "console";
import { ExtendedRequest } from "../middlewares/authJWT";
import http from 'http';
import { Prisma } from "@prisma/client";

const applyToProject = async (req: ExtendedRequest, res: Response) => {
    const userId = req.user?.userId;

    
    if (!userId) {
        throw new ApiError("Usuario não encontrado ou autorizado", 401);
    }
    
    if (req.user?.role !== 'STUDENT') {
        return res.status(403).json({ message: "Usuário não autorizado para se aplicar a projetos" });
    }

    const { projectId, resumePath, summary, message } = req.body;

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                userId: true,
            },
        });

        if (!project) {
            throw new ApiError("projeto não encontrado", 404);
        }

        const professorId = project.userId;
        console.log(`ID do Professor: ${professorId}`);
        if(!professorId){
            throw new ApiError("Professor não encontrado", 404);
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                userId,
                projectId,
            },
        });

        if (existingApplication) {
            throw new ApiError("Você já se aplicou para este projeto", 400);
        }

        

        const application = await prisma.application.create({
            data: {
                projectId,
                userId,
                summary,
                resumePath,
                status: 'Pendente',
                comment: message,
            },
        });
        
        const notificationMessage = `Nova candidatura recebida de `;
        await createNotification(professorId, notificationMessage, application.id, projectId);

        return res.status(201).json({ message: "Candidatura enviada com sucesso" });
    } catch (err) {
        console.error("Error creating application:", err);

        if (err instanceof ApiError) {     
            return res.status(err.statusCode).json({ message: err.message });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

const createNotification = async (userId: string, message: string, applicationId: string, projectId: string) => {
    try {
        const application = await prisma.application.findUnique({
            where: {
                id: applicationId,
            },
            select: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const userName = application?.user?.name || "Usuário Desconhecido";

        await prisma.notification.create({
            data: {
                userId,
                message: ` ${message} ${userName}`,
                applicationId,
                projectId,
            },
        });
    } catch (err) {
        console.error("Error creating notification:", err);
    }
};

const acceptApplication = async (req: ExtendedRequest, res: Response) => {
    const professorId = req.user?.userId;
    const { applicationId } = req.body;

    try {
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                Project: {
                    userId: professorId,
                },
            },
            select: {
                userId: true,
                user: {
                    select: {
                        name: true,
                    },
                },
                projectId: true,
            },
        });

        if (!application) {
            throw new ApiError("Candidatura não encontrada ou não pertence ao projeto do professor", 404);
        }

        // Atualiza o status da candidatura para 'Aceita'
        await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: 'Aceita',
            },
        });

        // Notifica o aluno sobre a aceitação
        const notificationMessage = `Sua candidatura para o projeto ${application.projectId} foi aceita`;
        await createNotification(application.userId, notificationMessage, applicationId, application.projectId);

        // Adiciona o projeto aos myProjects do usuário
        await prisma.user.update({
            where: { id: application.userId },
            data: {
                myProjects: {
                    push: application.projectId,
                },
            },
        });

        res.status(200).json({ message: "Candidatura aceita com sucesso" });
    } catch (err) {
        console.error("Error accepting application:", err);
        if (err instanceof ApiError) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

const rejectApplication = async (req: ExtendedRequest, res: Response) => {
    const professorId = req.user?.userId;
    const { applicationId, message } = req.body;

    try {
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                Project: {
                    userId: professorId,
                },
            },
        });

        if (!application) {
            throw new ApiError("Candidatura não encontrada ou não pertence ao projeto do professor", 404);
        }

        // Atualizar o status da candidatura para 'Recusada' e adicionar a mensagem do professor
        await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: 'Recusada',  // Corrigido para configurar o status como 'Recusada'
                responseProfessorMessage: message,  // Corrigido para configurar a mensagem do professor
            },
        });
        

       
        const notificationMessage = `Sua candidatura para o projeto ${application.projectId} foi recusada`;
        await createNotification(application.userId, notificationMessage, applicationId, application.projectId);

        return res.status(200).json({ message: "Candidatura recusada com sucesso" });
    } catch (err) {
        console.error("Error rejecting application:", err);

        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ message: err.message });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

const getApplication = async (req: ExtendedRequest, res: Response) => {
    const professorId = req.user?.userId;

    if (!professorId) {
        return res.status(401).json({ message: 'Usuário não autorizado' });
    }

    try {
        // Obtenha todas as notificações associadas ao professor com as informações do projeto
        const notifications = await prisma.notification.findMany({
            where: {
                userId: professorId,
                applicationId: { not: null },
            },
            include: {
                Application: {
                    include: {
                        Project: true, // Inclui informações do projeto associado à aplicação
                    },
                },
            },
        });

        // Mapeie as notificações para obter as aplicações e informações do projeto associadas
        const applications = notifications.map((notification) => {
            const { Application } = notification;
            const project = Application?.Project; // Informações do projeto associado à aplicação

            return {
                id: Application?.id,
                summary: Application?.summary,
                resumePath: Application?.resumePath,
                status: Application?.status,
                comment: Application?.comment,
                responseProfessorMessage: Application?.responseProfessorMessage,
                projectId: Application?.projectId,
                userId: Application?.userId,
                projectName: project?.title, 
            };
        });

        return res.status(200).json({ applications });
    } catch (error) {
        console.error('Erro ao buscar aplicações do professor:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


export { acceptApplication, rejectApplication, getApplication };
export { applyToProject };
