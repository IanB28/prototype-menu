"use client";

import { useEffect, useState } from "react";
import { initialProducts, type Product } from "@/lib/data";

const storageKey = "cafe-nube-products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setProducts(JSON.parse(stored) as Product[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(products));
    }
  }, [hydrated, products]);

  return [products, setProducts] as const;
}
