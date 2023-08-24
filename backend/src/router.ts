import {Router} from "express";
import {createUser} from ".controller/UserController";

const {Router} from "express";

export const router = Router()

router.post("/user", createUser)