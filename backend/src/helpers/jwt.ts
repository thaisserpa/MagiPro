import jwt from 'jsonwebtoken';
import { ApiError } from './api-errors';
import dotenv from 'dotenv';
import { prisma } from "../database/prisma";


dotenv.config();
const jwtPassword = process.env.PASSWORD_JWT as string;

if(!jwtPassword) throw new ApiError('Error interno do servidor',500);

interface Payload {
    userId: string;
    role: string;
}

function createToken(payload: Payload): string {
    return jwt.sign(payload, jwtPassword, { expiresIn: '8h' });
}

const verifyToken = async (token: string): Promise<Payload & { user?: any }> => { 
    const decoded = jwt.verify(token, jwtPassword) as Payload;

    if (!decoded) throw new ApiError('Token inválido', 401);

    const user = await prisma.user.findUnique({ 
        where: { id: decoded.userId } 
    });

    if (!user) throw new ApiError('Usuário não encontrado', 404);
    
    return { ...decoded, user };
}
 
export {
    createToken,
    verifyToken,
    jwtPassword
}