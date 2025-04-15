import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/pet';
import { products as mockProducts } from '@/mocks/products';

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShopState {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  
  // Actions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  
  // Getters
  getCartItems: () => { product: Product; quantity: number }[];
  getCartTotal: () => number;
  getFavoriteProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsBySearch: (query: string) => Product[];
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      cart: [],
      favorites: [],
      
      addToCart: (productId, quantity = 1) => set((state) => {
        const existingItem = state.cart.find(item => item.productId === productId);
        
        if (existingItem) {
          return {
            cart: state.cart.map(item => 
              item.productId === productId 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          };
        } else {
          return {
            cart: [...state.cart, { productId, quantity }]
          };
        }
      }),
      
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId)
      })),
      
      updateCartItemQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.productId === productId 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        )
      })),
      
      clearCart: () => set({ cart: [] }),
      
      addToFavorites: (productId) => set((state) => ({
        favorites: [...state.favorites, productId]
      })),
      
      removeFromFavorites: (productId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== productId)
      })),
      
      getCartItems: () => {
        const { products, cart } = get();
        return cart.map(item => ({
          product: products.find(p => p.id === item.productId)!,
          quantity: item.quantity
        })).filter(item => item.product); // Filter out any items where product wasn't found
      },
      
      getCartTotal: () => {
        const cartItems = get().getCartItems();
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
      
      getFavoriteProducts: () => {
        const { products, favorites } = get();
        return products.filter(product => favorites.includes(product.id));
      },
      
      getProductsByCategory: (category) => {
        return get().products.filter(product => product.category === category);
      },
      
      getProductById: (id) => {
        return get().products.find(product => product.id === id);
      },
      getProductsBySearch: (query) => {
        const searchTerm = query.toLowerCase().trim();
        return get().products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }
    }),
    {
      name: 'shop-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);