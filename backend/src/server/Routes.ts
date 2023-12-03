import { Router,Request,Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { createProject, deleteProjects, getMyProjectsInfo, getProjectById, getProjects,putProjects } from "../controllers/projectsController";
import { isUserLoggedIn } from "../middlewares/authJWT";
import { getPerfil, updatePerfil } from "../controllers/userController";
import { acceptApplication, applyToProject, getApplication, rejectApplication } from "../controllers/applicationController";
import { getNotifications } from "../controllers/notificationController";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/perfil/:userId",getPerfil);

//rotas necessarias ter autenticação
router.use(isUserLoggedIn) // middleware login 

router.put("/perfil/:userId", updatePerfil)
router.post("/projects",createProject);

router.get("/projects", getProjects);

router.get("/projects/:id", getProjectById);
router.put("/projects/:id", putProjects);
router.delete("/projects/:id", deleteProjects)

router.post("/application",applyToProject)
router.get("/applications",getApplication)
router.get("/notifications", getNotifications);

router.post('/accept-application', acceptApplication)
router.post('/reject-application', rejectApplication)
router.get('/get-myprojects', getMyProjectsInfo)

export { router };