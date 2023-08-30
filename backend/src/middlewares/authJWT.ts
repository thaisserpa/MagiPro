import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-errors";
import { verifyToken } from "../helpers/jwt";

const isUserLoggedIn = async (req:Request, res:Response, next:NextFunction) =>{
    const { authorization } = req.headers;
    const [bearer, token] = authorization?.split(" ") || [];

    if (bearer !== "Bearer" || !token) {
        throw new ApiError("Não autorizado",401)
        return;
    }

    const tokenUser = verifyToken(token);
    next();
}

export {
    isUserLoggedIn
}