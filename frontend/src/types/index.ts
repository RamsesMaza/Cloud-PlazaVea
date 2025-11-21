export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplierId: string;
  unit: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  ruc: string;
  isActive: boolean;
  createdAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  type: 'entry' | 'exit';
  quantity: number;
  reason: string;
  reference: string;
  userId: string;
  createdAt: string;
  cost?: number;
}

export interface Request {
  id: string;
  productId: string;
  requestedBy: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring';
  productId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
}