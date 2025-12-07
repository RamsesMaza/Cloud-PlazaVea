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

  deleteSupplier: (id: string) => Promise<void>;

  addMovement: (movement: Omit<Movement, 'id' | 'createdAt'>) => Promise<void>;
  createRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => void;

  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;

  markAlertAsRead: (id: string) => void;

  searchProducts: (query?: string) => Product[];
  generateReport: (startDate: string, endDate: string) => Movement[];
  exportToExcel: () => void;
  refreshAllData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // ================= FETCH =================

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/suppliers`);
      if (!res.ok) throw new Error();
      setSuppliers(await res.json());
    } catch (e) {
      console.error('Error fetch suppliers', e);
    }
  }, [API_URL]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error();
      const raw: any[] = await res.json();

      const safe: Product[] = raw.map(p => ({
        ...p,
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0
      }));

      setProducts(safe);
    } catch (e) {
      console.error('Error fetch products', e);
    }
  }, [API_URL]);

  const fetchMovements = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/movements`);
      if (!res.ok) throw new Error();
      setMovements(await res.json());
    } catch (e) {
      console.error('Error fetch movements', e);
    }
  }, [API_URL]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/requests`);
      if (!res.ok) throw new Error();
      setRequests(await res.json());
    } catch (e) {
      console.error('Error fetch requests', e);
    }
  }, [API_URL]);

  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchProducts(),
      fetchSuppliers(),
      fetchMovements(),
      fetchRequests()
    ]);
  }, [fetchProducts, fetchSuppliers, fetchMovements, fetchRequests]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // ================== PRODUCTS ==================

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(p => [...p, data]);
    } catch (e) {
      console.error('Error add product', e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(p => p.map(x => x.id === id ? data : x));
    } catch (e) {
      console.error('Error update product', e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(p => p.filter(x => x.id !== id));
    } catch (e) {
      console.error('Error delete product', e);
    }
  };

  // ✅ DELETE SUPPLIER CORRECTO
    const deleteSupplier = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
        method: 'DELETE'
        });

        if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
        }

        setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('No se pudo eliminar el proveedor');
    }
    };


  // ================== MOVEMENTS ==================

  const addMovement = async (movement: Omit<Movement, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch(`${API_URL}/api/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement)
      });

      if (!res.ok) throw new Error();
      const newMov = await res.json();
      setMovements(m => [...m, newMov]);

      const prod = products.find(p => p.id === movement.productId);
      if (prod) {
        const newStock =
          movement.type === 'entry'
            ? prod.stock + movement.quantity
            : prod.stock - movement.quantity;
        await updateProduct(movement.productId, { stock: newStock });
      }
    } catch (e) {
      console.error('Error movement', e);
    }
  };

  // ================= REQUESTS =================

  const createRequest = async (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const data = await res.json();
      setRequests(r => [...r, data]);
    } catch (e) {
      console.error('Error create request', e);
    }
  };

  const updateRequest = (id: string, updates: Partial<Request>) => {
    setRequests(r =>
      r.map(x => (x.id === id ? { ...x, ...updates, updatedAt: new Date().toISOString() } : x))
    );
  };

  // ================== SUPPLIERS ==================

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch(`${API_URL}/api/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      const data = await res.json();
      setSuppliers(s => [...s, data]);
    } catch (e) {
      console.error('Error add supplier', e);
    }
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(s => s.map(x => (x.id === id ? { ...x, ...updates } : x)));
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(a => a.map(x => (x.id === id ? { ...x, isRead: true } : x)));
  };

  // =================== UTILS ===================

  const searchProducts = (query?: string) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return products;

    return products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  };

  const generateReport = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);

    return movements.filter(m => {
      const d = new Date(m.createdAt);
      return d >= s && d <= e;
    });
  };

  const exportToExcel = () => {
    const csv = [
      ['SKU', 'Nombre', 'Categoría', 'Stock', 'Precio'],
      ...products.map(p => [p.sku, p.name, p.category, p.stock, String(p.price)])
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
        deleteSupplier,
        addMovement,
        createRequest,
        updateRequest,
        addSupplier,
        updateSupplier,
        markAlertAsRead,
        searchProducts,
        generateReport,
        exportToExcel,
        refreshAllData
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
