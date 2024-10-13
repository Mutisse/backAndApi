import express from "express";
import connectDatabase from "./config/database";
import routes from "./routes/routes";
import dotenv from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Conectar ao banco de dados
connectDatabase();

// Configuração do Express
app.use(express.json());
app.use(routes);

// Iniciar o servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
