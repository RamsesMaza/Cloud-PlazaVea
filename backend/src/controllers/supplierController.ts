import { Request, Response } from 'express';
import pool from '../db';

// Obtener todos los proveedores
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT id, name, contactPerson, phone, email, ruc, address, isActive FROM suppliers');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo proveedor (NUEVA FUNCIÓN)
export const addSupplier = async (req: Request, res: Response) => {
  // Las columnas deben coincidir con las de tu tabla suppliers
  const { name, contactPerson, email, phone, address, ruc, isActive = true } = req.body;
  try {
    const [result]: any = await pool.query(
      'INSERT INTO suppliers (name, contactPerson, email, phone, address, ruc, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, contactPerson, email, phone, address, ruc, isActive]
    );

    // Devolver el proveedor recién creado con su ID
    const [newSupplierRows]: any = await pool.query('SELECT * FROM suppliers WHERE id = ?', [result.insertId]);
    res.status(201).json(newSupplierRows[0]);
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};