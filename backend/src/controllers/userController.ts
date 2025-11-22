// src/controllers/userController.ts (CORREGIDO)

import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // <-- ¡Añadir esta importación!

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  
  // 1. Generar ID para la tabla 'users'
  const id = uuidv4(); 
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Incluir 'id' en la consulta INSERT (la tabla 'users' requiere el ID explícito)
    const [result] = await pool.query(
      'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, username, email, hashedPassword, role]
    );
    
    res.status(201).json({ message: 'Usuario registrado', id: id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // Asumo que el campo de nombre de usuario es 'username' o 'name'
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } }); 
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};