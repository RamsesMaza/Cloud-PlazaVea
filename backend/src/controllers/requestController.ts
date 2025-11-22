import { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid'; // <-- Necesario para generar IDs

// Obtener todas las solicitudes
export const getRequests = async (req: Request, res: Response) => {
  try {
    // Corregido: Usamos 'created_at' para coincidir con la base de datos
    const [rows] = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear una nueva solicitud
export const createRequest = async (req: Request, res: Response) => {
  const { productId, requestedBy, quantity, reason, status } = req.body;
  
  // 1. Generar el ID
  const id = uuidv4();
  
  try {
    // 2. CORRECCIÓN CLAVE: Incluir 'id' en la lista de columnas y valores
    const [result]: any = await pool.query(
      'INSERT INTO requests (id, productId, requestedBy, quantity, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, productId, requestedBy, quantity, reason, status]
    );

    // 3. Usar el ID generado para devolver el movimiento (result.insertId ya no se usa)
    const [newRequestRows]: any = await pool.query('SELECT * FROM requests WHERE id = ?', [id]);
    res.status(201).json(newRequestRows[0]);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};