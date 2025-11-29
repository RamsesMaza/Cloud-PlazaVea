import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Movement, Request, Supplier, Alert } from '../types';

interface InventoryContextType {
  products: Product[];
  movements: Movement[];
  requests: Request[];
  suppliers: Supplier[];
  alerts: Alert[];

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addMovement: (movement: Omit<Movement, 'id' | 'createdAt'>) => Promise<void>;
  createRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => void;

  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;

  markAlertAsRead: (id: string) => void;

  searchProducts: (query: string) => Product[];
  generateReport: (startDate: string, endDate: string) => Movement[];
  exportToExcel: () => void;
  refreshAllData: () => Promise<void>; 
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // 🔥 Debe ser SIN fallback para que Azure lo reemplace
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);


  // --- FETCH FUNCTIONS (EN PERSISTENCIA) ---

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/suppliers`);
      if (!response.ok) throw new Error('Error al obtener proveedores');
      setSuppliers(await response.json());
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  }, [API_URL]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) throw new Error('Error al obtener productos');
      
      // 🛑 CORRECCIÓN APLICADA AQUÍ: Mapear para asegurar que los números sean números
      const rawProducts: any[] = await response.json(); 

      const safeProducts: Product[] = rawProducts.map(product => ({
        ...product,
        // Convertir price a float, usando 0 si es null/undefined/string no válido
        price: parseFloat(product.price) || 0,
        // Convertir stock a entero (si es necesario)
        stock: parseInt(product.stock) || 0, 
      }));
      
      setProducts(safeProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }, [API_URL]);

  // <-- NUEVAS FUNCIONES DE FETCH PARA MOVIMIENTOS Y SOLICITUDES -->
  const fetchMovements = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/movements`);
      if (!response.ok) throw new Error('Error al obtener movimientos');
      setMovements(await response.json());
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
    }
  }, [API_URL]);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/requests`);
      if (!response.ok) throw new Error('Error al obtener solicitudes');
      setRequests(await response.json());
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    }
  }, [API_URL]);
  // <-- FIN DE NUEVAS FUNCIONES DE FETCH -->

  // --- FUNCIÓN UNIFICADA DE RECARGA (refreshAllData) ---
  const refreshAllData = useCallback(async () => {
      await fetchProducts();
      await fetchSuppliers();
      await fetchMovements();
      await fetchRequests();
  }, [fetchProducts, fetchSuppliers, fetchMovements, fetchRequests]); 

  // --- EFECTO DE CARGA INICIAL ---
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]); 


  // --- CRUD PRODUCTS (PERSISTENTE) ---
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Error al agregar producto');
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Error al actualizar producto');

      const updated = await response.json(); 
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar producto');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };


  // --- MOVEMENTS (CORREGIDO para PERSISTENCIA) ---
  const addMovement = async (movement: Omit<Movement, 'id' | 'createdAt'>) => {
    try {
      // 1. Registrar el movimiento en el Backend (Persistencia)
      const response = await fetch(`${API_URL}/api/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement),
      });
      if (!response.ok) throw new Error('Error al registrar movimiento');
      
      const newMovement = await response.json();
      setMovements(prev => [...prev, newMovement]); // Actualiza estado

      // 2. Actualizar el stock en la base de datos (CRÍTICO)
      const productToUpdate = products.find(p => p.id === movement.productId);
      if (productToUpdate) {
        const newStock = movement.type === 'entry'
          ? productToUpdate.stock + movement.quantity
          : productToUpdate.stock - movement.quantity;
        
        await updateProduct(movement.productId, { stock: newStock }); // Llama a la función persistente
      }
      
    } catch (error) {
      console.error('Error al agregar movimiento:', error);
    }
  };


  // --- REQUESTS / SOLICITUDES (CORREGIDO para PERSISTENCIA) ---
  const createRequest = async (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // 1. Registrar la solicitud en el Backend (Persistencia)
      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Error al crear solicitud');

      const newRequest = await response.json();
      setRequests(prev => [...prev, newRequest]); // Actualiza estado
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
    }
  };

  // --- SUPPLIERS (PERSISTENTE) ---
  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`${API_URL}/api/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier),
      });
      
      if (!response.ok) throw new Error('Error al agregar proveedor');

      const newSupplier = await response.json(); 
      setSuppliers(prev => [...prev, newSupplier]); 
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }
  };

  // --- OTRAS FUNCIONES ---
  const updateRequest = (id: string, updates: Partial<Request>) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, isRead: true } : a)));
  };

  // --- UTILS ---

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  };

  const generateReport = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return movements.filter(m => {
      const date = new Date(m.createdAt);
      return date >= start && date <= end;
    });
  };

  const exportToExcel = () => {
    const csv = [
      ['SKU', 'Nombre', 'Categoría', 'Stock Actual', 'Precio'],
      ...products.map(p => [p.sku, p.name, p.category, p.stock, p.price]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventario.csv';
    link.click();
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        movements,
        requests,
        suppliers,
        alerts,
        addProduct,
        updateProduct,
        deleteProduct,
        addMovement,
        createRequest,
        updateRequest,
        addSupplier,
        updateSupplier,
        markAlertAsRead,
        searchProducts,
        generateReport,
        exportToExcel,
        refreshAllData, 
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};