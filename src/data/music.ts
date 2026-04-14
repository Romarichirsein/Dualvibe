export interface MusicTrack {
  id: string;
  title: string;
  url: string;
  category: string;
}

export const MUSIC_CATEGORIES = [
  "Tout",
  "Amapiano & Mbole",
  "Trap & Beats",
  "Cinématique & Ambiance",
  "Émotion & Amour",
  "Baptêmes",
  "Mariage",
  "Dot",
  "Toquer porte",
  "Anniversaire",
  "Deuil",
  "Voir Bébé",
  "Fiançailles",
  "Demande en Mariage",
  "Pardon",
  "Réconciliation",
  "Demandes de couples",
  "Autres"
];

export const MUSIC_CATALOG: MusicTrack[] = [
  { id: '1', title: 'Beat Amapiano Lourd (1)', url: '/products/musique/Beat Amapiano Lourd (1).mp3', category: 'Amapiano & Mbole' },
  { id: '2', title: 'Beat Amapiano Lourd', url: '/products/musique/Beat Amapiano Lourd.mp3', category: 'Amapiano & Mbole' },
  { id: '3', title: 'Beat Mbole de Douala (1)', url: '/products/musique/Beat Mbole de Douala (1).mp3', category: 'Amapiano & Mbole' },
  { id: '4', title: 'Beat Mbole de Douala', url: '/products/musique/Beat Mbole de Douala.mp3', category: 'Amapiano & Mbole' },
  { id: '5', title: 'Pression Amapiano (1)', url: '/products/musique/Pression Amapiano (1).mp3', category: 'Amapiano & Mbole' },
  { id: '6', title: 'Pression Amapiano', url: '/products/musique/Pression Amapiano.mp3', category: 'Amapiano & Mbole' },
  { id: '7', title: 'Indomptables jusqu\'au bout (Afro Drill – Spécial CAN 2026)', url: '/products/musique/Titre _ _Indomptables jusqu\'au bout__(Afro Drill – Spécial CAN 2026 🇨🇲).mp3', category: 'Amapiano & Mbole' },
  
  { id: '8', title: 'Beat Lourd Pour Créateurs (1)', url: '/products/musique/Beat Lourd Pour Créateurs (1).mp3', category: 'Trap & Beats' },
  { id: '9', title: 'Beat Lourd Pour Créateurs', url: '/products/musique/Beat Lourd Pour Créateurs.mp3', category: 'Trap & Beats' },
  { id: '10', title: 'Beat Lourd du Continent (1)', url: '/products/musique/Beat Lourd du Continent (1).mp3', category: 'Trap & Beats' },
  { id: '11', title: 'Beat Lourd du Continent', url: '/products/musique/Beat Lourd du Continent.mp3', category: 'Trap & Beats' },
  { id: '12', title: 'Carnage Beats, Le Monde S’en Fout De Toi (1)', url: '/products/musique/Carnage Beats, Le Monde S’en Fout De Toi (1).mp3', category: 'Trap & Beats' },
  { id: '13', title: 'Carnage Beats, Le Monde S’en Fout De Toi', url: '/products/musique/Carnage Beats, Le Monde S’en Fout De Toi.mp3', category: 'Trap & Beats' },
  { id: '14', title: 'Hard Trap Portal (1)', url: '/products/musique/Hard Trap Portal (1).mp3', category: 'Trap & Beats' },
  { id: '15', title: 'Hard Trap Portal', url: '/products/musique/Hard Trap Portal.mp3', category: 'Trap & Beats' },
  
  { id: '16', title: 'Circuit Uprising (1)', url: '/products/musique/Circuit Uprising (1).mp3', category: 'Cinématique & Ambiance' },
  { id: '17', title: 'Circuit Uprising (2)', url: '/products/musique/Circuit Uprising (2).mp3', category: 'Cinématique & Ambiance' },
  { id: '18', title: 'Ethereal Voyage', url: '/products/musique/Ethereal Voyage.mp3', category: 'Cinématique & Ambiance' },
  { id: '19', title: 'Jour de Soleil (1)', url: '/products/musique/Jour de Soleil (1).mp3', category: 'Cinématique & Ambiance' },
  { id: '20', title: 'Jour de Soleil', url: '/products/musique/Jour de Soleil.mp3', category: 'Cinématique & Ambiance' },
  { id: '21', title: 'Portes de lumière', url: '/products/musique/Portes de lumière.mp3', category: 'Cinématique & Ambiance' },
  { id: '22', title: 'Rainy Day Reverie', url: '/products/musique/Rainy Day Reverie.mp3', category: 'Cinématique & Ambiance' },
  { id: '23', title: 'Skyforge Uprising (1)', url: '/products/musique/Skyforge Uprising (1).mp3', category: 'Cinématique & Ambiance' },
  { id: '24', title: 'Skyforge Uprising', url: '/products/musique/Skyforge Uprising.mp3', category: 'Cinématique & Ambiance' },
  
  { id: '25', title: 'Amour en Élan', url: '/products/musique/Amour en Élan.mp3', category: 'Demandes de couples' },
  { id: '26', title: 'Je T’Aime Mal (1)', url: '/products/musique/Je T’Aime Mal (1).mp3', category: 'Demandes de couples' },
  { id: '27', title: 'Je T’Aime Mal', url: '/products/musique/Je T’Aime Mal.mp3', category: 'Demandes de couples' },
  { id: '28', title: 'Priscille, Ma Lumière', url: '/products/musique/Priscille, Ma Lumière.mp3', category: 'Demande en Mariage' },
  { id: '29', title: 'À toi qui ressens', url: '/products/musique/À toi qui ressens.mp3', category: 'Pardon' },
  { id: '30', title: 'À toi qui écoutes (1)', url: '/products/musique/À toi qui écoutes (1).mp3', category: 'Émotion & Amour' },
  { id: '31', title: 'À toi qui écoutes', url: '/products/musique/À toi qui écoutes.mp3', category: 'Émotion & Amour' },
  { id: '32', title: 'Les pleurs du Maroc (1)', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲 (1).mp3', category: 'Deuil' },
  { id: '33', title: 'Les pleurs du Maroc (2)', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲 (2).mp3', category: 'Deuil' },
  { id: '34', title: 'Les pleurs du Maroc (3)', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲 (3).mp3', category: 'Deuil' },
  { id: '35', title: 'Les pleurs du Maroc (4)', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲 (4).mp3', category: 'Deuil' },
  { id: '36', title: 'Les pleurs du Maroc (5)', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲 (5).mp3', category: 'Deuil' },
  { id: '37', title: 'Les pleurs du Maroc (6)', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲 (6).mp3', category: 'Deuil' },
  { id: '38', title: 'Les pleurs du Maroc', url: '/products/musique/🎵 Titre _ _Les pleurs du Maroc_ 🇲🇦💧🇨🇲.mp3', category: 'Deuil' },
  
  { id: '39', title: 'Pannen im Alltags', url: '/products/musique/Pannen im Alltags.mp3', category: 'Autres' },
  { id: '40', title: 'Schönheitsideale (1)', url: '/products/musique/Schönheitsideale (1).mp3', category: 'Autres' },
  { id: '41', title: 'schönheitsideale', url: '/products/musique/schönheitsideale.mp3', category: 'Autres' },
  { id: '42', title: 'Notre Héros, Papa Anatole (1)', url: '/products/musique/Titre _ Notre Héros, Papa Anatole (1).mp3', category: 'Deuil' },
  { id: '43', title: 'Notre Héros, Papa Anatole (2)', url: '/products/musique/Titre _ Notre Héros, Papa Anatole (2).mp3', category: 'Deuil' },
  { id: '44', title: 'Notre Héros, Papa Anatole (3)', url: '/products/musique/Titre _ Notre Héros, Papa Anatole (3).mp3', category: 'Deuil' },
  { id: '45', title: 'Notre Héros, Papa Anatole', url: '/products/musique/Titre _ Notre Héros, Papa Anatole.mp3', category: 'Deuil' },
  { id: '46', title: 'J’ai quitté les bails sales (1)', url: '/products/musique/J’ai quitté les bails sales (1).mp3', category: 'Autres' },
  { id: '47', title: 'J’ai quitté les bails sales', url: '/products/musique/J’ai quitté les bails sales.mp3', category: 'Autres' },
  { id: '48', title: 'Untitled (1)', url: '/products/musique/Untitled (1).mp3', category: 'Autres' },
  { id: '49', title: 'Untitled (2)', url: '/products/musique/Untitled (2).mp3', category: 'Autres' },
  { id: '50', title: 'Untitled (3)', url: '/products/musique/Untitled (3).mp3', category: 'Autres' },
  { id: '51', title: 'Untitled', url: '/products/musique/Untitled.mp3', category: 'Autres' },
  { id: '52', title: 'Déjà Payé (1)', url: '/products/musique/_Déjà Payé_ (1).mp3', category: 'Autres' },
  { id: '53', title: 'Déjà Payé', url: '/products/musique/_Déjà Payé_.mp3', category: 'Autres' }
];
