import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1]; // Assume que o token está no formato "Bearer <token>"

  if (!token) {
    return response.status(401).json({
      error: "Unauthorized",
      message: "No token provided",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return response.status(401).json({
        error: "Unauthorized",
        message: "Invalid token",
      });
    }

    // Adiciona o ID do usuário decodificado ao objeto de requisição
    request.userId = (decoded as any).id;
    next();
  });
};

export default authMiddleware;
