export type MenuCategory =
  | "Biryani"
  | "Curries"
  | "Tandoor"
  | "Starters"
  | "Vegetarian"
  | "Breads"
  | "Desserts"
  | "Drinks";

export interface Dish {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  image: string;
  vegetarian?: boolean;
  spicy?: 0 | 1 | 2 | 3;
  signature?: boolean;
}

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const CATEGORIES: ("All" | MenuCategory)[] = [
  "All",
  "Biryani",
  "Curries",
  "Tandoor",
  "Starters",
  "Vegetarian",
  "Breads",
  "Desserts",
  "Drinks",
];

export const MENU: Dish[] = [
  {
    id: "hyd-chicken-biryani",
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Biryani",
    description:
      "Aged basmati layered with saffron, fried onion & mint, sealed and slow-steamed on dum.",
    price: 21.9,
    image: img("photo-1589302168068-964664d93dc0"),
    spicy: 2,
    signature: true,
  },
  {
    id: "goat-biryani",
    name: "Goat Dum Biryani",
    category: "Biryani",
    description:
      "Tender goat marinated overnight in yoghurt & stone-flower masala, steamed with rice.",
    price: 24.9,
    image: img("photo-1563379091339-03b21ab4a4f8"),
    spicy: 2,
    signature: true,
  },
  {
    id: "veg-biryani",
    name: "Subz Veg Dum Biryani",
    category: "Biryani",
    description:
      "Seasonal vegetables, paneer & saffron rice finished with ghee and crisp shallots.",
    price: 18.9,
    image: img("photo-1596797038530-2c107229654b"),
    vegetarian: true,
    spicy: 1,
  },
  {
    id: "butter-chicken",
    name: "Old Delhi Butter Chicken",
    category: "Curries",
    description:
      "Charred tandoori chicken folded into tomato-makhani, fenugreek & cream.",
    price: 22.9,
    image: img("photo-1631452180539-96aca7d48617"),
    spicy: 1,
    signature: true,
  },
  {
    id: "goat-curry",
    name: "Darbar Goat Curry",
    category: "Curries",
    description:
      "Slow-braised goat, browned onions, garam masala — the house Sunday curry.",
    price: 24.9,
    image: img("photo-1606491956689-2ea866880c84"),
    spicy: 3,
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka & Ghee",
    category: "Vegetarian",
    description:
      "Yellow dal tempered in ghee with garlic, cumin & dried red chilli.",
    price: 17.9,
    image: img("photo-1585937421612-70a008356fbe"),
    vegetarian: true,
    spicy: 1,
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka Angaar",
    category: "Tandoor",
    description:
      "Smoked cottage cheese, peppers & onion from the clay oven, mint chutney.",
    price: 19.9,
    image: img("photo-1630383249896-424e482df921"),
    vegetarian: true,
    spicy: 2,
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka — Clay Oven",
    category: "Tandoor",
    description:
      "Overnight marinade, mustard oil, Kashmiri chilli. Charred, juicy, unapologetic.",
    price: 21.9,
    image: img("photo-1599487488170-d11ec9c172f0"),
    spicy: 2,
    signature: true,
  },
  {
    id: "samosa",
    name: "Punjabi Samosa (2 pc)",
    category: "Starters",
    description:
      "Crisp pastry, spiced potato-pea, tamarind & mint chutneys.",
    price: 9.9,
    image: img("photo-1601050690597-df0568f70950"),
    vegetarian: true,
    spicy: 1,
  },
  {
    id: "dosa",
    name: "Mysore Masala Dosa",
    category: "Vegetarian",
    description:
      "Golden fermented crepe, red garlic chutney, potato palya, sambar & coconut.",
    price: 16.9,
    image: img("photo-1610057099443-fde8c4d50f91"),
    vegetarian: true,
    spicy: 2,
  },
  {
    id: "curry-naan",
    name: "Curry & Naan Feast",
    category: "Breads",
    description:
      "Pick any two curries with butter naan, garlic naan & steamed basmati.",
    price: 23.9,
    image: img("photo-1626777552726-4a6b54c97e46"),
    spicy: 1,
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun & Kulfi",
    category: "Desserts",
    description: "Warm milk dumplings in rose syrup with malai kulfi & pistachio.",
    price: 10.9,
    image: img("photo-1551024506-0bccd828d307"),
    vegetarian: true,
  },
  {
    id: "mango-lassi",
    name: "Alphonso Mango Lassi",
    category: "Drinks",
    description: "Thick yoghurt churned with alphonso pulp, cardamom & saffron.",
    price: 7.9,
    image: img("photo-1541544181051-e46607bc22a4"),
    vegetarian: true,
  },
  {
    id: "chai",
    name: " cutting Chai",
    category: "Drinks",
    description: "Assam leaves boiled with ginger, cardamom & full-cream milk.",
    price: 5.5,
    image: img("photo-1571934811356-5cc061b6821f"),
    vegetarian: true,
  },
];

export const FEATURED_IDS = [
  "hyd-chicken-biryani",
  "butter-chicken",
  "chicken-tikka",
  "goat-biryani",
];

export const GALLERY = [
  { src: img("photo-1589302168068-964664d93dc0", 1200), alt: "Hyderabadi dum biryani in handi", label: "Dum Biryani" },
  { src: img("photo-1414235077428-338989a2e8c0", 1200), alt: "Fine dining table at Hyderabad Darbar", label: "The Dining Room" },
  { src: img("photo-1599487488170-d11ec9c172f0", 1200), alt: "Chicken tikka skewers over coals", label: "Tandoor" },
  { src: img("photo-1517248135467-4c7edcad34c4", 1200), alt: "Warm restaurant interior", label: "Family Dining" },
  { src: img("photo-1631452180539-96aca7d48617", 1200), alt: "Butter chicken with cream swirl", label: "Makhani" },
  { src: img("photo-1552566626-52f8b828add9", 1200), alt: "Guests dining together", label: "Gatherings" },
  { src: img("photo-1601050690597-df0568f70950", 1200), alt: "Crisp samosas with chutneys", label: "Starters" },
  { src: img("photo-1559339352-11d035aa65de", 1200), alt: "Shared feast on table", label: "Feasts" },
];

export const TESTIMONIALS = [
  {
    name: "Priya S.",
    suburb: "Dandenong",
    text: "The dum biryani tastes like home — fragrant, layered, and the rice is perfect. Best Hyderabadi food we've had in Melbourne.",
    rating: 5,
  },
  {
    name: "Daniel M.",
    suburb: "Berwick",
    text: "Ordered for a family dinner of eight. Goat curry and tandoori platter were outstanding, and takeaway was still hot.",
    rating: 5,
  },
  {
    name: "Ayesha K.",
    suburb: "Narre Warren",
    text: "Beautiful room, generous serves, staff who genuinely care. The catering for our engagement was flawless.",
    rating: 5,
  },
  {
    name: "Tom H.",
    suburb: "Clayton",
    text: "Butter chicken is rich without being heavy, naan comes out blistered. My regular Friday night order.",
    rating: 4,
  },
];

export function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}
