import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-errors";
import { verifyToken, Payload } from "../helpers/jwt";
import { Request as ExpressRequest } from "express";

interface ExtendedRequest extends ExpressRequest {
    user?: Payload & { user?: any  };
}

const isUserLoggedIn = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) throw new ApiError("Não autorizado", 401)

    const [bearer, token] = authorization?.split(" ") || [];

    if (bearer !== "Bearer" || !token) throw new ApiError("Não autorizado", 401);

    const tokenUser = await verifyToken(token);
    req.user = tokenUser;
    next();
}

export {
    isUserLoggedIn,
    ExtendedRequest
}