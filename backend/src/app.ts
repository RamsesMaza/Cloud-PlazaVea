import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import supplierRoutes from './routes/supplierRoutes';
import movementRoutes from './routes/movementRoutes';
import requestRoutes from './routes/requestRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('API backend bd_disearqui funcionando');
});

// Rutas reales
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/requests', requestRoutes);

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
