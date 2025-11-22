// src/controllers/productController.ts

import { Request, Response } from "express";
import pool from "../db";
import { v4 as uuidv4 } from "uuid";

// ================================
// GET PRODUCTS
// ================================
export const getProducts = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ================================
// ADD PRODUCT
// ================================
export const addProduct = async (req: Request, res: Response) => {
    console.log("📥 Datos recibidos del frontend:", req.body);

    const {
        name,
        sku,
        description,
        price,
        stock,
        minStock,
        maxStock,
        supplierId,
        unit,
        category,
        categoryId,
        location,
        locationId,
    } = req.body;

    const id = uuidv4();

    // Mapeo automático
    const finalCategory = categoryId ?? category;
    const finalLocation = locationId ?? location;

    try {
        await pool.query(
            `INSERT INTO products 
            (id, name, sku, category, description, price, stock, min_stock_level, max_stock_level, supplier_id, unit_of_measure, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                name,
                sku,
                finalCategory,
                description,
                price,
                stock,
                minStock,
                maxStock,
                supplierId,
                unit,
                finalLocation,
            ]
        );

        const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
            id,
        ]);

        res.status(201).json(Array.isArray(rows) ? rows[0] : null);
    } catch (error: any) {
        console.error("❌ Error al agregar producto:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            detail: error.message,
        });
    }
};

// ================================
// UPDATE PRODUCT
// ================================
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const mappedUpdates: { [key: string]: any } = {};

    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            let dbColumn = key;

            if (key === "minStock") dbColumn = "min_stock_level";
            else if (key === "maxStock") dbColumn = "max_stock_level";
            else if (key === "supplierId") dbColumn = "supplier_id";
            else if (key === "unit") dbColumn = "unit_of_measure";
            else if (key === "categoryId") dbColumn = "category";
            else if (key === "locationId") dbColumn = "location";

            mappedUpdates[dbColumn] = updates[key];
        }
    }

    try {
        await pool.query(
            "UPDATE products SET ?, updated_at = NOW() WHERE id = ?",
            [mappedUpdates, id]
        );

        const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
            id,
        ]);

        res.json(Array.isArray(rows) ? rows[0] : null);
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ================================
// DELETE PRODUCT
// ================================
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM products WHERE id = ?", [id]);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
