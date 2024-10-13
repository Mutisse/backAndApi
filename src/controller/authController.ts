import { Request, Response } from "express";
import User from "../model/schemas/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class AuthController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email }).select('+password'); // Inclui a senha no resultado da consulta

      if (!user) {
        return response.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      const isMatch = await user.comparePassword(password); // Verifica a senha

      if (!isMatch) {
        return response.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      // Gera o token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: '1h', // O token expira em 1 hora
      });

      return response.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      return response.status(500).json({
        error: "Something went wrong, please try again.",
        message: error.message || "An unexpected error occurred",
      });
    }
  }
}

export default new AuthController();
