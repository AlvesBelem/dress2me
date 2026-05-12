import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Image as ImageIcon, 
  Check, 
  X,
  ChevronLeft,
  LayoutDashboard,
  Tags,
  PlusCircle
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';

interface Category {
  id: string;
  name: string;
}

interface Dress {
  id: string;
  name: string;
  categoryId: string;
  imageUrl: string;
  colors: string[];
  sizes: string[];
  description: string;
  isRented: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dresses' | 'categories'>('dresses');
  const [categories, setCategories] = useState<Category[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [showDressForm, setShowDressForm] = useState(false);
  const [editingDress, setEditingDress] = useState<Dress | null>(null);
  const [dressForm, setDressForm] = useState<Partial<Dress>>({
    name: '',
    categoryId: '',
    imageUrl: '',
    colors: [],
    sizes: [],
    description: '',
    isRented: false
  });

  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      const catData = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(catData);

      const dressSnap = await getDocs(query(collection(db, 'dresses'), orderBy('createdAt', 'desc')));
      const dressData = dressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dress));
      setDresses(dressData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await addDoc(collection(db, 'categories'), { name: newCategoryName });
      setNewCategoryName('');
      setShowCategoryForm(false);
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? As roupas nela continuarão existindo.')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const handleSaveDress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...dressForm,
        createdAt: editingDress ? undefined : serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingDress) {
        await updateDoc(doc(db, 'dresses', editingDress.id), data);
      } else {
        await addDoc(collection(db, 'dresses'), data);
      }

      setShowDressForm(false);
      setEditingDress(null);
      setDressForm({
        name: '',
        categoryId: '',
        imageUrl: '',
        colors: [],
        sizes: [],
        description: '',
        isRented: false
      });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, editingDress ? OperationType.UPDATE : OperationType.CREATE, 'dresses');
    }
  };

  const handleDeleteDress = async (id: string) => {
    if (!confirm('Excluir este vestido permanentemente?')) return;
    try {
      await deleteDoc(doc(db, 'dresses', id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `dresses/${id}`);
    }
  };

  const addTag = (type: 'colors' | 'sizes', value: string) => {
    if (!value.trim()) return;
    const current = dressForm[type] || [];
    if (!current.includes(value)) {
      setDressForm({ ...dressForm, [type]: [...current, value] });
    }
    if (type === 'colors') setColorInput('');
    else setSizeInput('');
  };

  const removeTag = (type: 'colors' | 'sizes', value: string) => {
    const current = dressForm[type] || [];
    setDressForm({ ...dressForm, [type]: current.filter(v => v !== value) });
  };

  if (isLoading) return <div className="p-20 text-center">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="font-serif text-4xl uppercase tracking-tighter text-brand-dark mb-2">Painel Administrativo</h1>
            <p className="text-brand-dark/50 font-light">Gerencie seu catálogo de vestidos e categorias.</p>
          </div>
          
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('dresses')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'dresses' ? 'bg-brand-primary text-white' : 'text-brand-dark/50 hover:text-brand-dark'}`}
            >
              <LayoutDashboard size={18} /> Vestidos
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'categories' ? 'bg-brand-primary text-white' : 'text-brand-dark/50 hover:text-brand-dark'}`}
            >
              <Tags size={18} /> Categorias
            </button>
          </div>
        </div>

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
              >
                <Plus size={18} /> Nova Categoria
              </button>
            </div>

            {showCategoryForm && (
              <motion.form 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddCategory}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4"
              >
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nome da categoria (ex: Debutantes, Madrinhas)"
                  className="flex-1 bg-gray-50 border-0 rounded-xl px-6 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  autoFocus
                />
                <button type="submit" className="bg-brand-primary text-white px-8 rounded-xl font-bold uppercase text-xs cursor-pointer">Salvar</button>
                <button type="button" onClick={() => setShowCategoryForm(false)} className="text-gray-400 px-4 cursor-pointer">Cancelar</button>
              </motion.form>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-brand-primary/30 transition-all">
                  <span className="font-serif text-xl text-brand-dark">{cat.name}</span>
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dresses' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingDress(null);
                  setDressForm({ name: '', categoryId: '', imageUrl: '', colors: [], sizes: [], description: '', isRented: false });
                  setShowDressForm(true);
                }}
                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
              >
                <PlusCircle size={18} /> Adicionar Vestido
              </button>
            </div>

            {showDressForm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[100] bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <motion.form 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  onSubmit={handleSaveDress}
                  className="bg-white w-full max-w-4xl p-8 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-3xl uppercase tracking-tighter">
                      {editingDress ? 'Editar Vestido' : 'Novo Vestido'}
                    </h2>
                    <button type="button" onClick={() => setShowDressForm(false)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                      <X />
                    </button>
                  </div>

                  <div className="overflow-y-auto pr-2 flex-1 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-dark/40">Informações Básicas</label>
                        <input 
                          type="text" 
                          placeholder="Nome do Vestido"
                          value={dressForm.name}
                          onChange={e => setDressForm({...dressForm, name: e.target.value})}
                          className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                          required
                        />
                        <select 
                          value={dressForm.categoryId}
                          onChange={e => setDressForm({...dressForm, categoryId: e.target.value})}
                          className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                          required
                        >
                          <option value="">Selecionar Categoria</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <textarea 
                          placeholder="Descrição detalhada do vestido"
                          value={dressForm.description}
                          onChange={e => setDressForm({...dressForm, description: e.target.value})}
                          className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-primary/20 transition-all h-32"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-dark/40">Visual e Status</label>
                        <div className="relative">
                          <input 
                            type="url" 
                            placeholder="URL da Imagem"
                            value={dressForm.imageUrl}
                            onChange={e => setDressForm({...dressForm, imageUrl: e.target.value})}
                            className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-primary/20 transition-all pl-12"
                            required
                          />
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                        
                        {dressForm.imageUrl && (
                          <div className="aspect-[3/4] w-32 rounded-2xl overflow-hidden bg-gray-100 mx-auto border-4 border-white shadow-lg">
                            <img src={dressForm.imageUrl} className="w-full h-full object-cover"  referrerPolicy="no-referrer" />
                          </div>
                        )}

                        <div 
                          onClick={() => setDressForm({...dressForm, isRented: !dressForm.isRented})}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${dressForm.isRented ? 'border-red-100 bg-red-50 text-red-600' : 'border-green-100 bg-green-50 text-green-600'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dressForm.isRented ? 'bg-red-200' : 'bg-green-200'}`}>
                            {dressForm.isRented ? <X size={20}/> : <Check size={20}/>}
                          </div>
                          <div>
                            <p className="font-bold text-xs uppercase tracking-widest">Status de Aluguel</p>
                            <p className="text-sm font-light">{dressForm.isRented ? 'Vestido está alugado' : 'Disponível para aluguel'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-dark/40">Cores Disponíveis</label>
                        <div className="flex gap-2 mb-4">
                          <input 
                            type="text" 
                            placeholder="Adicionar cor"
                            value={colorInput}
                            onChange={e => setColorInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('colors', colorInput))}
                            className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm"
                          />
                          <button type="button" onClick={() => addTag('colors', colorInput)} className="bg-brand-dark text-white px-4 rounded-xl text-xs uppercase font-bold cursor-pointer">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dressForm.colors?.map(c => (
                            <span key={c} className="bg-white border border-gray-100 px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                              {c} <button type="button" onClick={() => removeTag('colors', c)} className="cursor-pointer"><X size={12} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-dark/40">Tamanhos Disponíveis</label>
                        <div className="flex gap-2 mb-4">
                          <input 
                            type="text" 
                            placeholder="Adicionar tamanho (ex: 38, P, G)"
                            value={sizeInput}
                            onChange={e => setSizeInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('sizes', sizeInput))}
                            className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm"
                          />
                          <button type="button" onClick={() => addTag('sizes', sizeInput)} className="bg-brand-dark text-white px-4 rounded-xl text-xs uppercase font-bold cursor-pointer">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dressForm.sizes?.map(s => (
                            <span key={s} className="bg-white border border-gray-100 px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                              {s} <button type="button" onClick={() => removeTag('sizes', s)} className="cursor-pointer"><X size={12} /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t flex justify-end gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowDressForm(false)}
                      className="px-8 py-3 rounded-xl font-bold uppercase text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      Descartar
                    </button>
                    <button 
                      type="submit"
                      className="bg-brand-primary text-white px-12 py-3 rounded-xl font-bold uppercase text-xs tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all cursor-pointer"
                    >
                      {editingDress ? 'Atualizar Vestido' : 'Publicar no Catálogo'}
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {dresses.map(dress => (
                <div key={dress.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group hover:border-brand-primary/30 transition-all flex flex-col">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img src={dress.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"  referrerPolicy="no-referrer" />
                    {dress.isRented && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Alugado
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary block mb-1">
                        {categories.find(c => c.id === dress.categoryId)?.name || 'Sem Categoria'}
                      </span>
                      <h3 className="font-serif text-lg leading-tight mb-2">{dress.name}</h3>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={() => {
                          setEditingDress(dress);
                          setDressForm(dress);
                          setShowDressForm(true);
                        }}
                        className="flex-1 bg-gray-50 text-gray-400 hover:bg-brand-primary/10 hover:text-brand-primary p-3 rounded-xl transition-all cursor-pointer"
                      >
                        <Edit size={18} className="mx-auto" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDress(dress.id)}
                        className="flex-1 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 p-3 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 size={18} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
