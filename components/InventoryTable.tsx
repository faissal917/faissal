import React, { useState } from 'react';
import { Product } from '../types';
import { Edit2, Trash2, AlertTriangle, Package } from 'lucide-react';

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
           <Package className="w-5 h-5 text-indigo-600" /> Liste des Produits
        </h3>
        <input 
          type="text" 
          placeholder="Rechercher (Nom, SKU, Cat)..." 
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Nom Produit</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4 text-right">Prix</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">État</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                  Aucun produit trouvé.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium border border-indigo-100">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{product.price.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{product.quantity}</td>
                  <td className="px-6 py-4 text-center">
                    {product.quantity <= product.minStock ? (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium border border-red-100">
                        <AlertTriangle className="w-3 h-3" /> Bas
                      </span>
                    ) : (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium border border-emerald-100">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(product)} 
                        className="p-2 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)} 
                        className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
