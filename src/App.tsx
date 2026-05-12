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
  X
} from "lucide-react";
import { useState } from "react";

const BRAND_COLOR = "#a67c7e";
const WHATSAPP_URL = "https://wa.me/5591982743820";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white">
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-brand-light/80 backdrop-blur-md border-b border-brand-primary/10"
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
          </div>

          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
          >
            Agendar Horário
          </motion.a>

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
      <section id="catalog" className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <span className="uppercase text-brand-primary font-bold tracking-widest text-xs mb-4 block">Nossa Coleção</span>
              <h2 className="font-serif text-4xl md:text-6xl uppercase leading-none tracking-tighter">Descubra sua próxima<br />memória inesquecível</h2>
            </div>
            <motion.a 
              whileHover={{ x: 5 }}
              href="https://instagram.com/dress2me_" 
              className="font-sans text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-brand-primary transition-colors border-b border-brand-dark/20 pb-1"
            >
              Ver mais no Instagram <ChevronRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl group shadow-sm bg-white"
              >
                <img 
                  src={`https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop&sig=${i}`}
                  alt={`Vestido ${i}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white font-serif text-xl mb-1">Coleção Gala</p>
                  <p className="text-white/70 text-xs uppercase tracking-widest">Disponível para aluguel</p>
                  <a href={WHATSAPP_URL} className="mt-4 bg-white text-brand-dark py-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-colors">
                    Tenho interesse
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
