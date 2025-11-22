// src/controllers/userController.ts

import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Importación de UUID

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (req: Request, res: Response) => {
  // Aseguramos que 'name' y 'isActive' se manejen correctamente.
  const { name, username, email, password, role, isActive = true } = req.body; 
  
  // 1. Generar ID para la tabla 'users'
  const id = uuidv4(); 
  
  // Usamos el username como nombre si 'name' no viene en el body
  const userName = name || username;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Incluir 'id' y el resto de columnas obligatorias en la consulta INSERT
    const [result] = await pool.query(
      'INSERT INTO users (id, name, username, email, password, role, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userName, username, email, hashedPassword, role, isActive]
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
    
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } }); 
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};