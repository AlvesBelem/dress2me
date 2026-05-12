/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Instagram, 
  MapPin, 
  Phone, 
  Clock, 
  ShoppingBag, 
  Gem, 
  Star, 
  ChevronRight,
  Menu,
  X,
  LogIn,
  User,
  ArrowLeft,
  LayoutDashboard
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  where,
  limit,
  doc,
  getDoc
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import AdminDashboard from './components/Admin';

const BRAND_COLOR = "#a67c7e";
const WHATSAPP_URL = "https://wa.me/5591982743820";

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

interface Category {
  id: string;
  name: string;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'auth'>('home');
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [filteredDresses, setFilteredDresses] = useState<Dress[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is admin
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      } else {
        setIsAdmin(false);
        setCurrentPage('home');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    setIsLoading(true);
    try {
      const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      const catData = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(catData);

      const dressSnap = await getDocs(query(collection(db, 'dresses'), orderBy('createdAt', 'desc')));
      const dressData = dressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dress));
      setDresses(dressData);
      setFilteredDresses(dressData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      setFilteredDresses(dresses);
    } else {
      setFilteredDresses(dresses.filter(d => d.categoryId === catId));
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setCurrentPage('home');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error(error);
      setAuthError(error.message.includes('auth/invalid-credential') 
        ? 'E-mail ou senha incorretos.' 
        : 'Ocorreu um erro na autenticação. Tente novamente.');
    }
  };

  const logout = () => {
    signOut(auth);
    setCurrentPage('home');
  };

  const getWhatsAppMessage = (dress: Dress) => {
    return encodeURIComponent(`Olá! Vi o vestido "${dress.name}" no site e gostaria de agendar uma prova.`);
  };

  const testimonials = [
    {
      name: "Brenda Gonzalez",
      text: "De todas as lojas que já fui em Belém, a dress2me foi onde fui melhor atendida, com os melhores vestidos e preços ótimos. Super recomendo!!!",
      stars: 5
    },
    {
      name: "Carolina Mergulhão",
      text: "Atendimento personalizado .. super atenciosa! Peças de bom gosto e atuais..",
      stars: 5
    },
    {
      name: "Valéria Mendes",
      text: "A loja possui vestidos novos, preços ótimos e atendimento de qualidade. Super recomendo",
      stars: 5
    }
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative z-10 border border-gray-100"
        >
          <button 
            onClick={() => setCurrentPage('home')}
            className="absolute top-8 left-8 text-brand-dark/40 hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft />
          </button>

          <div className="text-center mb-10 pt-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white font-serif text-2xl border-4 border-white shadow-lg mx-auto mb-6">
              D
            </div>
            <h2 className="font-serif text-3xl uppercase tracking-tighter mb-2">
              {authMode === 'login' ? 'Bem-vinda de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-brand-dark/40 font-light text-sm">
              {authMode === 'login' ? 'Acesse o painel administrativo.' : 'Cadastre-se para gerenciar o catálogo.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authError && (
              <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100 text-center">
                {authError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/40 ml-2">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/40 ml-2">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {authMode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/40 hover:text-brand-primary transition-colors cursor-pointer"
            >
              {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (currentPage === 'admin' && isAdmin) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-[100] bg-white border-b px-6 h-16 flex items-center justify-between">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-dark/60 hover:text-brand-dark cursor-pointer">
            <ArrowLeft size={18} /> Voltar ao Site
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-brand-primary">{currentUser?.email}</span>
            <button onClick={logout} className="text-xs font-bold uppercase tracking-widest text-red-500 cursor-pointer">Sair</button>
          </div>
        </div>
        <AdminDashboard />
      </>
    );
  }

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white">
      {/* Dress Detail Modal */}
      {selectedDress && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-brand-dark/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-brand-light w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh]"
          >
            <button 
              onClick={() => setSelectedDress(null)}
              className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white hover:text-brand-dark transition-all cursor-pointer"
            >
              <X />
            </button>

            <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto overflow-hidden">
              <img src={selectedDress.imageUrl} className="w-full h-full object-cover"  referrerPolicy="no-referrer" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
                  {categories.find(c => c.id === selectedDress.categoryId)?.name}
                </span>
                <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-8">{selectedDress.name}</h2>
                <div className="w-20 h-1 bg-brand-primary mb-8" />
                
                <p className="text-brand-dark/60 font-light leading-relaxed text-lg mb-12">
                  {selectedDress.description || "Este modelo exclusivo foi selecionado para proporcionar elegância e sofisticação ao seu evento."}
                </p>

                <div className="flex flex-col sm:flex-row gap-12 mb-12">
                  {selectedDress.colors?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/40 mb-4">Cores Disponíveis</h4>
                      <div className="flex wrap gap-2">
                        {selectedDress.colors.map(c => (
                          <span key={c} className="px-4 py-2 bg-white rounded-lg text-xs border border-brand-primary/10">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedDress.sizes?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/40 mb-4">Tamanhos</h4>
                      <div className="flex wrap gap-2">
                        {selectedDress.sizes.map(s => (
                          <span key={s} className="px-4 py-2 bg-white rounded-lg text-xs border border-brand-primary/10">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {selectedDress.isRented ? (
                  <div className="p-6 rounded-2xl bg-red-50 text-red-600 font-bold uppercase tracking-widest text-center text-xs border border-red-100">
                    Este vestido está alugado no momento
                  </div>
                ) : (
                  <a 
                    href={`${WHATSAPP_URL}?text=${getWhatsAppMessage(selectedDress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-brand-primary text-white w-full py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform shadow-xl shadow-brand-primary/20"
                  >
                    Agendar Prova <Phone size={18} />
                  </a>
                )}
                <p className="text-center text-[10px] uppercase tracking-widest text-brand-dark/30">Bolsa e brinco inclusos no aluguel</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-brand-light/80 backdrop-blur-md border-b border-brand-primary/10"
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-serif text-xl border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-500">
              D
            </div>
            <span className="font-serif text-2xl tracking-tighter text-brand-dark uppercase">Dress2me</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium uppercase tracking-widest text-brand-dark/70">
            {['Início', 'A Loja', 'Vestidos', 'Contato'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="hover:text-brand-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-brand-primary hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
            {isAdmin && (
              <button 
                onClick={() => setCurrentPage('admin')}
                className="text-brand-primary font-bold hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <User size={16} /> Admin
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!currentUser ? (
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setCurrentPage('auth');
                }}
                className="p-2 text-brand-dark/50 hover:text-brand-primary transition-all flex items-center gap-2 group cursor-pointer"
                title="Acesso Administrativo"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Acesso</span>
                <LogIn size={20} />
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {isAdmin && currentPage !== 'admin' && (
                  <button 
                    onClick={() => setCurrentPage('admin')}
                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-full transition-all cursor-pointer"
                  >
                    <LayoutDashboard size={20} />
                  </button>
                )}
                <button onClick={logout} className="text-[10px] uppercase tracking-widest font-bold text-red-500/50 hover:text-red-500 cursor-pointer">Sair</button>
              </div>
            )}
            <motion.a 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
            >
              Agendar Horário
            </motion.a>
          </div>

          <button 
            className="md:hidden p-2 text-brand-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-brand-light border-b border-brand-primary/10 p-6 flex flex-col gap-4 font-sans uppercase text-sm tracking-widest text-brand-dark/70 shadow-xl overflow-hidden"
          >
            <a href="#hero" onClick={() => setIsMenuOpen(false)}>Início</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>A Loja</a>
            <a href="#catalog" onClick={() => setIsMenuOpen(false)}>Vestidos</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contato</a>
            <a 
              href={WHATSAPP_URL}
              className="bg-brand-primary text-white p-4 rounded-xl text-center font-bold mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              WhatsApp
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop"
            alt="Dress Highlight"
            className="w-full h-full object-cover grayscale-[0.2] brightness-50"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white pt-16 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif italic text-xl md:text-2xl mb-4 text-brand-primary font-medium tracking-wide"
            >
              Desde 2017 criando memórias
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter mb-8 font-light uppercase"
            >
              Vestidos que contam<br />sua história
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/80 font-light leading-relaxed"
            >
              Aluguel de vestidos de festa de alta costura em Belém. Elegância, sofisticação e atendimento personalizado.
            </motion.p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#catalog"
                className="w-full sm:w-auto bg-white text-brand-dark px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-xl"
              >
                Ver Catálogo
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Falar com Consultora
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Floating scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>
      </section>

      {/* Featured Benefits */}
      <section className="py-20 bg-white relative overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              { icon: ShoppingBag, title: "Curadoria Exclusiva", text: "Vestidos selecionados a dedo para garantir que você brilhe em qualquer ocasião especial." },
              { icon: Gem, title: "Acessórios Inclusos", text: "Facilitamos sua vida: o aluguel do seu vestido já inclui a bolsa e os brincos perfeitos." },
              { icon: Instagram, title: "Atendimento VIP", text: "Consultoria personalizada para encontrar o modelo que melhor valoriza sua beleza." }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                  <benefit.icon className="w-6 h-6 outline-none" />
                </div>
                <h3 className="font-serif text-2xl mb-3 uppercase tracking-tight"> {benefit.title} </h3>
                <p className="text-brand-dark/60 leading-relaxed font-light"> {benefit.text} </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Catalog Gallery */}
      <section id="vestidos" className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <span className="uppercase text-brand-primary font-bold tracking-widest text-xs mb-4 block">Nosso Catálogo</span>
              <h2 className="font-serif text-4xl md:text-6xl uppercase leading-none tracking-tighter">Descubra sua próxima<br />memória inesquecível</h2>
            </div>
            <div className="flex items-center gap-4 border-b border-brand-dark/20 pb-4 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => handleCategoryChange('all')}
                className={`text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-colors cursor-pointer ${activeCategory === 'all' ? 'text-brand-primary' : 'text-brand-dark/40 hover:text-brand-dark'}`}
              >
                Tudo
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-colors cursor-pointer ${activeCategory === cat.id ? 'text-brand-primary' : 'text-brand-dark/40 hover:text-brand-dark'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredDresses.map((dress) => (
              <motion.div 
                key={dress.id}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedDress(dress)}
                className="relative aspect-[3/4] overflow-hidden rounded-[2rem] group shadow-sm bg-white cursor-pointer"
              >
                <img 
                  src={dress.imageUrl}
                  alt={dress.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {dress.isRented && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Alugado
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] mb-1">
                    {categories.find(c => c.id === dress.categoryId)?.name}
                  </span>
                  <p className="text-white font-serif text-xl mb-4">{dress.name}</p>
                  <button className="bg-white text-brand-dark py-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all">
                    Ver Detalhes
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {filteredDresses.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <p className="text-brand-dark/40 font-light italic">Nenhum vestido encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl uppercase tracking-tighter mb-4">O que nossas clientes dizem</h2>
            <div className="w-20 h-1 bg-brand-primary mx-auto" />
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp}
                className="p-8 border border-brand-primary/10 rounded-3xl bg-brand-light/20 flex flex-col justify-between hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-brand-primary text-brand-primary" />
                    ))}
                  </div>
                  <p className="text-brand-dark/80 italic font-medium leading-relaxed mb-8">"{t.text}"</p>
                </div>
                <p className="font-serif text-lg font-bold uppercase tracking-wide">— {t.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-15deg] translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="font-serif text-4xl md:text-6xl uppercase leading-[0.9] tracking-tighter mb-6">
              Pronta para seu próximo<br />grande momento?
            </h2>
            <p className="text-white/80 text-lg font-light mb-8 max-w-lg">
              Agende uma visita e deixe nossa equipe de consultoras encontrar o vestido perfeito para você.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a 
              href={WHATSAPP_URL}
              className="bg-white text-brand-primary px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform shadow-2xl"
            >
              Falar pelo WhatsApp
            </a>
            <p className="text-center text-xs uppercase tracking-widest text-white/60">Atendimento especializado e exclusivo</p>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-24 bg-brand-light/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <span className="uppercase text-brand-primary font-bold tracking-widest text-xs mb-4 block">Onde estamos</span>
                <h2 className="font-serif text-4xl md:text-5xl uppercase tracking-tighter mb-6">Visite nosso Atelier</h2>
                <p className="text-brand-dark/70 font-light leading-relaxed text-lg">
                  Estamos localizados em uma das áreas mais charmosas de Belém. Venha nos visitar e experimentar nossa coleção completa em um ambiente acolhedor e sofisticado.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-primary/5">
                    <MapPin className="text-brand-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Endereço</h4>
                    <p className="text-brand-dark/60 font-light">Rua Arcipreste Manoel Teodoro, 434. Sala 01.<br />Batista Campos, Belém - PA</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-brand-primary/5">
                    <Clock className="text-brand-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Funcionamento</h4>
                    <p className="text-brand-dark/60 font-light">Segunda a Sexta: 09h às 18h<br />Sábados sob agendamento</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://www.google.com/maps/place/Dress2Me/@-1.4592761,-48.5116253,15z/data=!4m10!1m2!2m1!1slojas+de+aluguel+de+roupas!3m6!1s0x92a48eeccb50e417:0x4ff4aeb4640d2017!8m2!3d-1.4592761!4d-48.4936009!15sChpsb2phcyBkZSBhbHVndWVsIGRlIHJvdXBhc1ocIhpsb2phcyBkZSBhbHVndWVsIGRlIHJvdXBhc5IBDmNsb3RoaW5nX3N0b3Jl4AEA!16s%2Fg%2F11gbq7c5lv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 group text-brand-primary font-bold uppercase tracking-widest text-xs border-b-2 border-brand-primary pb-1 hover:gap-4 transition-all"
              >
                Abrir no Google Maps <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white lg:rotate-2 group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5833!2d-48.4961758!3d-1.4592761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48eeccb50e417%3A0x4ff4aeb4640d2017!2sDress2Me!5e0!3m2!1spt-BR!2sbr!4v1715520000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-brand-dark text-white py-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20 border-b border-white/10 pb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-serif text-lg border border-white/20">
                  D
                </div>
                <span className="font-serif text-3xl tracking-tighter uppercase font-light">Dress2me</span>
              </div>
              <p className="text-white/50 max-w-sm font-light leading-relaxed mb-8">
                Desde 2017, transformando o aluguel de vestidos em uma experiência de pura elegância e praticidade. Localizados no coração de Belém.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/dress2me_" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all">
                  <Instagram size={18} />
                </a>
                <a href={WHATSAPP_URL} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all">
                  <Phone size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-brand-primary mb-8">Localização</h4>
              <ul className="flex flex-col gap-6 text-white/70 font-light">
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-brand-primary" />
                  <span>Rua Arcipreste Manoel Teodoro, 434.<br />Sala 01 - Batista Campos,<br />Belém - PA, 66023-700</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-brand-primary mb-8">Horários</h4>
              <ul className="flex flex-col gap-6 text-white/70 font-light">
                <li className="flex gap-3">
                  <Clock className="w-5 h-5 shrink-0 text-brand-primary" />
                  <div>
                    <p>Segunda - Sexta: 09h às 18h</p>
                    <p>Sábado: Consultar horários</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-[10px] uppercase tracking-[0.3em]">
            <p>© 2024 Dress2me Belém. Todos os direitos reservados.</p>
            <p>Feito com elegância.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
