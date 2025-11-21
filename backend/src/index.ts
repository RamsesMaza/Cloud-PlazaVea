import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Ejemplo de ruta /products
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "Producto 1" },
    { id: 2, name: "Producto 2" }
  ]);
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor backend corriendo en puerto " + PORT);
});
