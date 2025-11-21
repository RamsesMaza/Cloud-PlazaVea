// Controlador para gestión de productos
import { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid'; // <-- 1. Importar UUID para generar IDs

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
  
  // 2. Generar el ID único antes de la inserción
  const id = uuidv4(); 

  try {
    // CORRECCIÓN CLAVE: 
    // a) Se incluye 'id' en la consulta.
    // b) Se usan nombres de columna EXACTOS de MySQL (snake_case).
    const [result] = await pool.query(
      'INSERT INTO products (id, name, sku, category, description, price, stock, min_stock_level, max_stock_level, supplier_id, unit_of_measure, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, sku, category, description, price, stock, minStock, maxStock, supplierId, unit, location]
    );
    
    // 3. Se usa el ID generado para obtener el producto insertado.
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
    
    // NOTA: La lógica de actualización SET ? funciona si el frontend envía snake_case, 
    // o si el objeto 'updates' se mapea a snake_case antes de esta consulta.

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