import { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid'; // CRÍTICO: Importar UUID

// Obtener todos los proveedores
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    // CORRECCIÓN: Usar nombres de columna exactos o alias si es necesario.
    // Usaremos los nombres exactos de la base de datos (snake_case)
    const [rows] = await pool.query('SELECT id, name, contact_person, phone, email, ruc, address, isActive, created_at, updated_at FROM suppliers'); 
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo proveedor
export const addSupplier = async (req: Request, res: Response) => {
  const { name, contactPerson, email, phone, address, ruc, isActive = true } = req.body;
  
  // 1. GENERAR ID para la columna 'id' (VARCHAR)
  const id = uuidv4(); 
  
  try {
    // 2. CORRECCIÓN CLAVE: Usar nombres de columna EXACTOS (snake_case)
    // 3. Incluir 'id' y el valor '?' en la consulta.
    const [result]: any = await pool.query(
      'INSERT INTO suppliers (id, name, contact_person, email, phone, address, ruc, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, contactPerson, email, phone, address, ruc, isActive]
    );

    // 4. Devolver el proveedor recién creado usando el ID generado
    const [newSupplierRows]: any = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    res.status(201).json(newSupplierRows[0]);
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};