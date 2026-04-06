import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, Mic, Headphones, Activity, Music, Power } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef(null);
  const scrollVideoRef = useRef(null);
  const scrollVideoSectionRef = useRef(null);

  useEffect(() => {
    // Força a página a iniciar no topo antes de qualquer animação do GSAP
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Navbar scroll effect
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '.navbar' }
      });

      // Hero Animation
      gsap.fromTo('.hero-text', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power3.out' }
      );

      // Features Animation
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.features-section', start: 'top 70%' }
        }
      );

      // Philosophy Animation
      gsap.fromTo('.philosophy-text',
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.philosophy-section', start: 'top 60%' }
        }
      );

      // Scroll-controlled video
      const video = scrollVideoRef.current;
      const section = scrollVideoSectionRef.current;
      
      if (video && section) {
        const setupVideoScroll = () => {
          ctx.add(() => {
            video.pause();
            try {
              video.currentTime = 0;
            } catch (e) {
              console.warn("Video currentTime set failed", e);
            }

            const duration = video.duration || 8;
            const scrollLength = window.innerHeight * 5;

            ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              end: `+=${scrollLength}`,
              pin: true,
              scrub: 0.1,
              onUpdate: (self) => {
                const targetTime = self.progress * duration;
                if (Math.abs(video.currentTime - targetTime) > 0.05) {
                  try {
                    video.currentTime = targetTime;
                  } catch {
                    // ignore
                  }
                }
              },
            });
          });
        };

        if (video.readyState >= 1) {
          setupVideoScroll();
        } else {
          video.addEventListener('loadedmetadata', setupVideoScroll);
        }
      }

      // Parallax on the divider image
      gsap.to('.parallax-img', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Bento gallery stagger
      gsap.fromTo('.bento-item',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.bento-gallery', start: 'top 75%' }
        }
      );

      // Protocol Stacking
      const cards = gsap.utils.toArray('.protocol-card');
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          ScrollTrigger.create({
            trigger: cards[i + 1],
            start: 'top 40%',
            end: 'top 10%',
            scrub: true,
            animation: gsap.to(card, { 
              scale: 0.9, 
              opacity: 0.5, 
              filter: 'blur(10px)', 
              ease: 'none' 
            })
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-background font-sans text-dark">
      {/* Noise Overlay */}
      <svg className="noise-overlay pointer-events-none fixed inset-0 w-full h-full z-50 opacity-5">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>

      {/* A. NAVBAR */}
      <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-8 py-4 rounded-[2rem] w-[90%] max-w-5xl transition-all duration-500 bg-transparent text-white [&.scrolled]:bg-background/80 [&.scrolled]:backdrop-blur-xl [&.scrolled]:text-primary [&.scrolled]:shadow-sm [&.scrolled]:border [&.scrolled]:border-dark/10">
        <div className="font-bold text-xl tracking-tight">ROLAND GO:KEYS 5</div>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#features" className="hover:-translate-y-[1px] transition-transform">Funcionalidades</a>
          <a href="#design" className="hover:-translate-y-[1px] transition-transform">Design</a>
          <a href="#specs" className="hover:-translate-y-[1px] transition-transform">Especificações</a>
          <a href="#accessories" className="hover:-translate-y-[1px] transition-transform">Acessórios</a>
        </div>
        <a href="https://store.roland.com.br/" target="_blank" rel="noopener noreferrer" className="magnetic-btn bg-accent text-white px-6 py-2 rounded-full text-sm font-bold inline-block">
          Onde Comprar
        </a>
      </nav>

      {/* B. HERO SECTION */}
      <section 
        ref={scrollVideoSectionRef}
        className="relative h-[100dvh] flex flex-col justify-end p-8 md:p-16 overflow-hidden bg-primary"
      >
        <div className="absolute inset-0 z-0">
          <video
            ref={scrollVideoRef}
            src="/frame-piano-scroll.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
          />
          {/* Gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl text-white">
          <h1 className="flex flex-col gap-2">
            <span className="hero-text font-sans font-bold text-4xl md:text-6xl tracking-tight">O TECLADO DE CRIAÇÃO MUSICAL ENCONTRA A</span>
            <span className="hero-text font-drama italic text-6xl md:text-9xl text-accent">Inspiração.</span>
          </h1>
          <p className="hero-text mt-8 text-lg md:text-xl max-w-xl text-white/80 font-mono">
            Desperte o músico dentro de você. Uma transição simples de fã para criador ativo.
          </p>
          <div className="hero-text mt-10">
            <a href="https://store.roland.com.br/" target="_blank" rel="noopener noreferrer" className="magnetic-btn bg-accent text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-3">
              Onde Comprar <ArrowRight size={20} />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 text-right text-white z-10 hidden md:block">
          <p className="font-mono text-xs tracking-[0.3em] text-white/50 uppercase mb-3">Role para explorar</p>
          <div className="w-px h-16 bg-white/20 ml-auto" />
        </div>
      </section>

      {/* C. FEATURES */}
      <section id="features" className="features-section py-32 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Diagnostic Shuffler */}
          <div className="feature-card bg-white p-8 rounded-[2.5rem] shadow-xl border border-dark/5 relative overflow-hidden h-96 flex flex-col">
            <div className="mb-auto">
              <h3 className="font-bold text-2xl text-primary mb-2">Sons Inspiradores</h3>
              <p className="text-dark/70 text-sm">Mais de 1000 sons da histórica biblioteca da Roland para motivar sua criatividade.</p>
            </div>
            <div className="relative h-32 w-full flex items-center justify-center">
              <div className="absolute w-full bg-background p-4 rounded-2xl border border-dark/10 shadow-sm flex items-center gap-4 z-30 transform -translate-y-4">
                <Music className="text-accent" />
                <span className="font-mono text-sm font-bold">Pianos Acústicos</span>
              </div>
              <div className="absolute w-full bg-background p-4 rounded-2xl border border-dark/10 shadow-sm flex items-center gap-4 z-20 scale-95 opacity-70 transform translate-y-4">
                <Activity className="text-accent" />
                <span className="font-mono text-sm font-bold">Sintetizadores Modernos</span>
              </div>
              <div className="absolute w-full bg-background p-4 rounded-2xl border border-dark/10 shadow-sm flex items-center gap-4 z-10 scale-90 opacity-40 transform translate-y-12">
                <Mic className="text-accent" />
                <span className="font-mono text-sm font-bold">Instrumentos Orquestrais</span>
              </div>
            </div>
          </div>

          {/* Card 2: Telemetry Typewriter */}
          <div className="feature-card bg-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden h-96 flex flex-col">
            <div className="mb-auto">
              <h3 className="font-bold text-2xl mb-2">Magia Melódica</h3>
              <p className="text-white/70 text-sm">Progressões de acordes prontas e acompanhamentos dinâmicos.</p>
            </div>
            <div className="bg-dark/50 p-6 rounded-2xl font-mono text-xs text-accent mt-8 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[10px] text-white/50">LIVE FEED</span>
              </div>
              <p className="mt-4 opacity-80">&gt; Carregando acordes...</p>
              <p className="opacity-80">&gt; Sincronizando banda virtual...</p>
              <p className="text-white font-bold mt-2">Pronto para tocar.</p>
            </div>
          </div>

          {/* Card 3: Cursor Protocol Scheduler */}
          <div className="feature-card bg-white p-8 rounded-[2.5rem] shadow-xl border border-dark/5 relative overflow-hidden h-96 flex flex-col">
            <div className="mb-auto">
              <h3 className="font-bold text-2xl text-primary mb-2">Companheiro Compacto</h3>
              <p className="text-dark/70 text-sm">Design portátil, alto-falantes estéreo e funcionamento a pilhas.</p>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-xl flex items-center justify-center ${i === 3 ? 'bg-accent text-white' : 'bg-background text-dark/30'}`}>
                  {i === 3 ? <Power size={16} /> : <div className="w-1 h-1 rounded-full bg-current"></div>}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center bg-background p-3 rounded-xl">
              <span className="font-mono text-xs font-bold text-dark/50">STATUS</span>
              <span className="font-mono text-xs font-bold text-accent">ON-THE-GO</span>
            </div>
          </div>

        </div>
      </section>

      {/* C.6 DESIGN SHOWCASE */}
      <section id="design" className="py-32 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-primary mb-4">Design Premium</h2>
          <p className="text-lg text-dark/70 font-mono">Disponível em duas cores elegantes. Feito para se destacar.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Black Model */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-dark/5 flex flex-col items-center group">
            <div className="w-full h-64 flex items-center justify-center mb-8 relative">
              <img 
                src="/piano-black.jpg" 
                alt="Roland GO:KEYS 5 Black" 
                className="w-full h-auto object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
              />
            </div>
            <h3 className="font-bold text-2xl text-primary mb-2">Graphite Black</h3>
            <p className="text-dark/50 text-sm font-mono mb-8">Elegância atemporal e discrição.</p>
            <div className="w-full mt-auto">
              <p className="text-xs font-bold text-dark/40 mb-2 uppercase tracking-widest">Painel Traseiro</p>
              <img 
                src="/piano-back-black.jpg" 
                alt="Conexões Black" 
                className="w-full h-auto object-contain opacity-80"
              />
            </div>
          </div>

          {/* White Model */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-dark/5 flex flex-col items-center group">
            <div className="w-full h-64 flex items-center justify-center mb-8 relative">
              <img 
                src="/piano-white.jpg" 
                alt="Roland GO:KEYS 5 White" 
                className="w-full h-auto object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
              />
            </div>
            <h3 className="font-bold text-2xl text-primary mb-2">Acoustic White</h3>
            <p className="text-dark/50 text-sm font-mono mb-8">Moderno, limpo e inspirador.</p>
            <div className="w-full mt-auto">
              <p className="text-xs font-bold text-dark/40 mb-2 uppercase tracking-widest">Painel Traseiro</p>
              <img 
                src="/piano-back-white.jpg" 
                alt="Conexões White" 
                className="w-full h-auto object-contain opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* C.7 BENTO GALLERY */}
      <section className="bento-gallery py-32 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-primary mb-4">Feito para Criar</h2>
          <p className="text-lg text-dark/70 font-mono">Em qualquer lugar. A qualquer hora. Do seu jeito.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px]">

          {/* Large — woman on floor with records */}
          <div className="bento-item col-span-2 row-span-1 rounded-[2.5rem] overflow-hidden relative group">
            <img src="/gokeys_5_content_photo_01.jpg" alt="Criatividade começa aqui" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <p className="text-white font-drama italic text-2xl">A Criatividade Começa Aqui</p>
            </div>
          </div>

          {/* Record button close-up */}
          <div className="bento-item col-span-1 row-span-1 rounded-[2.5rem] overflow-hidden relative group">
            <img src="/gokeys_5_content_photo_07.jpg" alt="Grave e Compartilhe" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <p className="text-white font-mono text-sm font-bold tracking-widest uppercase">Record</p>
            </div>
          </div>

          {/* Tablet with music app */}
          <div className="bento-item col-span-1 row-span-1 rounded-[2.5rem] overflow-hidden relative group">
            <img src="/gokeys_5_content_photo_09.jpg" alt="Reproduza e Crie" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <p className="text-white font-drama italic text-xl">Reproduza & Crie</p>
            </div>
          </div>

          {/* Aerial view playing on floor */}
          <div className="bento-item col-span-2 row-span-1 rounded-[2.5rem] overflow-hidden relative group">
            <img src="/gokeys_5_content_photo_05.jpg" alt="Magia Melódica" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <p className="text-white font-drama italic text-2xl">Magia Melódica</p>
            </div>
          </div>

          {/* Woman with headphones at laptop */}
          <div className="bento-item col-span-1 md:col-span-2 row-span-1 rounded-[2.5rem] overflow-hidden relative group">
            <img src="/gokeys_5_content_photo_08.jpg" alt="Produza com Softwares" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <p className="text-white font-drama italic text-2xl">Produza com Softwares</p>
            </div>
          </div>

          {/* Top-down playing at table */}
          <div className="bento-item col-span-1 row-span-1 rounded-[2.5rem] overflow-hidden relative group">
            <img src="/gokeys_5_content_photo_02.jpg" alt="Toque em qualquer lugar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <p className="text-white font-mono text-sm font-bold tracking-widest uppercase">Sons Inspiradores</p>
            </div>
          </div>

        </div>
      </section>

      {/* D. PHILOSOPHY */}
      <section id="philosophy" className="philosophy-section relative py-40 px-8 md:px-16 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/gokeys_5_main.jpg" alt="Roland GO:KEYS 5" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="philosophy-text text-xl md:text-2xl text-white/50 font-sans font-medium mb-8">
            A maioria dos teclados foca em: complexidade técnica e curvas de aprendizado íngremes.
          </p>
          <p className="philosophy-text text-4xl md:text-7xl font-drama italic leading-tight">
            Nós focamos em: <span className="text-accent">criação musical espontânea</span> para qualquer nível de habilidade.
          </p>
        </div>
      </section>

      {/* D.5 PARALLAX DIVIDER */}
      <section className="parallax-section relative h-[70vh] overflow-hidden">
        <img
          src="/gokeys_5_content_photo_10.jpg"
          alt="Conheça a Família GO:KEYS"
          className="parallax-img absolute inset-0 w-full h-[130%] object-cover -top-[15%]"
        />
        <div className="absolute inset-0 bg-dark/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary opacity-60 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8 z-10">
          <p className="font-mono text-xs tracking-[0.4em] text-white/80 uppercase mb-4 drop-shadow-md">A Família Roland</p>
          <h2 className="text-4xl md:text-7xl font-drama italic drop-shadow-xl text-white">
            Conheça a Família<br /><span className="text-accent drop-shadow-lg">GO:KEYS</span>
          </h2>
        </div>
      </section>

      {/* E. PROTOCOL */}
      <section id="protocol" className="relative bg-background py-20">
        <div className="max-w-5xl mx-auto px-8 md:px-16">
          
          <div className="protocol-card h-[80vh] flex items-center justify-center sticky top-[10vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-dark/5 mb-8">
            <div className="grid md:grid-cols-2 w-full h-full">
              <div className="flex flex-col justify-center p-12">
                <span className="font-mono text-accent font-bold text-lg mb-4 block">01</span>
                <h2 className="text-4xl md:text-5xl font-bold font-sans text-primary mb-6">Mixe e Combine</h2>
                <p className="text-lg text-dark/70">
                  Descubra seu próprio estilo remixando sons. Adicione e remova partes, troque instrumentos e processe a música com efeitos de filtro e lo-fi.
                </p>
              </div>
              <div className="relative h-full min-h-[40vh] overflow-hidden">
                <img src="/gokeys_5_content_photo_04.jpg" alt="Mixe e Combine" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="protocol-card h-[80vh] flex items-center justify-center sticky top-[10vh] bg-primary text-white rounded-[3rem] shadow-2xl overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 w-full h-full">
              <div className="flex flex-col justify-center p-12 order-2 md:order-1">
                <div className="relative h-full min-h-[40vh] overflow-hidden rounded-[2rem]">
                  <img src="/gokeys_5_content_photo_03.jpg" alt="Comande a Banda" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-transparent"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center p-12 order-1 md:order-2">
                <span className="font-mono text-accent font-bold text-lg mb-4 block">02</span>
                <h2 className="text-4xl md:text-5xl font-bold font-sans mb-6">Comande a Banda</h2>
                <p className="text-lg text-white/70">
                  Dirija uma banda com músicos virtuais. Acompanhamentos dinâmicos controlados por um ou dois dedos. Improvise melodias enquanto a banda acompanha.
                </p>
              </div>
            </div>
          </div>

          <div className="protocol-card h-[80vh] flex items-center justify-center sticky top-[10vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-dark/5 mb-8">
            <div className="grid md:grid-cols-2 w-full h-full">
              <div className="flex flex-col justify-center p-12">
                <span className="font-mono text-accent font-bold text-lg mb-4 block">03</span>
                <h2 className="text-4xl md:text-5xl font-bold font-sans text-primary mb-6">Hora de Cantar</h2>
                <p className="text-lg text-dark/70">
                  Entrada de microfone e efeitos para aprimorar sua voz. Adicione reverb, crie harmonias em tempo real ou transforme sua voz com efeitos robóticos.
                </p>
              </div>
              <div className="relative h-full min-h-[40vh] overflow-hidden">
                <img src="/gokeys_5_content_photo_06.jpg" alt="Hora de Cantar" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* E.5 SPECS */}
      <section id="specs" className="py-32 px-8 md:px-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-sans mb-16 text-center">Especificações Técnicas</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 font-mono text-sm">
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent block mb-1">Teclado</span>
              <span className="text-white/80">61 teclas (Box-shape com velocity)</span>
            </div>
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent block mb-1">Gerador de Som</span>
              <span className="text-white/80">ZEN-Core (1.154 sons, 74 kits de bateria)</span>
            </div>
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent block mb-1">Sistema de Som</span>
              <span className="text-white/80">Alto-falantes 5cm x 2 + Radiador Passivo x 2</span>
            </div>
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent block mb-1">Conectividade</span>
              <span className="text-white/80">Bluetooth 5.0 (Áudio/MIDI), USB Type-C</span>
            </div>
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent block mb-1">Dimensões</span>
              <span className="text-white/80">950 mm (L) x 286 mm (P) x 87 mm (A)</span>
            </div>
            <div className="border-b border-white/10 pb-4">
              <span className="text-accent block mb-1">Peso</span>
              <span className="text-white/80">4.9 kg (sem estante de partitura)</span>
            </div>
          </div>
        </div>
      </section>

      {/* E.6 ACCESSORIES */}
      <section id="accessories" className="py-32 px-8 md:px-16 bg-background max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-primary mb-4">Acessórios Oficiais</h2>
          <p className="text-lg text-dark/70 font-mono">Expanda sua experiência musical.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: '/cb-v61_tn.jpg', title: 'CB-V61', desc: 'Bag versátil para teclados portáteis de 61 teclas.' },
            { img: '/mrgks3_5_tn.jpg', title: 'MRGKS3/5', desc: 'Porta Partituras dedicado para a série GO:KEYS.' },
            { img: '/ks-11z_tn.jpg', title: 'KS-11Z', desc: 'Estante reforçada em formato Z para pianos de palco.' },
            { img: '/ks-13_tn.jpg', title: 'KS-13', desc: 'Estante versátil em formato de mesa.' },
            { img: '/dp_2_angle_tn_thumb.jpg', title: 'DP-2', desc: 'Pedal de sustain compacto e resistente.' },
            { img: '/dp_10_angle_tn_thumb.jpg', title: 'DP-10', desc: 'Pedal de sustain com sensibilidade realística.' }
          ].map((acc, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-dark/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
              <div className="h-40 w-full flex items-center justify-center mb-6 p-4">
                <img src={acc.img} alt={acc.title} className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="font-bold text-xl text-primary mb-2">{acc.title}</h3>
              <p className="text-dark/60 text-sm">{acc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* F. GET STARTED */}
      <section className="py-32 px-8 md:px-16 text-center">
        <div className="max-w-3xl mx-auto bg-primary text-white p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-sans mb-6">Comece Sua Jornada</h2>
            <p className="text-xl text-white/70 mb-10 font-mono">Transforme seus sonhos musicais em realidade hoje.</p>
            <a href="https://store.roland.com.br/" target="_blank" rel="noopener noreferrer" className="magnetic-btn bg-accent text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
              Onde Comprar <ArrowRight size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* G. FOOTER */}
      <footer className="bg-primary text-white pt-20 pb-10 px-8 md:px-16 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="font-bold text-2xl tracking-tight mb-4">ROLAND GO:KEYS 5</div>
            <p className="text-white/50 max-w-sm">O Teclado de Criação Musical que facilita a transição de fã para criador ativo.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white/80">Navegação</h4>
            <ul className="space-y-4 text-white/50">
              <li><a href="#features" className="hover:text-accent transition-colors">Funcionalidades</a></li>
              <li><a href="#design" className="hover:text-accent transition-colors">Design</a></li>
              <li><a href="#specs" className="hover:text-accent transition-colors">Especificações</a></li>
              <li><a href="#accessories" className="hover:text-accent transition-colors">Acessórios</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white/80">Legal</h4>
            <ul className="space-y-4 text-white/50">
              <li><a href="#" className="hover:text-accent transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 Roland Corporation. <br className="md:hidden" />
            <a href="https://store.roland.com.br/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors ml-1">
              Visite a Loja Oficial
            </a>
          </p>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-xs text-white/70">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}