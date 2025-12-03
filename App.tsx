import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Plus, 
  Boxes, 
  AlertOctagon, 
  TrendingUp, 
  BrainCircuit,
  Settings,
  Search,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product, ViewState, ToastType } from './types';
import { StatsCard } from './components/StatsCard';
import { InventoryTable } from './components/InventoryTable';
import { Modal } from './components/Modal';
import { ProductForm } from './components/ProductForm';
import { analyzeStockHealth } from './services/geminiService';
import Markdown from 'react-markdown';

// MOCK DATA
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Ordinateur Portable Pro', sku: 'LAP-001', category: 'Électronique', quantity: 12, minStock: 5, price: 1200, description: 'PC portable haute performance.', lastUpdated: '2023-10-25' },
  { id: '2', name: 'Chaise Ergonomique', sku: 'FUR-002', category: 'Mobilier', quantity: 3, minStock: 10, price: 250, description: 'Confort optimal.', lastUpdated: '2023-10-26' },
  { id: '3', name: 'Casque Audio Sans Fil', sku: 'AUD-005', category: 'Électronique', quantity: 45, minStock: 8, price: 89, description: 'Son pur.', lastUpdated: '2023-10-24' },
  { id: '4', name: 'Bureau Assis-Debout', sku: 'FUR-008', category: 'Mobilier', quantity: 8, minStock: 2, price: 450, description: 'Bureau ajustable.', lastUpdated: '2023-10-20' },
  { id: '5', name: 'Moniteur 4K', sku: 'MON-022', category: 'Électronique', quantity: 2, minStock: 4, price: 340, description: 'Écran ultra HD.', lastUpdated: '2023-10-27' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Derived Statistics
  const stats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;
    
    // Group by category for chart
    const catMap = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryDistribution = Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key]
    }));

    return { totalValue, totalItems: products.length, lowStockCount, categoryDistribution };
  }, [products]);

  // Handlers
  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (data: Omit<Product, 'id' | 'lastUpdated'>) => {
    if (editingProduct) {
      // Update
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...data, id: p.id, lastUpdated: new Date().toISOString().split('T')[0] } 
          : p
      ));
    } else {
      // Create
      const newProduct: Product = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setIsModalOpen(false);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult('');
    try {
      const result = await analyzeStockHealth(products);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisResult("Erreur lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 transition-all duration-300 md:relative">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Gestion Stock Pro</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </button>
          <button 
            onClick={() => setView('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${view === 'inventory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package className="w-5 h-5" />
            Inventaire
          </button>
          <button 
            onClick={() => setView('analysis')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${view === 'analysis' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BrainCircuit className="w-5 h-5" />
            Analyse IA
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 text-xs">
            <Settings className="w-4 h-4" />
            <span>v1.0.0 • React + Gemini</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto ml-0 md:ml-0 w-full">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {view === 'dashboard' ? 'Tableau de bord' : view === 'inventory' ? 'Gestion Inventaire' : 'Intelligence Artificielle'}
          </h2>
          
          <div className="flex items-center gap-4">
             {view === 'inventory' && (
                <button 
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Nouveau Produit
                </button>
             )}
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard 
                  title="Valeur Totale" 
                  value={`${stats.totalValue.toLocaleString('fr-FR')} €`} 
                  icon={TrendingUp} 
                  trend="+2.5% vs mois dernier"
                />
                <StatsCard 
                  title="Total Produits" 
                  value={stats.totalItems} 
                  icon={Package} 
                />
                <StatsCard 
                  title="Stock Critique" 
                  value={stats.lowStockCount} 
                  icon={AlertOctagon} 
                  colorClass={stats.lowStockCount > 0 ? "bg-red-50 border-red-100" : "bg-white"}
                  trend={stats.lowStockCount > 0 ? "Attention requise" : "Tout est normal"}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-6 text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" /> Distribution du Stock par Catégorie
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categoryDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f1f5f9'}}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {stats.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#0ea5e9'][index % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY VIEW */}
          {view === 'inventory' && (
            <div className="h-[calc(100vh-140px)]">
              <InventoryTable 
                products={products} 
                onEdit={handleEditProduct} 
                onDelete={handleDeleteProduct}
              />
            </div>
          )}

          {/* ANALYSIS VIEW */}
          {view === 'analysis' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-700 rounded-full opacity-50 blur-xl"></div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" /> Expert IA
                  </h3>
                  <p className="text-indigo-200 text-sm mb-6">
                    Utilisez la puissance de Gemini pour analyser vos niveaux de stock, identifier les goulots d'étranglement et obtenir des recommandations d'achat.
                  </p>
                  <button 
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <><div className="w-4 h-4 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div> Analyse en cours...</>
                    ) : (
                      'Lancer l\'analyse du Stock'
                    )}
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="font-semibold mb-4 text-slate-800">Métriques Analysées</h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Taux de rotation (Estimé)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Valeur immobilisée
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Risques de rupture
                    </li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                  {analysisResult ? (
                    <div className="prose prose-indigo max-w-none">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Rapport d'Analyse</h3>
                      <Markdown>{analysisResult}</Markdown>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-16 h-16 mb-4 opacity-20" />
                      <p>Aucune analyse effectuée pour le moment.</p>
                      <p className="text-sm mt-2">Cliquez sur "Lancer l'analyse" pour commencer.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? "Modifier Produit" : "Ajouter Produit"}
      >
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleSaveProduct} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

    </div>
  );
};

export default App;