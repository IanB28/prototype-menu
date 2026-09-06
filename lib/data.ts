export const categories = ["Todos", "Café", "Bebidas frías", "Desayunos", "Panadería", "Postres"] as const;
export type Category = (typeof categories)[number];

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "Todos">;
  image: string;
  available: boolean;
  featured?: boolean;
};

export const initialProducts: Product[] = [
  { id: 1, name: "Latte de vainilla", description: "Espresso doble, leche vaporizada y vainilla de Madagascar.", price: 68, category: "Café", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=85", available: true, featured: true },
  { id: 2, name: "Cappuccino nube", description: "Espuma sedosa, canela recién molida y nuestro blend de la casa.", price: 62, category: "Café", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85", available: true },
  { id: 3, name: "Matcha tonic", description: "Matcha ceremonial, agua tónica, limón amarillo y hielo.", price: 78, category: "Bebidas frías", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85", available: true, featured: true },
  { id: 4, name: "Chai frío", description: "Té chai especiado, leche de avena y un toque de miel.", price: 74, category: "Bebidas frías", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=85", available: true },
  { id: 5, name: "Tostada de aguacate", description: "Pan de masa madre, aguacate, huevo pochado y chile seco.", price: 125, category: "Desayunos", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85", available: true, featured: true },
  { id: 6, name: "Croissant de almendra", description: "Hojaldre de mantequilla horneado cada mañana.", price: 58, category: "Panadería", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85", available: true },
  { id: 7, name: "Pastel de zanahoria", description: "Especias cálidas, nuez tostada y frosting de queso crema.", price: 82, category: "Postres", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85", available: false },
  { id: 8, name: "Galleta de chocolate", description: "Bordes crujientes, centro suave y chocolate 70%.", price: 42, category: "Postres", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85", available: true }
];
