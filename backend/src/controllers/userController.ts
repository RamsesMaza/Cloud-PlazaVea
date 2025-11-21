// Controlador para autenticación y gestión de usuarios
import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'Usuario registrado' });
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
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
