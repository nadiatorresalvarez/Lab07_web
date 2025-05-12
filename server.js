// filepath: d:\nodejs\Laboratorio07-Web\server.js
import express from "express";
import cors from "cors";
import session from "express-session"; // Importa express-session
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();

// Permite el acceso a la API desde el cliente React
const corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura express-session
app.use(
  session({
    secret: "your-secret-key", // Cambia esto por una clave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Usa `true` si estás en HTTPS
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});