import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import movementRoutes from "./routes/movementRoutes";
import requestRoutes from "./routes/requestRoutes";
import userRoutes from "./routes/userRoutes"; // opcional si lo necesitas

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS REALES
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes); // opcional

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor backend corriendo en puerto " + PORT);
});
