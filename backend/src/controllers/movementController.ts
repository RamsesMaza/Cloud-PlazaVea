import { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid'; // <-- Necesario para generar IDs

// Obtener todos los movimientos
export const getMovements = async (req: Request, res: Response) => {
  try {
    // Corregido: Usamos 'created_at' para coincidir con la base de datos
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
  
  // 1. Generar el ID
  const id = uuidv4(); 
  
  try {
    // 2. CORRECCIÓN CLAVE: Incluir 'id' en la lista de columnas y valores
    const [result]: any = await pool.query(
      'INSERT INTO movements (id, productId, type, quantity, reason, reference, userId, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, productId, type, quantity, reason, reference, userId, cost]
    );

    // 3. Usar el ID generado para devolver el movimiento (result.insertId ya no se usa)
    const [newMovementRows]: any = await pool.query('SELECT * FROM movements WHERE id = ?', [id]);
    res.status(201).json(newMovementRows[0]);
  } catch (error) {
    console.error('Error al agregar movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};