import { Request, Response, response } from "express";
import { prisma } from "../database/prisma";
import { ApiError } from "../helpers/api-errors";
import { createToken, verifyToken } from "../helpers/jwt";
import { error } from "console";
import { ExtendedRequest } from "../middlewares/authJWT";
import WebSocket from 'ws';

const IsTeacher = (user?: { role: string }) => {
    if (!user || user.role !== 'TEACHER') {
        throw new ApiError("Somente professores podem criar projetos", 401);
    }
}

const createProject = async (req: ExtendedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { title, description, objectives, timeline, studentCount, resources, interestArea } = req.body;

    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                objectives,
                timeline,
                studentCount,
                resources,
                interestArea,
                userId,
            },
        });

        // Adiciona o projeto aos myProjects do usuário
        await prisma.user.update({
            where: { id: userId },
            data: {
                myProjects: {
                    push: project.id,
                },
            },
        });

        res.status(201).json({ message: "Projeto criado com sucesso" });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getProjects = async (req: ExtendedRequest, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getProjectById = async(req:ExtendedRequest, res:Response) => {
    const {id} = req.params
    const project = await prisma.project.findUnique({
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        where : { id :id},
    })
    res.status(200).json(project)
}

const putProjects = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.params
    const {title, 
        description,
        objectives,
        timeline,
        studentCount,
        resources,
        interestArea} = req.body
    const projects = await prisma.project.update({
        where: {id : id},
        data: {title, 
            description,
            objectives,
            timeline,
            studentCount,
            resources,
            interestArea}
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
const getMyProjectsInfo = async (req: ExtendedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "Usuário não autorizado" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                projects: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        let projectsInfo;

        if (user.role === "TEACHER") {
            // Professor
            const ownedProjects = user.projects.map((project) => project.title);
            projectsInfo = { projects: ownedProjects };
        } else if (user.role === "STUDENT") {
            // Estudante
            const myProjects = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            }).then(user => user?.myProjects);

            projectsInfo = { myProjects };
        } else {
            return res.status(400).json({ message: "Papel de usuário não reconhecido" });
        }

        return res.status(200).json(projectsInfo);
    } catch (err) {
        console.error("Error fetching my projects info:", err);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export {
    createProject,
    getProjects,
    getProjectById,
    putProjects,
    deleteProjects,
    getMyProjectsInfo
}