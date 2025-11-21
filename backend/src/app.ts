import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import supplierRoutes from './routes/supplierRoutes'; // <-- LÍNEA NUEVA
import movementRoutes from './routes/movementRoutes'; // <-- NUEVA
import requestRoutes from './routes/requestRoutes';   // <-- NUEVA

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('API backend bd_disearqui funcionando');
});

// Example endpoint: obtener productos
app.get('/products', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Aquí se agregarán más rutas para usuarios, movimientos, solicitudes, proveedores, alertas, etc.

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/movements', movementRoutes); // <-- REGISTRO DE RUTA
app.use('/api/requests', requestRoutes);   // <-- REGISTRO DE RUTA


app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
