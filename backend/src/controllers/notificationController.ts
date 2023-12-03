import { Request, Response, response } from "express";
import { prisma } from "../database/prisma";
import { ApiError } from "../helpers/api-errors";
import { createToken, verifyToken } from "../helpers/jwt";
import { error } from "console";
import { ExtendedRequest } from "../middlewares/authJWT";
import http from 'http';

const getNotifications = async (req: ExtendedRequest, res: Response) => {
    try {
        const professorId = req.user?.userId; 

        if (!professorId) {
            throw new ApiError("não encontrado ou autorizado", 401);
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: professorId,
            },
            orderBy: {
                createdAt: 'desc', 
            },
        });

        return res.status(200).json({ notifications });
    } catch (err) {
        console.error("Error fetching notifications:", err);

        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ message: err.message });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

export { getNotifications };