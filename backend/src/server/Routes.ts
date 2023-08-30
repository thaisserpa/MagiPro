import { Router,Request,Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { getProjects } from "../controllers/projectsController";
import { isUserLoggedIn } from "../middlewares/authJWT";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser)

//rotas necessarias ter autenticação
router.use(isUserLoggedIn)

router.get("/perfil")
router.get("/projects", getProjects)

export { router };