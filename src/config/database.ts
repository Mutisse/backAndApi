import mongoose from "mongoose";
import dotenv from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const connectDatabase = async () => {
  try {
    // Obter a URL do MongoDB a partir das variáveis de ambiente
    const uri = process.env.MONGODB_URI as string;

    // Extrair o nome da base de dados da URL
    const dbName = uri.split('/').pop(); // Assume que o nome da base de dados está no final da URL
    
    // Conectar ao MongoDB
    await mongoose.connect(uri);

    // Logar a mensagem de sucesso com o nome da base de dados
    console.log(`Connected to Database "${dbName}" successfully`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Encerra o processo com um código de erro
  }
};

export default connectDatabase;
