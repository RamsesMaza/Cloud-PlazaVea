import { Request, Response } from 'express';
import pool from '../db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Nota: Si usas SELECT * FROM products, la base de datos devolverá snake_case. 
    // El frontend (React) debe estar preparado para recibir 'min_stock_level', no 'minStock'. 
    // Si el frontend espera camelCase, necesitaríamos usar ALIAS en esta consulta.
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
    // CORRECCIÓN CLAVE: Usar nombres de columna EXACTOS (snake_case)
    const [result] = await pool.query(
      'INSERT INTO products (name, sku, category, description, price, stock, min_stock_level, max_stock_level, supplier_id, unit_of_measure, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    
    // NOTA: Para que esto funcione sin fallar en las columnas snake_case, 
    // necesitas que el frontend envíe los datos con snake_case (ej: {min_stock_level: 5})
    // O hacer un mapeo aquí de camelCase a snake_case antes de la actualización.

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