export type MaqamRegion = "kerala" | "india" | "middle-east" | "worldwide";
export type MaqamCategory = "sahaba" | "sufi" | "scholar" | "shaheed" | "prophet";

export type MaqamImage = {
  src: string;
  caption?: string;
  alt?: string;
};

export type Maqam = {
  id: string;
  name: string;
  malayalamName?: string;
  location: string;
  city: string;
  country: string;
  region: MaqamRegion;
  category: MaqamCategory;
  era?: string;
  description: string;
  significance?: string;
  bestTimeToVisit?: string;
  sourceUrl?: string;
  coverImage?: string;
  images?: MaqamImage[];
  addressDetail?: string;
  visitingHours?: {
    label: string;
    hours: string;
  }[];
  nerchaa?: {
    title: string;
    description: string;
    month?: string;
  }[];
  howToReach?: {
    mode: string;
    details: string;
  }[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  facilities?: string[];
  history?: string;
  architecture?: string;
};

export const MAQAMS: Maqam[] = [
  {
    id: "mampuram",
    name: "Mampuram Maqam",
    malayalamName: "മമ്പുറം മഖാം",
    location: "Mampuram Juma Masjid",
    city: "Tirurangadi, Malappuram",
    country: "India",
    region: "kerala",
    category: "scholar",
    era: "19th century",
    description:
      "Resting place of Sayyid Alavi Thangal and Sayyid Fazal Pookoya Thangal, revered scholars and reformers of Malabar.",
    significance:
      "Center of spiritual learning and historic resistance during colonial Malabar.",
    bestTimeToVisit: "Rabi al-Awwal Uroos",
    sourceUrl: "https://en.wikipedia.org/wiki/Mamburam_Thangal",
  },
  {
    id: "kondotty",
    name: "Kondotty Khubba",
    malayalamName: "കൊണ്ടോട്ടി ഖുബ്ബ",
    location: "Kondotty Thakkiya",
    city: "Kondotty, Malappuram",
    country: "India",
    region: "kerala",
    category: "sufi",
    era: "18th century",
    description:
      "Shrine of Muhammad Shah Tangal, founder of the Kondotty Sufi tradition in Kerala.",
    significance: "Annual Nercha draws devotees from across South India.",
    bestTimeToVisit: "Rajab Nercha",
  },
  {
    id: "ponnani",
    name: "Ponnani Valiya Juma Masjid Maqbara",
    malayalamName: "പൊന്നാനി മഖ്ബറ",
    location: "Ponnani Valiya Juma Masjid",
    city: "Ponnani, Malappuram",
    country: "India",
    region: "kerala",
    category: "scholar",
    era: "16th century",
    description:
      "Burial site of Makhdoom scholars including Zainuddin Makhdoom I & II, the spiritual axis of Malabar.",
    significance: "Known as the Mecca of Malabar for centuries of Islamic scholarship.",
  },
  {
    id: "beemapally",
    name: "Beemapally Dargah",
    malayalamName: "ബീമാപള്ളി ദർഗ",
    location: "Beemapally Mosque",
    city: "Thiruvananthapuram",
    country: "India",
    region: "kerala",
    category: "sufi",
    era: "Medieval",
    description:
      "Dargah of Beema Beevi, a revered woman saint from Arabia who settled in Kerala.",
    bestTimeToVisit: "Annual Uroos in Jumada al-Akhir",
  },
  {
    id: "ajmer",
    name: "Ajmer Sharif Dargah",
    location: "Khwaja Moinuddin Chishti Dargah",
    city: "Ajmer, Rajasthan",
    country: "India",
    region: "india",
    category: "sufi",
    era: "12th–13th century",
    description:
      "Shrine of Khwaja Moinuddin Chishti, founder of the Chishti order in the subcontinent.",
    significance: "One of the most visited Sufi shrines in the world.",
    bestTimeToVisit: "Annual Urs in Rajab",
    sourceUrl: "https://en.wikipedia.org/wiki/Ajmer_Sharif_Dargah",
  },
  {
    id: "nizamuddin",
    name: "Nizamuddin Dargah",
    location: "Hazrat Nizamuddin Auliya Dargah",
    city: "New Delhi",
    country: "India",
    region: "india",
    category: "sufi",
    era: "14th century",
    description:
      "Resting place of Hazrat Nizamuddin Auliya, the celebrated Chishti master of Delhi.",
    bestTimeToVisit: "Thursday Qawwali evenings",
  },
  {
    id: "baghdad",
    name: "Shaykh Abdul Qadir Jilani Shrine",
    location: "Al-Gilani Mosque",
    city: "Baghdad",
    country: "Iraq",
    region: "middle-east",
    category: "sufi",
    era: "12th century",
    description:
      "Shrine of Muhiyuddin Abdul Qadir Jilani, the Ghaus al-Azam and founder of the Qadiri order.",
    bestTimeToVisit: "11th of Rabi al-Thani (Giyarvi Sharif)",
  },
  {
    id: "rumi",
    name: "Mevlana Rumi Shrine",
    location: "Mevlana Museum",
    city: "Konya",
    country: "Turkey",
    region: "middle-east",
    category: "sufi",
    era: "13th century",
    description:
      "Tomb of Mawlana Jalaluddin Rumi, the renowned Persian poet and Sufi master.",
    bestTimeToVisit: "Şeb-i Arus (17 December)",
  },
  {
    id: "uwais",
    name: "Uwais al-Qarani Shrine",
    location: "Raqqa governorate",
    city: "Raqqa",
    country: "Syria",
    region: "middle-east",
    category: "sahaba",
    era: "1st century AH",
    description:
      "Maqam of Uwais al-Qarani, the Yemeni follower beloved by the Prophet ﷺ.",
  },
  {
    id: "madina-baqi",
    name: "Jannat al-Baqi",
    location: "Adjacent to Masjid an-Nabawi",
    city: "Madina",
    country: "Saudi Arabia",
    region: "middle-east",
    category: "sahaba",
    era: "1st century AH",
    description:
      "Sacred cemetery containing many companions, family of the Prophet ﷺ, and early scholars.",
    significance: "One of the holiest burial grounds in Islam.",
  },
];

export const REGION_LABELS: Record<MaqamRegion, string> = {
  kerala: "Kerala",
  india: "India",
  "middle-east": "Middle East",
  worldwide: "Worldwide",
};

export const CATEGORY_LABELS: Record<MaqamCategory, string> = {
  sahaba: "Sahaba",
  sufi: "Sufi Masters",
  scholar: "Scholars",
  shaheed: "Shuhada",
  prophet: "Anbiya",
};
