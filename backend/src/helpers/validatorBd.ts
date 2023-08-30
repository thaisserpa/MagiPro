import { NextFunction, Request, Response } from 'express';
import { ApiError } from './api-errors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let dbConnectionStatus: 'connected' | 'disconnected' = 'disconnected';

export async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    dbConnectionStatus = 'connected';
    console.log('\x1b[32m%s\x1b[0m', 'Banco de dados conectado com sucesso');
  } catch (err) {
    dbConnectionStatus = 'disconnected';
    console.error('\x1b[31m%s\x1b[0m', 'Erro ao conectar com o banco de dados');
  }
}

export function validateDbConnection(req: Request, res: Response, next: NextFunction) {
  if (dbConnectionStatus === 'disconnected') {
    next(new ApiError('Internal Server Error', 500));
  } else {
    next();
  }
}

