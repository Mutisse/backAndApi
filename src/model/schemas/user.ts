import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  nome: {
    pnome: {
      type: String,
      required: true,
    },
    sobrenome: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  genero: {
    type: String,
    enum: ["M", "F"], // Enum para aceitar apenas 'M' ou 'F'
    required: true, // Gênero será obrigatório
  },
  profileImage: {
    type: String, // Campo para armazenar a URL da imagem
    default: "", // Valor padrão vazio
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware de pré-validação para gerar o código de usuário
userSchema.pre("validate", async function (next) {
  if (this.isNew && !this._id) {
    let uniqueCodeFound = false;
    while (!uniqueCodeFound) {
      const randomCode = Math.floor(1000 + Math.random() * 9000); // Gera um número de 4 dígitos
      const userId = `U${randomCode}`;

      // Verifica se o código já existe
      const existingUser = await mongoose
        .model("User")
        .findOne({ _id: userId });
      if (!existingUser) {
        this._id = userId;
        uniqueCodeFound = true;
      }
    }
  }
  next();
});

// Middleware de pré-salvamento para criptografar a senha
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      this.password = hashedPassword;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
