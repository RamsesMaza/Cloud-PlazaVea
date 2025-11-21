import { Request, Response } from 'express';
import pool from '../db';

// Obtener todos los movimientos
export const getMovements = async (req: Request, res: Response) => {
  try {
    // CORRECCIÓN CLAVE: Usamos 'created_at' (snake_case)
    const [rows] = await pool.query('SELECT * FROM movements ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Agregar un nuevo movimiento
export const addMovement = async (req: Request, res: Response) => {
  const { productId, type, quantity, reason, reference, userId, cost } = req.body;
  try {
    // Asumo que el campo de tiempo se maneja automáticamente por MySQL
    const [result]: any = await pool.query(
      'INSERT INTO movements (productId, type, quantity, reason, reference, userId, cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, type, quantity, reason, reference, userId, cost]
    );

    // Devolver el movimiento recién creado
    const [newMovementRows]: any = await pool.query('SELECT * FROM movements WHERE id = ?', [result.insertId]);
    res.status(201).json(newMovementRows[0]);
  } catch (error) {
    console.error('Error al agregar movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};