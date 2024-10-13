import { Router } from "express";
import UserController from "../controller/userController";
import AuthController from "../controller/authController";
import authMiddleware from "../middleware/authMiddleware";

const routes = Router();

// Rotas públicas
routes.post("/login", AuthController.login);
routes.post("/users", UserController.create); // Criar usuário não protegido

// Rotas protegidas
routes.get("/users", authMiddleware, UserController.find); // Buscar usuários protegido
routes.get("/users/:id", authMiddleware, UserController.findOne); // Buscar um usuário protegido
routes.put("/users/:id", authMiddleware, UserController.update); // Atualizar usuário protegido
routes.delete("/users/:id", authMiddleware, UserController.delete); // Deletar usuário protegido

export default routes;
