import { Request, Response } from "express";
import { ExtendedRequest } from "../middlewares/authJWT";
import { prisma } from "../database/prisma";
import bcrypt from 'bcrypt';
import { isValid } from "../helpers/validatorUpdatePerfil";
import { ApiError } from "../helpers/api-errors";


//TODO rota para pegar todos alunos inscritos no projeto 
//TODO rota para depois de ver todos alunos inscritos ver perfil aluno 

const getPerfil = async (req: ExtendedRequest, res: Response) => {
    // rota para pegar nome email curriculo e descrição
    const userId = req.params.userId
    const userPerfil = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            email: true,
            resume: true,
            description: true
        }
    });
    res.status(200).json(userPerfil)
}

const updatePerfil = async (req: ExtendedRequest, res: Response) => {
    const idFromJwt = req.user?.userId;
    const idUserParams = req.params.userId;

    if (idFromJwt !== idUserParams) throw new ApiError('Não foi possivel atualizar o perfil', 400);

    const { name, email, resume, description, newPassword, oldPassword } = req.body;
    
    const errors = await isValid({ name, email, newPassword });
    if (errors.length > 0) return res.status(400).json({ errors });

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (resume) updateData.resume = resume;
    if (description) updateData.description = description;

    if (oldPassword && newPassword) {
        const user = await prisma.user.findUnique({ where: { id: idFromJwt } });

        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const newHashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = newHashedPassword;
        } else {
            res.status(400).json({ message: "Senha antiga incorreta" });
        }
    }

    if(newPassword && !oldPassword) throw new ApiError('Porfavor informe a senha antiga', 400);

    const updatedUser = await prisma.user.update({
        where: { id: idFromJwt },
        data: updateData,
    });

    return res.status(200).json({message:"Usuario atualizado com sucesso"});
};




export {
    updatePerfil,
    getPerfil
}