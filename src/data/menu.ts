import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Truffle Mushroom Pizza",
    price: 699,
    desc: "Wood-fired crust, wild mushrooms, black truffle oil, fior di latte mozzarella, fresh thyme.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    category: 'pizzas',
    categoryLabel: 'Artisanal Pizza',
    isVeg: true,
    isChefSpecial: true,
    prepTime: "12-15m",
    calories: "780 kcal"
  },
  {
    id: 2,
    name: "Gold Leaf Wagyu Burger",
    price: 899,
    desc: "Prime A5 Wagyu patty, 24k edible gold flakes, aged English cheddar, caramelized shallots, brioche.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    category: 'burgers',
    categoryLabel: 'Gourmet Burgers',
    isVeg: false,
    isChefSpecial: true,
    prepTime: "15-18m",
    calories: "920 kcal"
  },
  {
    id: 3,
    name: "Spicy Garlic Pasta",
    price: 549,
    desc: "Bronze-die penne in rich roasted garlic tomato basil emulsion with charred chili flakes and parmesan.",
    img: "https://images.unsplash.com/photo-1621996311210-911477759247?auto=format&fit=crop&w=800&q=80",
    category: 'pasta',
    categoryLabel: 'Handcrafted Pasta',
    isVeg: true,
    spicyLevel: 2,
    prepTime: "10-12m",
    calories: "620 kcal"
  },
  {
    id: 4,
    name: "Midnight Espresso Martini",
    price: 499,
    desc: "Single-origin Arabica cold brew, premium vodka, Kahlúa liqueur, vanilla essence, dark cocoa dusting.",
    img: "https://images.unsplash.com/photo-1628198305739-2ceee211606a?auto=format&fit=crop&w=800&q=80",
    category: 'cocktails',
    categoryLabel: 'Signature Drinks',
    isVeg: true,
    isChefSpecial: true,
    prepTime: "5m",
    calories: "210 kcal"
  },
  {
    id: 5,
    name: "Classic Mojito",
    price: 349,
    desc: "Crushed Cuban mint, muddled key lime, white Caribbean rum, organic demerara syrup, club soda.",
    img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
    category: 'cocktails',
    categoryLabel: 'Signature Drinks',
    isVeg: true,
    prepTime: "4m",
    calories: "160 kcal"
  },
  {
    id: 6,
    name: "Burrata & Heirloom Caprese",
    price: 589,
    desc: "Fresh Puglia burrata, balsamic caviar, heirloom beefsteak tomatoes, cold-pressed basil olive oil.",
    img: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80",
    category: 'mains',
    categoryLabel: 'Starters & Mains',
    isVeg: true,
    isChefSpecial: false,
    prepTime: "8m",
    calories: "450 kcal"
  },
  {
    id: 7,
    name: "Smoked Butter Chicken Slider Trio",
    price: 649,
    desc: "Charcoal-smoked pulled chicken in rich makhani glaze, pickled onions, mini milk brioche buns.",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    category: 'burgers',
    categoryLabel: 'Gourmet Burgers',
    isVeg: false,
    spicyLevel: 1,
    prepTime: "12-14m",
    calories: "710 kcal"
  },
  {
    id: 8,
    name: "Dark Chocolate Lava Fondant",
    price: 449,
    desc: "70% Belgian chocolate molten core cake, Madagascar vanilla bean gelato, raspberry coulis.",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    category: 'desserts',
    categoryLabel: 'Decadent Desserts',
    isVeg: true,
    isChefSpecial: true,
    prepTime: "10m",
    calories: "520 kcal"
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'burgers', label: 'Burgers & Sliders' },
  { id: 'pasta', label: 'Pastas' },
  { id: 'mains', label: 'Mains & Starters' },
  { id: 'cocktails', label: 'Cocktails & Brews' },
  { id: 'desserts', label: 'Desserts' },
] as const;

export interface SmartPairingRecommendation {
  item: MenuItem;
  reason: string;
  triggeredByName: string;
}

export function getSmartPairing(cartItems: { item: MenuItem; qty: number }[]): SmartPairingRecommendation | null {
  if (cartItems.length === 0) return null;

  const cartItemIds = new Set(cartItems.map((c) => c.item.id));
  const hasDrinks = cartItems.some((c) => c.item.category === 'cocktails');
  const hasDesserts = cartItems.some((c) => c.item.category === 'desserts');
  const foodItems = cartItems.filter((c) => c.item.category !== 'cocktails');

  const espressoMartini = MENU_ITEMS.find((m) => m.id === 4)!;
  const classicMojito = MENU_ITEMS.find((m) => m.id === 5)!;
  const chocolateLava = MENU_ITEMS.find((m) => m.id === 8)!;

  // Case 1: Food in cart, but no drinks
  if (foodItems.length > 0 && !hasDrinks) {
    // Check for Pizza
    const pizza = foodItems.find((c) => c.item.category === 'pizzas');
    if (pizza) {
      const recItem = !cartItemIds.has(espressoMartini.id) ? espressoMartini : classicMojito;
      return {
        item: recItem,
        reason: "Arabica cold brew & dark cocoa notes balance wood-fired truffle mozzarella effortlessly.",
        triggeredByName: pizza.item.name,
      };
    }

    // Check for Pasta
    const pasta = foodItems.find((c) => c.item.category === 'pasta');
    if (pasta) {
      const recItem = !cartItemIds.has(espressoMartini.id) ? espressoMartini : classicMojito;
      return {
        item: recItem,
        reason: "Rich velvet cold brew tones soften roasted garlic and spicy chili heat.",
        triggeredByName: pasta.item.name,
      };
    }

    // Check for Burgers / Sliders
    const burger = foodItems.find((c) => c.item.category === 'burgers');
    if (burger) {
      const recItem = !cartItemIds.has(classicMojito.id) ? classicMojito : espressoMartini;
      return {
        item: recItem,
        reason: "Zesty Cuban lime and crushed fresh mint cut cleanly through succulent Wagyu & brioche richness.",
        triggeredByName: burger.item.name,
      };
    }

    // Check for Mains / Burrata
    const main = foodItems.find((c) => c.item.category === 'mains');
    if (main) {
      const recItem = !cartItemIds.has(classicMojito.id) ? classicMojito : espressoMartini;
      return {
        item: recItem,
        reason: "Sparkling botanical citrus accentuates fresh creamy Puglia burrata and cold-pressed basil oils.",
        triggeredByName: main.item.name,
      };
    }

    // Default drink pairing
    const fallbackFood = foodItems[0];
    const recItem = !cartItemIds.has(espressoMartini.id) ? espressoMartini : classicMojito;
    return {
      item: recItem,
      reason: "Handcrafted signature cocktail crafted to elevate and balance your selected courses.",
      triggeredByName: fallbackFood.item.name,
    };
  }

  // Case 2: Cart has drinks and food, but no dessert
  if (!hasDesserts && !cartItemIds.has(chocolateLava.id)) {
    return {
      item: chocolateLava,
      reason: "Conclude your midnight culinary journey with 70% molten Belgian cocoa and Madagascar gelato.",
      triggeredByName: cartItems[0].item.name,
    };
  }

  return null;
}

