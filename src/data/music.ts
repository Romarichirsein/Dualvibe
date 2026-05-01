export interface MusicType {
  id: string;
  name: string;
  description?: string;
}

export interface MusicSubCategory {
  id: string;
  title: string;
  types: MusicType[];
}

export interface MusicPack {
  id: string;
  title: string;
  subtitle?: string;
  subCategories: MusicSubCategory[];
}

export const MUSIC_PACKS: MusicPack[] = [
  {
    id: "pack-01",
    title: "PACK 01",
    subtitle: "CÉRÉMONIES & ÉVÉNEMENTS SOCIAUX",
    subCategories: [
      {
        id: "mariage-coutumier",
        title: "MARIAGE & MARIAGE COUTUMIER",
        types: [
          { id: "dot", name: "Musiques pour le Dot" },
          { id: "toquer-porte", name: "le Toquer porte" },
          { id: "fiancailles", name: "les Fiançailles" },
          { id: "demande-mariage", name: "la Demande en Mariage" }
        ]
      },
      {
        id: "celebrations",
        title: "CÉLÉBRATIONS",
        types: [
          { id: "baptemes", name: "Musiques pour les Baptêmes" },
          { id: "anniversaires", name: "les Anniversaires" },
          { id: "nouveau-ne", name: "l'arrivée d'un nouveau-né (Voir Bébé)" }
        ]
      },
      {
        id: "soutien-recueillement",
        title: "SOUTIEN & RECUEILLEMENT",
        types: [
          { id: "deuil", name: "musiques pour le Deuil" }
        ]
      }
    ]
  },
  {
    id: "pack-02",
    title: "PACK 02",
    subtitle: "RELATIONS & COMMUNICATION PERSONNELLE",
    subCategories: [
      {
        id: "pardon-reconciliation",
        title: "PARDON & RÉCONCILIATION",
        types: [
          { id: "pardon-parents", name: "musique de demande de pardon aux parents" },
          { id: "pardon-ex", name: "musique de demande de pardon a son ex" },
          { id: "pardon-gar", name: "musique de demande de pardon a son gar" },
          { id: "pardon-go", name: "musique de demande de pardon a sa go" }
        ]
      },
      {
        id: "demandes-couples",
        title: "DEMANDES DE COUPLES",
        types: [
          { id: "draguer-go", name: "musique pour draguer une go" },
          { id: "draguer-gar", name: "musique pour draguer un gar" }
        ]
      }
    ]
  }
];
