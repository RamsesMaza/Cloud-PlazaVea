import { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';

// ===============================
// OBTENER PROVEEDORES
// ===============================
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        name, 
        contact_person AS contactPerson, 
        phone, 
        email, 
        ruc, 
        address, 
        isActive, 
        created_at AS createdAt, 
        updated_at AS updatedAt 
      FROM suppliers
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ===============================
// CREAR PROVEEDOR
// ===============================
export const addSupplier = async (req: Request, res: Response) => {
  const { name, contactPerson, email, phone, address, ruc, isActive = true } = req.body;

  const id = uuidv4();

  try {
    await pool.query(
      `INSERT INTO suppliers 
        (id, name, contact_person, email, phone, address, ruc, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, contactPerson, email, phone, address, ruc, isActive]
    );

    const [newSupplier]: any = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    res.status(201).json(newSupplier[0]);
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ===============================
// ELIMINAR PROVEEDOR ✅
export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result]: any = await pool.query(
      'DELETE FROM suppliers WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
