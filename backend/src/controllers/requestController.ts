import { Request, Response } from 'express';
import pool from '../db';

// Obtener todas las solicitudes
export const getRequests = async (req: Request, res: Response) => {
  try {
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
  try {
    const [result]: any = await pool.query(
      'INSERT INTO requests (productId, requestedBy, quantity, reason, status) VALUES (?, ?, ?, ?, ?)',
      [productId, requestedBy, quantity, reason, status]
    );

    // Devolver la solicitud recién creada
    const [newRequestRows]: any = await pool.query('SELECT * FROM requests WHERE id = ?', [result.insertId]);
    res.status(201).json(newRequestRows[0]);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Puedes agregar updateRequest y deleteRequest aquí si es necesario