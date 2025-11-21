
-- 1. DESACTIVAR RESTRICCIONES DE CLAVES FORÁNEAS TEMPORALMENTE (PARA PERMITIR BORRAR Y REINICIAR IDs)
SET FOREIGN_KEY_CHECKS = 0; 

-- 2. LIMPIEZA DE BASE DE DATOS
USE bd_disearqui;
DELETE FROM movements;
DELETE FROM requests;
DELETE FROM alerts;
DELETE FROM products;
DELETE FROM suppliers;
DELETE FROM users;

-- 3. REINICIAR CONTADORES DE IDs (AUTO_INCREMENT)
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1; 
ALTER TABLE suppliers AUTO_INCREMENT = 1; 
ALTER TABLE requests AUTO_INCREMENT = 1; 

-- 4. CREACIÓN DE TABLAS (Usamos el IF NOT EXISTS para evitar errores)
CREATE DATABASE IF NOT EXISTS bd_disearqui;
USE bd_disearqui;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  minStock INT DEFAULT 0,
  maxStock INT DEFAULT 0,
  supplierId INT,
  unit VARCHAR(50),
  location VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'employee') NOT NULL,
  name VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  type ENUM('entry', 'exit') NOT NULL,
  quantity INT NOT NULL,
  reason VARCHAR(255),
  reference VARCHAR(255),
  userId INT,
  cost DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  requestedBy INT,
  quantity INT NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (requestedBy) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contactPerson VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  ruc VARCHAR(20),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  productId INT,
  message TEXT,
  severity ENUM('low', 'medium', 'high'),
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id)
);

-- ============================================================
-- 5. DATOS DE PRUEBA (CON IDs FIJOS PARA CLAVES FORÁNEAS)
-- ============================================================

-- A. Insertar Usuarios (IDs 1, 2, 3)
INSERT INTO users (id, username, email, password, role, name) VALUES 
(1, 'admin', 'admin@plazavea.com.pe', 'password', 'admin', 'Administrador Sistema'),
(2, 'manager', 'manager@plazavea.com.pe', 'password', 'manager', 'Gerente Tienda'),
(3, 'employee', 'employee@plazavea.com.pe', 'password', 'employee', 'Empleado Almacén');

-- B. Insertar Proveedores (IDs 1, 2, 3)
INSERT INTO suppliers (id, name, contactPerson, email, phone, address, ruc) VALUES 
(1, 'Alicorp S.A.A.', 'Carlos Rodriguez', 'ventas@alicorp.com.pe', '01-555-1234', 'Av. Argentina 4793, Callao', '20100055237'),
(2, 'Gloria S.A.', 'Maria Fernandez', 'contacto@gloria.com.pe', '01-555-9876', 'Av. República de Panamá 2461', '20100190797'),
(3, 'Procter & Gamble', 'Jorge Luis', 'ventas@pg.com', '01-211-0000', 'San Isidro, Lima', '20100123456');

-- C. Insertar Productos (IDs 1, 2, 3, 4)
INSERT INTO products (id, name, sku, category, description, price, stock, minStock, maxStock, supplierId, unit, location) VALUES 
(1, 'Detergente Bolívar 5kg', 'DET-BOL-001', 'Limpieza', 'Detergente industrial en bolsa', 45.50, 150, 20, 500, 1, 'Bolsa', 'Pasillo A-12'),
(2, 'Aceite Primor 1L', 'ACE-PRI-002', 'Abarrotes', 'Aceite vegetal premium', 12.90, 80, 15, 200, 1, 'Botella', 'Pasillo B-05'),
(3, 'Leche Gloria Azul', 'LEC-GLO-001', 'Lácteos', 'Leche evaporada entera', 4.20, 500, 50, 1000, 2, 'Lata', 'Almacén Frío 1'),
(4, 'Shampoo H&S', 'SHA-HS-001', 'Cuidado Personal', 'Control caspa limpieza renovadora', 28.00, 30, 5, 100, 3, 'Frasco', 'Estante C-3');

-- D. Insertar Movimientos
INSERT INTO movements (productId, type, quantity, reason, reference, userId, cost) VALUES 
(1, 'entry', 100, 'Compra Inicial', 'FAC-001', 1, 40.00), -- User 1 (Admin)
(3, 'entry', 500, 'Reposición Mensual', 'FAC-002', 1, 3.80), -- User 1 (Admin)
(1, 'exit', 5, 'Consumo Interno', 'REQ-001', 2, 0.00); -- User 2 (Manager)

-- E. Insertar Solicitudes (Tendrás 2 pendientes)
INSERT INTO requests (productId, requestedBy, quantity, reason, status) VALUES 
(2, 2, 50, 'Stock bajo detectado en revisión matutina', 'pending'), -- User 2 (Manager)
(4, 3, 20, 'Solicitud urgente para cliente especial', 'pending'); -- User 3 (Employee)

-- F. Insertar Alertas
INSERT INTO alerts (type, productId, message, severity, isRead) VALUES 
('stock', 4, 'El stock de Shampoo H&S es bajo (30 unidades)', 'medium', FALSE),
('system', NULL, 'Backup de base de datos realizado con éxito', 'low', TRUE);

-- 6. ACTIVAR RESTRICCIONES DE CLAVES FORÁNEAS DE NUEVO
SET FOREIGN_KEY_CHECKS = 1;