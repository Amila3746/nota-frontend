'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const penImage = '/pen-render.png';

interface Product {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  offers: number;
  slug: string;
}

interface SpecificationItem {
  id: number;
  number: string;
  title: string;
  description: string;
}

interface WhoForItem {
  id: number;
  number: string;
  title: string;
  description: string;
}

interface HomepageData {
  heroBadge?: string;
  heroTitle?: string;
  heroTagline?: string;
  manifestoSubtitle?: string;
  manifestoTitle?: string;
  manifestoDescription?: string;
  specifications?: SpecificationItem[];
  whoForItems?: WhoForItem[];
}

export default function HomePage() {
  const mainRef = useRef<HTMLElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Homepage Data & Products from Strapi v5 with URL cleaning
  useEffect(() => {
    const fetchData = async () => {
      try {
        let strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://nota-backend-production-708b.up.railway.app';
        
        // Remove brackets or unwanted trailing slashes from the URL automatically
        strapiUrl = strapiUrl.replace(/\[|\]/g, '').replace(/\/$/, '');

        // Fetch Homepage Single Type & Products concurrently with cache disabled
        const [homeRes, prodRes] = await Promise.all([
          fetch(`${strapiUrl}/api/homepage?populate=*`, { cache: 'no-store' }),
          fetch(`${strapiUrl}/api/products`, { cache: 'no-store' })
        ]);

        if (homeRes.ok) {
          const homeJson = await homeRes.json();
          const attributes = homeJson?.data?.attributes || homeJson?.data || {};
          setHomepageData(attributes);
        }

        if (prodRes.ok) {
          const prodJson = await prodRes.json();
          const rawData = prodJson?.data;
          const dataArray = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
          const parsedProducts = dataArray.map((item: any) => ({
            id: item.id,
            ...item,
            ...(item.attributes || {})
          }));
          setProducts(parsedProducts);
        }
      } catch (error) {
        console.error('Error fetching data from Strapi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (!mainRef.current || loading) return;

    const ctx = gsap.context(() => {
      // Hero animation
      const hero = document.querySelector('.nota-hero');
      const heroPen = document.querySelector('.nota-hero-pen');
      const heroTitle = document.querySelector('.nota-hero-title');
      const heroTagline = document.querySelector('.nota-hero-tagline');

      if (hero && heroPen) {
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=1100',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
          .to(heroPen, {
            scale: 1.65,
            x: -100,
            rotateY: 12,
            ease: 'none',
          }, 0)
          .to(heroTitle, {
            y: -130,
            opacity: 0,
            ease: 'none',
          }, 0)
          .to(heroTagline, {
            y: -70,
            opacity: 0,
            ease: 'none',
          }, 0.1);
      }

      // Section reveal animations
      gsap.utils.toArray<HTMLElement>('.nota-reveal').forEach((element) => {
        gsap.fromTo(element,
          { opacity: 0, y: 65 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // White specifications section
      const specs = document.querySelector('.nota-specs');
      const specsPen = document.querySelector('.nota-specs-pen');

      if (specs && specsPen) {
        gsap.fromTo(specsPen,
          { y: 100, scale: 0.7, rotate: -8 },
          {
            y: -100,
            scale: 1.15,
            rotate: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: specs,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      // Story section parallax
      gsap.utils.toArray<HTMLElement>('.nota-parallax').forEach((element) => {
        gsap.fromTo(element,
          { y: 100 },
          {
            y: -100,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      // Product image reveals
      gsap.utils.toArray<HTMLElement>('.nota-product-image').forEach((element) => {
        gsap.fromTo(element,
          { scale: 0.82, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              end: 'top 35%',
              scrub: 1,
            },
          }
        );
      });

      // Large typography reveals
      gsap.utils.toArray<HTMLElement>('.nota-big-text').forEach((element) => {
        gsap.fromTo(element,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
            },
          }
        );
      });

      // Finish sections
      gsap.utils.toArray<HTMLElement>('.nota-finish').forEach((element) => {
        gsap.fromTo(element,
          { clipPath: 'inset(20% 10% 20% 10%)', opacity: 0.5 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
            },
          }
        );
      });

      // Footer entrance
      gsap.fromTo('.nota-footer-content',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.nota-footer',
            start: 'top 80%',
          },
        }
      );

      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, [loading, products, homepageData]);

  return (
    <main
      ref={mainRef}
      className="bg-[#090909] text-white overflow-x-clip selection:bg-white selection:text-black"
    >
      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 w-full z-[100] px-5 md:px-12 py-5 flex items-center justify-between bg-black/20 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="text-2xl font-serif tracking-tight">
          Nōta
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[12px] text-white/80">
          <Link href="#specs" className="hover:text-white transition">Specifications</Link>
          <Link href="#whofor" className="hover:text-white transition">Who it's for</Link>
          <Link href="#about" className="hover:text-white transition">About</Link>
          <Link href="#box" className="hover:text-white transition">Inside the box</Link>
        </nav>

        <Link
          href="#box"
          className="bg-white text-black px-6 py-3 text-[11px] font-semibold tracking-wide hover:bg-neutral-200 transition"
        >
          Order Nōta One · $300
        </Link>
      </header>

      {/* HERO */}
      <section className="nota-hero relative h-screen min-h-[650px] bg-[#777d80] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a5aaac] via-[#707779] to-[#25292b]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,.2) 50%, transparent 60%)',
          }}
        />
        <div className="nota-hero-title absolute z-20 left-6 md:left-[8%] bottom-[17%] md:bottom-[20%]">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] mb-5 text-white/70">
            {homepageData?.heroBadge || 'The future of handwriting'}
          </p>
          <h1 
            className="font-serif text-[68px] md:text-[120px] leading-[0.8] tracking-[-0.07em] whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: homepageData?.heroTitle || 'Smart pen<br />for real thinking.' }}
          />
        </div>
        <div className="nota-hero-pen absolute z-10 w-[130%] md:w-[115%] left-[-12%] md:left-[-5%] top-[24%] md:top-[18%]">
          <img
            src={penImage}
            alt="Nōta Smart Pen"
            className="w-full h-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.4)]"
          />
        </div>
        <div className="nota-hero-tagline absolute right-[7%] bottom-[13%] text-right z-20">
          <p className="text-[10px] md:text-xs tracking-[0.2em] text-white/60 uppercase whitespace-pre-line">
            {homepageData?.heroTagline || 'Analog soul.\nDigital intelligence.'}
          </p>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/70">Scroll to discover</span>
          <div className="h-10 w-px bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="bg-[#080808] py-36 md:py-52 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-12 nota-reveal">
            {homepageData?.manifestoSubtitle || 'A different way to think'}
          </p>
          <h2 className="nota-big-text font-serif text-4xl md:text-[76px] leading-[1.15] tracking-[-0.045em] text-white/90">
            {homepageData?.manifestoTitle || 'Some thoughts deserve more than a screen.'}
          </h2>
          <p className="nota-reveal max-w-2xl mx-auto mt-12 text-sm md:text-base leading-8 text-white/45 font-light">
            {homepageData?.manifestoDescription || 'Writing by hand creates focus, presence and a deeper connection with ideas. Nōta brings that experience into a connected world.'}
          </p>
        </div>
      </section>

      {/* SPECIFICATIONS */}
      <section id="specs" className="nota-specs relative min-h-screen bg-[#f3f1ec] text-[#161616] overflow-hidden py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-8 nota-reveal">
              Engineering meets simplicity
            </p>
            <h2 className="font-serif text-6xl md:text-[110px] leading-[0.85] tracking-[-0.07em] nota-big-text">
              Nota pen<br />Specifications
            </h2>
          </div>
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
            <div className="nota-specs-pen w-[65%] md:w-[35%] max-w-[420px]">
              <img
                src={penImage}
                alt="Nōta pen specifications"
                className="w-full h-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-black/15 pt-10">
            {homepageData?.specifications && homepageData.specifications.length > 0 ? (
              homepageData.specifications.map((spec, index) => (
                <div key={spec.id || index} className="nota-reveal">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-black/40">{spec.number} / Writing</span>
                  <h3 className="font-serif text-3xl mt-5 mb-4">{spec.title}</h3>
                  <p className="text-sm leading-7 text-black/55">{spec.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="nota-reveal">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-black/40">01 / Writing</span>
                  <h3 className="font-serif text-3xl mt-5 mb-4">Natural precision.</h3>
                  <p className="text-sm leading-7 text-black/55">A refined writing experience with a precision-engineered nib and natural ink flow.</p>
                </div>
                <div className="nota-reveal">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-black/40">02 / Capture</span>
                  <h3 className="font-serif text-3xl mt-5 mb-4">Every stroke matters.</h3>
                  <p className="text-sm leading-7 text-black/55">Advanced optical tracking captures handwriting and sketches with exceptional detail.</p>
                </div>
                <div className="nota-reveal">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-black/40">03 / Digital</span>
                  <h3 className="font-serif text-3xl mt-5 mb-4">Quietly connected.</h3>
                  <p className="text-sm leading-7 text-black/55">Your notes are organized, searchable and ready to evolve with intelligent digital tools.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section id="whofor" className="bg-black py-32 md:py-48 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div className="nota-reveal">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-8">Who it's for</p>
            <h2 className="font-serif text-5xl md:text-[82px] leading-[0.95] tracking-[-0.05em]">
              Made for minds that never stop.
            </h2>
          </div>
          <div className="space-y-14 pt-5">
            {homepageData?.whoForItems && homepageData.whoForItems.length > 0 ? (
              homepageData.whoForItems.map((item, index) => (
                <div key={item.id || index} className="nota-reveal border-b border-white/15 pb-10">
                  <span className="text-[10px] text-white/35 tracking-widest">{item.number} / 03</span>
                  <h3 className="font-serif text-3xl md:text-4xl mt-4 mb-4">{item.title}</h3>
                  <p className="text-sm text-white/45 leading-7 max-w-lg">{item.description}</p>
                </div>
              ))
            ) : (
              [
                ['01', 'Students & Learners', 'Stay present in every lecture. Write naturally, then organize and revisit your notes whenever you need.'],
                ['02', 'Creators & Designers', 'Keep sketches, diagrams and ideas on paper while making every thought part of your digital workspace.'],
                ['03', 'Managers & Thinkers', 'Turn conversations into clear notes, useful summaries and meaningful next steps.'],
              ].map(([number, title, description]) => (
                <div key={number} className="nota-reveal border-b border-white/15 pb-10">
                  <span className="text-[10px] text-white/35 tracking-widest">{number} / 03</span>
                  <h3 className="font-serif text-3xl md:text-4xl mt-4 mb-4">{title}</h3>
                  <p className="text-sm text-white/45 leading-7 max-w-lg">{description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PHONE / DIGITAL EXPERIENCE */}
      <section className="bg-[#101010] min-h-screen py-32 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-20">
          <div className="nota-reveal">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">
              Your notes. Already there.
            </p>
            <h2 className="font-serif text-5xl md:text-[76px] leading-[0.95] tracking-[-0.05em] mb-10">
              The paper experience.<br />
              <span className="text-white/40">Without the limits.</span>
            </h2>
            <p className="text-sm text-white/50 leading-8 max-w-md">
              Everything you write is instantly transferred to your digital
              workspace. Find your ideas, organize your thoughts and keep
              your creative process moving.
            </p>
            <div className="mt-12 flex gap-12">
              <div>
                <p className="font-serif text-4xl">01</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Write</p>
              </div>
              <div>
                <p className="font-serif text-4xl">02</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Sync</p>
              </div>
              <div>
                <p className="font-serif text-4xl">03</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Discover</p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[580px] flex items-center justify-center nota-parallax">
            <div className="absolute w-[420px] h-[420px] rounded-full bg-[#333] blur-[100px] opacity-30" />
            <div className="nota-product-image relative z-10 w-[245px] h-[490px] rounded-[38px] border-[7px] border-[#777] bg-[#080808] shadow-[0_30px_80px_rgba(0,0,0,.7)] p-3 rotate-[-8deg]">
              <div className="h-full w-full rounded-[29px] bg-[#e9e7e1] text-black overflow-hidden p-5 flex flex-col">
                <div className="flex justify-between text-[9px] font-semibold">
                  <span>9:41</span><span>●●●</span>
                </div>
                <p className="font-serif text-2xl mt-10">My notes.</p>
                <p className="text-[9px] text-black/40 mt-2">Your thoughts, organized.</p>
                <div className="mt-8 space-y-4">
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-[10px] font-semibold">Project ideas</p>
                    <p className="text-[8px] mt-2 leading-5 text-black/50">Creative direction and new concepts...</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-[10px] font-semibold">Meeting notes</p>
                    <p className="text-[8px] mt-2 leading-5 text-black/50">Ideas, actions and follow-ups...</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-[10px] font-semibold">Daily thoughts</p>
                    <p className="text-[8px] mt-2 leading-5 text-black/50">A place for everything worth remembering.</p>
                  </div>
                </div>
                <div className="mt-auto bg-black text-white rounded-full py-3 text-center text-[9px]">
                  + New note
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMARTPAPER */}
      <section className="bg-[#080808] py-32 md:py-48 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="nota-product-image relative bg-[#171717] min-h-[480px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#343434] to-[#090909]" />
              <div className="relative w-[250px] h-[340px] bg-[#d9d6cc] shadow-[20px_25px_60px_rgba(0,0,0,.6)] rotate-[-7deg] p-5 text-black">
                <p className="text-[9px] tracking-[0.3em]">NŌTA</p>
                <p className="font-serif text-3xl mt-16">SmartPaper</p>
                <p className="text-[9px] mt-3 text-black/50">Notebook · A5</p>
              </div>
            </div>
            <div className="nota-reveal">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">
                Made for the way you write
              </p>
              <h2 className="font-serif text-5xl md:text-[75px] leading-[0.95] tracking-[-0.05em] mb-10">
                No delays.<br />
                No distractions.<br />
                <span className="text-white/40">No random effects.</span>
              </h2>
              <p className="text-sm leading-8 text-white/45 max-w-lg">
                Specially designed paper with an almost invisible pattern.
                Every page becomes a precise map, allowing your pen to
                capture your handwriting and sketches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSIDE THE BOX - DYNAMIC STRAPI PRODUCTS SECTION */}
      <section id="box" className="bg-[#f1efe9] text-black py-32 md:py-48 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-8 nota-reveal">
              Everything starts here
            </p>
            <h2 className="font-serif text-6xl md:text-[115px] leading-[0.85] tracking-[-0.07em] nota-big-text">
              Inside<br />the box.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={product.id || index} className="nota-product-image bg-[#dedbd2] min-h-[380px] p-8 flex flex-col justify-between rounded-xl shadow-md">
                  <span className="text-[10px] tracking-widest">0{index + 1} / {product.slug ? product.slug.toUpperCase() : 'PRODUCT'}</span>
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <h3 className="font-serif text-3xl">{product.title}</h3>
                    <p className="text-xs text-black/60 mt-3 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="border-t border-black/15 pt-4 flex justify-between items-center">
                    <span className="font-bold text-base">Rs. {product.price}</span>
                    {product.offers > 0 && (
                      <span className="bg-black text-white text-[10px] px-3 py-1 rounded-full">
                        {product.offers}% Off
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-black/50">
                <p className="text-sm">{loading ? 'Loading products from Strapi backend...' : 'No products available.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COLOR FINISHES */}
      <section id="about" className="bg-[#090909]">
        <div className="text-center px-6 py-32 md:py-40">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8 nota-reveal">
            Personal expression
          </p>
          <h2 className="font-serif text-5xl md:text-[85px] tracking-[-0.05em] nota-big-text">
            Refined colors.<br />Personal expression.
          </h2>
          <p className="text-sm text-white/45 mt-8 nota-reveal">
            Choose the finish that feels like you.
          </p>
        </div>

        <div className="nota-finish relative min-h-[650px] bg-gradient-to-b from-[#202c56] to-[#070b20] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={penImage} alt="Mist Blue finish" className="w-[120%] md:w-[95%] rotate-[-90deg] md:rotate-0 object-contain opacity-90" style={{ filter: 'hue-rotate(165deg) saturate(.7)' }} />
          </div>
          <div className="relative z-10 text-center mt-[350px] md:mt-[250px]">
            <h3 className="font-serif text-4xl md:text-6xl">Mist Blue</h3>
            <p className="text-xs text-white/60 mt-4">Light thinking.</p>
          </div>
        </div>

        <div className="nota-finish relative min-h-[650px] bg-gradient-to-b from-[#b94b36] to-[#e78350] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={penImage} alt="Precision Red finish" className="w-[120%] md:w-[95%] rotate-[-90deg] md:rotate-0 object-contain opacity-90" style={{ filter: 'hue-rotate(330deg) saturate(1.5)' }} />
          </div>
          <div className="relative z-10 text-center mt-[350px] md:mt-[250px]">
            <h3 className="font-serif text-4xl md:text-6xl">Precision Red</h3>
            <p className="text-xs text-white/70 mt-4">Form follows thought.</p>
          </div>
        </div>

        <div className="nota-finish relative min-h-[650px] bg-gradient-to-b from-[#bd5728] to-[#f28b43] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={penImage} alt="Bright Orange finish" className="w-[120%] md:w-[95%] rotate-[-90deg] md:rotate-0 object-contain opacity-90" style={{ filter: 'hue-rotate(15deg) saturate(1.5)' }} />
          </div>
          <div className="relative z-10 text-center mt-[350px] md:mt-[250px]">
            <h3 className="font-serif text-4xl md:text-6xl">Bright Orange</h3>
            <p className="text-xs text-white/70 mt-4">Steady focus.</p>
          </div>
        </div>
      </section>

      {/* FINAL MESSAGE */}
      <section className="bg-black py-40 md:py-56 px-6 md:px-16 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-5xl md:text-[95px] leading-[0.95] tracking-[-0.06em] nota-big-text">
            Impossible to<br />
            <span className="text-white/35">overthink.</span>
          </h2>
          <p className="max-w-xl mx-auto mt-12 text-sm leading-8 text-white/45 nota-reveal">
            This is more than a pen. It is a quieter, more natural way to
            turn thoughts into something meaningful.
          </p>
          <Link href="#box" className="inline-block mt-12 bg-white text-black px-9 py-4 text-xs font-semibold tracking-widest hover:bg-neutral-300 transition">
            DISCOVER NŌTA
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nota-footer bg-black border-t border-white/10 px-6 md:px-16 py-20 overflow-hidden">
        <div className="nota-footer-content max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 pb-20">
            <div>
              <h2 className="font-serif text-4xl mb-8">Nōta</h2>
              <p className="text-sm text-white/45 leading-7 max-w-sm">
                Nōta creates tools that respect the way people think and write.
                Natural handwriting, quietly connected to digital structure.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8">Navigation</p>
              <div className="flex flex-col gap-5 text-sm text-white/70">
                <Link href="#specs" className="hover:text-white">Specifications</Link>
                <Link href="#whofor" className="hover:text-white">Who it's for</Link>
                <Link href="#about" className="hover:text-white">About</Link>
                <Link href="#box" className="hover:text-white">Inside the box</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8">Get in touch</p>
              <p className="text-sm text-white/60 leading-7">
                Have questions about Nōta?<br />
                Get in touch with our team.
              </p>
              <Link href="#box" className="inline-block mt-7 border border-white/30 px-6 py-3 text-[10px] tracking-widest hover:bg-white hover:text-black transition">
                ORDER NŌTA ONE
              </Link>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-5 text-[10px] text-white/35">
            <p>© 2026 Nōta Systems Inc.</p>
            <p>Designed for real thinking.</p>
            <p>Made with intention.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}