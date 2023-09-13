import { Router,Request,Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { createProjects, deleteProjects, getProjectById, getProjects,putProjects } from "../controllers/projectsController";
import { isUserLoggedIn } from "../middlewares/authJWT";
import { createApplication, deleteApplication, getApplication, getApplicationById, putApplication } from "../controllers/applicationController";

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


router.post("/application",createApplication);
router.get("/application", getApplication);
router.get("/application/:id", getApplicationById);
router.put("/application/:id", putApplication);
router.delete("/application/:id", deleteApplication)


export { router };