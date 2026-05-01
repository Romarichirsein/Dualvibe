export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductOption {
  label: string;
  price: number;
}

export interface Product {
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

export interface CartItem extends Product {
  quantity: number;
  selectedOption?: ProductOption;
  customMetadata?: any;
}

export const PRODUCTS: Product[] = [
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
