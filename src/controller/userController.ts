import { Request, Response } from "express";
import User from "../model/schemas/user";


class UserController {
  async find(request: Request, response: Response) {
    try {
      const users = await User.find();
      return response.status(200).json(users); // Responde com status 200 e o JSON dos usuários
    } catch (error) {
      console.error(error); // Adiciona logs para depuração
      if (!response.headersSent) {
        // Verifica se os cabeçalhos já foram enviados
        return response.status(500).json({
          // Responde com status 500 e a mensagem de erro
          error: "Something went wrong, please try again.",
          message: error.message || "An unexpected error occurred",
        });
      }
    }
  }

  async create(request: Request, response: Response) {
    const { nome, email, password,genero,profileImage} = request.body;
    const { pnome, sobrenome } = nome;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return response.status(400).json({
          error: "Ooops",
          massage: "user already exists",
        });
      }

      const user = await User.create({
        nome: { pnome, sobrenome },
        email,
        password,
        genero, // Adicionando o campo gênero
        profileImage // Se você estiver armazenando uma URL ou um buffer de imagem
      });
      return response.status(201).send(user);
    } catch (error) {
      console.error(error); // Adicione logs para depuração
      return response.status(500).send({
        error: "Registration failed",
        message: error.message || "An unexpected error occurred",
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params; // Captura o ID do usuário a partir dos parâmetros da URL
      const { nome, email, password,genero,profileImage } = request.body; // Captura os dados do corpo da requisição

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { nome, email, password,genero,profileImage},
        { new: true, runValidators: true } // Retorna o documento atualizado e aplica as validações do esquema
      );

      if (!updatedUser) {
        return response.status(404).json({
          error: "User not found",
          message: `No user found with the ID: ${id}`,
        });
      }

      return response.status(200).json(updatedUser); // Retorna o usuário atualizado
    } catch (error) {
      console.error('Error updating user:', error); // Adiciona logs para depuração
      if (!response.headersSent) {
        return response.status(500).json({
          error: "Something went wrong, please try again.",
          message: error.message || "An unexpected error occurred",
        });
      }
    }
  }

  async findOne(request: Request, response: Response) {
    try {
      const { id } = request.params; // Captura o ID do usuário a partir dos parâmetros da URL

      const user = await User.findById(id); // Encontra o usuário pelo ID

      if (!user) {
        return response.status(404).json({
          error: "User not found",
          message: `No user found with the ID: ${id}`,
        });
      }

      return response.status(200).json(user); // Responde com status 200 e o JSON do usuário
    } catch (error) {
      console.error('Error finding user:', error); // Adiciona logs para depuração
      if (!response.headersSent) {
        return response.status(500).json({
          error: "Something went wrong, please try again.",
          message: error.message || "An unexpected error occurred",
        });
      }
    }
  }
  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params; // Captura o ID do usuário a partir dos parâmetros da URL

      const user = await User.findByIdAndDelete(id); // Encontra e deleta o usuário pelo ID

      if (!user) {
        return response.status(404).json({
          error: "User not found",
          message: `No user found with the ID: ${id}`,
        });
      }

      return response.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error); // Adiciona logs para depuração
      if (!response.headersSent) {
        return response.status(500).json({
          error: "Something went wrong, please try again.",
          message: error.message || "An unexpected error occurred",
        });
      }
    }
  }
}

export default new UserController();
