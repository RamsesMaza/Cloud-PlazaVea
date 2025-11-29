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

  // 2. Saneamiento de datos: Asegurar que quantity es un número
  const safeQuantity = Number(quantity);
  
  try {
    // 3. Validación de la cantidad
    if (isNaN(safeQuantity) || safeQuantity <= 0) {
      // Devolver un error 400 Bad Request si la cantidad no es válida
      return res.status(400).json({ error: 'La cantidad solicitada debe ser un número válido mayor que cero.' });
    }

    // 4. CORRECCIÓN CLAVE: Ejecutar la consulta incluyendo el 'id' generado
    const [result]: any = await pool.query(
      'INSERT INTO requests (id, productId, requestedBy, quantity, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, productId, requestedBy, safeQuantity, reason, status]
    );

    // 5. Usar el ID generado para devolver la solicitud completa
    const [newRequestRows]: any = await pool.query('SELECT * FROM requests WHERE id = ?', [id]);
    res.status(201).json(newRequestRows[0]);
  } catch (error) {
    // 6. MEJORA DE DIAGNÓSTICO: Loguear la excepción real y devolver el detalle al cliente
    console.error('Error al crear solicitud (Excepción DB):', error); 
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      detail: (error as Error).message
    });
  }
};