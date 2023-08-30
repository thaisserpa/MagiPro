import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/api-errors';
import { checkPrismaConnection } from '../helpers/validatorBd';

export const errorMiddleware = (
    error: Error & Partial<ApiError>,
    req: Request, 
    res: Response, 
    next: NextFunction 
)=> {
    const statusCode = error.statusCode ?? 500;
    const message = error.statusCode ? error.message : 'Internal Server Error';  
    return res.status(statusCode).json({message});
};

//exemplos de uso  
// throw new ApiError('Erro lançado',400);