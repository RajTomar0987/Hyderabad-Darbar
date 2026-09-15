export type MenuCategory =
  | "Darbar Special"
  | "Mandi"
  | "Snack Bar"
  | "Tandoori Kabab"
  | "Paratha Rolls"
  | "Takeaway Deals"
  | "Vegetables - Curries"
  | "Paneer Curries (Cottage Cheese)"
  | "Chicken Curries Boneless"
  | "Lamb Curries With Bone"
  | "Goat Curries"
  | "Seafood Dishes"
  | "Indo-Chinese"
  | "Rice"
  | "Breads"
  | "Extras"
  | "Dessert"
  | "Drinks"
  | "Catering Menu"
  | "Other";

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

export const CATEGORIES: ("All" | MenuCategory)[] = [
  "All",
  "Darbar Special",
  "Mandi",
  "Snack Bar",
  "Tandoori Kabab",
  "Paratha Rolls",
  "Takeaway Deals",
  "Vegetables - Curries",
  "Paneer Curries (Cottage Cheese)",
  "Chicken Curries Boneless",
  "Lamb Curries With Bone",
  "Goat Curries",
  "Seafood Dishes",
  "Indo-Chinese",
  "Rice",
  "Breads",
  "Extras",
  "Dessert",
  "Drinks",
  "Catering Menu",
  "Other",
];

export const MENU: Dish[] = [
  {
    "id": "chicken-dum-biryani",
    "name": "Chicken Dum Biryani",
    "category": "Darbar Special",
    "description": "Prepared with meat, marinated with spices, and yoghurt overnight. Cooked on DUM - slow flame along with Basmati Rice",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063792788.png",
    "spicy": 1,
    "signature": true
  },
  {
    "id": "goat-dum-biryani",
    "name": "Goat Dum Biryani",
    "category": "Darbar Special",
    "description": "Prepared With Meat, Marinated With Spices & Yoghurt Overnight. Cooked On DUM - Slow Flame Along With Basmati Rice",
    "price": 20,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063795923.png",
    "spicy": 1,
    "signature": true
  },
  {
    "id": "chicken-65-biryani",
    "name": "Chicken 65 Biryani",
    "category": "Darbar Special",
    "description": "Chicken 65 Saute with Spice Sauce Added to Flavoured Rice",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063800539.png",
    "spicy": 1,
    "signature": true
  },
  {
    "id": "veggie-dum-biryani",
    "name": "Veggie Dum Biryani",
    "category": "Darbar Special",
    "description": "Seasonal Veggies Marinated with Spices and Yoghurt, Cooked on Dum with Basmati Rice.",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063804632.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "haleem",
    "name": "Haleem",
    "category": "Darbar Special",
    "description": "The Delicacy of Hyderabad Made by Lamb Meat and Special Spices",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063801987.png"
  },
  {
    "id": "goat-paya",
    "name": "Goat Paya",
    "category": "Darbar Special",
    "description": "Goat  Trotters Cooked in Special Potli Ka Masala from Hyderabad",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063802692.png"
  },
  {
    "id": "goat-shank-nehari",
    "name": "Goat Shank Nehari",
    "category": "Darbar Special",
    "description": "Soup Made from Tender Goat with Bone",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063804531.png"
  },
  {
    "id": "aloo-kheema",
    "name": "ALOO KHEEMA​​​​​​​​​",
    "category": "Darbar Special",
    "description": "Goat Mince cooked with green peas and potatoes",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063811743.png"
  },
  {
    "id": "bagaray-baigan",
    "name": "Bagaray Baigan",
    "category": "Darbar Special",
    "description": "Thich gravy made of paste of coconut, peanuts and sesame along with eggplant",
    "price": 15,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063814087.png"
  },
  {
    "id": "mirchi-ka-salan",
    "name": "Mirchi Ka Salan",
    "category": "Darbar Special",
    "description": "Gravy made with curry leaves, touch of black seeds & nuts paste along with Green Chilies",
    "price": 15,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063817333.png"
  },
  {
    "id": "hyderabad-chai-tea",
    "name": "Hyderabad Chai / Tea",
    "category": "Darbar Special",
    "description": "Delicious tea available to serve",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063809123.png"
  },
  {
    "id": "hyderabad-tea---dine-in",
    "name": "Hyderabad Tea - Dine In",
    "category": "Darbar Special",
    "description": "Delicious tea available to serve",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063817636.png"
  },
  {
    "id": "lamb-shank-mandi",
    "name": "Lamb Shank Mandi",
    "category": "Mandi",
    "description": "Single (1 Pc), Triple (3 Pcs), Family (4 Pcs +5 Rice)",
    "price": 25,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1785147573063.png"
  },
  {
    "id": "chicken-maryland-mandi",
    "name": "Chicken Maryland Mandi",
    "category": "Mandi",
    "description": "Single (1 Pc), Triple (3 Pcs), Family (4 Pcs +5 Rice)",
    "price": 23,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1785147573781.png"
  },
  {
    "id": "chicken-65-mandi",
    "name": "Chicken 65 Mandi",
    "category": "Mandi",
    "description": "Chicken 65 Mandi",
    "price": 22,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1785147574157.png"
  },
  {
    "id": "mix-mandi",
    "name": "Mix Mandi",
    "category": "Mandi",
    "description": "Triple (1 Shank 2 Maryland), Family (2 Shanks 2 Maryland +5 Rice)",
    "price": 65,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1785147576204.png"
  },
  {
    "id": "special-mix",
    "name": "Special Mix.",
    "category": "Mandi",
    "description": "Triple (1 Shank 2 Maryland Chicken 65), Family (2 Shanks 2 Maryland  Chicken 65 +5 Rice)",
    "price": 70,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1785148105633.png",
    "signature": true
  },
  {
    "id": "vegetable-samosa",
    "name": "Vegetable Samosa",
    "category": "Snack Bar",
    "description": "Pastry stuffed with potato, peas & fragrant spices & deep fried",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063842416.png",
    "vegetarian": true
  },
  {
    "id": "kheema-samosa-goat",
    "name": "Kheema Samosa (Goat)",
    "category": "Snack Bar",
    "description": "Pastry Stuffed with Goat Mince Cooked & Deep Fried",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063844501.png",
    "vegetarian": true
  },
  {
    "id": "onion-bhaji-onion-rings",
    "name": "Onion Bhaji (Onion Rings)",
    "category": "Snack Bar",
    "description": "Onion rings combined with chickpea batter & deep fried",
    "price": 8,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063844473.png"
  },
  {
    "id": "vegetable-pakora-4-pieces",
    "name": "Vegetable Pakora (4 Pieces)",
    "category": "Snack Bar",
    "description": "Mix vegetables combined with chickpea batter & deep fried",
    "price": 8,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063848690.png",
    "vegetarian": true
  },
  {
    "id": "crispy-gobi-65",
    "name": "Crispy Gobi 65",
    "category": "Snack Bar",
    "description": "Cauliflower Pieces Mixed with Corn Flour Batter, Spices & Deep Fried",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063850296.png"
  },
  {
    "id": "papadums",
    "name": "Papadums",
    "category": "Snack Bar",
    "description": "5 Pcs",
    "price": 2.5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063851634.png"
  },
  {
    "id": "paneer-tikka-sWnfq7",
    "name": "Paneer Tikka",
    "category": "Snack Bar",
    "description": "made with marinated cubes of Indian cottage cheese, grilled to perfection",
    "price": 15.5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063857014.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "paneer-tikka",
    "name": "Paneer Tikka",
    "category": "Tandoori Kabab",
    "description": "Paneer Marinated In Yogurt & Spices , Grilled in a tandoor",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065290689.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "mix-tandoori-platter",
    "name": "Mix Tandoori Platter",
    "category": "Tandoori Kabab",
    "description": "2X Tandoori, 2X Malai Tikka, 2X Chicken Tikka, 2X Seekh Kebabs, 2X Lamb Cutlets",
    "price": 45,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064940051.png"
  },
  {
    "id": "tandoori-chicken-half",
    "name": "Tandoori Chicken (Half)",
    "category": "Tandoori Kabab",
    "description": "Whole chicken marinated with yogurt & chef's recipe (Half 4 Pcs)",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064945022.png"
  },
  {
    "id": "tandoori-chicken-full",
    "name": "Tandoori Chicken (Full)",
    "category": "Tandoori Kabab",
    "description": "Whole Chicken Marinated with Yogurt & Chef's Recipe Full (8 Pcs)",
    "price": 32,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064938046.png"
  },
  {
    "id": "chicken-malai-tikka-4-5-pcs",
    "name": "Chicken Malai Tikka (4-5 Pcs)",
    "category": "Tandoori Kabab",
    "description": "Boneless chicken marinated with less spices & more cream",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064938075.png",
    "spicy": 1
  },
  {
    "id": "chicken-tikka-medium-spicy",
    "name": "Chicken Tikka (Medium Spicy)",
    "category": "Tandoori Kabab",
    "description": "Medium spicy chicken marinated with special spices",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064935303.png",
    "spicy": 2
  },
  {
    "id": "chicken-65",
    "name": "Chicken 65",
    "category": "Tandoori Kabab",
    "description": "Chicken Pieces Mixed with Corn Flour Batter, Spices & Deep Fried",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064933493.png"
  },
  {
    "id": "lamb-shami-kabab-4-pcs",
    "name": "Lamb Shami Kabab (4 Pcs)",
    "category": "Tandoori Kabab",
    "description": "Boneless Lamb meshed with spices & made into patties",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064932540.png",
    "spicy": 1
  },
  {
    "id": "lamb-seekh-kebab-4-pcs",
    "name": "Lamb Seekh Kebab (4 Pcs)",
    "category": "Tandoori Kabab",
    "description": "Lamb mince marinated with Indian spices and green herbs",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064930471.png"
  },
  {
    "id": "lamb-chops-3-pcs",
    "name": "Lamb Chops (3 Pcs)",
    "category": "Tandoori Kabab",
    "description": "Lamb Cutlet Marinated with Medium Spices",
    "price": 21,
    "image": "https://assets.nextorder.co/public/aec0de9a-50b0-4592-872e-bb75cd39270c"
  },
  {
    "id": "chicken-tikka-roll",
    "name": "Chicken Tikka Roll",
    "category": "Paratha Rolls",
    "description": "pieces of tandoori chicken, wrapped in a soft & fluffy roll, accompanied by crisp veggies & a zesty mint chutney",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064950650.png",
    "spicy": 1
  },
  {
    "id": "chicken-malai-roll",
    "name": "Chicken Malai Roll",
    "category": "Paratha Rolls",
    "description": "tender chunks of chicken marinated in a rich blend of cream, cheese & spices, wrapped in a warm paratha & served with a tangy tamarind sauce",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064954144.png"
  },
  {
    "id": "seekh-kebab-roll",
    "name": "Seekh Kebab Roll",
    "category": "Paratha Rolls",
    "description": "Juicy Minced Meat Kebabs Wrapped in Soft Flatbread with Fresh Salad and Sauces",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771064958613.png"
  },
  {
    "id": "family-pack-chicken-biryani-5-6-ppl-serving",
    "name": "Family Pack Chicken Biryani (5-6 Ppl Serving)",
    "category": "Takeaway Deals",
    "description": "Chicken Biryani/Veggie Biryani, Raita & Mirchi Ka Salan.(5 People Serving)",
    "price": 70,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065362402.png",
    "spicy": 1
  },
  {
    "id": "family-pack-veggie-biryani-5-6-ppl-serving",
    "name": "Family Pack Veggie Biryani (5-6 Ppl Serving)",
    "category": "Takeaway Deals",
    "description": "Goat Biryani/Veggie Biryani Chicken Biryani, Raita & Mirchi Ka Salan.(5 People Serving)",
    "price": 65,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065111776.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "family-pack-goat-biryani-5-6-ppl-serving",
    "name": "Family Pack Goat Biryani (5-6 Ppl Serving)",
    "category": "Takeaway Deals",
    "description": "Goat Biryani, Raita & Mirchi Ka Salan.(5 People Serving)",
    "price": 75,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065061299.png",
    "spicy": 1
  },
  {
    "id": "jumbo-pack-chicken-biryani-10-12-ppl-serving",
    "name": "Jumbo Pack Chicken Biryani (10-12 Ppl Serving)",
    "category": "Takeaway Deals",
    "description": "Chicken Biryani/Veggie Biryani, Raita & Mirchi Ka Salan. (8 People Serving)",
    "price": 130,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065058409.png",
    "spicy": 1
  },
  {
    "id": "jumbo-pack-veggies-biryani-10-12-ppl-serving",
    "name": "Jumbo Pack Veggies Biryani (10-12 Ppl Serving)",
    "category": "Takeaway Deals",
    "description": "Goat Biryani/Veggie Biryani/Chicken Biryani, Raita & Mirchi Ka Salan (8 People Serving)",
    "price": 125,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065056597.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "jumbo-pack-goat-biryani-10-12-ppl-serving",
    "name": "Jumbo Pack Goat Biryani (10-12 Ppl Serving)",
    "category": "Takeaway Deals",
    "description": "Goat Biryani, Raita & Mirchi Ka Salan. (8 People Serving)",
    "price": 135,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065056535.png",
    "spicy": 1
  },
  {
    "id": "tandoori-mix-family-pack-18-pcs",
    "name": "Tandoori Mix Family Pack (18 pcs)",
    "category": "Takeaway Deals",
    "description": "6X Tandoori Chicken, 5X Malai Tikka, 4X Seekh Kebabs, 3X Lamb Cutlets",
    "price": 70,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065052769.png"
  },
  {
    "id": "chicken-65-family-pack-5x-serve",
    "name": "Chicken 65 Family Pack (5x Serve)",
    "category": "Takeaway Deals",
    "description": "Serves up to 5–6 Guests",
    "price": 65,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065047771.png"
  },
  {
    "id": "chilli-chicken-family-pack-5x-serve",
    "name": "Chilli Chicken Family Pack (5x Serve)",
    "category": "Takeaway Deals",
    "description": "Serves up to 5–6 Guests",
    "price": 70,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065045392.png",
    "spicy": 2
  },
  {
    "id": "5-kg-curry-bucket-veg-chicken-lamb-or-goat",
    "name": "5 Kg Curry Bucket (Veg., Chicken, Lamb or Goat)",
    "category": "Takeaway Deals",
    "description": "Serves up to 10–12 Guests",
    "price": 120,
    "image": "https://storage.googleapis.com/next-order-media/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1772418626879.png",
    "vegetarian": true
  },
  {
    "id": "10-kg-curry-bucket-veg-chicken-lamb-or-goat",
    "name": "10 Kg Curry Bucket (Veg., Chicken, Lamb Or Goat)",
    "category": "Takeaway Deals",
    "description": "Serves up to 20+ Guests",
    "price": 220,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1772418863931.png",
    "vegetarian": true
  },
  {
    "id": "catering-biryani-for-20-people-veg-or-chicken",
    "name": "Catering Biryani for 20 people (Veg or Chicken)",
    "category": "Takeaway Deals",
    "description": "aromatic flavors of our biryani, available in both veg & chicken options",
    "price": 1,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065040678.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "catering-biryani-15-people-veg-or-chicken",
    "name": "Catering Biryani 15 people (Veg or Chicken)",
    "category": "Takeaway Deals",
    "description": "aromatic flavors of our biryani, available in both veg & chicken options",
    "price": 1,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065044256.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "one-person-rice-curry-deal",
    "name": "One Person Rice & Curry Deal",
    "category": "Takeaway Deals",
    "description": "1 Curry + 1 Rice, Choose any curry from vegetable/chicken & lamb, 1 Drink or 1 Sugar Lassi or 1 Water Bottle",
    "price": 1,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065042167.png"
  },
  {
    "id": "value-pack-save-15-curry-deal",
    "name": "Value Pack Save $15 (Curry Deal)",
    "category": "Takeaway Deals",
    "description": "ENTREE : 2 Samosas MAINS : Any Choice of 2 Curries. Accompaniments : 2 Rice, 2 Naan, & 2 Salt or Sugar Lassi",
    "price": 55,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065042977.png"
  },
  {
    "id": "one-person-naan-curry-deal",
    "name": "One Person Naan & Curry Deal",
    "category": "Takeaway Deals",
    "description": "Choose any curry from vegetable/chicken or lamb. 2 Naan (Plain, Butter or Garlic) 1 Drink or 1 Sugar Lassi or 1 Mango Lassi",
    "price": 1,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065464889.png"
  },
  {
    "id": "big-family-deal",
    "name": "Big Family Deal",
    "category": "Takeaway Deals",
    "description": "ENTREE : Choice of any 2 Veg Or Chicken Entree. MAINS : Choice of any 3 curries. Accompaniments : 3 Rice, 4 Naan, Papadums (6 Pieces) : Choice of Any 4 Lassis (Sugar or Mango)",
    "price": 1,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065034291.png"
  },
  {
    "id": "combo-pack",
    "name": "Combo Pack",
    "category": "Takeaway Deals",
    "description": "(Any 2 Biryani Chicken/Lamb/Veggie) Chicken 65/Gobi 65 & Raita/Mirchi Ka Salan",
    "price": 38,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065034331.png"
  },
  {
    "id": "special-family-deal",
    "name": "Special Family Deal",
    "category": "Takeaway Deals",
    "description": "2 Veg Samosas, 2 Pieces Tandoori, 2 Curries, 1 Rice, 2 Naan, 1 Raita, 2 Papadums & Chutney",
    "price": 60,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065027726.png"
  },
  {
    "id": "jumbo-family-deal",
    "name": "Jumbo Family Deal",
    "category": "Takeaway Deals",
    "description": "4 Samosas, 4 Chicken Tikka Pieces, 3 Curries, 2 Rice, 4 Naans, Raita, 4 Papadums & Chutney",
    "price": 75,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065024650.png"
  },
  {
    "id": "bagaray-baigan-c7b2ML",
    "name": "Bagaray Baigan",
    "category": "Vegetables - Curries",
    "description": "Thick Gravy made by paste of coconut, peanuts and sesame along with Eggplant",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065491535.png",
    "vegetarian": true
  },
  {
    "id": "mirchi-ka-salan-xfohgu",
    "name": "Mirchi Ka Salan",
    "category": "Vegetables - Curries",
    "description": "Gravy made with curry leaves, touch of black seeds & nuts paste along with Green Chilies",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065411223.png",
    "vegetarian": true
  },
  {
    "id": "dal-makhani",
    "name": "Dal Makhani",
    "category": "Vegetables - Curries",
    "description": "Mixed black lentils & kidney beans tampered with butter & cream sauce",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065409757.png",
    "vegetarian": true
  },
  {
    "id": "chana-masala-curry",
    "name": "Chana Masala Curry",
    "category": "Vegetables - Curries",
    "description": "Boiled chana cooked with Indian herbs & spices",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065410478.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "daal-fry-khatti-daal",
    "name": "Daal Fry / Khatti Daal",
    "category": "Vegetables - Curries",
    "description": "Yellow lentils tampered with cumin seeds & curry leaves",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065408813.png",
    "vegetarian": true
  },
  {
    "id": "mix-vegetables",
    "name": "Mix Vegetables",
    "category": "Vegetables - Curries",
    "description": "Mixed veggies tossed with onion & tomato gravy sauce",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065406622.png",
    "vegetarian": true
  },
  {
    "id": "aloo-palak",
    "name": "Aloo Palak",
    "category": "Vegetables - Curries",
    "description": "Potatoes cooked with spinach",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065412624.png",
    "vegetarian": true
  },
  {
    "id": "aloo-mutter",
    "name": "Aloo Mutter",
    "category": "Vegetables - Curries",
    "description": "Potatoes & peas mixed curry with little gravy",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065404610.png",
    "vegetarian": true
  },
  {
    "id": "aloo-gobhi",
    "name": "Aloo Gobhi",
    "category": "Vegetables - Curries",
    "description": "Potatoes & cauliflower mixed curry with little gravy",
    "price": 16,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065404198.png",
    "vegetarian": true
  },
  {
    "id": "palak-paneer",
    "name": "Palak Paneer",
    "category": "Paneer Curries (Cottage Cheese)",
    "description": "Cottage cheese and spinach cooked with aromatic herbs and spices",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065529108.png",
    "vegetarian": true
  },
  {
    "id": "shahi-paneer",
    "name": "Shahi Paneer",
    "category": "Paneer Curries (Cottage Cheese)",
    "description": "Cottage cheese cooked with nuts paste, subtle touch of cream and butter",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065528657.png",
    "vegetarian": true
  },
  {
    "id": "paneer-butter-masala",
    "name": "Paneer Butter Masala",
    "category": "Paneer Curries (Cottage Cheese)",
    "description": "Cottage cheese cooked in rich tomato sauce and cashew paste with bell peppers",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065530102.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "chilli-paneer",
    "name": "Chilli Paneer",
    "category": "Paneer Curries (Cottage Cheese)",
    "description": "Cottage cheese tossed with soy sauce, vinegar and bell peppers",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065530639.png",
    "vegetarian": true,
    "spicy": 2
  },
  {
    "id": "paneer-karahi",
    "name": "Paneer Karahi",
    "category": "Paneer Curries (Cottage Cheese)",
    "description": "Cottage cheese cooked in aromatic spices with fresh tomatoes, onions and bell peppers",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065532312.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "chicken-65-dry",
    "name": "Chicken 65 Dry",
    "category": "Chicken Curries Boneless",
    "description": "Chicken 65 cooked with tomato sauce, fresh onions & capsicums",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065751243.png"
  },
  {
    "id": "chicken-tikka-masala",
    "name": "Chicken Tikka Masala",
    "category": "Chicken Curries Boneless",
    "description": "Roasted chicken tikka pieces cooked with tomato sauce, fresh onions and capsicums",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065753872.png",
    "spicy": 1
  },
  {
    "id": "chicken-karahi",
    "name": "Chicken Karahi",
    "category": "Chicken Curries Boneless",
    "description": "Chicken cooked in fresh tomatoes, onions & capsicums",
    "price": 17.5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065756493.png",
    "spicy": 1
  },
  {
    "id": "chicken-korma",
    "name": "Chicken Korma",
    "category": "Chicken Curries Boneless",
    "description": "Chicken Braised with Nuts and Yoghurt",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065758420.png"
  },
  {
    "id": "achari-chicken",
    "name": "Achari Chicken",
    "category": "Chicken Curries Boneless",
    "description": "Tangy Pickled Flavor Curry",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065765087.png"
  },
  {
    "id": "butter-chicken",
    "name": "Butter Chicken",
    "category": "Chicken Curries Boneless",
    "description": "Chicken cooked in tomato and creamy butter sauce",
    "price": 16,
    "image": "https://assets.nextorder.co/public/f46cd407-bfa5-4367-a688-d323f8a20178",
    "signature": true
  },
  {
    "id": "chicken-madras",
    "name": "Chicken Madras",
    "category": "Chicken Curries Boneless",
    "description": "Curry Cooked in South Indian style, flavoured with coconut & curry leaves",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065767575.png"
  },
  {
    "id": "chicken-vindaloo",
    "name": "Chicken Vindaloo.",
    "category": "Chicken Curries Boneless",
    "description": "Hot and spicy curry, with a subtle hint of vinegar",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065761112.png",
    "vegetarian": true,
    "spicy": 2
  },
  {
    "id": "chicken-palak",
    "name": "Chicken Palak",
    "category": "Chicken Curries Boneless",
    "description": "Chicken cooked in fresh Spinach",
    "price": 17,
    "image": "https://assets.nextorder.co/public/b6f8429a-045b-462a-9631-28c6bdf791e4"
  },
  {
    "id": "lamb-curry",
    "name": "Lamb Curry",
    "category": "Lamb Curries With Bone",
    "description": "Lamb Curry Made by Tomato and Onion Sauce with Special Herbs and Spices",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065817816.png"
  },
  {
    "id": "achari-ghosht",
    "name": "Achari Ghosht",
    "category": "Lamb Curries With Bone",
    "description": "Lamb Cooked with Thick Masala Curry of Fresh Onions and Capsicums",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065817940.png"
  },
  {
    "id": "lamb-karahi-thick-gravy",
    "name": "Lamb Karahi (Thick Gravy)",
    "category": "Lamb Curries With Bone",
    "description": "Lamb Cooked Aromatic Spices with Fresh Tomatoes, Onions and Bell Peppers",
    "price": 18.5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065818846.png",
    "spicy": 1
  },
  {
    "id": "lamb-korma",
    "name": "Lamb Korma",
    "category": "Lamb Curries With Bone",
    "description": "Lamb meat braised with paste of nuts, fried onions & yoghurt",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065819605.png"
  },
  {
    "id": "lamb-rogan-josh",
    "name": "Lamb Rogan Josh",
    "category": "Lamb Curries With Bone",
    "description": "Tender lamb cooked with herbs & mild spices in traditional style",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065821996.png"
  },
  {
    "id": "lamb-vindaloo",
    "name": "Lamb Vindaloo",
    "category": "Lamb Curries With Bone",
    "description": "Hot & spicy curry, with a subtle hint of vinegar",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065825876.png",
    "vegetarian": true,
    "spicy": 2
  },
  {
    "id": "lamb-madras",
    "name": "Lamb Madras",
    "category": "Lamb Curries With Bone",
    "description": "Curry Cooked in South Indian style, flavored with coconut & fresh curry leaves",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065825101.png"
  },
  {
    "id": "lamb-palak",
    "name": "Lamb Palak",
    "category": "Lamb Curries With Bone",
    "description": "Spinach cooked with lamb curry & cream",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065834467.png"
  },
  {
    "id": "goat-curry-gravy",
    "name": "Goat Curry (Gravy)",
    "category": "Goat Curries",
    "description": "Goat curry made by tomato & onion sauce with special herbs & spices",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065880114.png"
  },
  {
    "id": "goat-masala-thick-gravy",
    "name": "Goat Masala (Thick Gravy)",
    "category": "Goat Curries",
    "description": "Goat cooked with thick masala curry of fresh onions & capsicums",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065882214.png",
    "spicy": 1
  },
  {
    "id": "goat-palak-gravy",
    "name": "Goat Palak (Gravy)",
    "category": "Goat Curries",
    "description": "Spinach cooked with Goat curry & cream",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065888028.png"
  },
  {
    "id": "goat-vindaloo-gravy",
    "name": "Goat Vindaloo (Gravy)",
    "category": "Goat Curries",
    "description": "Hot and spicy Goat curry, with a subtle hint of vinegar",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065885533.png",
    "vegetarian": true,
    "spicy": 2
  },
  {
    "id": "fish-curry-i",
    "name": "Fish Curry (I)",
    "category": "Seafood Dishes",
    "description": "Fish Curry Serving",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065914991.png"
  },
  {
    "id": "prawn-curry-i",
    "name": "Prawn Curry (I)",
    "category": "Seafood Dishes",
    "description": "Prawn Curry Serving",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065914988.png"
  },
  {
    "id": "fish-65-i",
    "name": "Fish 65 (I)",
    "category": "Seafood Dishes",
    "description": "Basa fillets coated with corn flour, spices, deep fried with curry leaves, & green chilies",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065916275.png"
  },
  {
    "id": "prawn-65-i",
    "name": "Prawn 65 (I)",
    "category": "Seafood Dishes",
    "description": "Shrimps coated with corn flour, spices, deep fried with curry leaves, & green chilies",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065917814.png"
  },
  {
    "id": "prawn-chilli-i",
    "name": "Prawn Chilli (I)",
    "category": "Seafood Dishes",
    "description": "Prawn Shrimps 65 tossed with bell peppers, sauces & touch of vinegar",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065922974.png",
    "spicy": 2
  },
  {
    "id": "chili-chicken",
    "name": "Chili Chicken",
    "category": "Indo-Chinese",
    "description": "Chili Chicken Serving",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065980209.png"
  },
  {
    "id": "veg-fried-rice",
    "name": "Veg Fried Rice",
    "category": "Indo-Chinese",
    "description": "Veggies Fried Rice (Vegetarian)",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065981854.png",
    "vegetarian": true
  },
  {
    "id": "chicken-fried-rice",
    "name": "Chicken Fried Rice",
    "category": "Indo-Chinese",
    "description": "combination of fluffy rice, tender chicken, scrambled eggs & fresh vegetables stir-fried in aromatic spices",
    "price": 18,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065984918.png"
  },
  {
    "id": "veg-manchurian",
    "name": "Veg Manchurian",
    "category": "Indo-Chinese",
    "description": "Fusion Of vegetables Coated In A Tangy & Spicy Sauce",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065986113.png",
    "vegetarian": true,
    "spicy": 2
  },
  {
    "id": "vegetable-noodles",
    "name": "Vegetable Noodles",
    "category": "Indo-Chinese",
    "description": "combination of stir-fried noodles & fresh vegetables, seasoned with savory sauces & spices",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065986665.png",
    "vegetarian": true
  },
  {
    "id": "egg-noodles",
    "name": "Egg Noodles",
    "category": "Indo-Chinese",
    "description": "made with wheat flour & eggs",
    "price": 17,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065988657.png"
  },
  {
    "id": "chicken-noodles-wKQHVY",
    "name": "Chicken Noodles",
    "category": "Indo-Chinese",
    "description": "combination of tender chicken, soft noodles & fresh vegetables in a savory broth",
    "price": 19,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771065991479.png"
  },
  {
    "id": "steamed-rice",
    "name": "Steamed Rice",
    "category": "Rice",
    "description": "perfectly cooked steamed rice, a versatile staple that complements any meal",
    "price": 4,
    "image": "https://storage.googleapis.com/next-order-media/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066009437.png",
    "vegetarian": true
  },
  {
    "id": "saffron-rice",
    "name": "Saffron Rice",
    "category": "Rice",
    "description": "aromatic blend of premium quality saffron & fluffy basmati rice",
    "price": 5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066009700.png",
    "vegetarian": true
  },
  {
    "id": "tandoori-roti-whole-meal",
    "name": "Tandoori Roti (Whole Meal)",
    "category": "Breads",
    "description": "a crispy & chewy flatbread that is baked to perfection in a traditional clay oven",
    "price": 3.5,
    "image": "https://storage.googleapis.com/next-order-media/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066029281.png",
    "vegetarian": true
  },
  {
    "id": "tandoori-garlic-roti-whole-meal",
    "name": "Tandoori Garlic Roti (Whole Meal)",
    "category": "Breads",
    "description": "whole wheat flatbread infused with garlic & cooked to perfection in our clay oven",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066032230.png",
    "vegetarian": true
  },
  {
    "id": "plain-naan-pf",
    "name": "Plain Naan (PF)",
    "category": "Breads",
    "description": "a light & fluffy Indian bread that pairs perfectly with any curry or dish",
    "price": 3.5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066033939.png",
    "vegetarian": true
  },
  {
    "id": "butter-naan-pf",
    "name": "Butter Naan (PF)",
    "category": "Breads",
    "description": "a soft & fluffy bread that perfectly complements any curry or dish",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066035476.png",
    "vegetarian": true
  },
  {
    "id": "garlic-naan-pf",
    "name": "Garlic Naan (PF)",
    "category": "Breads",
    "description": "a fragrant & fluffy bread infused with aromatic garlic",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066036164.png",
    "vegetarian": true
  },
  {
    "id": "cheese-naan-pf",
    "name": "Cheese Naan (PF)",
    "category": "Breads",
    "description": "a fluffy & buttery Indian flatbread stuffed with melted cheese & baked to golden perfection in our clay oven",
    "price": 6,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066037673.png",
    "vegetarian": true
  },
  {
    "id": "kashmiri-naan-pf",
    "name": "Kashmiri Naan (PF)",
    "category": "Breads",
    "description": "a traditional Indian flatbread infused with a blend of sweet & savory spices, dried fruits & nuts",
    "price": 6,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066039556.png",
    "vegetarian": true
  },
  {
    "id": "tawa-paratha-pf",
    "name": "Tawa Paratha (PF)",
    "category": "Breads",
    "description": "Tawa Paratha (Plain Flour)",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066045965.png",
    "vegetarian": true
  },
  {
    "id": "paneer-paratha-pf",
    "name": "Paneer Paratha (PF)",
    "category": "Breads",
    "description": "delicious blend of soft, crumbly cottage cheese & warm flaky bread",
    "price": 7,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066043814.png",
    "vegetarian": true
  },
  {
    "id": "aloo-paratha-pf",
    "name": "Aloo Paratha (PF)",
    "category": "Breads",
    "description": "a traditional Indian flatbread stuffed with a savory potato filling & cooked to golden perfection",
    "price": 7,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066045978.png",
    "vegetarian": true
  },
  {
    "id": "aloo-paneer-paratha-pf",
    "name": "Aloo & Paneer Paratha (PF)",
    "category": "Breads",
    "description": "combination of savory mashed potatoes, creamy cottage cheese, & freshly made bread",
    "price": 7,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066047194.png",
    "vegetarian": true
  },
  {
    "id": "onion-salad",
    "name": "Onion Salad",
    "category": "Extras",
    "description": "made with sliced red onions",
    "price": 3,
    "image": "https://storage.googleapis.com/next-order-media/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066064561.png"
  },
  {
    "id": "mix-salad",
    "name": "Mix Salad",
    "category": "Extras",
    "description": "Mix Salad",
    "price": 5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066065922.png"
  },
  {
    "id": "raita",
    "name": "Raita",
    "category": "Extras",
    "description": "yogurt-based condiment made with diced cucumbers, tomatoes & aromatic spice",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066067804.png",
    "vegetarian": true
  },
  {
    "id": "pickles",
    "name": "Pickles",
    "category": "Extras",
    "description": "Made with a mix of pickled carrots, cauliflower & green chilies",
    "price": 2,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066069433.png"
  },
  {
    "id": "boiled-egg",
    "name": "Boiled Egg",
    "category": "Extras",
    "description": "Boiled Egg",
    "price": 2,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066069619.png"
  },
  {
    "id": "qubani-ka-meetha-apprecots",
    "name": "Qubani Ka Meetha (Apprecots)",
    "category": "Dessert",
    "description": "Qubani Ka Meetha (Apprecots)",
    "price": 6,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066084327.png",
    "vegetarian": true
  },
  {
    "id": "gulab-jamun",
    "name": "Gulab Jamun",
    "category": "Dessert",
    "description": "1 piece Indian dessert made with soft, spongy dough balls soaked in sweet syrup & garnished with nuts",
    "price": 2.5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066087148.png",
    "vegetarian": true
  },
  {
    "id": "kheer",
    "name": "Kheer",
    "category": "Dessert",
    "description": "a creamy & decadent rice pudding that is infused with aromatic spices & garnished with crunchy nuts",
    "price": 6,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066087511.png",
    "vegetarian": true
  },
  {
    "id": "kulfi-paanpista",
    "name": "Kulfi (Paan/Pista)",
    "category": "Dessert",
    "description": "a rich & creamy frozen dessert made with pure milk, pistachios & cardamom",
    "price": 5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066088883.png",
    "vegetarian": true
  },
  {
    "id": "diet-coke-375ml",
    "name": "Diet Coke (375ml)",
    "category": "Drinks",
    "description": "Soft Drink - Can",
    "price": 3,
    "image": "https://assets.nextorder.co/public/d39789d8-5337-44b3-9e6f-ac004ad40240",
    "vegetarian": true
  },
  {
    "id": "coke-375ml",
    "name": "Coke (375ml)",
    "category": "Drinks",
    "description": "Coke Classic Soft Drink",
    "price": 3,
    "image": "https://assets.nextorder.co/public/03b29dce-445e-4267-8275-5aaa0fb43adc",
    "vegetarian": true
  },
  {
    "id": "pepsi-375ml",
    "name": "Pepsi (375ml)",
    "category": "Drinks",
    "description": "Pepsi Soft Drink",
    "price": 3,
    "image": "https://assets.nextorder.co/public/a0137b58-6a72-421a-a860-b9850f4ceaa0",
    "vegetarian": true
  },
  {
    "id": "solo-375ml",
    "name": "Solo (375ml)",
    "category": "Drinks",
    "description": "Solo Soft Drink",
    "price": 3,
    "image": "https://assets.nextorder.co/public/17890f46-fdc5-44d0-a24a-ba591d418904",
    "vegetarian": true
  },
  {
    "id": "lemonade-375ml",
    "name": "Lemonade (375ml)",
    "category": "Drinks",
    "description": "Lemonade (375ml)",
    "price": 3,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066363935.png",
    "vegetarian": true
  },
  {
    "id": "tea",
    "name": "Tea",
    "category": "Drinks",
    "description": "Tea prepared authentic Hyderabadi style with fresh spices and herbs.",
    "price": 4,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066367726.png",
    "vegetarian": true
  },
  {
    "id": "salt-lassi",
    "name": "Salt Lassi",
    "category": "Drinks",
    "description": "Salt Lassi",
    "price": 5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066364604.png",
    "vegetarian": true
  },
  {
    "id": "sugar-lassi",
    "name": "Sugar Lassi",
    "category": "Drinks",
    "description": "Sugar Lassi",
    "price": 5,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066365165.png",
    "vegetarian": true
  },
  {
    "id": "mango-lassi",
    "name": "Mango Lassi",
    "category": "Drinks",
    "description": "Mango Lassi",
    "price": 6,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771066367562.png",
    "vegetarian": true
  },
  {
    "id": "tandoori-mix-family-pack",
    "name": "Tandoori Mix (Family Pack)",
    "category": "Catering Menu",
    "description": "(6X Tandoori Chicken, 5X Malai tikka, 4X Seekh Kebabs, 3X Lamb cutlets )",
    "price": 75,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063824264.png"
  },
  {
    "id": "chicken-65-SKeyr1",
    "name": "Chicken 65",
    "category": "Catering Menu",
    "description": "(6X Tandoori Chicken, 5X Malai tikka,",
    "price": 65,
    "image": "https://assets.nextorder.co/public/b4522a39-effc-4345-a670-3ba7098089dc"
  },
  {
    "id": "chilli-chicken",
    "name": "Chilli Chicken",
    "category": "Catering Menu",
    "description": "4X Seekh Kebabs, 3X Lamb cutlets )",
    "price": 75,
    "image": "https://assets.nextorder.co/public/17d17478-981d-45da-a670-66eed9d9387b",
    "spicy": 2
  },
  {
    "id": "5kg-curry-bucket",
    "name": "5Kg Curry Bucket",
    "category": "Catering Menu",
    "description": "Serves Upto 12-13 Guests, Choice of Veg, Chicken, Lamb Or Goat",
    "price": 120,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1772418390409.png"
  },
  {
    "id": "10kg-curry-bucket",
    "name": "10Kg Curry Bucket",
    "category": "Catering Menu",
    "description": "Serves Upto 20+ Guests, Choice of Veg, Chicken, Lamb Or Goat",
    "price": 220,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1772418462787.png"
  },
  {
    "id": "family-goat-biryani-4-to-5-ppl",
    "name": "Family Goat Biryani (4 to 5 ppl)",
    "category": "Catering Menu",
    "description": "Serves 5-6 Guests",
    "price": 70,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063737885.png",
    "spicy": 1
  },
  {
    "id": "family-biryani-4-to-5-ppl",
    "name": "Family Biryani (4 to 5 ppl)",
    "category": "Catering Menu",
    "description": "Serves 5-6 Guests, Chicken or Vegetable",
    "price": 65,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063739624.png",
    "spicy": 1
  },
  {
    "id": "jumbo-chicken-or-vegetable-biryani-8-to-10-ppl",
    "name": "Jumbo Chicken Or Vegetable Biryani (8 to 10 ppl)",
    "category": "Catering Menu",
    "description": "Serves 10-12 Guests, 2x Family Pack",
    "price": 125,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063741768.png",
    "vegetarian": true,
    "spicy": 1
  },
  {
    "id": "jumbo-goat-biryani-8-to-10-ppl",
    "name": "Jumbo Goat Biryani (8 to 10 ppl)",
    "category": "Catering Menu",
    "description": "Serves 10-12 Guests, 2x Family Pack",
    "price": 135,
    "image": "https://assets.nextorder.co/menu-items/fUl4PMdzNvx8me0cnIS0/generated_1771063742865.png",
    "spicy": 1
  },
  {
    "id": "15-people-pot",
    "name": "15 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita & Salan Not Included With Handi)",
    "price": 180,
    "image": "https://assets.nextorder.co/public/b8420a2e-fc65-492f-878f-0a706fe327c4"
  },
  {
    "id": "20-people-pot",
    "name": "20 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 220,
    "image": "https://assets.nextorder.co/public/166e7da1-6a6e-47f7-8671-3f55cb33d16b"
  },
  {
    "id": "25-people-pot",
    "name": "25 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 270,
    "image": "https://assets.nextorder.co/public/075906b3-5f2d-4f28-8d22-502cccf29e08"
  },
  {
    "id": "30-people-pot",
    "name": "30 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 320,
    "image": "https://assets.nextorder.co/public/cc056516-bd40-49a6-9f67-f3f58125e2ba"
  },
  {
    "id": "35-people-pot",
    "name": "35 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 360,
    "image": "https://assets.nextorder.co/public/6a9c4508-b24d-4557-8912-42c44b3f8c80"
  },
  {
    "id": "40-people-pot",
    "name": "40 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 450,
    "image": "https://assets.nextorder.co/public/a29de040-a7e1-48f2-8386-6f2abd6acd58"
  },
  {
    "id": "45-people-pot",
    "name": "45 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 470,
    "image": "https://assets.nextorder.co/public/958787b0-0862-4f11-ab13-3c5e3a18532e"
  },
  {
    "id": "50-people-pot",
    "name": "50 People Pot",
    "category": "Catering Menu",
    "description": "Biryani Pots, Curries, Kebabs, Sweets & Naan At Reasonable Price. (Note: Raita And Salan Not Included With Handi)",
    "price": 500,
    "image": "https://assets.nextorder.co/public/041fefa1-9000-4731-ad6f-bc350cd8b911"
  },
  {
    "id": "thanks",
    "name": "Thanks",
    "category": "Other",
    "description": "Thanks",
    "price": 0.5,
    "image": "https://assets.nextorder.co/public/68c5a626-e8bf-43ae-aa4c-80ffda24bd66"
  },
  {
    "id": "vegetarian-noodles",
    "name": "Vegetarian Noodles",
    "category": "Other",
    "description": "Vegetarian Noodles",
    "price": 17,
    "image": "https://lacampa.s3.ap-southeast-2.amazonaws.com/public/cf348502-04b7-43e5-9eb8-b7e0316313b0",
    "vegetarian": true
  },
  {
    "id": "egg-noodles-bLpzp3",
    "name": "Egg Noodles",
    "category": "Other",
    "description": "Egg Noodles",
    "price": 17,
    "image": "https://lacampa.s3.ap-southeast-2.amazonaws.com/public/ec8b1d58-b2c5-40a2-9301-bc11ba1c7160"
  },
  {
    "id": "chicken-noodles",
    "name": "Chicken Noodles",
    "category": "Other",
    "description": "Chicken Noodles",
    "price": 17,
    "image": "https://lacampa.s3.ap-southeast-2.amazonaws.com/public/4203b9d7-bc86-40ec-baca-2fcb2f54fee3"
  },
  {
    "id": "vegetarian-and-egg-noodles",
    "name": "Vegetarian and Egg Noodles",
    "category": "Other",
    "description": "Vegetarian and Egg Noodles",
    "price": 17,
    "image": "https://lacampa.s3.ap-southeast-2.amazonaws.com/public/1efbac49-110c-441d-8a63-dc5d0c3f3167",
    "vegetarian": true
  },
  {
    "id": "chicken-and-egg-noodles",
    "name": "Chicken and Egg Noodles",
    "category": "Other",
    "description": "Chicken and Egg Noodles",
    "price": 17,
    "image": "https://lacampa.s3.ap-southeast-2.amazonaws.com/public/bb2dc727-5c06-4dfa-8db0-45845905181f"
  }
];

export const FEATURED_IDS = [
  "chicken-dum-biryani",
  "goat-dum-biryani",
  "chicken-65-biryani",
  "special-mix"
];

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

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
