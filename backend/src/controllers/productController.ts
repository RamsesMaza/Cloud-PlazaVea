// src/controllers/productController.ts

import { Request, Response } from 'express';
import pool from '../db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { name, sku, category, description, price, stock, minStock, maxStock, supplierId, unit, location } = req.body;
  try {
    // CORRECCIÓN CLAVE: 
    // Se eliminan 'createdAt' y 'updatedAt' de la lista de columnas y los valores 'NOW()'
    // La lista de 11 columnas coincide con los 11 marcadores de posición '?'
    const [result] = await pool.query(
      'INSERT INTO products (name, sku, category, description, price, stock, minStock, maxStock, supplierId, unit, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, sku, category, description, price, stock, minStock, maxStock, supplierId, unit, location]
    );
    
    const insertedId = (result as any).insertId;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [insertedId]);
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(201).json(rows[0]);
    } else {
      res.status(201).json(null);
    }
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    await pool.query(
      'UPDATE products SET ? , updated_at = NOW() WHERE id = ?',
      [updates, id]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};