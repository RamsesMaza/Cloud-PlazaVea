// src/controllers/productController.ts

import { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid'; 

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
  
  // 1. Generar ID y corregir el mapeo
  const id = uuidv4(); 

  try {
    const [result] = await pool.query(
      'INSERT INTO products (id, name, sku, category, description, price, stock, min_stock_level, max_stock_level, supplier_id, unit_of_measure, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, sku, category, description, price, stock, minStock, maxStock, supplierId, unit, location]
    );
    
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
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
    
    const mappedUpdates: { [key: string]: any } = {};
    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            let dbColumnName = key;
            if (key === 'minStock') dbColumnName = 'min_stock_level';
            else if (key === 'maxStock') dbColumnName = 'max_stock_level';
            else if (key === 'supplierId') dbColumnName = 'supplier_id';
            else if (key === 'unit') dbColumnName = 'unit_of_measure';
            mappedUpdates[dbColumnName] = updates[key];
        }
    }

  try {
    await pool.query(
      'UPDATE products SET ? , updated_at = NOW() WHERE id = ?',
      [mappedUpdates, id]
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