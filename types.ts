export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  description: string;
  lastUpdated: string;
}

export interface DashboardStats {
  totalValue: number;
  totalItems: number;
  lowStockCount: number;
  categoryDistribution: { name: string; value: number }[];
}

export type ViewState = 'dashboard' | 'inventory' | 'analysis';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
