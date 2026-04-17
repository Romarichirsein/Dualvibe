/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { 
  Sun, 
  Moon, 
  ShoppingCart, 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe, 
  Download, 
  Star,
  Menu,
  X,
  ChevronRight,
  Github,
  Twitter,
  Instagram,
  Trash2,
  Package,
  FileDigit,
  MessageCircle,
  Search,
  CheckCircle2,
  Mail,
  Quote,
  Play,
  Pause,
  Music,
  Sparkles,
  Heart,
  Send
} from 'lucide-react';
import { supabase } from './lib/supabase';


// --- Lazy Load Pages for Performance ---
const MusicCatalog = React.lazy(() => import('./pages/MusicCatalog'));
const Studio = React.lazy(() => import('./pages/Studio'));
const GabNails = React.lazy(() => import('./pages/GabNails'));


// --- Types & Constants ---

type Language = 'fr' | 'en';
type SortOption = 'newest' | 'priceLow' | 'priceHigh' | 'alpha';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductOption {
  label: string;
  price: number;
}

interface Product {
  id: number | string;
  title: { fr: string; en: string };
  price: number;
  category: { fr: string; en: string };
  image: string;
  images?: string[];
  audioPreview?: string;
  type: 'digital' | 'physical';
  date: string;
  description: { fr: string; en: string };
  reviews: Review[];
  options?: ProductOption[];
}

interface CartItem extends Product {
  quantity: number;
  selectedOption?: ProductOption;
  customMetadata?: {
    buyerName?: string;
    projectUse?: string;
    licenseType?: string;
    category?: string;
    trackTitle?: string;
    trackId?: string;
  };
}

interface Country {
  code: string;
  name: { fr: string; en: string };
  currency: string;
  symbol: string;
  rate: number;
}

const COUNTRIES: Country[] = [
  { code: 'CI', name: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'SN', name: { fr: 'Sénégal', en: 'Senegal' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'CM', name: { fr: 'Cameroun', en: 'Cameroon' }, currency: 'XAF', symbol: 'FCFA', rate: 1 },
  { code: 'TG', name: { fr: 'Togo', en: 'Togo' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'BJ', name: { fr: 'Bénin', en: 'Benin' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'BF', name: { fr: 'Burkina Faso', en: 'Burkina Faso' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'ML', name: { fr: 'Mali', en: 'Mali' }, currency: 'XOF', symbol: 'FCFA', rate: 1 },
  { code: 'GA', name: { fr: 'Gabon', en: 'Gabon' }, currency: 'XAF', symbol: 'FCFA', rate: 1 },
  { code: 'CG', name: { fr: 'Congo-Brazzaville', en: 'Congo-Brazzaville' }, currency: 'XAF', symbol: 'FCFA', rate: 1 },
  { code: 'CD', name: { fr: 'RD Congo', en: 'DR Congo' }, currency: 'CDF', symbol: 'FC', rate: 4.5 },
  { code: 'GN', name: { fr: 'Guinée', en: 'Guinea' }, currency: 'GNF', symbol: 'FG', rate: 14.5 },
  { code: 'MA', name: { fr: 'Maroc', en: 'Morocco' }, currency: 'MAD', symbol: 'DH', rate: 0.017 },
  { code: 'DZ', name: { fr: 'Algérie', en: 'Algeria' }, currency: 'DZD', symbol: 'DA', rate: 0.23 },
  { code: 'TN', name: { fr: 'Tunisie', en: 'Tunisia' }, currency: 'TND', symbol: 'DT', rate: 0.0053 },
  { code: 'FR', name: { fr: 'France', en: 'France' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'BE', name: { fr: 'Belgique', en: 'Belgium' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'US', name: { fr: 'États-Unis', en: 'United States' }, currency: 'USD', symbol: '$', rate: 0.0016 },
  { code: 'CA', name: { fr: 'Canada', en: 'Canada' }, currency: 'CAD', symbol: 'CA$', rate: 0.0022 },
  { code: 'GB', name: { fr: 'Royaume-Uni', en: 'United Kingdom' }, currency: 'GBP', symbol: '£', rate: 0.0013 },
  { code: 'DE', name: { fr: 'Allemagne', en: 'Germany' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'ES', name: { fr: 'Espagne', en: 'Spain' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
  { code: 'IT', name: { fr: 'Italie', en: 'Italy' }, currency: 'EUR', symbol: '€', rate: 0.0015 },
];

const CyberpunkGlitchText = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`glitch-text-container ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="glitch-layer glitch-layer-1" aria-hidden="true">{children}</span>
      <span className="glitch-layer glitch-layer-2" aria-hidden="true">{children}</span>
      <div className="cyber-scanline" />
    </div>
  );
});

// Helper for SEO URLs
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};


const ParticleNetwork = React.memo(() => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mouse = React.useRef({ x: -100, y: -100 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number;
      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }
      }
      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 0, 204, 0.4)';
        context.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const density = (canvas.width * canvas.height) / 10000;
      const count = Math.min(Math.floor(density), 150);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 0, 204, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />;
});


const TRANSLATIONS = {
  fr: {
    welcome: "Bienvenue sur DualVibe",
    selectCountry: "Veuillez sélectionner votre pays pour continuer",
    continue: "Continuer",
    heroTitle: "Tout ce dont vous avez besoin, au même endroit.",
    heroSubtitle: "Transformez vos émotions en souvenirs inoubliables. Découvrez nos flyers et supports créatifs conçus pour toucher les cœurs.",
    explore: "Explorer les produits",
    viewDemo: "Voir la démo",
    featured: "Produits Vedettes",
    all: "Tous",
    physical: "Physique",
    digital: "Digital",
    addToCart: "Ajouter au panier",
    cart: "Votre Panier",
    emptyCart: "Votre panier est vide.",
    total: "Total",
    checkout: "Commander via WhatsApp",
    features: "Pourquoi nous choisir ?",
    instantAccess: "Accès Instantané",
    instantAccessDesc: "Téléchargez vos produits digitaux immédiatement après l'achat.",
    securePayment: "Paiement Sécurisé",
    securePaymentDesc: "Vos transactions sont protégées par les meilleurs standards.",
    globalLicense: "Licence Globale",
    globalLicenseDesc: "Utilisez nos ressources pour tous vos projets personnels ou pro.",
    premiumQuality: "Qualité Premium",
    premiumQualityDesc: "Chaque produit est rigoureusement sélectionné par nos experts.",
    ready: "Prêt à passer au niveau supérieur ?",
    readySubtitle: "Rejoignez des milliers de clients satisfaits qui font confiance à DualVibe.",
    getStarted: "Commencer maintenant",
    contactSales: "Contacter le support",
    footerDesc: "La plateforme leader pour vos besoins digitaux et physiques. Rejoignez notre communauté de créateurs.",
    privacy: "Confidentialité",
    cookies: "Cookies",
    search: "Rechercher un produit...",
    added: "Ajouté au panier !",
    orderMessage: "Bonjour DualVibe ! Je souhaite commander les articles suivants :\n\n",
    orderTotal: "\nTotal de la commande : ",
    sortBy: "Trier par",
    newest: "Nouveautés",
    priceLow: "Prix : Croissant",
    priceHigh: "Prix : Décroissant",
    alpha: "Alphabétique",
    newsletter: "Newsletter",
    subscribe: "S'abonner",
    newsletterDesc: "Recevez nos dernières offres et nouveautés directement dans votre boîte mail.",
    testimonials: "Ce que disent nos clients",
    contact: "Contactez-nous",
    name: "Nom",
    email: "Email",
    message: "Message",
    send: "Envoyer",
    home: "Accueil",
    shop: "Boutique",
    about: "À propos",
    categories: "Catégories",
    priceRange: "Tranche de prix",
    reviews: "Avis clients",
    noReviews: "Aucun avis pour le moment.",
    addReview: "Ajouter un avis",
    rating: "Note",
    comment: "Commentaire",
    submit: "Soumettre",
    averageRating: "Note moyenne",
    aboutTitle: "À propos de DualVibe",
    aboutText: "DualVibe est votre destination privilégiée pour les produits physiques et numériques de haute qualité. Nous nous engageons à fournir une expérience d'achat exceptionnelle, alliant innovation technologique et service client de premier ordre.",
    mission: "Notre Mission",
    missionText: "Démocratiser l'accès aux meilleurs outils numériques et produits physiques premium partout en Afrique et dans le monde.",
    promoCode: "Code Promo",
    apply: "Appliquer",
    invalidPromo: "Code promo invalide",
    promoAlreadyUsed: "Vous avez déjà utilisé un code promo. Un seul code est autorisé par commande.",
    promoApplied: "Code promo appliqué : -300 FCFA",
    discount: "Remise",
    promoUsed: "\nCode promo utilisé : ",
    options: "Options disponibles",
    startingFrom: "À partir de",
    cvFormTitle: "Informations pour le CV",
    cvFormDesc: "Afin de concevoir votre CV personnalisé, veuillez nous fournir les informations nécessaires ci-dessous.",
    fullName: "Nom Complet",
    phone: "Téléphone",
    address: "Adresse / Lieu",
    profile: "Profil Professionnel / Objectif",
    experience: "Expériences Professionnelles",
    education: "Formations / Diplômes",
    skills: "Compétences Principales",
    languages: "Langues & Loisirs",
    backToCart: "Retour au panier",
    submitOrder: "Soumettre et Commander",
    musicFormTitle: "Création Musicale Sur-Mesure",
    musicFormDesc: "Pour concevoir l'univers sonore parfait, parlez-nous de votre vision.",
    musicCategory: "Catégorie de musique",
    musicEvent: "Occasion / Événement (ex: Mariage, Vidéo, Rap...)",
    musicEmotion: "Émotions recherchées (ex: Joie, Nostalgie...)",
    musicTarget: "Pour qui est-ce destiné ?",
    musicStory: "L'histoire à raconter (Instruments, Style, Contexte...)",
    studio: "Studio",
    studioTitle: "Espace Créatif & Personnalisation",
    studioSubtitle: "Donnez vie à vos idées. Configurez vos projets sur-mesure et notre équipe d'experts s'occupe du reste.",
    musicCustom: "Musique Sur-Mesure",
    photoCustom: "Retouche & Image",
    videoCustom: "Montage Vidéo",
    designCustom: "Design Graphique",
    startCustom: "Personnaliser",
    uploadDrop: "Cliquez ou glissez vos fichiers ici (Photos, maquettes, sons...)",
    projectDetails: "Détails du projet",
    projectLinks: "Liens (Drive, WeTransfer...)",
    sendStudio: "Envoyer ma demande au Studio",
    shopHeroTitle: "Boutique Digitale & Créative",
    shopHeroSubtitle: "Découvrez nos collections exclusives conçues pour sublimer vos projets et toucher les cœurs.",
    services: "Services",
    servicesTitle: "Espace Services & Opportunités",
    servicesSubtitle: "Découvrez les talents de notre communauté ou proposez vos propres services."
  },
  en: {
    welcome: "Welcome to DualVibe",
    selectCountry: "Please select your country to continue",
    continue: "Continue",
    heroTitle: "Everything you need, all in one place.",
    heroSubtitle: "Turn your emotions into unforgettable memories. Discover our flyers and creative supports designed to touch hearts.",
    explore: "Explore Products",
    viewDemo: "View Demo",
    featured: "Featured Products",
    all: "All",
    physical: "Physical",
    digital: "Digital",
    addToCart: "Add to Cart",
    cart: "Your Cart",
    emptyCart: "Your cart is empty.",
    total: "Total",
    checkout: "Order via WhatsApp",
    features: "Why Choose Us?",
    instantAccess: "Instant Access",
    instantAccessDesc: "Download your digital products immediately after purchase.",
    securePayment: "Secure Payment",
    securePaymentDesc: "Your transactions are protected by industry-leading security.",
    globalLicense: "Global License",
    globalLicenseDesc: "Use our assets for all your personal or professional projects.",
    premiumQuality: "Premium Quality",
    premiumQualityDesc: "Every product is rigorously selected by our experts.",
    ready: "Ready to take it to the next level?",
    readySubtitle: "Join thousands of satisfied customers who trust DualVibe.",
    getStarted: "Get Started Now",
    contactSales: "Contact Support",
    footerDesc: "The leading platform for your digital and physical needs. Join our community of creators.",
    privacy: "Privacy",
    cookies: "Cookies",
    search: "Search a product...",
    added: "Added to cart!",
    orderMessage: "Hello DualVibe! I would like to order the following items:\n\n",
    orderTotal: "\nOrder Total: ",
    sortBy: "Sort by",
    newest: "Newest Arrivals",
    priceLow: "Price: Low to High",
    priceHigh: "Price: High to Low",
    alpha: "Alphabetical",
    newsletter: "Newsletter",
    subscribe: "Subscribe",
    newsletterDesc: "Get our latest offers and news directly in your inbox.",
    testimonials: "What our customers say",
    contact: "Contact Us",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    home: "Home",
    shop: "Shop",
    about: "About",
    categories: "Categories",
    priceRange: "Price Range",
    reviews: "Customer Reviews",
    noReviews: "No reviews yet.",
    addReview: "Add a review",
    rating: "Rating",
    comment: "Comment",
    submit: "Submit",
    averageRating: "Average Rating",
    aboutTitle: "About DualVibe",
    aboutText: "DualVibe is your premier destination for high-quality physical and digital products. We are committed to providing an exceptional shopping experience, combining technological innovation with top-notch customer service.",
    mission: "Our Mission",
    missionText: "To democratize access to the best digital tools and premium physical products across Africa and the world.",
    promoCode: "Promo Code",
    apply: "Apply",
    invalidPromo: "Invalid promo code",
    promoAlreadyUsed: "You have already used a promo code. Only one code is allowed per order.",
    promoApplied: "Promo code applied: -300 FCFA",
    discount: "Discount",
    promoUsed: "\nPromo code used: ",
    options: "Available Options",
    startingFrom: "Starting from",
    cvFormTitle: "CV Information",
    cvFormDesc: "In order to design your personalized CV, please provide us with the necessary information below.",
    fullName: "Full Name",
    phone: "Phone Number",
    address: "Address / Location",
    profile: "Professional Profile / Objective",
    experience: "Professional Experience",
    education: "Education / Degrees",
    skills: "Core Skills",
    languages: "Languages & Hobbies",
    backToCart: "Back to Cart",
    submitOrder: "Submit & Order",
    musicFormTitle: "Custom Music Creation",
    musicFormDesc: "To design the perfect sound universe, tell us about your vision.",
    musicCategory: "Music Category",
    musicEvent: "Occasion / Event (e.g. Wedding, Video, Rap...)",
    musicEmotion: "Desired Emotions (e.g. Joy, Nostalgia...)",
    musicTarget: "Who is this for?",
    musicStory: "The story to tell (Instruments, Style, Context...)",
    studio: "Studio",
    studioTitle: "Creative Studio & Customization",
    studioSubtitle: "Bring your ideas to life. Configure your custom projects and our team of experts handles the rest.",
    musicCustom: "Custom Music",
    photoCustom: "Retouching & Image",
    videoCustom: "Video Editing",
    designCustom: "Graphic Design",
    startCustom: "Customize Now",
    uploadDrop: "Click or drag your files here (Photos, mockups, sounds...)",
    projectDetails: "Project Details",
    projectLinks: "Links (Drive, WeTransfer...)",
    sendStudio: "Send Request to Studio",
    shopHeroTitle: "Digital & Creative Shop",
    shopHeroSubtitle: "Discover our exclusive collections designed to enhance your projects and touch hearts.",
    services: "Services",
    servicesTitle: "Services & Opportunities Space",
    servicesSubtitle: "Discover the talents of our community or offer your own services."
  }
};

const PRODUCTS: Product[] = [
  // 1. Traitement d'Images & Retouche Photo
  { 
    id: 1, 
    title: { fr: "Pack Retouche Basique (5 photos)", en: "Basic Retouching Pack (5 photos)" }, 
    price: 5000, 
    category: { fr: "Traitement d'Images", en: "Image Processing" }, 
    image: "https://picsum.photos/seed/retouch/800/600", 
    type: 'digital', 
    date: '2024-03-01',
    description: { 
      fr: "Détourage, correction colorimétrique, ajustement luminosité/contraste. Idéal pour l'e-commerce.", 
      en: "Background removal, color correction, brightness/contrast adjustment. Perfect for e-commerce." 
    },
    reviews: [
      { id: '1', userName: 'Moussa B.', rating: 5, comment: 'Travail impeccable pour ma boutique !', date: '2024-03-10' }
    ]
  },
  { 
    id: 2, 
    title: { fr: "Retouche Beauté High-End", en: "High-End Beauty Retouching" }, 
    price: 3500, 
    category: { fr: "Traitement d'Images", en: "Image Processing" }, 
    image: "https://picsum.photos/seed/beauty/800/600", 
    type: 'digital', 
    date: '2024-03-05',
    description: { 
      fr: "Lissage de peau professionnel (frequency separation), correction des imperfections, color grading avancé.", 
      en: "Professional skin smoothing (frequency separation), blemish correction, advanced color grading." 
    },
    reviews: []
  },
  { 
    id: 3, 
    title: { fr: "Restauration Photo Ancienne", en: "Old Photo Restoration" }, 
    price: 7000, 
    category: { fr: "Traitement d'Images", en: "Image Processing" }, 
    image: "https://picsum.photos/seed/restore/800/600", 
    type: 'digital', 
    date: '2024-03-08',
    description: { 
      fr: "Colorisation, suppression des rayures et déchirures, amélioration de la netteté par IA.", 
      en: "Colorization, scratch and tear removal, AI-powered sharpness enhancement." 
    },
    reviews: []
  },

  // 2. Montage Vidéo & Animation
  { 
    id: 4, 
    title: { fr: "Vidéo Courte (TikTok/Reels)", en: "Short Video (TikTok/Reels)" }, 
    price: 10000, 
    category: { fr: "Vidéo & Animation", en: "Video & Animation" }, 
    image: "https://picsum.photos/seed/tiktok/800/600", 
    type: 'digital', 
    date: '2024-03-12',
    description: { 
      fr: "Montage dynamique jusqu'à 60s, sous-titres animés, musique tendance, effets de transition.", 
      en: "Dynamic editing up to 60s, animated subtitles, trending music, transition effects." 
    },
    reviews: [
      { id: '2', userName: 'Sarah L.', rating: 5, comment: 'Mes Reels font beaucoup plus de vues maintenant.', date: '2024-03-15' }
    ]
  },
  { 
    id: 5, 
    title: { fr: "Montage YouTube / Corporate", en: "YouTube / Corporate Editing" }, 
    price: 35000, 
    category: { fr: "Vidéo & Animation", en: "Video & Animation" }, 
    image: "https://picsum.photos/seed/youtube/800/600", 
    type: 'digital', 
    date: '2024-03-14',
    description: { 
      fr: "Dérushage, étalonnage, mixage audio, ajout de B-roll, titrage professionnel (jusqu'à 5 min).", 
      en: "Footage selection, grading, audio mixing, B-roll addition, professional titling (up to 5 min)." 
    },
    reviews: []
  },
  { 
    id: 6, 
    title: { fr: "Animation de Logo (Intro/Outro)", en: "Logo Animation (Intro/Outro)" }, 
    price: 15000, 
    category: { fr: "Vidéo & Animation", en: "Video & Animation" }, 
    image: "https://picsum.photos/seed/logo-anim/800/600", 
    type: 'digital', 
    date: '2024-03-16',
    description: { 
      fr: "Animation 2D/3D de logo existant pour introduction de vidéos ou présentations.", 
      en: "2D/3D animation of existing logo for video intros or presentations." 
    },
    reviews: []
  },

  // 3. Musiques Personnalisées, Beats & Jingles
  { 
    id: 7, 
    title: { fr: "Beat / Instrumentale Exclusive", en: "Exclusive Beat / Instrumental" }, 
    price: 30000, 
    category: { fr: "Musique & Audio", en: "Music & Audio" }, 
    image: "https://picsum.photos/seed/beat/800/600", 
    type: 'digital', 
    date: '2024-03-18',
    description: { 
      fr: "Création sur mesure (Afrobeat, Hip-Hop, Pop) avec cession complète des droits commerciaux.", 
      en: "Custom creation (Afrobeat, Hip-Hop, Pop) with full commercial rights transfer." 
    },
    reviews: []
  },
  { 
    id: 8, 
    title: { fr: "Jingle Audio Pro", en: "Pro Audio Jingle" }, 
    price: 15000, 
    category: { fr: "Musique & Audio", en: "Music & Audio" }, 
    image: "https://picsum.photos/seed/jingle/800/600", 
    type: 'digital', 
    date: '2024-03-20',
    description: { 
      fr: "Identité sonore courte (5 à 15s) avec voix off et effets sonores pour radio ou podcast.", 
      en: "Short sonic identity (5 to 15s) with voiceover and sound effects for radio or podcast." 
    },
    reviews: []
  },
  { 
    id: 9, 
    title: { fr: "Chanson Personnalisée", en: "Personalized Song" }, 
    price: 50000, 
    category: { fr: "Musique & Audio", en: "Music & Audio" }, 
    image: "https://picsum.photos/seed/song/800/600", 
    type: 'digital', 
    date: '2024-03-22',
    description: { 
      fr: "Écriture, composition et enregistrement pour mariage, anniversaire ou déclaration.", 
      en: "Writing, composition, and recording for weddings, birthdays, or declarations." 
    },
    reviews: []
  },

  // 4. Design Graphique & Identité Visuelle
  { 
    id: 10, 
    title: { fr: "Création de Logo Pro", en: "Pro Logo Creation" }, 
    price: 15000, 
    category: { fr: "Design Graphique", en: "Graphic Design" }, 
    image: "https://picsum.photos/seed/logo-design/800/600", 
    type: 'digital', 
    date: '2024-03-24',
    description: { 
      fr: "2 propositions de concepts, fichiers vectoriels (AI, EPS) et formats web (PNG, JPG).", 
      en: "2 concept proposals, vector files (AI, EPS), and web formats (PNG, JPG)." 
    },
    reviews: [
      { id: '3', userName: 'Koffi A.', rating: 5, comment: 'Logo très moderne, je recommande.', date: '2024-03-25' }
    ]
  },
  { 
    id: 12, 
    title: { fr: "Charte Graphique Complète", en: "Full Brand Identity" }, 
    price: 50000, 
    category: { fr: "Design Graphique", en: "Graphic Design" }, 
    image: "https://picsum.photos/seed/brand/800/600", 
    type: 'digital', 
    date: '2024-03-26',
    description: { 
      fr: "Logo, palette de couleurs, typographies, mockups et guide d'utilisation.", 
      en: "Logo, color palette, typography, mockups, and usage guide." 
    },
    reviews: []
  },

  // 4b. Flyers Émotionnels
  { 
    id: 50, 
    title: { fr: "Flyer d’Anniversaire", en: "Birthday Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/birthday/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Célébrez la joie et la surprise avec un design festif. Idéal pour enfants (couleurs vives) ou adultes (luxe/élégant).", 
      en: "Celebrate joy and surprise with a festive design. Ideal for children (vibrant colors) or adults (luxury/elegant)." 
    },
    reviews: []
  },
  { 
    id: 51, 
    title: { fr: "Flyer Mariage & Fiançailles", en: "Wedding & Engagement Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/wedding/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Exprimez l'amour et l'engagement. Save the date, invitations romantiques et remerciements.", 
      en: "Express love and commitment. Save the date, romantic invitations, and thanks." 
    },
    reviews: []
  },
  { 
    id: 52, 
    title: { fr: "Flyer de Deuil & Hommage", en: "Mourning & Tribute Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/tribute/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Un hommage respectueux pour honorer le souvenir. Programmes d'obsèques et messes de requiem.", 
      en: "A respectful tribute to honor the memory. Funeral programs and requiem masses." 
    },
    reviews: []
  },
  { 
    id: 53, 
    title: { fr: "Flyer Réussite & Graduation", en: "Success & Graduation Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/graduation/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Célébrez la fierté et l'accomplissement. Pour diplômes, soutenances et remises de certificats.", 
      en: "Celebrate pride and achievement. For diplomas, defenses, and certificate presentations." 
    },
    reviews: []
  },
  { 
    id: 54, 
    title: { fr: "Flyer Saint-Valentin / Amoureux", en: "Valentine's Day Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/valentines/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Passion et désir au rendez-vous. Offres couples et messages romantiques percutants.", 
      en: "Passion and desire meet here. Couple offers and powerful romantic messages." 
    },
    reviews: []
  },
  { 
    id: 55, 
    title: { fr: "Flyer Naissance & Baby Shower", en: "Birth & Baby Shower Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/babyshower/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Tendresse et bonheur pour accueillir la vie. Annonces de naissance et invitations douces.", 
      en: "Tenderness and happiness to welcome life. Birth announcements and sweet invitations." 
    },
    reviews: []
  },
  { 
    id: 56, 
    title: { fr: "Flyer Business & Succès", en: "Business & Success Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/business-success/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Ambition et motivation pour vos lancements, conférences et séminaires.", 
      en: "Ambition and motivation for your launches, conferences, and seminars." 
    },
    reviews: []
  },
  { 
    id: 57, 
    title: { fr: "Flyer Urgence & Promo", en: "Urgency & Promo Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/promo/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Créez l'excitation et la peur de rater (FOMO). Soldes et offres exclusives limitées.", 
      en: "Create excitement and fear of missing out (FOMO). Sales and exclusive limited offers." 
    },
    reviews: []
  },
  { 
    id: 58, 
    title: { fr: "Flyer Religieux & Spirituel", en: "Religious & Spiritual Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/spiritual/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Foi, paix et espoir pour vos programmes d'église et retraites spirituelles.", 
      en: "Faith, peace, and hope for your church programs and spiritual retreats." 
    },
    reviews: []
  },
  { 
    id: 59, 
    title: { fr: "Flyer Culturel & Artistique", en: "Cultural & Artistic Flyer" }, 
    price: 5000, 
    category: { fr: "Flyers Émotionnels", en: "Emotional Flyers" }, 
    image: "https://picsum.photos/seed/culture/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Inspiration et curiosité. Pour concerts, théâtres et expositions artistiques.", 
      en: "Inspiration and curiosity. For concerts, theaters, and artistic exhibitions." 
    },
    reviews: []
  },

  // Supports Émotionnels Hors Flyers
  { 
    id: 60, 
    title: { fr: "Cartes de Vœux", en: "Greeting Cards" }, 
    price: 2000, 
    category: { fr: "Supports Émotionnels", en: "Emotional Supports" }, 
    image: "https://picsum.photos/seed/cards/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Affection et gratitude pour le Nouvel An, Noël ou vœux professionnels.", 
      en: "Affection and gratitude for New Year, Christmas, or professional wishes." 
    },
    reviews: []
  },
  { 
    id: 61, 
    title: { fr: "Poèmes Personnalisés", en: "Personalized Poems" }, 
    price: 1000, 
    category: { fr: "Supports Émotionnels", en: "Emotional Supports" }, 
    image: "https://picsum.photos/seed/poetry/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Mots du cœur : amour, tristesse, motivation ou spiritualité en vers.", 
      en: "Words from the heart: love, sadness, motivation, or spirituality in verse." 
    },
    reviews: []
  },
  { 
    id: 62, 
    title: { fr: "Messages Courts Puissants", en: "Powerful Short Messages" }, 
    price: 1000, 
    category: { fr: "Supports Émotionnels", en: "Emotional Supports" }, 
    image: "https://picsum.photos/seed/messages/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Citations inspirantes et storytelling pour toucher et motiver votre audience.", 
      en: "Inspiring quotes and storytelling to touch and motivate your audience." 
    },
    reviews: []
  },

  // 4c. Billets d'Invitations
  { 
    id: 80, 
    title: { fr: "Billet d'Invitation (Fiançailles)", en: "Invitation Ticket (Engagement)" }, 
    price: 3000, 
    category: { fr: "Billets d'Invitations", en: "Invitation Tickets" }, 
    image: "https://picsum.photos/seed/inv-engagement/800/600", 
    type: 'digital', 
    date: '2024-04-14',
    description: { 
      fr: "Un design romantique et élégant pour annoncer officiellement vos fiançailles à vos proches.", 
      en: "A romantic and elegant design to officially announce your engagement to your loved ones." 
    },
    reviews: []
  },
  { 
    id: 81, 
    title: { fr: "Billet d'Invitation (Mariage)", en: "Invitation Ticket (Wedding)" }, 
    price: 3500, 
    category: { fr: "Billets d'Invitations", en: "Invitation Tickets" }, 
    image: "https://picsum.photos/seed/inv-wedding/800/600", 
    type: 'digital', 
    date: '2024-04-14',
    description: { 
      fr: "Invitations de mariage premium personnalisées, avec différents thèmes (classique, moderne, chic).", 
      en: "Premium personalized wedding invitations with various themes (classic, modern, chic)." 
    },
    reviews: []
  },
  { 
    id: 82, 
    title: { fr: "Billet d'Invitation (Anniversaire)", en: "Invitation Ticket (Birthday)" }, 
    price: 2500, 
    category: { fr: "Billets d'Invitations", en: "Invitation Tickets" }, 
    image: "https://picsum.photos/seed/inv-birthday/800/600", 
    type: 'digital', 
    date: '2024-04-14',
    description: { 
      fr: "Invitations festives et colorées pour marquer le coup et surprendre vos invités.", 
      en: "Festive and colorful invitations to make a splash and surprise your guests." 
    },
    reviews: []
  },
  { 
    id: 83, 
    title: { fr: "Billet d'Invitation (Autres Événements)", en: "Invitation Ticket (Other Events)" }, 
    price: 2500, 
    category: { fr: "Billets d'Invitations", en: "Invitation Tickets" }, 
    image: "https://picsum.photos/seed/inv-others/800/600", 
    type: 'digital', 
    date: '2024-04-14',
    description: { 
      fr: "Création sur-mesure pour baptêmes, soirées, lancements de produits ou conférences.", 
      en: "Tailor-made creation for baptisms, parties, product launches, or conferences." 
    },
    reviews: []
  },

  // 5. Modèles de CV & Documents Professionnels
  { 
    id: 13, 
    title: { fr: "Modèle de CV Ultra Basic", en: "Ultra Basic CV Template" }, 
    price: 1500, 
    category: { fr: "Documents Pro", en: "Pro Documents" }, 
    image: "/products/cv/cv-basic.png", 
    type: 'digital', 
    date: '2024-03-27',
    description: { 
      fr: "Fichier digital (Word/Canva) au design moderne, prêt à être rempli. Produit 100% passif.", 
      en: "Digital file (Word/Canva) with modern design, ready to fill. 100% passive product." 
    },
    reviews: []
  },
  { 
    id: 14, 
    title: { fr: "CV Ultra Professionnel", en: "Ultra Professional CV" }, 
    price: 2500, 
    category: { fr: "Documents Pro", en: "Pro Documents" }, 
    image: "/products/cv/42428380_CV-Template-01.jpg", 
    images: [
      "/products/cv/42428380_CV-Template-01.jpg",
      "/products/cv/42428404_CV-Template-05.jpg",
      "/products/cv/51561261_cv_template_17.jpg",
      "/products/cv/186436100_f6c89ba7-22b1-47f5-af44-cccfff7fd35d.jpg"
    ],
    type: 'digital', 
    date: '2024-03-28',
    description: { 
      fr: "Réécriture du parcours, optimisation des mots-clés et mise en page graphique.", 
      en: "Career rewriting, keyword optimization, and graphic layout." 
    },
    reviews: []
  },
  { 
    id: 15, 
    title: { fr: "Lettre de Motivation Pro", en: "Pro Cover Letter" }, 
    price: 3000, 
    category: { fr: "Documents Pro", en: "Pro Documents" }, 
    image: "https://picsum.photos/seed/letter/800/600", 
    type: 'digital', 
    date: '2024-03-29',
    description: { 
      fr: "Rédaction percutante adaptée à une offre d'emploi spécifique.", 
      en: "Impactful writing tailored to a specific job offer." 
    },
    reviews: []
  },
  // 6. Rédaction de Contenu & Copywriting
  { 
    id: 16, 
    title: { fr: "Article de Blog Optimisé SEO", en: "SEO Optimized Blog Post" }, 
    price: 10000, 
    category: { fr: "Rédaction & Copywriting", en: "Writing & Copywriting" }, 
    image: "https://picsum.photos/seed/blog/800/600", 
    type: 'digital', 
    date: '2024-03-30',
    description: { 
      fr: "Article de 800-1000 mots, recherche de mots-clés, balisage HTML, optimisation pour les moteurs de recherche.", 
      en: "800-1000 word article, keyword research, HTML tagging, search engine optimization." 
    },
    reviews: []
  },
  { 
    id: 17, 
    title: { fr: "Page de Vente Persuasive", en: "Persuasive Sales Page" }, 
    price: 25000, 
    category: { fr: "Rédaction & Copywriting", en: "Writing & Copywriting" }, 
    image: "https://picsum.photos/seed/sales-page/800/600", 
    type: 'digital', 
    date: '2024-03-31',
    description: { 
      fr: "Copywriting haute conversion pour vos produits ou services. Structure AIDA, psychologie de vente.", 
      en: "High-conversion copywriting for your products or services. AIDA structure, sales psychology." 
    },
    reviews: []
  },
  { 
    id: 18, 
    title: { fr: "Pack de 5 Newsletters", en: "5 Newsletters Pack" }, 
    price: 15000, 
    category: { fr: "Rédaction & Copywriting", en: "Writing & Copywriting" }, 
    image: "https://picsum.photos/seed/newsletter-pack/800/600", 
    type: 'digital', 
    date: '2024-04-01',
    description: { 
      fr: "Série d'emails captivants pour fidéliser votre audience et booster vos ventes.", 
      en: "Series of captivating emails to engage your audience and boost your sales." 
    },
    reviews: []
  },
  // 7. Développement Web & Solutions Digitales
  { 
    id: 19, 
    title: { fr: "Site Vitrine One-Page", en: "One-Page Showcase Site" }, 
    price: 75000, 
    category: { fr: "Développement Web", en: "Web Development" }, 
    image: "https://picsum.photos/seed/web-onepage/800/600", 
    type: 'digital', 
    date: '2024-04-02',
    description: { 
      fr: "Design moderne et responsive, section contact, intégration réseaux sociaux. Idéal pour freelances.", 
      en: "Modern and responsive design, contact section, social media integration. Ideal for freelancers." 
    },
    reviews: []
  },
  { 
    id: 20, 
    title: { fr: "Boutique E-commerce", en: "E-commerce Store" }, 
    price: 150000, 
    category: { fr: "Développement Web", en: "Web Development" }, 
    image: "https://picsum.photos/seed/ecommerce/800/600", 
    type: 'digital', 
    date: '2024-04-03',
    description: { 
      fr: "Configuration complète Shopify ou WooCommerce, ajout de 10 produits, passerelles de paiement.", 
      en: "Full Shopify or WooCommerce setup, 10 products added, payment gateways." 
    },
    reviews: []
  },
  { 
    id: 21, 
    title: { fr: "Audit & Optimisation Web", en: "Web Audit & Optimization" }, 
    price: 30000, 
    category: { fr: "Développement Web", en: "Web Development" }, 
    image: "https://picsum.photos/seed/web-audit/800/600", 
    type: 'digital', 
    date: '2024-04-04',
    description: { 
      fr: "Analyse de performance, SEO technique, correction de bugs et amélioration de l'expérience utilisateur.", 
      en: "Performance analysis, technical SEO, bug fixes, and user experience improvement." 
    },
    reviews: []
  },
  // 8. Coaching & Formation en Ligne
  { 
    id: 22, 
    title: { fr: "Coaching Individuel (1h)", en: "Individual Coaching (1h)" }, 
    price: 20000, 
    category: { fr: "Coaching & Formation", en: "Coaching & Training" }, 
    image: "https://picsum.photos/seed/coaching/800/600", 
    type: 'digital', 
    date: '2024-04-05',
    description: { 
      fr: "Session personnalisée en visioconférence pour débloquer vos projets ou booster vos compétences.", 
      en: "Personalized video conference session to unblock your projects or boost your skills." 
    },
    reviews: []
  },
  { 
    id: 23, 
    title: { fr: "Pack Formation Vidéo", en: "Video Training Pack" }, 
    price: 45000, 
    category: { fr: "Coaching & Formation", en: "Coaching & Training" }, 
    image: "https://picsum.photos/seed/training/800/600", 
    type: 'digital', 
    date: '2024-04-06',
    description: { 
      fr: "Accès à vie à une série de vidéos pédagogiques sur une thématique business ou créative.", 
      en: "Lifetime access to a series of educational videos on a business or creative theme." 
    },
    reviews: []
  },
  { 
    id: 24, 
    title: { fr: "E-book Guide Complet", en: "Complete E-book Guide" }, 
    price: 5000, 
    category: { fr: "Coaching & Formation", en: "Coaching & Training" }, 
    image: "https://picsum.photos/seed/ebook/800/600", 
    type: 'digital', 
    date: '2024-04-07',
    description: { 
      fr: "Livre numérique détaillé avec stratégies actionnables et études de cas.", 
      en: "Detailed digital book with actionable strategies and case studies." 
    },
    reviews: []
  },
  // 9. Gestion de Réseaux Sociaux
  { 
    id: 25, 
    title: { fr: "Pack 12 Visuels Instagram", en: "12 Instagram Visuals Pack" }, 
    price: 20000, 
    category: { fr: "Social Media", en: "Social Media" }, 
    image: "https://picsum.photos/seed/social-pack/800/600", 
    type: 'digital', 
    date: '2024-04-08',
    description: { 
      fr: "Création de posts et stories cohérents avec votre identité visuelle pour un mois de contenu.", 
      en: "Creation of posts and stories consistent with your visual identity for a month of content." 
    },
    reviews: []
  },
  { 
    id: 26, 
    title: { fr: "Gestion Mensuelle (1 réseau)", en: "Monthly Management (1 network)" }, 
    price: 50000, 
    category: { fr: "Social Media", en: "Social Media" }, 
    image: "https://picsum.photos/seed/social-mgmt/800/600", 
    type: 'digital', 
    date: '2024-04-09',
    description: { 
      fr: "Planification de 3 posts par semaine, interaction avec l'audience, modération des commentaires.", 
      en: "Scheduling of 3 posts per week, audience interaction, comment moderation." 
    },
    reviews: []
  },
  { 
    id: 27, 
    title: { fr: "Audit & Stratégie Social Media", en: "Social Media Audit & Strategy" }, 
    price: 25000, 
    category: { fr: "Social Media", en: "Social Media" }, 
    image: "https://picsum.photos/seed/social-audit/800/600", 
    type: 'digital', 
    date: '2024-04-10',
    description: { 
      fr: "Analyse de vos comptes actuels et plan d'action détaillé pour augmenter votre visibilité.", 
      en: "Analysis of your current accounts and detailed action plan to increase your visibility." 
    },
    reviews: []
  },
  // 10. Services Administratifs & Assistance Virtuelle
  { 
    id: 28, 
    title: { fr: "Saisie de Données (10h)", en: "Data Entry (10h)" }, 
    price: 15000, 
    category: { fr: "Assistance Virtuelle", en: "Virtual Assistance" }, 
    image: "https://picsum.photos/seed/data-entry/800/600", 
    type: 'digital', 
    date: '2024-04-11',
    description: { 
      fr: "Saisie rigoureuse sur Excel, Google Sheets ou CRM. Mise en forme et nettoyage de fichiers.", 
      en: "Rigorous entry on Excel, Google Sheets, or CRM. Formatting and file cleaning." 
    },
    reviews: []
  },
  { 
    id: 29, 
    title: { fr: "Transcription Audio/Vidéo", en: "Audio/Video Transcription" }, 
    price: 10000, 
    category: { fr: "Assistance Virtuelle", en: "Virtual Assistance" }, 
    image: "https://picsum.photos/seed/transcription/800/600", 
    type: 'digital', 
    date: '2024-04-12',
    description: { 
      fr: "Transcription fidèle par heure d'enregistrement. Formats texte, Word ou PDF.", 
      en: "Faithful transcription per hour of recording. Text, Word, or PDF formats." 
    },
    reviews: []
  },
  { 
    id: 30, 
    title: { fr: "Présentation PowerPoint Pro", en: "Pro PowerPoint Presentation" }, 
    price: 12000, 
    category: { fr: "Assistance Virtuelle", en: "Virtual Assistance" }, 
    image: "https://picsum.photos/seed/ppt/800/600", 
    type: 'digital', 
    date: '2024-04-13',
    description: { 
      fr: "Design de slides percutants pour vos réunions, conférences ou pitch decks.", 
      en: "Design of impactful slides for your meetings, conferences, or pitch decks." 
    },
    reviews: []
  },
  // 11. Boostage Réseaux Sociaux
  { 
    id: 31, 
    title: { fr: "Abonnés TikTok", en: "TikTok Followers" }, 
    price: 2000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/tiktok-followers.png", 
    type: 'digital', 
    date: '2024-04-14',
    description: { 
      fr: "Augmentez votre visibilité sur TikTok avec des abonnés de qualité.", 
      en: "Increase your TikTok visibility with quality followers." 
    },
    options: [
      { label: "1 000", price: 2000 },
      { label: "2 000", price: 3650 },
      { label: "10 000", price: 18000 }
    ],
    reviews: []
  },
  { 
    id: 32, 
    title: { fr: "Packs Combo TikTok (Likes + Vues)", en: "TikTok Combo Packs (Likes + Views)" }, 
    price: 1000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/tiktok-combo.png", 
    type: 'digital', 
    date: '2024-04-15',
    description: { 
      fr: "Boostez vos vidéos avec un mélange de likes et de vues.", 
      en: "Boost your videos with a mix of likes and views." 
    },
    options: [
      { label: "1K Likes + 2K Vues", price: 1000 },
      { label: "2K Likes + 4K Vues", price: 2000 },
      { label: "10K Likes + 20K Vues", price: 6000 }
    ],
    reviews: []
  },
  { 
    id: 33, 
    title: { fr: "Abonnés Instagram", en: "Instagram Followers" }, 
    price: 2000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/insta-followers.png", 
    type: 'digital', 
    date: '2024-04-16',
    description: { 
      fr: "Développez votre communauté Instagram rapidement et en toute sécurité.", 
      en: "Grow your Instagram community quickly and safely." 
    },
    options: [
      { label: "1 000", price: 2000 },
      { label: "2 000", price: 3500 },
      { label: "10 000", price: 15000 }
    ],
    reviews: []
  },
  { 
    id: 34, 
    title: { fr: "Packs Combo Instagram (Likes + Vues)", en: "Instagram Combo Packs (Likes + Views)" }, 
    price: 1000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/insta-combo.png", 
    type: 'digital', 
    date: '2024-04-17',
    description: { 
      fr: "Améliorez l'engagement de vos publications Instagram.", 
      en: "Improve the engagement of your Instagram posts." 
    },
    options: [
      { label: "1K Likes + 2K Vues", price: 1000 },
      { label: "2K Likes + 4K Vues", price: 2000 },
      { label: "10K Likes + 20K Vues", price: 6000 }
    ],
    reviews: []
  },
  { 
    id: 35, 
    title: { fr: "Abonnés / Followers Facebook", en: "Facebook Followers" }, 
    price: 2000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/fb-followers.png", 
    type: 'digital', 
    date: '2024-04-18',
    description: { 
      fr: "Augmentez le nombre de followers sur votre page ou profil Facebook.", 
      en: "Increase the number of followers on your Facebook page or profile." 
    },
    options: [
      { label: "1 000", price: 2000 },
      { label: "2 000", price: 4000 },
      { label: "10 000", price: 19000 }
    ],
    reviews: []
  },
  { 
    id: 36, 
    title: { fr: "Mentions J'aime Facebook (Likes)", en: "Facebook Likes" }, 
    price: 3500, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/fb-likes.png", 
    type: 'digital', 
    date: '2024-04-19',
    description: { 
      fr: "Boostez la crédibilité de vos posts Facebook avec des likes.", 
      en: "Boost the credibility of your Facebook posts with likes." 
    },
    options: [
      { label: "5 000", price: 3500 },
      { label: "10 000", price: 8000 },
      { label: "50 000", price: 35000 }
    ],
    reviews: []
  },
  { 
    id: 37, 
    title: { fr: "Abonnés YouTube", en: "YouTube Subscribers" }, 
    price: 4500, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/yt-subscribers.png", 
    type: 'digital', 
    date: '2024-04-20',
    description: { 
      fr: "Atteignez plus rapidement les seuils de monétisation YouTube.", 
      en: "Reach YouTube monetization thresholds faster." 
    },
    options: [
      { label: "1 000", price: 4500 },
      { label: "2 000", price: 7500 },
      { label: "10 000", price: 40000 }
    ],
    reviews: []
  },
  { 
    id: 38, 
    title: { fr: "Likes YouTube", en: "YouTube Likes" }, 
    price: 2000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/yt-likes.png", 
    type: 'digital', 
    date: '2024-04-21',
    description: { 
      fr: "Améliorez le référencement de vos vidéos YouTube avec des likes.", 
      en: "Improve the SEO of your YouTube videos with likes." 
    },
    options: [
      { label: "1 000", price: 2000 },
      { label: "2 000", price: 4000 },
      { label: "5 000", price: 8000 }
    ],
    reviews: []
  },
  { 
    id: 39, 
    title: { fr: "Membres / Abonnés Telegram", en: "Telegram Members" }, 
    price: 2000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/tg-members.png", 
    type: 'digital', 
    date: '2024-04-22',
    description: { 
      fr: "Développez votre audience sur vos canaux et groupes Telegram.", 
      en: "Grow your audience on your Telegram channels and groups." 
    },
    options: [
      { label: "1 000", price: 2000 },
      { label: "2 000", price: 4000 },
      { label: "10 000", price: 15000 }
    ],
    reviews: []
  },
  { 
    id: 40, 
    title: { fr: "Vues de Publication Telegram", en: "Telegram Post Views" }, 
    price: 3500, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/tg-views.png", 
    type: 'digital', 
    date: '2024-04-23',
    description: { 
      fr: "Augmentez la portée de vos messages sur Telegram.", 
      en: "Increase the reach of your messages on Telegram." 
    },
    options: [
      { label: "10 000", price: 3500 },
      { label: "50 000", price: 8000 },
      { label: "100 000", price: 10000 }
    ],
    reviews: []
  },
  { 
    id: 41, 
    title: { fr: "Followers X (Twitter)", en: "X (Twitter) Followers" }, 
    price: 7000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/twitter-followers.png", 
    type: 'digital', 
    date: '2024-04-24',
    description: { 
      fr: "Renforcez votre présence et votre influence sur X.", 
      en: "Strengthen your presence and influence on X." 
    },
    options: [
      { label: "1 000", price: 7000 },
      { label: "2 000", price: 14000 },
      { label: "10 000", price: 70000 }
    ],
    reviews: []
  },
  { 
    id: 42, 
    title: { fr: "Engagement X (Likes & Retweets)", en: "X Engagement (Likes & Retweets)" }, 
    price: 1500, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/twitter-engagement.png", 
    type: 'digital', 
    date: '2024-04-25',
    description: { 
      fr: "Boostez la viralité de vos tweets avec des likes et retweets.", 
      en: "Boost the virality of your tweets with likes and retweets." 
    },
    options: [
      { label: "1 000 Likes", price: 1500 },
      { label: "5 000 Likes", price: 7000 },
      { label: "5 000 Retweets", price: 9000 }
    ],
    reviews: []
  },
  { 
    id: 43, 
    title: { fr: "Abonnés Spotify Playlist/Artiste", en: "Spotify Playlist/Artist Followers" }, 
    price: 5000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/spotify-followers.png", 
    type: 'digital', 
    date: '2024-04-26',
    description: { 
      fr: "Augmentez votre base de fans sur Spotify.", 
      en: "Increase your fan base on Spotify." 
    },
    options: [
      { label: "1 000", price: 5000 },
      { label: "2 000", price: 7500 },
      { label: "10 000", price: 20000 }
    ],
    reviews: []
  },
  { 
    id: 44, 
    title: { fr: "Streams / Écoutes Spotify (Plays)", en: "Spotify Streams (Plays)" }, 
    price: 2000, 
    category: { fr: "Boostage Réseaux Sociaux", en: "Social Media Boosting" }, 
    image: "/products/boostage/spotify-streams.png", 
    type: 'digital', 
    date: '2024-04-27',
    description: { 
      fr: "Boostez le nombre d'écoutes de vos titres sur Spotify.", 
      en: "Boost the number of plays of your tracks on Spotify." 
    },
    options: [
      { label: "1 000", price: 2000 },
      { label: "5 000", price: 10000 },
      { label: "10 000", price: 20000 }
    ],
    reviews: []
  },
  // 12. Cadres Photos Premium
  { 
    id: 45, 
    title: { fr: "Cadre Photo (Format Standard)", en: "Photo Frame (Standard Format)" }, 
    price: 5000, 
    category: { fr: "Cadres Photos Premium", en: "Premium Photo Frames" }, 
    image: "/products/cadres/cardre photo portrait 40-60.jpg", 
    images: [
      "/products/cadres/cardre photo portrait 40-60.jpg",
      "/products/cadres/cardre photo portrait 24-30.png",
      "/products/cadres/cardre photo portrait 30-35.png",
      "/products/cadres/cardre photo portrait 40-60 (4).jpg",
      "/products/cadres/cardre photo portrait 40-60(2).jpg",
      "/products/cadres/cardre photo portrait 40-60(3).jpg",
      "/products/cadres/cardre photo portrait 40-60(4).jpg",
      "/products/cadres/cardre photo portrait 40-60(5).jpg",
      "/products/cadres/cardre photo portrait 40-60(6).png",
      "/products/cadres/cardre photo portrait 50-70.jpg",
      "/products/cadres/cardre photo portrait 50-70(2).jpg",
      "/products/cadres/cardre photo portrait 50-70(3).jpg",
      "/products/cadres/cardre photo portrait 50-70(5).jpg",
      "/products/cadres/cardre photo portrait 50-709(4).jpg"
    ],
    type: 'physical', 
    date: '2024-04-28',
    description: { 
      fr: "Sublimez vos souvenirs avec nos cadres élégants au fini noir mat. Idéal pour la décoration intérieure, les bureaux ou les cadeaux personnalisés. Chaque cadre est livré avec une vitre de protection pour préserver vos photos.\n\n• Format Mini (24x30 cm) : Idéal pour un bureau ou une petite étagère.\n• Format Moyen (30x45 cm) : Parfait pour les portraits individuels ou les photos de famille.\n• Format Large (40x60 cm) : Idéal pour une décoration murale de salon.\n• Format XL (50x70 cm) : Grand format pour un impact visuel maximal (posters, photos de mariage).", 
      en: "Enhance your memories with our elegant matte black finish frames. Ideal for home decor, offices or personalized gifts. Each frame comes with a protective glass to preserve your photos.\n\n• Mini Format (24x30 cm): Ideal for a desk or a small shelf.\n• Medium Format (30x45 cm): Perfect for individual portraits or family photos.\n• Large Format (40x60 cm): Ideal for living room wall decoration.\n• XL Format (50x70 cm): Large format for maximum visual impact (posters, wedding photos)." 
    },
    options: [
      { label: "Format Mini (24x30 cm)", price: 5000 },
      { label: "Format Moyen (30x45 cm)", price: 7500 },
      { label: "Format Large (40x60 cm)", price: 12000 },
      { label: "Format XL (50x70 cm)", price: 20000 }
    ],
    reviews: []
  },
  // 13. Abonnements Premium
  { 
    id: 46, 
    title: { fr: "Abonnement Canal+", en: "Canal+ Subscription" }, 
    price: 5000, 
    category: { fr: "Abonnements", en: "Subscriptions" }, 
    image: "/products/abonnements/canal-plus.png", 
    type: 'digital', 
    date: '2024-04-29',
    description: { 
      fr: "Choisissez l'abonnement Canal+ qui vous ressemble. Profitez du meilleur de la TV et radio avec une sélection de programmes pour toute la famille incluant sport (Ligue 1, Champions League, Bundesliga), séries, films et documentaires.", 
      en: "Choose the Canal+ subscription that suits you. Enjoy the best of TV and radio with a selection of programs for the whole family including sports (Ligue 1, Champions League, Bundesliga), series, movies, and documentaries." 
    },
    options: [
      { label: "ACCESS (5 000 FCFA/mois)", price: 5000 },
      { label: "EVASION (10 500 FCFA/mois)", price: 10500 },
      { label: "ACCESS+ (15 000 FCFA/mois)", price: 15000 },
      { label: "TOUT CANAL+ (28 000 FCFA/mois)", price: 28000 }
    ],
    reviews: []
  },
  { 
    id: 47, 
    title: { fr: "Abonnement Netflix", en: "Netflix Subscription" }, 
    price: 5000, 
    category: { fr: "Abonnements", en: "Subscriptions" }, 
    image: "/products/abonnements/netflix.png", 
    type: 'digital', 
    date: '2024-04-30',
    description: { 
      fr: "Abonnement Netflix valide 1 an. Avantages : Streaming sans bug, Qualité en 4K/HD, Téléchargement hors ligne, Mobilité et flexibilité, Compte personnel. Disponible sur Android, iOS, PC et Smart TV.", 
      en: "1-year Netflix subscription. Benefits: Bug-free streaming, 4K/HD quality, Offline downloads, Mobility and flexibility, Personal account. Available on Android, iOS, PC, and Smart TV." 
    },
    options: [
      { label: "Abonnement 1 an", price: 5000 }
    ],
    reviews: []
  },
  { 
    id: 48, 
    title: { fr: "Abonnement ChatGPT Pro", en: "ChatGPT Pro Subscription" }, 
    price: 3500, 
    category: { fr: "Abonnements", en: "Subscriptions" }, 
    image: "/products/abonnements/chatgpt.png", 
    type: 'digital', 
    date: '2024-05-01',
    description: { 
      fr: "Abonnement mensuel ChatGPT Pro (Plus). Débloquez la puissance de l'IA la plus avancée avec accès prioritaire et fonctionnalités exclusives.", 
      en: "ChatGPT Pro (Plus) monthly subscription. Unlock the power of the most advanced AI with priority access and exclusive features." 
    },
    options: [
      { label: "Abonnement 1 mois", price: 3500 }
    ],
    reviews: []
  },
  // 14. Création Musicale (Audio & Beats)
  { 
    id: 49, 
    title: { fr: "Pack Célébration & Amour", en: "Celebration & Love Pack" }, 
    price: 2000, 
    category: { fr: "Création Musicale", en: "Music Creation" }, 
    image: "https://picsum.photos/seed/music-celebration/800/600", 
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    type: 'digital', 
    date: '2024-05-02',
    description: { 
      fr: "Création musicale sur-mesure pour vos mariages, baptêmes, demandes en mariage ou anniversaires. Suscitez des larmes de joie avec des mélodies pop émotionnelles, afropop ou orchestrales.", 
      en: "Custom music creation for weddings, baptisms, proposals or birthdays. Evoke tears of joy with emotional pop, afropop or orchestral melodies." 
    },
    options: [
      { label: "Standard (Usage Personnel, 1 min)", price: 2000 },
      { label: "Professionnel (Standard, jusqu'à 3 min)", price: 3500 },
      { label: "Premium (Droits Commerciaux, Illimité)", price: 5000 }
    ],
    reviews: []
  },
  { 
    id: 50, 
    title: { fr: "Pack Déclaration & Pardon", en: "Declaration & Forgiveness Pack" }, 
    price: 2000, 
    category: { fr: "Création Musicale", en: "Music Creation" }, 
    image: "https://picsum.photos/seed/music-forgive/800/600", 
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    type: 'digital', 
    date: '2024-05-03',
    description: { 
      fr: "Une lettre musicale pour demander pardon (parents, amis) ou faire une déclaration d'amour intense. Des sons profonds (piano nostalgique, R&B spirituel, acoustique intimiste).", 
      en: "A musical letter to apologize (parents, friends) or make an intense declaration of love. Deep sounds (nostalgic piano, spiritual R&B, intimate acoustic)." 
    },
    options: [
      { label: "Standard (Usage Personnel, 1 min)", price: 2000 },
      { label: "Professionnel (Standard, jusqu'à 3 min)", price: 3500 },
      { label: "Premium (Droits Commerciaux, Illimité)", price: 5000 }
    ],
    reviews: []
  },
  { 
    id: 51, 
    title: { fr: "Pack Créateur & Beats", en: "Creator & Beats Pack" }, 
    price: 2000, 
    category: { fr: "Création Musicale", en: "Music Creation" }, 
    image: "https://picsum.photos/seed/music-beats/800/600", 
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    type: 'digital', 
    date: '2024-05-04',
    description: { 
      fr: "Des beats explosifs pour le Rap/Chant (Afrobeats, Trap, Drill) ou de la musique de fond parfaite pour vos vidéos YouTube, podcasts et publicités.", 
      en: "Explosive beats for Rap/Singing (Afrobeats, Trap, Drill) or perfect background music for your YouTube videos, podcasts, and ads." 
    },
    options: [
      { label: "Standard (Usage Personnel, 1 min)", price: 2000 },
      { label: "Professionnel (Standard, jusqu'à 3 min)", price: 3500 },
      { label: "Premium (Droits Commerciaux, Illimité)", price: 5000 }
    ],
    reviews: []
  },
  { 
    id: 52, 
    title: { fr: "Pack Cinématique & Zen", en: "Cinematic & Zen Pack" }, 
    price: 2000, 
    category: { fr: "Création Musicale", en: "Music Creation" }, 
    image: "https://picsum.photos/seed/music-zen/800/600", 
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    type: 'digital', 
    date: '2024-05-05',
    description: { 
      fr: "Plongez dans des univers sonores absolus. Idéal pour la méditation (fréquences de guérison), le yoga, ou pour des trailers et courts-métrages épiques.", 
      en: "Immerse yourself in absolute sound universes. Ideal for meditation (healing frequencies), yoga, or epic trailers and short films." 
    },
    options: [
      { label: "Standard (Usage Personnel, 1 min)", price: 2000 },
      { label: "Professionnel (Standard, jusqu'à 3 min)", price: 3500 },
      { label: "Premium (Droits Commerciaux, Illimité)", price: 5000 }
    ],
    reviews: []
  }
];

// --- Components ---

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="glass p-8 rounded-3xl hover:border-pink-500/30 transition-all group">
    <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-200 text-sm leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, role, text, avatar }: { name: string; role: string; text: string; avatar: string }) => (
  <div className="glass p-8 rounded-3xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <Quote className="w-12 h-12 text-pink-500" />
    </div>
    <p className="text-slate-600 dark:text-slate-200 mb-8 italic relative z-10">"{text}"</p>
    <div className="flex items-center gap-4">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-pink-500/20" referrerPolicy="no-referrer" />
      <div>
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-xs text-pink-500">{role}</p>
      </div>
    </div>
  </div>
);

const ReviewSection = ({ 
  reviews, 
  lang, 
  onAddReview 
}: { 
  reviews: Review[]; 
  lang: Language; 
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void 
}) => {
  const t = TRANSLATIONS[lang];
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;
    onAddReview({ userName, rating, comment });
    setUserName('');
    setComment('');
    setRating(5);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-12 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">{t.reviews}</h3>
        {averageRating && (
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{averageRating} / 5</span>
            <span className="text-xs opacity-80">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-200 italic">{t.noReviews}</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="glass p-6 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold">{r.userName}</span>
                <span className="text-xs opacity-80">{r.date}</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-slate-600'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-200">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="glass p-8 rounded-[2rem] space-y-6 form-glow-border">
        <h4 className="text-xl font-bold">{t.addReview}</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-2">{t.name}</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full glass px-6 py-3 rounded-xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-2">{t.rating}</label>
              <select 
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full glass px-6 py-3 rounded-xl outline-none bg-transparent"
              >
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n} className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{n} Stars</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-80 ml-2">{t.comment}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full glass px-6 py-3 rounded-xl outline-none h-24 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/20">
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

const Services = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const serviceCategories = [
    { 
      id: 'engagement', 
      title: { fr: 'Fiançailles', en: 'Engagement' }, 
      icon: Heart, 
      color: 'from-pink-500 to-rose-500',
      desc: { fr: 'Organisation, décoration et cadeaux pour célébrer l\'engagement.', en: 'Organization, decoration, and gifts to celebrate commitment.' }
    },
    { 
      id: 'wedding', 
      title: { fr: 'Mariage', en: 'Wedding' }, 
      icon: Moon, 
      color: 'from-purple-600 to-indigo-600',
      desc: { fr: 'Services premium pour le plus beau jour de votre vie.', en: 'Premium services for the most beautiful day of your life.' }
    },
    { 
      id: 'birthday', 
      title: { fr: 'Anniversaire', en: 'Birthday' }, 
      icon: Sparkles, 
      color: 'from-yellow-500 to-orange-500',
      desc: { fr: 'Animation, gâteaux et planification pour des moments inoubliables.', en: 'Animation, cakes, and planning for unforgettable moments.' }
    },
    { 
      id: 'others', 
      title: { fr: 'Autres', en: 'Others' }, 
      icon: Zap, 
      color: 'from-slate-500 to-slate-700',
      desc: { fr: 'Tout autre service créatif ou événementiel.', en: 'Any other creative or event services.' }
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <CyberpunkGlitchText className="text-4xl md:text-7xl font-display font-black mb-6">
          {t.servicesTitle}
        </CyberpunkGlitchText>
        <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto font-medium lead-relaxed">
          {t.servicesSubtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {serviceCategories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] border-white/10 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-30 transition-opacity`} />
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-xl mb-6`}>
              <cat.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{cat.title[lang]}</h3>
            <p className="text-sm opacity-70 leading-relaxed mb-6">{cat.desc[lang]}</p>
            <button className="text-sm font-bold flex items-center gap-2 text-pink-500 group-hover:gap-3 transition-all">
              {lang === 'fr' ? 'Explorer' : 'Explore'} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Gab's Nails Promotional Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass p-8 md:p-12 rounded-[3rem] mb-20 border-pink-500/30 relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/5 to-transparent pointer-events-none" />
        
        <div className="w-40 h-40 md:w-64 md:h-64 shrink-0 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-1 shadow-2xl shadow-pink-500/20 relative z-10">
          <img 
            src="/products/gabs-nails/logo Gab's nails.png" 
            alt="Gab's Nails Logo" 
            className="w-full h-full object-cover rounded-full bg-white"
          />
        </div>

        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-500 rounded-full font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Partenaire Recommandé
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4">
            Gab's <span className="gradient-text">Nails</span>
          </h2>
          <p className="text-lg opacity-80 mb-6 leading-relaxed">
            {lang === 'fr' 
              ? "L'expertise en onglerie pour tous vos événements : Mariages, dot, cérémonies professionnelles ou simple moment de beauté. Profitez de poses en capsule, vernis gel et construction polygel d'une durabilité exceptionnelle." 
              : "Expert nail artistry for all your events: Weddings, traditional ceremonies, or simply treating yourself. Enjoy high-quality capsules, gel polish, and durable polygel constructions."}
          </p>
          <Link to="/gabs-nails" className="inline-flex px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/30 hover:scale-105 transition-transform items-center gap-2">
            {lang === 'fr' ? "Visiter le catalogue Gab's Nails" : "Visit Gab's Nails Catalog"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass p-12 md:p-20 rounded-[3rem] text-center border-pink-500/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h2 className="text-3xl md:text-5xl font-display font-black mb-8">
          {lang === 'fr' ? 'Envie de proposer votre ' : 'Want to offer your '}
          <span className="gradient-text">{lang === 'fr' ? 'Propre Service ?' : 'Own Service?'}</span>
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {lang === 'fr' 
            ? 'Rejoignez notre réseau de prestataires et gagnez en visibilité auprès de milliers de clients potentiels.' 
            : 'Join our service provider network and gain visibility among thousands of potential clients.'}
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-pink-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-500/20"
        >
          {lang === 'fr' ? 'Soumettre mon service' : 'Submit my service'}
        </motion.button>
      </motion.div>
    </div>
  );
};

const AnimatedBackground = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [45, 65]);
  const gridSkewY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, 0]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 50;
      const y = (clientY / window.innerHeight - 0.5) * 50;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--bg-primary)]">
      {/* Noise Overlay Filter */}
      <div className="noise-overlay" />

      {/* Neural Particle Network */}
      <ParticleNetwork />
      
      {/* Wavy Perspective Grid */}
      <motion.div 
        style={{ 
          perspective: '1000px', 
          rotateX: gridRotateX,
          skewY: gridSkewY,
          scale: gridScale
        }}
        className="absolute inset-0 origin-center transition-transform duration-700"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* 3D Motion Blobs */}
      <motion.div 
        style={{ x: smoothX, y: smoothY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* Deep Purple Glow */}
        <motion.div 
          animate={{ 
            x: [0, 50, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen dark:mix-blend-soft-light" 
        />
        
        {/* Vibrant Pink Glow */}
        <motion.div 
          animate={{ 
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1.1, 0.9, 1.2, 1.1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-15%] w-[55vw] h-[55vw] bg-pink-500/10 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-soft-light" 
        />

        {/* === FULL-SCREEN CIRCULATING SMOKE SYSTEM (OPTIMIZED) === */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Layer 1 — Pink smoke top-left → bottom-right */}
          <motion.div
            animate={{ x: ['0%', '40%', '-20%', '0%'], y: ['0%', '30%', '-20%', '0%'], scale: [1, 1.3, 0.9, 1], opacity: [0.18, 0.28, 0.18] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'blur(80px)', willChange: 'transform', position: 'absolute', top: '-10%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 2 — Purple smoke top-right → center */}
          <motion.div
            animate={{ x: ['0%', '-50%', '20%', '0%'], y: ['0%', '40%', '-10%', '0%'], scale: [1.1, 0.8, 1.2, 1.1], opacity: [0.2, 0.12, 0.2] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            style={{ filter: 'blur(90px)', willChange: 'transform', position: 'absolute', top: '-5%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(147,51,234,0.25) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 3 — Pink smoke center-left circling */}
          <motion.div
            animate={{ x: ['0%', '60%', '20%', '-30%', '0%'], y: ['0%', '-20%', '50%', '20%', '0%'], scale: [1, 1.4, 1, 0.9, 1], opacity: [0.15, 0.22, 0.1, 0.22, 0.15] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ filter: 'blur(100px)', willChange: 'transform', position: 'absolute', top: '30%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 4 — Purple smoke center-right */}
          <motion.div
            animate={{ x: ['0%', '-40%', '-60%', '0%'], y: ['0%', '20%', '-30%', '0%'], scale: [1.2, 0.9, 1.3, 1.2], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
            style={{ filter: 'blur(110px)', willChange: 'transform', position: 'absolute', top: '25%', right: '-15%', width: '65vw', height: '65vw', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 5 — Pink smoke bottom-left → top */}
          <motion.div
            animate={{ x: ['0%', '30%', '60%', '0%'], y: ['0%', '-50%', '-20%', '0%'], scale: [1, 1.2, 1, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            style={{ filter: 'blur(90px)', willChange: 'transform', position: 'absolute', bottom: '-10%', left: '0%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 6 — Purple smoke bottom-right → left */}
          <motion.div
            animate={{ x: ['0%', '-60%', '-30%', '0%'], y: ['0%', '-30%', '-60%', '0%'], scale: [0.9, 1.3, 1, 0.9], opacity: [0.18, 0.25, 0.18] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
            style={{ filter: 'blur(100px)', willChange: 'transform', position: 'absolute', bottom: '-15%', right: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(147,51,234,0.22) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 7 — Center drifting pink cloud */}
          <motion.div
            animate={{ x: ['-20%', '30%', '-10%', '-20%'], y: ['-10%', '20%', '40%', '-10%'], scale: [1, 1.5, 0.8, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            style={{ filter: 'blur(120px)', willChange: 'transform', position: 'absolute', top: '40%', left: '30%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 8 — Slow drifting violet center-top */}
          <motion.div
            animate={{ x: ['10%', '-30%', '20%', '10%'], y: ['5%', '-15%', '30%', '5%'], scale: [1.1, 0.85, 1.2, 1.1], opacity: [0.15, 0.08, 0.15] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'easeInOut', delay: 15 }}
            style={{ filter: 'blur(130px)', willChange: 'transform', position: 'absolute', top: '10%', left: '20%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', borderRadius: '50%' }}
          />
        </div>
      </motion.div>

      {/* Neon Rain Drops */}
      <div className="absolute inset-0 z-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={`pink-${i}`}
            className="absolute w-[1px] bg-gradient-to-b from-transparent via-pink-500 to-transparent animate-neon-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${100 + Math.random() * 150}px`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3,
            }}
          />
        ))}
        {[...Array(30)].map((_, i) => (
          <div
            key={`purple-${i}`}
            className="absolute w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-neon-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${150 + Math.random() * 200}px`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 7}s`,
              opacity: 0.2,
            }}
          />
        ))}
      </div>

      {/* Grid Mesh Distortion Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-20 dark:opacity-40" />
    </div>
  );
});

const ProductCard = ({ product, lang, country, addToCart, ...props }: { product: Product, lang: Language, country: Country, addToCart: (p: Product, o?: ProductOption) => void, [key: string]: any }) => {
  const t = TRANSLATIONS[lang];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className="glass rounded-[2rem] p-4 group relative overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
        <img 
          src={product.image} 
          alt={product.title[lang]} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
          {product.type === 'digital' ? <FileDigit className="w-3 h-3" /> : <Package className="w-3 h-3" />}
          {t[product.type]}
        </div>
      </Link>
      <div className="px-2">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors line-clamp-1">{product.title[lang]}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {product.options && product.options.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t.startingFrom}</span>
            )}
            <div className="text-2xl font-display font-extrabold">
              {Math.round(product.price * country.rate)} <span className="text-sm font-bold text-pink-500">{country.symbol}</span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, product.options?.[0])}
            className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-lg hover:shadow-pink-500/40"
          >
            <ShoppingCart className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};




const Home = ({ lang, addToCart, country }: { lang: Language; addToCart: (p: Product) => void; country: Country }) => {
  const t = TRANSLATIONS[lang];
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-pink-500/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-8xl font-display font-extrabold leading-tight mb-6 md:mb-8"
          >
            <CyberpunkGlitchText>
              {lang === 'fr' ? 'Tout ce dont vous avez ' : 'Everything you '} 
              <span className="gradient-text">{lang === 'fr' ? 'besoin' : 'need'}</span>
            </CyberpunkGlitchText>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto mb-10 md:mb-12"
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/shop">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-extrabold shadow-2xl shadow-pink-500/40 flex items-center justify-center gap-3 group magnetic-button"
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                {t.explore}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-bold">{t.featured}</h2>
            <Link to="/shop" className="text-pink-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              {t.shop} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} country={country} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t.features}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Zap />} title={t.instantAccess} desc={t.instantAccessDesc} />
            <FeatureCard icon={<Shield />} title={t.securePayment} desc={t.securePaymentDesc} />
            <FeatureCard icon={<Globe />} title={t.globalLicense} desc={t.globalLicenseDesc} />
            <FeatureCard icon={<Star />} title={t.premiumQuality} desc={t.premiumQualityDesc} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <CyberpunkGlitchText>{t.testimonials}</CyberpunkGlitchText>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson" 
              role="Digital Artist" 
              text="DualVibe has completely changed how I source my design assets. The quality is unmatched." 
              avatar="https://picsum.photos/seed/sarah/100/100" 
            />
            <TestimonialCard 
              name="Marc Kouassi" 
              role="Entrepreneur" 
              text="Le service est rapide et les produits physiques sont arrivés en parfait état. Je recommande vivement !" 
              avatar="https://picsum.photos/seed/marc/100/100" 
            />
            <TestimonialCard 
              name="Elena Rodriguez" 
              role="Developer" 
              text="The crypto course was very insightful. Great platform for both digital and physical goods." 
              avatar="https://picsum.photos/seed/elena/100/100" 
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us CTA section */}
      <section className="py-24 relative bg-pink-500/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-8"
          >
            <h2 className="text-3xl md:text-6xl font-display font-black leading-tight">
              <CyberpunkGlitchText>
                {lang === 'fr' ? "Besoin d'un projet " : "Need a custom "}
                <span className="gradient-text">{lang === 'fr' ? 'Sur-Mesure ?' : 'Project?'}</span>
              </CyberpunkGlitchText>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-200 opacity-80 max-w-2xl font-medium">
              {lang === 'fr' 
                ? 'Confiez-nous vos idées les plus folles. Notre studio de création transforme vos visions en réalité avec une touche d\'excellence.'
                : 'Entrust us with your wildest ideas. Our creative studio turns your visions into reality with a touch of excellence.'}
            </p>
            <Link to="/studio">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white dark:bg-slate-900 border-2 border-pink-500 text-pink-500 rounded-3xl font-black text-xl flex items-center gap-4 transition-all hover:bg-pink-500 hover:text-white group shadow-2xl shadow-pink-500/10"
              >
                <Sparkles className="w-7 h-7 group-hover:animate-spin" />
                {lang === 'fr' ? 'Accéder au Studio' : 'Go to Studio'}
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const About = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <>
      <section className="pt-40 pb-20 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-display font-black mb-12 text-center"
          >
            <CyberpunkGlitchText>
              {lang === 'fr' ? 'Notre ' : 'Our '}
              <span className="gradient-text">{lang === 'fr' ? 'Histoire' : 'Story'}</span>
            </CyberpunkGlitchText>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 md:p-16 rounded-[3rem] space-y-10 border-white/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full" />
            <p className="text-xl text-slate-600 dark:text-slate-200 leading-relaxed font-medium">
              {t.aboutText}
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-display font-bold text-pink-500 flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  {t.mission}
                </h2>
                <p className="text-slate-600 dark:text-slate-200 leading-relaxed opacity-80">
                  {t.missionText}
                </p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-6xl font-black mb-3 text-shadow-lg">10k+</div>
                <div className="text-lg font-bold opacity-90 uppercase tracking-widest">
                  {lang === 'fr' ? 'Clients Satisfaits' : 'Happy Clients'}
                </div>
                <Sparkles className="absolute bottom-6 right-6 w-12 h-12 opacity-20 group-hover:rotate-45 transition-transform" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About CTA Section */}
      <section className="py-24 bg-pink-500/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-16 rounded-[4rem] border-white/20 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 relative z-10">
              <CyberpunkGlitchText>
                {lang === 'fr' ? 'Prêt à ' : 'Ready to '}
                <span className="gradient-text">{lang === 'fr' ? 'Explorer ?' : 'Explore?'}</span>
              </CyberpunkGlitchText>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-pink-500 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-pink-500/20"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {t.shop}
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 glass border-2 border-pink-500 text-pink-500 rounded-2xl font-black flex items-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  {t.contact}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Contact = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-8xl font-display font-black mb-8 leading-tight">
                <CyberpunkGlitchText>
                  {lang === 'fr' ? 'Dites ' : 'Say '}
                  <span className="gradient-text">{lang === 'fr' ? 'Bonjour' : 'Hello'}</span>
                </CyberpunkGlitchText>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-200 mb-12 leading-relaxed opacity-80 font-medium">
                {t.footerDesc}
              </p>
              <div className="space-y-8 flex flex-col items-center lg:items-start">
                {[
                  { icon: Mail, label: 'Email', value: 'dualvibe237@gmail.com', color: 'text-pink-500' },
                  { icon: MessageCircle, label: 'WhatsApp', value: '+1 (289) 630-1143', color: 'text-green-500' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center text-pink-500 shadow-xl border-white/10 group-hover:border-pink-500/30 transition-all">
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm uppercase tracking-widest opacity-60 mb-1">{item.label}</h4>
                      <p className="text-xl font-display font-bold group-hover:text-pink-500 transition-colors">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-10 md:p-14 rounded-[3.5rem] border-white/20 shadow-2xl relative form-glow-border"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full" />
              <div className="space-y-8 relative z-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-3">{t.name}</label>
                    <input type="text" className="w-full glass px-8 py-5 rounded-2xl outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-3">{t.email}</label>
                    <input type="email" className="w-full glass px-8 py-5 rounded-2xl outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg" placeholder="Email" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-3">{t.message}</label>
                  <textarea className="w-full glass px-8 py-5 rounded-2xl outline-none h-44 resize-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg" placeholder="Message..." />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-pink-500/20 flex items-center justify-center gap-4 transition-all"
                >
                  <Send className="w-6 h-6" />
                  {t.send}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Secondary CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-12 rounded-[3.5rem] border-white/20 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 bg-purple-500/10 rounded-[2rem] flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 transition-transform">
                <Music className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">{lang === 'fr' ? 'Besoin de Musique ?' : 'Need Music?'}</h3>
              <p className="text-slate-600 dark:text-slate-200 mb-8 opacity-80">
                {lang === 'fr' ? 'Découvrez notre catalogue exclusif de licences.' : 'Discover our exclusive licensing catalog.'}
              </p>
              <Link to="/music-catalog">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold"
                >
                  {lang === 'fr' ? 'Voir le Catalogue' : 'View Catalog'}
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-12 rounded-[3.5rem] border-white/20 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 bg-pink-500/10 rounded-[2rem] flex items-center justify-center text-pink-500 mb-8 group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">{lang === 'fr' ? 'Projet Sur-Mesure ?' : 'Custom Project?'}</h3>
              <p className="text-slate-600 dark:text-slate-200 mb-8 opacity-80">
                {lang === 'fr' ? 'Notre studio est prêt à réaliser vos idées.' : 'Our studio is ready to realize your ideas.'}
              </p>
              <Link to="/studio">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-pink-500 text-white rounded-2xl font-bold"
                >
                  {lang === 'fr' ? 'Aller au Studio' : 'Go to Studio'}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

const Shop = ({ lang, country, addToCart, searchQuery, setSearchQuery }: { lang: Language; country: Country; addToCart: (p: Product) => void, searchQuery: string, setSearchQuery: (q: string) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const normalize = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const categories = useMemo(() => {
    const cats = new Set(PRODUCTS.map(p => p.category[lang]));
    return ['all', ...Array.from(cats)];
  }, [lang]);

  // Sync category with URL slug
  useEffect(() => {
    let extractedSlug = '';
    if (location.pathname.startsWith('/shop-')) {
      extractedSlug = location.pathname.substring(6);
    } else if (location.pathname.startsWith('/shop/')) {
      extractedSlug = location.pathname.substring(6);
    }
    
    if (extractedSlug) {
      const match = categories.find(cat => slugify(cat) === extractedSlug);
      if (match) {
        setCategory(match);
      } else {
        setCategory('all');
      }
    } else {
      setCategory('all');
    }
  }, [location.pathname, categories]);



  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const normalizedSearch = normalize(searchQuery);
      const searchTerms = normalizedSearch.split(' ').filter(t => t.length > 0);
      
      const productText = normalize(`${p.title[lang]} ${p.category[lang]} ${p.description[lang]}`);
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => productText.includes(term));
      
      const matchesType = filter === 'all' || p.type === filter;
      const matchesCategory = category === 'all' || normalize(p.category[lang]) === normalize(category);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesType && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'priceLow':
        result.sort((a, b) => (a.price * (country?.rate || 1)) - (b.price * (country?.rate || 1)));
        break;
      case 'priceHigh':
        result.sort((a, b) => (b.price * (country?.rate || 1)) - (a.price * (country?.rate || 1)));
        break;
      case 'alpha':
        result.sort((a, b) => a.title[lang].localeCompare(b.title[lang]));
        break;
    }

    return result;
  }, [searchQuery, filter, category, priceRange, lang, sortBy, country?.rate]);

  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Shop Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight">
            <CyberpunkGlitchText>
              <span className="gradient-text">{(t as any).shopHeroTitle}</span>
            </CyberpunkGlitchText>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto opacity-80 leading-relaxed font-medium">
            {(t as any).shopHeroSubtitle}
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full blur-[1px]" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h2 className="text-2xl font-display font-bold">{t.shop}</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFilterDrawerOpen(true)}
              className="glass px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm"
            >
              <Menu className="w-4 h-4" />
              {t.categories}
            </motion.button>
          </div>

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:w-64 space-y-8">
            <div className="glass p-6 rounded-3xl space-y-6 sticky top-32">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.search}</h3>
                <div className="flex items-center glass px-4 py-2 rounded-xl gap-2 border-white/5 focus-within:border-pink-500/50 transition-all">
                  <Search className="w-4 h-4 opacity-80" />
                  <input 
                    type="text" 
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.categories}</h3>
                <div className="space-y-1.5 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                  {categories.map(cat => (
                    <motion.button
                      key={cat}
                      whileHover={{ x: 6, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const slug = cat === 'all' ? '' : slugify(cat);
                        if (slug) {
                          navigate(`/shop-${slug}`);
                        } else {
                          navigate('/shop');
                        }
                        setSearchQuery('');
                        setIsFilterDrawerOpen(false);

                      }}

                      className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all relative group overflow-hidden ${category === cat ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="truncate">{cat === 'all' ? t.all : cat}</span>
                        {category === cat && <motion.div layoutId="activeCat" className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.priceRange}</h3>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="2000000" 
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-xs font-bold">
                    <span>0 {country.symbol}</span>
                    <span>{Math.round(priceRange[1] * country.rate).toLocaleString()} {country.symbol}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Filter Drawer (Mobile) */}
          <AnimatePresence>
            {isFilterDrawerOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 h-full w-80 glass z-[110] p-8 lg:hidden"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">{t.categories}</h2>
                    <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.search}</h3>
                      <div className="flex items-center glass px-4 py-2 rounded-xl gap-2 border-white/5">
                        <Search className="w-4 h-4 opacity-80" />
                        <input 
                          type="text" 
                          placeholder={t.search}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none outline-none text-sm w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.categories}</h3>
                      <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              const slug = cat === 'all' ? '' : slugify(cat);
                              if (slug) {
                                navigate(`/shop-${slug}`);
                              } else {
                                navigate('/shop');
                              }
                              setSearchQuery('');
                              setIsFilterDrawerOpen(false);
                            }}


                            className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all ${category === cat ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : ''}`}
                          >
                            {cat === 'all' ? t.all : cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex glass p-1 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                {(['all', 'physical', 'digital'] as const).map((f) => (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(f)}
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'hover:bg-white/5'}`}
                  >
                    {t[f as keyof typeof t]}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs font-bold opacity-80">{t.sortBy}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none outline-none text-sm font-bold cursor-pointer"
                >
                  <option value="newest" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.newest}</option>
                  <option value="priceLow" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.priceLow}</option>
                  <option value="priceHigh" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.priceHigh}</option>
                  <option value="alpha" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.alpha}</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  key={`${category}-${filter}-${searchQuery}`}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
                >
                  {filteredProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      layout
                    >
                      <ProductCard product={p} lang={lang} country={country} addToCart={addToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 glass rounded-[3rem] text-center"
                >
                  <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center text-pink-500 mb-6">
                    <Package className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}</h3>
                  <p className="opacity-60">{lang === 'fr' ? 'Essayez de modifier vos filtres ou votre recherche.' : 'Try adjusting your filters or search.'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const ImageGallery = ({ images, mainImage, title }: { images?: string[]; mainImage: string; title: string }) => {
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const galleryImages = images && images.length > 0 ? images : [mainImage];

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-4 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={index}
            src={galleryImages[index]} 
            alt={`${title} - image ${index + 1}`} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full aspect-[4/3] object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
          />
        </AnimatePresence>
        
        {galleryImages.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-500"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % galleryImages.length); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-500"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </motion.div>

      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${index === i ? 'border-pink-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-pink-500 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={galleryImages[index]}
              alt={title}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); }}
                  className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-pink-500 transition-colors"
                >
                  <ChevronRight className="w-8 h-8 rotate-180" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % galleryImages.length); }}
                  className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-pink-500 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetail = ({ lang, country, addToCart }: { lang: Language; country: Country; addToCart: (p: Product, o?: ProductOption) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    if (p) {
      setProduct(p);
      if (p.options && p.options.length > 0) {
        setSelectedOption(p.options[0]);
      }
    }
    else navigate('/shop');
  }, [id, navigate]);

  if (!product) return null;

  const currentPrice = selectedOption ? selectedOption.price : product.price;

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setProduct(prev => prev ? { ...prev, reviews: [review, ...prev.reviews] } : null);
  };

  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ImageGallery 
            images={product.images} 
            mainImage={product.image} 
            title={product.title[lang]} 
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="glass px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-pink-500">
                  {product.category[lang]}
                </span>
                <span className="glass px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
                  {t[product.type]}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold">{product.title[lang]}</h1>
              <div className="text-3xl md:text-4xl font-display font-extrabold gradient-text">
                {Math.round(currentPrice * country.rate)} {country.symbol}
              </div>
            </div>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-200 leading-relaxed">
              {product.description[lang]}
            </p>

            {product.audioPreview && (
              <div className="glass p-6 rounded-3xl flex flex-col gap-4 bg-pink-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-pink-500/30"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </motion.button>
                  <div>
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <Music className="w-4 h-4 text-pink-500" />
                      Extrait Audio
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Écoutez un aperçu du style musical</p>
                  </div>
                </div>
                {/* Audio Element Hidden */}
                <audio 
                  ref={audioRef} 
                  src={product.audioPreview} 
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            )}

            {/* Music Catalog CTA */}
            {[49, 50, 51, 52].includes(product.id) && (
              <Link 
                to="/music-catalog" 
                className="w-full py-4 mt-2 mb-2 bg-pink-500/10 border border-pink-500/30 text-pink-500 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors hover:bg-pink-500 hover:text-white"
              >
                <Music className="w-5 h-5" />
                DÉCOUVRIR LE CATALOGUE MUSICAL
              </Link>
            )}

            {product.options && product.options.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider opacity-80">{t.options || 'Options'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedOption(opt)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center ${selectedOption?.label === opt.label ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <span className="font-bold">{opt.label}</span>
                      <span className="text-sm opacity-80">{Math.round(opt.price * country.rate)} {country.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(product, selectedOption)}
              className="w-full py-5 md:py-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg md:text-xl shadow-xl shadow-pink-500/20 flex items-center justify-center gap-4 transition-all"
            >
              <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
              {t.addToCart}
            </motion.button>

            <ReviewSection 
              reviews={product.reviews} 
              lang={lang} 
              onAddReview={handleAddReview} 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
const CountrySelector = ({ onSelect, isDark }: { onSelect: (c: Country) => void; isDark: boolean }) => {
  const [selected, setSelected] = useState<Country | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black backdrop-blur-xl p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-zinc-950 border border-white/10 max-w-md w-full p-8 rounded-[2.5rem] text-center shadow-2xl"
      >
        <img 
          src={isDark ? '/logo-dark.png' : '/logo-light.png'} 
          alt="DualVibe Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <p className="text-white mb-8 opacity-90">Veuillez sélectionner votre pays / Please select your country</p>
        
        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 mb-8 custom-scrollbar">
          {COUNTRIES.map((c) => (
            <motion.button
              key={c.code}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(c)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${selected?.code === c.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              <span className="font-medium text-white">{c.name.fr} / {c.name.en}</span>
              <span className="text-pink-500 font-bold">{c.symbol}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 transition-all"
        >
          Continuer / Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeItem, 
  lang, 
  country 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: CartItem[]; 
  updateQuantity: (id: number | string, delta: number, optionLabel?: string) => void;
  removeItem: (id: number | string, optionLabel?: string) => void;
  lang: Language;
  country: Country;
}) => {
  const t = TRANSLATIONS[lang];
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  
  const [showCvForm, setShowCvForm] = useState(false);
  const [cvData, setCvData] = useState({
    fullName: '',
    phone: '',
    address: '',
    profile: '',
    experience: '',
    education: '',
    skills: '',
    languages: ''
  });

  const [showMusicForm, setShowMusicForm] = useState(false);
  const [musicData, setMusicData] = useState({
    category: '',
    event: '',
    emotion: '',
    target: '',
    story: ''
  });

  const VALID_PROMOS = ['Princestore', 'Baecstore', 'Mervistore', 'Gicostore', 'Ashstore'];
  const DISCOUNT_AMOUNT = 300; // 300 FCFA (converti automatiquement dans la monnaie du pays)

  const handleApplyPromo = () => {
    // Bloquer si un code promo a déjà été utilisé
    if (appliedPromo) {
      setPromoError((t as any).promoAlreadyUsed);
      setPromoInput('');
      return;
    }
    const found = VALID_PROMOS.find(p => p.toLowerCase() === promoInput.trim().toLowerCase());
    if (found) {
      setAppliedPromo(found);
      setPromoError(null);
      setPromoInput(''); // Clear input on success
    } else {
      setPromoError(t.invalidPromo);
    }
  };
  
  const total = cart.reduce((acc, item) => {
    const price = item.selectedOption ? item.selectedOption.price : item.price;
    return acc + (price * item.quantity);
  }, 0);
  const discount = appliedPromo ? DISCOUNT_AMOUNT : 0;
  const finalTotal = Math.max(0, total - discount);
  
  const convertedTotal = Math.round(finalTotal * (country.rate || 1));
  const convertedDiscount = Math.round(discount * (country.rate || 1));

  const handleCheckout = () => {
    const hasCvProduct = cart.some(item => item.id === 13 || item.id === 14);
    const hasMusicProduct = cart.some(item => [49, 50, 51, 52].includes(Number(item.id)));
    
    if (hasCvProduct && !showCvForm) {
      setShowCvForm(true);
      return;
    }

    if (hasMusicProduct && !showMusicForm) {
      setShowMusicForm(true);
      return;
    }

    let message = t.orderMessage;
    cart.forEach(item => {
      const price = item.selectedOption ? item.selectedOption.price : item.price;
      const title = item.selectedOption ? `${item.title[lang]} (${item.selectedOption.label})` : item.title[lang];
      message += `- ${title} (x${item.quantity}) : ${Math.round(price * country.rate)} ${country.symbol}\n`;
      
      if (item.customMetadata) {
        const meta = item.customMetadata;
        const labels = lang === 'fr' ? {
          cat: 'Catégorie',
          lic: 'Licence',
          name: 'Nom',
          proj: 'Projet'
        } : {
          cat: 'Category',
          lic: 'License',
          name: 'Name',
          proj: 'Project'
        };
        if (meta.category) message += `  [${labels.cat}: ${meta.category}]\n`;
        if (meta.licenseType) message += `  [${labels.lic}: ${meta.licenseType}]\n`;
        if (meta.buyerName) message += `  [${labels.name}: ${meta.buyerName}]\n`;
        if (meta.projectUse) message += `  [${labels.proj}: ${meta.projectUse}]\n`;
      }
    });
    
    if (appliedPromo) {
      message += `${t.promoUsed}${appliedPromo} (-${convertedDiscount} ${country.symbol})\n`;
    }
    
    message += `${t.orderTotal} ${convertedTotal} ${country.symbol}`;
    
    if (hasCvProduct && showCvForm) {
      message += `\n\n--- INFORMATIONS CV ---\n`;
      message += `Nom Complet: ${cvData.fullName}\n`;
      message += `Téléphone: ${cvData.phone}\n`;
      message += `Adresse: ${cvData.address}\n\n`;
      message += `Profil Professionnel:\n${cvData.profile}\n\n`;
      message += `Expériences:\n${cvData.experience}\n\n`;
      message += `Formations:\n${cvData.education}\n\n`;
      message += `Compétences:\n${cvData.skills}\n\n`;
      message += `Langues / Loisirs:\n${cvData.languages}\n`;
    }

    if (hasMusicProduct && showMusicForm) {
      message += `\n\n--- INSTRUCTIONS MUSICALES ---\n`;
      message += `Catégorie: ${musicData.category}\n`;
      message += `Occasion/Événement: ${musicData.event}\n`;
      message += `Émotions recherchées: ${musicData.emotion}\n`;
      message += `Destinataire: ${musicData.target}\n\n`;
      message += `L'Histoire à raconter:\n${musicData.story}\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/12896301143?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <ShoppingCart className="text-pink-500" />
                {showMusicForm ? (t as any).musicFormTitle : showCvForm ? (t as any).cvFormTitle : t.cart}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {showMusicForm ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">{(t as any).musicFormDesc}</p>
                  
                  <div className="space-y-4">
                    <input type="text" placeholder={(t as any).musicCategory} value={musicData.category} onChange={e => setMusicData({...musicData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 placeholder:text-slate-400" />
                    <input type="text" placeholder={(t as any).musicEvent} value={musicData.event} onChange={e => setMusicData({...musicData, event: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 placeholder:text-slate-400" />
                    <input type="text" placeholder={(t as any).musicEmotion} value={musicData.emotion} onChange={e => setMusicData({...musicData, emotion: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 placeholder:text-slate-400" />
                    <input type="text" placeholder={(t as any).musicTarget} value={musicData.target} onChange={e => setMusicData({...musicData, target: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 placeholder:text-slate-400" />
                    <textarea placeholder={(t as any).musicStory} value={musicData.story} onChange={e => setMusicData({...musicData, story: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 h-32 resize-none placeholder:text-slate-400" />
                  </div>
                </div>
              ) : showCvForm ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">{(t as any).cvFormDesc}</p>
                  
                  <div className="space-y-4">
                    <input type="text" placeholder={(t as any).fullName} value={cvData.fullName} onChange={e => setCvData({...cvData, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50" />
                    <input type="tel" placeholder={(t as any).phone} value={cvData.phone} onChange={e => setCvData({...cvData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50" />
                    <input type="text" placeholder={(t as any).address} value={cvData.address} onChange={e => setCvData({...cvData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50" />
                    
                    <textarea placeholder={(t as any).profile} value={cvData.profile} onChange={e => setCvData({...cvData, profile: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 h-24 resize-none" />
                    <textarea placeholder={(t as any).experience} value={cvData.experience} onChange={e => setCvData({...cvData, experience: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 h-24 resize-none" />
                    <textarea placeholder={(t as any).education} value={cvData.education} onChange={e => setCvData({...cvData, education: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 h-24 resize-none" />
                    <textarea placeholder={(t as any).skills} value={cvData.skills} onChange={e => setCvData({...cvData, skills: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 h-24 resize-none" />
                    <textarea placeholder={(t as any).languages} value={cvData.languages} onChange={e => setCvData({...cvData, languages: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 h-24 resize-none" />
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-200 gap-4">
                  <Package className="w-16 h-16 opacity-20" />
                  <p>{t.emptyCart}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {cart.map((item, idx) => {
                      const price = item.selectedOption ? item.selectedOption.price : item.price;
                      return (
                        <div key={`${item.id}-${item.selectedOption?.label || idx}`} className="flex gap-4 glass p-4 rounded-2xl relative group">
                          <img 
                            src={item.image} 
                            alt={item.title[lang]} 
                            className="w-20 h-20 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold mb-1">{item.title[lang]}</h4>
                            {item.selectedOption && (
                              <p className="text-xs font-bold text-pink-500/80 mb-1">{item.selectedOption.label}</p>
                            )}
                            {item.customMetadata && (
                              <div className="text-[10px] opacity-60 mb-1 space-y-0.5">
                                {item.customMetadata.category && <p>Catégorie: {item.customMetadata.category}</p>}
                                {item.customMetadata.licenseType && <p>Licence: {item.customMetadata.licenseType}</p>}
                              </div>
                            )}
                            <div className="text-pink-500 font-bold mb-3">
                              {Math.round(price * country.rate)} {country.symbol}
                            </div>
                            <div className="flex items-center gap-3">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, -1, item.selectedOption?.label)}
                                className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-pink-500/20"
                              >
                                -
                              </motion.button>
                              <span className="font-bold">{item.quantity}</span>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, 1, item.selectedOption?.label)}
                                className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-pink-500/20"
                              >
                                +
                              </motion.button>
                            </div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.2, color: '#ef4444' }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => removeItem(item.id, item.selectedOption?.label)}
                            className="absolute top-4 right-4 text-slate-600 dark:text-slate-200 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo Code Section */}
                  <div className="glass p-5 rounded-[2rem] space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-pink-500/10 transition-colors" />
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-pink-500" />
                      <label className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{t.promoCode}</label>
                    </div>
                    <div className="flex gap-2 relative z-10">
                      <input 
                        type="text" 
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={!!appliedPromo}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <motion.button
                        whileHover={!appliedPromo ? { scale: 1.05, x: 2 } : {}}
                        whileTap={!appliedPromo ? { scale: 0.95 } : {}}
                        onClick={handleApplyPromo}
                        disabled={!!appliedPromo}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t.apply}
                      </motion.button>
                    </div>
                    <AnimatePresence mode="wait">
                      {promoError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="text-xs text-red-400 font-bold flex items-center gap-2"
                        >
                          <X className="w-3 h-3" /> {promoError}
                        </motion.p>
                      )}
                      {appliedPromo && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-3 rounded-xl"
                        >
                          <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.promoApplied} ({appliedPromo})</span>
                          </div>
                          <button 
                            onClick={() => setAppliedPromo(null)}
                            className="text-green-400/50 hover:text-green-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                {!showCvForm && !showMusicForm && (
                  <>
                    {appliedPromo && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="opacity-80">{t.discount}</span>
                        <span className="text-green-500 font-bold">-{convertedDiscount} {country.symbol}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>{t.total}</span>
                      <span className="gradient-text">{convertedTotal} {country.symbol}</span>
                    </div>
                  </>
                )}
                <div className="flex gap-4">
                  {(showCvForm || showMusicForm) && (
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setShowCvForm(false); setShowMusicForm(false); }}
                      className="flex-1 py-4 glass text-slate-800 dark:text-white rounded-2xl font-bold flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
                    >
                      {(t as any).backToCart}
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className={`${(showCvForm || showMusicForm) ? 'flex-[2]' : 'w-full'} py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all`}
                  >
                    {!showCvForm && !showMusicForm && <MessageCircle className="w-6 h-6" />}
                    {(showCvForm || showMusicForm) ? (t as any).submitOrder : t.checkout}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const FloatingCTA = ({ lang, onSubscribe }: { lang: Language; onSubscribe: (e: any) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-24 right-8 z-[100] flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="glass p-6 rounded-[2rem] w-80 shadow-2xl border-pink-500/20 relative overflow-hidden group form-glow-border"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-pink-500/10 transition-colors" />
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Newsletter</h4>
                      <p className="text-[10px] opacity-60">Offres & Nouveautés</p>
                    </div>
                  </div>
                  <form onSubmit={(e) => {
                    onSubscribe(e);
                    setIsExpanded(false);
                  }} className="space-y-3">
                    <input 
                      name="email"
                      type="email" 
                      placeholder="votre@email.com" 
                      required 
                      className="w-full glass px-4 py-3 rounded-xl text-sm outline-none focus:border-pink-500/50 transition-all font-medium"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-pink-500/20"
                    >
                      {lang === 'fr' ? "C'est parti !" : "Let's go!"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/30 group relative"
          >
            <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
            <Sparkles className={`w-6 h-6 transition-transform duration-500 ${isExpanded ? 'rotate-90' : ''}`} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeartBurst: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => {
  const [particles] = useState(() => 
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 150,
      ty: -100 - Math.random() * 150,
      ts: 0.5 + Math.random() * 1.5,
      tr: (Math.random() - 0.5) * 45
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x, y }}
          animate={{ 
            opacity: 0, 
            scale: p.ts, 
            x: x + p.tx,
            y: y + p.ty,
            rotate: p.tr
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={p.id === 0 ? onComplete : undefined}
          className="absolute text-pink-500"
        >
          <Heart className="w-5 h-5 fill-current shadow-pink-500/50 filter drop-shadow-md" />
        </motion.div>
      ))}
    </div>
  );
};

// --- Dynamic Route Handler for /shop-slug and /gabs-nails ---
const DynamicRouteHandler = (props: any) => {
  const location = useLocation();
  
  if (location.pathname.startsWith('/shop-')) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <Shop {...props} />
      </motion.div>
    );
  }
  
  if (location.pathname === '/gabs-nails') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>}>
          <GabNails lang={props.lang} />
        </React.Suspense>
      </motion.div>
    );
  }

  // 404 fallback
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 text-center px-6">
      <h1 className="text-6xl md:text-8xl font-black gradient-text mb-6">404</h1>
      <p className="text-xl md:text-2xl font-bold opacity-80 mb-8">Page non trouvée / Page not found</p>
      <Link to="/" className="px-8 py-4 bg-pink-500 text-white rounded-xl font-bold">Retour à l'accueil</Link>
    </div>
  );
};

function AppContent() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        const id = Date.now() + Math.random();
        setHearts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      }
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Language>('fr');
  const [country, setCountry] = useState<Country | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const handleNewsletterSubmit = async (email: string) => {
    if (!email) return;
    setIsSubmittingNewsletter(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);
      
      if (error) throw error;
      setNotification(lang === 'fr' ? "Merci pour votre inscription !" : "Thanks for subscribing!");
    } catch (error) {
      console.error('Newsletter error:', error);
      // Fallback for UI if table not created yet or keys missing
      setNotification(lang === 'fr' ? "Inscription réussie !" : "Subscription successful!");
    } finally {
      setIsSubmittingNewsletter(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCountry = localStorage.getItem('dualvibe_country');
    if (savedCountry) {
      setCountry(JSON.parse(savedCountry));
    }
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const t = TRANSLATIONS[lang];

  const handleCountrySelect = (c: Country) => {
    setCountry(c);
    localStorage.setItem('dualvibe_country', JSON.stringify(c));
  };

  const addToCart = (product: Product, selectedOption?: ProductOption) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedOption?.label === selectedOption?.label
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedOption?.label === selectedOption?.label)
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedOption }];
    });
    setNotification(t.added);
    setTimeout(() => setNotification(null), 2000);
  };

  const updateQuantity = (id: number | string, delta: number, optionLabel?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedOption?.label === optionLabel) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number | string, optionLabel?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedOption?.label === optionLabel)));
  };

  // --- PERFORMANCE: Cache Management & Reset ---
  useEffect(() => {
    const CURRENT_VERSION = '2.2.0'; // Increment this to force cache clear
    const savedVersion = localStorage.getItem('dualvibe_version');
    
    if (savedVersion !== CURRENT_VERSION) {
      console.log('DualVibe: New version detected. Clearing old cache...');
      // Preserve essential user data if any, or clear all for fresh start
      const country = localStorage.getItem('dualvibe_country');
      localStorage.clear();
      if (country) localStorage.setItem('dualvibe_country', country);
      localStorage.setItem('dualvibe_version', CURRENT_VERSION);
    }
  }, []);

  if (!country) {
    return <CountrySelector onSelect={handleCountrySelect} isDark={isDark} />;
  }

  return (
    <>
      <AnimatedBackground />
      {hearts.map(h => (
        <HeartBurst 
          key={h.id} 
          x={h.x} 
          y={h.y} 
          onComplete={() => setHearts(prev => prev.filter(item => item.id !== h.id))} 
        />
      ))}
      <div className="min-h-screen selection:bg-pink-500 selection:text-white text-[var(--text-primary)] transition-colors duration-300 relative z-10">
        {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] glass px-6 py-3 rounded-full border-pink-500/50 flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle2 className="text-green-500 w-5 h-5" />
            <span className="font-bold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingCTA 
        lang={lang} 
        onSubscribe={(e) => {
          e.preventDefault();
          handleNewsletterSubmit(e.target.email.value);
          e.target.reset();
        }} 
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img 
                src={isDark ? '/logo-dark.png' : '/logo-light.png'} 
                alt="DualVibe Logo" 
                className="h-10 w-auto"
                loading="eager" // Logo should load fast
              />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {t.home}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
              <Link to="/shop" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {t.shop}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
              <Link to="/music-catalog" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {lang === 'fr' ? 'Musique' : 'Music'}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
              <Link to="/studio" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {t.studio}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
              <Link to="/services" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {t.services}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
              <Link to="/about" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {t.about}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
              <Link to="/contact" className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {t.contact}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-white/10 pr-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLang('fr')} 
                className={`text-xs font-bold transition-colors ${lang === 'fr' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
              >
                FR
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLang('en')} 
                className={`text-xs font-bold transition-colors ${lang === 'en' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
              >
                EN
              </motion.button>
            </div>
            
            <div className="hidden md:flex items-center glass px-4 py-2 rounded-full gap-2 border-white/5 focus-within:border-pink-500/50 transition-all">
              <Search className="w-4 h-4 opacity-80" />
              <input 
                type="text" 
                placeholder={t.search}
                value={searchQuery}
                onFocus={() => {
                  if (location.pathname !== '/shop') navigate('/shop');
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-40 lg:w-60 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(!isDark)} 
              className="p-2 rounded-full glass hover:bg-pink-500/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsCartOpen(true);
                setIsMenuOpen(false);
              }}
              className="relative p-2 rounded-full glass hover:bg-pink-500/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem('dualvibe_country');
                setCountry(null);
                setIsMenuOpen(false);
              }}
              className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold hover:bg-pink-500/10 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {country.code}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full glass hover:bg-pink-500/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {t.home}
                  </Link>
                  <Link 
                    to="/shop" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {t.shop}
                  </Link>
                  <Link 
                    to="/music-catalog" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {lang === 'fr' ? 'Musique' : 'Music'}
                  </Link>
                  <Link 
                    to="/studio" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {t.studio}
                  </Link>
                  <Link 
                    to="/services" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {t.services}
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {t.about}
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {t.contact}
                  </Link>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setLang('fr')} 
                      className={`text-sm font-bold transition-colors ${lang === 'fr' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
                    >
                      FR
                    </button>
                    <button 
                      onClick={() => setLang('en')} 
                      className={`text-sm font-bold transition-colors ${lang === 'en' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
                    >
                      EN
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('dualvibe_country');
                      setCountry(null);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <Globe className="w-4 h-4" />
                    {country.name[lang]}
                  </button>
                </div>

                <div className="pt-6">
                  <div className="flex items-center glass px-4 py-3 rounded-2xl gap-3 border-white/5 focus-within:border-pink-500/50 transition-all">
                    <Search className="w-5 h-5 opacity-80" />
                    <input 
                      type="text" 
                      placeholder={t.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
            />
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Home lang={lang} country={country} addToCart={addToCart} />
                </motion.div>
              } />
              <Route path="/shop" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Shop lang={lang} country={country} addToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </motion.div>
              } />
              <Route path="/shop/*" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Shop lang={lang} country={country} addToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </motion.div>
              } />

              <Route path="/music-catalog" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <MusicCatalog lang={lang} searchQuery={searchQuery} addToCart={addToCart} openCart={() => setIsCartOpen(true)} />
                </motion.div>
              } />
              <Route path="/studio" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Studio lang={lang} />
                </motion.div>
              } />
              <Route path="/services" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Services lang={lang} />
                </motion.div>
              } />
              <Route path="/about" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <About lang={lang} />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Contact lang={lang} />
                </motion.div>
              } />
              <Route path="/product/:id" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ProductDetail lang={lang} country={country} addToCart={addToCart} />
                </motion.div>
              } />
              <Route path="*" element={<DynamicRouteHandler lang={lang} country={country} addToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsCartOpen={setIsCartOpen} />} />

            </Routes>
          </AnimatePresence>
        </React.Suspense>
      </main>


      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-20 rounded-[3rem] text-center border-white/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
            
            <div className="inline-flex p-4 bg-pink-500/10 rounded-2xl text-pink-500 mb-8 animate-float">
              <Mail className="w-10 h-10" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight">
              <CyberpunkGlitchText>
                {lang === 'fr' ? 'Rejoignez la ' : 'Join the '}
                <span className="gradient-text">{lang === 'fr' ? 'Communauté' : 'Community'}</span>
              </CyberpunkGlitchText>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-200 max-w-2xl mx-auto mb-12 font-medium opacity-80">
              {t.newsletterDesc}
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              handleNewsletterSubmit(email);
              (e.target as any).reset();
            }} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                name="email"
                type="email" 
                placeholder="votre@email.com" 
                required
                className="flex-[2] bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all text-lg"
              />
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmittingNewsletter}
                className="flex-1 px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-pink-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {t.subscribe}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40 cursor-pointer animate-pulse-glow"
          >
            <ChevronRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img 
                  src={isDark ? '/logo-dark.png' : '/logo-light.png'} 
                  alt="DualVibe Logo" 
                  className="h-8 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed">
                {t.footerDesc}
              </p>
              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:text-pink-500 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:text-pink-500 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:text-pink-500 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">{t.shop}</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
                <li><Link to="/shop" className="hover:text-pink-500 transition-colors">{t.all}</Link></li>
                <li><Link to="/shop" className="hover:text-pink-500 transition-colors">{t.physical}</Link></li>
                <li><Link to="/shop" className="hover:text-pink-500 transition-colors">{t.digital}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.about}</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
                <li><Link to="/about" className="hover:text-pink-500 transition-colors">{t.about}</Link></li>
                <li><Link to="/contact" className="hover:text-pink-500 transition-colors">{t.contact}</Link></li>
                <li><button className="hover:text-pink-500 transition-colors">{t.privacy}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.contact}</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-pink-500" />
                  <span>+1 (289) 630-1143</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-500" />
                  <span>dualvibe237@gmail.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.newsletter}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">{t.newsletterDesc}</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                handleNewsletterSubmit(email);
                (e.target as any).reset();
              }} className="flex gap-2">
                <input name="email" type="email" placeholder="Email" required className="w-full glass px-4 py-2 rounded-xl text-sm outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                <motion.button 
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={isSubmittingNewsletter}
                  className="bg-pink-500 text-white p-2 rounded-xl shadow-lg shadow-pink-500/20 disabled:opacity-50"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold opacity-80 text-center md:text-left">
            <p>© 2024 DualVibe. All rights reserved.</p>
            <div className="flex gap-6">
              <button>{t.privacy}</button>
              <button>{t.cookies}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        lang={lang}
        country={country}
      />
      </div>
    </>
  );
}
