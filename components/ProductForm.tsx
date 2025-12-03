import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    minStock: 5,
    price: 0,
    description: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        sku: initialData.sku,
        category: initialData.category,
        quantity: initialData.quantity,
        minStock: initialData.minStock,
        price: initialData.price,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minStock' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert("Veuillez remplir le nom et la catégorie pour générer une description.");
      return;
    }
    setIsGenerating(true);
    try {
      const desc = await generateProductDescription(formData.name, formData.category);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      alert("Erreur lors de la génération IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Produit</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Ex: Chaise de bureau"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Référence)</label>
          <input
            type="text"
            name="sku"
            required
            value={formData.sku}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Ex: CH-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Sélectionner...</option>
            <option value="Électronique">Électronique</option>
            <option value="Mobilier">Mobilier</option>
            <option value="Vêtements">Vêtements</option>
            <option value="Alimentation">Alimentation</option>
            <option value="Divers">Divers</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prix (€)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            required
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantité Stock</label>
          <input
            type="number"
            name="quantity"
            required
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seuil Alerte (Min)</label>
          <input
            type="number"
            name="minStock"
            required
            min="0"
            value={formData.minStock}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <button 
            type="button" 
            onClick={handleGenerateDescription}
            disabled={isGenerating || !formData.name || !formData.category}
            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Générer avec IA
          </button>
        </div>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          placeholder="Description du produit..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
        >
          {initialData ? 'Mettre à jour' : 'Ajouter Produit'}
        </button>
      </div>
    </form>
  );
};
