import { Router,Request,Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { createProjects, deleteProjects, getProjectById, getProjects,putProjects } from "../controllers/projectsController";
import { isUserLoggedIn } from "../middlewares/authJWT";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser)

//rotas necessarias ter autenticação
router.use(isUserLoggedIn) // middleware login 

router.get("/perfil");
router.post("/projects",createProjects);
router.get("/projects", getProjects);
router.get("/projects/:id", getProjectById);
router.put("/projects/:id", putProjects);
router.delete("/projects/:id", deleteProjects)


export { router };