const menuItems = [
  // Biryani
  {
    id: "biryani-1",
    name: "Hyderabadi Dum Biryani (Chicken)",
    category: "Biryani",
    description: "Authentic royal fragrant basmati rice slow-cooked on dum with marinated chicken, saffron, and aromatic spices.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },
  {
    id: "biryani-2",
    name: "Hyderabadi Mutton Dum Biryani",
    category: "Biryani",
    description: "Tender goat meat layered with aged basmati rice, caramelized onions, mint, and signature spices.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },
  {
    id: "biryani-3",
    name: "Royal Veg Dum Biryani",
    category: "Biryani",
    description: "Fresh garden vegetables and cottage cheese layered with saffron-infused rice and herbs.",
    price: 14.49,
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "biryani-4",
    name: "Egg Dum Biryani",
    category: "Biryani",
    description: "Boiled and spiced eggs embedded in savory basmati rice cooked to perfection.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },

  // Starters
  {
    id: "starter-1",
    name: "Chicken 65",
    category: "Starters",
    description: "Crispy fried chicken chunks tossed in spicy yogurt, curry leaves, and green chilies.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },
  {
    id: "starter-2",
    name: "Paneer Tikka Angaare",
    category: "Starters",
    description: "Marinated cubes of paneer, bell peppers, and onions grilled in a traditional tandoor.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "starter-3",
    name: "Tandoori Chicken (Half/Full)",
    category: "Starters",
    description: "Classic bone-in chicken marinated in yogurt, Kashmiri red chili, and cooked in clay oven.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },
  {
    id: "starter-4",
    name: "Hyderabadi Veg Samosa (3 pcs)",
    category: "Starters",
    description: "Golden flaky pastry stuffed with seasoned potatoes, green peas, and served with mint & tamarind chutneys.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },

  // Curry
  {
    id: "curry-1",
    name: "Butter Chicken (Murgh Makhani)",
    category: "Curry",
    description: "Smoked shredded chicken cooked in a rich, velvety tomato butter and fenugreek gravy.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },
  {
    id: "curry-2",
    name: "Hyderabadi Dum Ka Murgh",
    category: "Curry",
    description: "Slow-cooked chicken cooked with roasted almond and cashew nut paste and aromatic spices.",
    price: 16.49,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    vegetarian: false
  },
  {
    id: "curry-3",
    name: "Paneer Butter Masala",
    category: "Curry",
    description: "Cottage cheese simmered in a luscious tomato-cashew creamy gravy with aromatic spices.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "curry-4",
    name: "Dal Makhani",
    category: "Curry",
    description: "Black lentils and kidney beans slow-cooked overnight with cream, butter, and mild spices.",
    price: 12.49,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },

  // Naan
  {
    id: "naan-1",
    name: "Butter Garlic Naan",
    category: "Naan",
    description: "Hand-stretched leavened tandoor flatbread brushed with garlic and clarified butter.",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "naan-2",
    name: "Plain Tandoori Roti",
    category: "Naan",
    description: "Whole wheat traditional flatbread baked fresh in the clay tandoor oven.",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "naan-3",
    name: "Cheese Chili Naan",
    category: "Naan",
    description: "Tandoori naan stuffed with mozzarella cheese, green chilies, and fresh cilantro.",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },

  // Rice
  {
    id: "rice-1",
    name: "Jeera Basmati Rice",
    category: "Rice",
    description: "Fragrant basmati rice tempered with roasted cumin seeds and desi ghee.",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "rice-2",
    name: "Saffron Bagara Rice",
    category: "Rice",
    description: "Traditional Hyderabadi seasoned rice cooked with whole spices, mint, and fried onions.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },

  // Drinks
  {
    id: "drinks-1",
    name: "Hyderabadi Irani Chai",
    category: "Drinks",
    description: "Famous slow-brewed strong milk tea infused with cardamom and condensed milk richness.",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "drinks-2",
    name: "Mango Lassi",
    category: "Drinks",
    description: "Thick, creamy yogurt shake blended with sweet Alphonso mango pulp and cardamom.",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "drinks-3",
    name: "Masala Chaas (Spiced Buttermilk)",
    category: "Drinks",
    description: "Refreshing churned buttermilk tempered with ginger, green chili, and roasted cumin.",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },

  // Desserts
  {
    id: "dessert-1",
    name: "Shahi Tukda (Double Ka Meetha)",
    category: "Desserts",
    description: "Royal Hyderabadi dessert of crispy fried bread soaked in saffron milk and topped with rabri & nuts.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "dessert-2",
    name: "Gulab Jamun with Ice Cream",
    category: "Desserts",
    description: "Warm milk-solid dumplings soaked in rose sugar syrup served alongside rich vanilla ice cream.",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1605197148560-63640243e8ea?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  },
  {
    id: "dessert-3",
    name: "Qubani Ka Meetha",
    category: "Desserts",
    description: "Traditional stewed dried apricot compote served with fresh clotted cream.",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80",
    vegetarian: true
  }
];

const CATEGORIES = [
  "Biryani",
  "Starters",
  "Curry",
  "Naan",
  "Rice",
  "Drinks",
  "Desserts"
];

module.exports = {
  menuItems,
  CATEGORIES
};
