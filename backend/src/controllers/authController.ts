import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../helpers/api-errors";
import { isValid } from "../helpers/validator";
import { createToken} from "../helpers/jwt";


const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, role } = req.body;

    const errors = await isValid({ name, email, password, confirmPassword,role });
    if (errors.length > 0) return res.status(400).json({ errors });

    const salt = await bcrypt.genSalt(10);
    const hashedPassowrd = await bcrypt.hash(password, salt);

    const roleToUpperCase = role.toUpperCase();
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassowrd, role: roleToUpperCase },
    });

    return res.json({ message: "Usuario Criado Com Sucesso" });
};

const loginUser = async (req: Request, res: Response) => {
    const {email,password} = req.body;

    const user = await prisma.user.findFirst({where:{email}});
    if(!user) throw new ApiError('Email ou senha invalida',400);
    
    const passwordValid = await bcrypt.compare(password,user.password);
    if (!passwordValid) throw new ApiError('Email ou senha invalida',400);

    const payload = {
        userId: user.id,
        role: user.role
    };
    
    const token = createToken(payload);

    return res.json({
        "userId": user.id,
        "role": user.role,
        "mensagem":"usuario autenticado",
        token
    });
};

export {
    registerUser,
    loginUser
}