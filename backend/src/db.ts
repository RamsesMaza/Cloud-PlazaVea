// src/db.ts

import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs'; 
import path from 'path'; 

dotenv.config();

const certPath = path.join(__dirname, 'certs', 'azure_mysql_ca.pem'); 

let caCert: Buffer | undefined;

try {
  caCert = fs.readFileSync(certPath);
} catch (error) {
  console.error("Error al leer el certificado CA:", error);
  // Si falla al leer, aún podemos intentar la conexión, pero el error 500 continuará.
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: caCert ? { // Solo añade la configuración SSL si el certificado se leyó correctamente
    rejectUnauthorized: true, 
    ca: caCert
  } : undefined 

});

export default pool.promise();