/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  Quote
} from 'lucide-react';

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
  id: number;
  title: { fr: string; en: string };
  price: number;
  category: { fr: string; en: string };
  image: string;
  images?: string[];
  type: 'digital' | 'physical';
  date: string;
  description: { fr: string; en: string };
  reviews: Review[];
  options?: ProductOption[];
}

interface CartItem extends Product {
  quantity: number;
  selectedOption?: ProductOption;
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

const TRANSLATIONS = {
  fr: {
    welcome: "Bienvenue sur DualVibe",
    selectCountry: "Veuillez sélectionner votre pays pour continuer",
    continue: "Continuer",
    heroTitle: "Tout ce dont vous avez besoin, au même endroit.",
    heroSubtitle: "Découvrez notre sélection de produits physiques et digitaux premium. Qualité garantie, livraison rapide.",
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
    promoApplied: "Code promo appliqué : -200 FCFA",
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
    submitOrder: "Soumettre et Commander"
  },
  en: {
    welcome: "Welcome to DualVibe",
    selectCountry: "Please select your country to continue",
    continue: "Continue",
    heroTitle: "Everything you need, all in one place.",
    heroSubtitle: "Discover our selection of premium physical and digital products. Guaranteed quality, fast delivery.",
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
    promoApplied: "Promo code applied: -200 FCFA",
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
    submitOrder: "Submit & Order"
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
    id: 11, 
    title: { fr: "Affiche / Flyer / Bannière", en: "Poster / Flyer / Banner" }, 
    price: 5000, 
    category: { fr: "Design Graphique", en: "Graphic Design" }, 
    image: "https://picsum.photos/seed/flyer/800/600", 
    type: 'digital', 
    date: '2024-03-25',
    description: { 
      fr: "Design percutant pour événement, promotion ou réseaux sociaux.", 
      en: "Impactful design for events, promotions, or social media." 
    },
    reviews: []
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

      <div className="glass p-8 rounded-[2rem] space-y-6">
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

const AnimatedBackground = () => {
  const pinkDrops = useMemo(() => [...Array(25)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${1.5 + Math.random() * 2}s`,
    delay: `${Math.random() * 5}s`,
    height: `${80 + Math.random() * 100}px`
  })), []);

  const purpleDrops = useMemo(() => [...Array(20)].map((_, i) => ({
    id: i + 25,
    left: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 3}s`,
    delay: `${Math.random() * 5}s`,
    height: `${120 + Math.random() * 120}px`
  })), []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Original Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/15 blur-[120px] rounded-full animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-purple-600/15 blur-[120px] rounded-full animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-pink-600/15 blur-[120px] rounded-full animate-blob animation-delay-4000" />
      
      {/* Neon Rain Drops */}
      <div className="absolute inset-0">
        {pinkDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute w-[2px] bg-gradient-to-b from-transparent via-pink-500 to-transparent animate-neon-rain"
            style={{
              left: drop.left,
              height: drop.height,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
              opacity: 0.6,
              boxShadow: '0 0 10px rgba(236, 72, 153, 0.4)'
            }}
          />
        ))}
        {purpleDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-neon-rain"
            style={{
              left: drop.left,
              height: drop.height,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
              opacity: 0.4,
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

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
            {lang === 'fr' ? 'Tout ce dont vous avez ' : 'Everything you '} 
            <span className="gradient-text">{lang === 'fr' ? 'besoin' : 'need'}</span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/shop">
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-pink-500/20 flex items-center justify-center gap-2"
              >
                {t.explore} <ArrowRight className="w-5 h-5" />
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
            <h2 className="text-4xl font-display font-bold mb-4">{t.testimonials}</h2>
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
    </>
  );
};

const About = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <section className="pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-display font-bold mb-8 text-center">{t.aboutTitle}</h1>
        <div className="glass p-10 rounded-[3rem] space-y-8">
          <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed">
            {t.aboutText}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-pink-500">{t.mission}</h2>
              <p className="text-slate-600 dark:text-slate-200">
                {t.missionText}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white flex flex-col justify-center">
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="opacity-80">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">{t.contact}</h2>
            <p className="text-slate-600 dark:text-slate-200 mb-10 leading-relaxed text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              {t.footerDesc}
            </p>
            <div className="space-y-6 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold">Email</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-200">support@dualvibe.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold">WhatsApp</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-200">+1 (289) 630-1143</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-80 ml-2">{t.name}</label>
                <input type="text" className="w-full glass px-6 py-4 rounded-2xl outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-80 ml-2">{t.email}</label>
                <input type="email" className="w-full glass px-6 py-4 rounded-2xl outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-2">{t.message}</label>
              <textarea className="w-full glass px-6 py-4 rounded-2xl outline-none h-32 resize-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-500/20"
            >
              {t.send}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Shop = ({ lang, country, addToCart }: { lang: Language; country: Country; addToCart: (p: Product) => void }) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(PRODUCTS.map(p => p.category[lang]));
    return ['all', ...Array.from(cats)];
  }, [lang]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesSearch = p.title[lang].toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filter === 'all' || p.type === filter;
      const matchesCategory = category === 'all' || p.category[lang] === category;
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

  const SidebarContent = () => (
    <div className="glass p-6 rounded-3xl space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.search}</h3>
        <div className="flex items-center glass px-4 py-2 rounded-xl gap-2 border-white/5">
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
        <div className="space-y-2">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCategory(cat);
                setIsFilterDrawerOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${category === cat ? 'bg-pink-500 text-white' : 'hover:bg-white/5'}`}
            >
              {cat === 'all' ? t.all : cat}
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
            <span>{Math.round(priceRange[1] * country.rate)} {country.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
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
            <SidebarContent />
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
                  className="fixed top-0 left-0 h-full w-full max-w-xs glass z-[110] shadow-2xl p-6 lg:hidden overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-display font-bold">{t.categories}</h2>
                    <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <SidebarContent />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} country={country} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ImageGallery = ({ images, mainImage, title }: { images?: string[]; mainImage: string; title: string }) => {
  const [index, setIndex] = useState(0);
  const galleryImages = images && images.length > 0 ? images : [mainImage];

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-4 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group"
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
              onClick={() => setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-500"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <button 
              onClick={() => setIndex((prev) => (prev + 1) % galleryImages.length)}
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
    </div>
  );
};

const ProductDetail = ({ lang, country, addToCart }: { lang: Language; country: Country; addToCart: (p: Product, o?: ProductOption) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(undefined);

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
  updateQuantity: (id: number, delta: number, optionLabel?: string) => void;
  removeItem: (id: number, optionLabel?: string) => void;
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

  const VALID_PROMOS = ['Princestore', 'Baecstore', 'Mervistore', 'Gicostore', 'Ashstore'];
  const DISCOUNT_AMOUNT = 200; // 200 FCFA (converti automatiquement dans la monnaie du pays)

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
    
    if (hasCvProduct && !showCvForm) {
      setShowCvForm(true);
      return;
    }

    let message = t.orderMessage;
    cart.forEach(item => {
      const price = item.selectedOption ? item.selectedOption.price : item.price;
      const title = item.selectedOption ? `${item.title[lang]} (${item.selectedOption.label})` : item.title[lang];
      message += `- ${title} (x${item.quantity}) : ${Math.round(price * country.rate)} ${country.symbol}\n`;
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
                {showCvForm ? (t as any).cvFormTitle : t.cart}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {showCvForm ? (
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
                {!showCvForm && (
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
                  {showCvForm && (
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCvForm(false)}
                      className="flex-1 py-4 glass text-slate-800 dark:text-white rounded-2xl font-bold flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
                    >
                      {(t as any).backToCart}
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className={`${showCvForm ? 'flex-[2]' : 'w-full'} py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all`}
                  >
                    {!showCvForm && <MessageCircle className="w-6 h-6" />}
                    {showCvForm ? (t as any).submitOrder : t.checkout}
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

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Language>('fr');
  const [country, setCountry] = useState<Country | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
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

  const updateQuantity = (id: number, delta: number, optionLabel?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedOption?.label === optionLabel) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number, optionLabel?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedOption?.label === optionLabel)));
  };

  if (!country) {
    return <CountrySelector onSelect={handleCountrySelect} isDark={isDark} />;
  }

  return (
    <>
      <AnimatedBackground />
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
        <Routes>
          <Route path="/" element={<Home lang={lang} country={country} addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop lang={lang} country={country} addToCart={addToCart} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
          <Route path="/product/:id" element={<ProductDetail lang={lang} country={country} addToCart={addToCart} />} />
        </Routes>
      </main>

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
            className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40 cursor-pointer"
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
                  <span>support@dualvibe.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.newsletter}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">{t.newsletterDesc}</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="w-full glass px-4 py-2 rounded-xl text-sm outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                <motion.button 
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-pink-500 text-white p-2 rounded-xl shadow-lg shadow-pink-500/20"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
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
