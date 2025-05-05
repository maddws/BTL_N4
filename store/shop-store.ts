import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/pet';
import { db } from '@/config/firebase'; // Import Firestore instance
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    getDocs,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
} from 'firebase/firestore';
// import {
//     collection,
//     getDocs,
//     getDoc,
//     query,
//     where,
//     doc,
//     setDoc,
//     deleteDoc,
// } from 'firebase/firestore';
import { Alert } from 'react-native';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';

const getRating = async (pid: string) => {
    const snap = await getDocs(query(collection(db, 'ItemRating'), where('product_id', '==', pid)));
    const total = snap.docs.reduce((s, d) => s + (d.data().rating || 0), 0);
    return {
        rating: snap.size ? total / snap.size : 0,
        reviews: snap.size,
    };
};

const writeCart = async (uid: string, cart: CartItem[]) => {
    try {
        await setDoc(doc(db, 'Carts', uid), { items: cart }, { merge: true });
    } catch (e) {
        console.warn('🔥 sync cart error', e);
    }
};
const fetchProductsOnce = async (): Promise<Product[]> => {
    const snap = await getDocs(collection(db, 'Products'));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

interface CartItem {
    productId: string;
    quantity: number;
}

interface ShopState {
    products: Product[];
    cart: CartItem[];
    userId: string | null;
    loadingCart: boolean;
    loadingProducts: boolean;
    favorites: string[];

    addToFavorites: (productId: string) => void;
    removeFromFavorites: (productId: string) => void;
    syncProducts: () => Promise<void>; // chỉ fetch 1 lần
    subscribeProducts: () => () => void;
    subscribeRatings: () => () => void;

    // Getters
    // getCartItems: () => { product: Product; quantity: number }[];
    // getCartTotal: () => number;
    getFavoriteProducts: () => Product[];
    getProductsByCategory: (category: string) => Product[];
    getProductById: (id: string) => Product | undefined;
    getProductsBySearch: (query: string) => Product[];

    // cart actions
    addToCart: (id: string, qty?: number) => void;
    updateQty: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;

    // helpers
    setUser: (uid: string | null) => Promise<void>;
    cartItems: () => { product: Product; quantity: number }[];
    cartTotal: () => number;
}
const toProduct = async (raw: any): Promise<Product> => {
    const { rating, reviews } = await getRating(raw.id); // hàm đã gửi trước
    return {
        ...raw,
        rating: rating ?? 0,
        reviews: reviews ?? 0,
    } as Product;
};

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            products: [],
            cart: [],
            userId: null,
            loadingCart: false,
            loadingProducts: false,
            favorites: [],

            subscribeProducts: () => {
                const q = query(collection(db, 'Products'));
                set({ loadingProducts: true });
                const unsub = onSnapshot(q, async (snap) => {
                    const prods: Product[] = [];
                    snap.docs.forEach((d) => {
                        prods.push({ id: d.id, ...(d.data() as any) });
                    });
                    set({ products: prods, loadingProducts: false });
                    // cache offline
                    await AsyncStorage.setItem('cachedProducts', JSON.stringify(prods));
                });
                return unsub;
            },

            subscribeRatings: () => {
                // listen changes in ItemRating to recalc averages
                const ratingsRef = collection(db, 'ItemRating');
                const unsub = onSnapshot(ratingsRef, async () => {
                    // simply refetch products to include avg rating
                    const prods = get().products;
                    // optionally fetch per-product reviews and merge...
                    // omitted for brevity
                    set({ products: [...prods] });
                });
                return unsub;
            },

            syncProducts: async () => {
                if (get().loadingProducts) return;
                set({ loadingProducts: true });
                try {
                    const base = await fetchProductsOnce();
                    const full = await Promise.all(base.map(toProduct));
                    set({ products: full });
                } finally {
                    set({ loadingProducts: false });
                }
            },

            /* ---------- auth ---------- */
            setUser: async (uid) => {
                set({ userId: uid, loadingCart: true });
                if (!uid) {
                    set({ cart: [], loadingCart: false });
                    return;
                }

                // load cart in Firestore
                const snap = await getDoc(doc(db, 'Carts', uid));
                const items = snap.exists() ? snap.data()?.items ?? [] : [];
                set({ cart: items, loadingCart: false });
            },

            /* ---------- cart mutators ---------- */
            addToCart: (id, qty = 1) => {
                set((state) => {
                    const ex = state.cart.find((c) => c.productId === id);
                    const next = ex
                        ? state.cart.map((c) =>
                              c.productId === id ? { ...c, quantity: c.quantity + qty } : c
                          )
                        : [...state.cart, { productId: id, quantity: qty }];
                    // fire‑and‑forget sync
                    if (state.userId) writeCart(state.userId, next);
                    return { cart: next };
                });
            },

            updateQty: (id, qty) => {
                set((state) => {
                    const next = state.cart.map((c) =>
                        c.productId === id ? { ...c, quantity: qty } : c
                    );
                    if (state.userId) writeCart(state.userId, next);
                    return { cart: next };
                });
            },

            removeFromCart: (id) => {
                set((state) => {
                    const next = state.cart.filter((c) => c.productId !== id);
                    if (state.userId) writeCart(state.userId, next);
                    return { cart: next };
                });
            },

            clearCart: () => {
                set((state) => {
                    if (state.userId) writeCart(state.userId, []);
                    return { cart: [] };
                });
            },

            /* ---------- getters ---------- */
            cartItems: () => {
                const { products, cart } = get();
                return cart
                    .map((c) => ({
                        product: products.find((p) => p.id === c.productId)!,
                        quantity: c.quantity,
                    }))
                    .filter((i) => i.product);
            },
            cartTotal: () => {
                return get()
                    .cartItems()
                    .reduce((s, i) => s + i.product.price * i.quantity, 0);
            },

            addToFavorites: (productId) =>
                set((state) => ({
                    favorites: [...state.favorites, productId],
                })),

            removeFromFavorites: (productId) =>
                set((state) => ({
                    favorites: state.favorites.filter((id) => id !== productId),
                })),

            getFavoriteProducts: () => {
                const { products, favorites } = get();
                return products.filter((product) => favorites.includes(product.id));
            },

            getProductsByCategory: (category) => {
                return get().products.filter((product) => product.category === category);
            },

            getProductById: (id) => {
                return get().products.find((product) => product.id === id);
            },
            getProductsBySearch: (query) => {
                const searchTerm = query.toLowerCase().trim();
                return get().products.filter(
                    (product) =>
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm)
                );
            },
        }),
        {
            name: 'shop-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Product } from '@/types/pet'; // Import kiểu dữ liệu Product
// import { db } from '@/config/firebase'; // Import Firestore instance
// import {
//     collection,
//     doc,
//     getDoc,
//     getDocs,
//     setDoc,
//     updateDoc,
//     query,
//     where,
// } from 'firebase/firestore';
// import { ListCollapse } from 'lucide-react-native';

// const productsCollection = collection(db, 'Products');
// const cartCollection = collection(db, 'Carts'); // Giả sử giỏ hàng lưu trong Firestore

// // Lấy tất cả sản phẩm từ Firestore
// const getProductsFromFirestore = async () => {
//     const querySnapshot = await getDocs(productsCollection);
//     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Thêm một sản phẩm vào giỏ hàng
// const addToCartInFirestore = async (userId: string, productId: string, quantity: number) => {
//     const cartRef = doc(cartCollection, userId);
//     const cartSnapshot = await getDoc(cartRef);
//     if (cartSnapshot.exists()) {
//         const existingCart = cartSnapshot.data().items || [];
//         existingCart.push({ productId, quantity });
//         await updateDoc(cartRef, { items: existingCart });
//     } else {
//         await setDoc(cartRef, { userId, items: [{ productId, quantity }] });
//     }
// };

// interface CartItem {
//     productId: string;
//     quantity: number;
// }

// interface ShopState {
//     products: Product[];
//     cart: CartItem[];
//     favorites: string[];

//     // Actions
//     addToCart: (userId: string, productId: string, quantity?: number) => void;
//     removeFromCart: (userId: string, productId: string) => void;
//     updateCartItemQuantity: (userId: string, productId: string, quantity: number) => void;
//     fetchProducts: () => void;
//     clearCart: () => void;
//     // Getters
//     getCartItems: () => { product: Product; quantity: number }[];
//     getCartTotal: () => number;
//     getFavoriteProducts: () => Product[];
//     getProductsByCategory: (category: string) => Product[];
//     getProductById: (id: string) => Product | undefined;
//     getProductsBySearch: (query: string) => Product[];
// }

// export const useShopStore = create<ShopState>()(
//     persist(
//         (set, get) => ({
//             products: [], // Mảng sản phẩm sẽ được lấy từ Firestore
//             cart: [],
//             favorites: [],

//             // Fetch products from Firestore when the store is initialized
//             fetchProducts: async () => {
//                 try {
//                     const products = await getProductsFromFirestore();

//                     // Dùng Promise.all để đợi tất cả các review được lấy về
//                     const visualProducts = await Promise.all(
//                         products.map(async (pr) => {
//                             // Lấy thông tin review cho từng sản phẩm
//                             const review = await getProductWithReviewsAndRating(pr.id);

//                             return {
//                                 id: pr.id,
//                                 name: pr.name,
//                                 description: pr.description,
//                                 price: pr.price,
//                                 imageUrl: pr.imageUrl,
//                                 category: pr.category,
//                                 rating: review?.rating || 0, // Lấy giá trị rating từ review nếu có
//                                 reviews: review?.count || 0, // Lấy số lượng đánh giá từ review nếu có
//                                 inStock: pr.inStock,
//                             };
//                         })
//                     );

//                     // Cập nhật state với mảng visualProducts đã tạo
//                     set({ products: visualProducts });
//                 } catch (error) {
//                     console.error('Error fetching products:', error);
//                 }
//             },

//             addToCart: async (userId, productId, quantity = 1) => {
//                 // Lấy giỏ hàng từ Firestore
//                 await addToCartInFirestore(userId, productId, quantity);

//                 // Cập nhật lại giỏ hàng trong store
//                 const newCart = [...get().cart, { productId, quantity }];
//                 set({ cart: newCart });
//             },

//             removeFromCart: (productId) =>
//                 set((state) => ({
//                     cart: state.cart.filter((item) => item.productId !== productId),
//                 })),

//             updateCartItemQuantity: (productId, quantity) =>
//                 set((state) => ({
//                     cart: state.cart.map((item) =>
//                         item.productId === productId
//                             ? { ...item, quantity: Math.max(1, quantity) }
//                             : item
//                     ),
//                 })),

//             clearCart: () => set({ cart: [] }),

//             getCartItems: () => {
//                 const { products, cart } = get();
//                 return cart
//                     .map((item) => ({
//                         product: products.find((p) => p.id === item.productId)!,
//                         quantity: item.quantity,
//                     }))
//                     .filter((item) => item.product);
//             },

//             getCartTotal: () => {
//                 const cartItems = get().getCartItems();
//                 return cartItems.reduce(
//                     (total, item) => total + item.product.price * item.quantity,
//                     0
//                 );
//             },

//             getFavoriteProducts: () => {
//                 const { products, favorites } = get();
//                 return products.filter((product) => favorites.includes(product.id));
//             },

//             getProductsByCategory: (category) => {
//                 return get().products.filter((product) => product.category === category);
//             },

//             getProductById: (id) => {
//                 return get().products.find((product) => product.id === id);
//             },

//             getProductsBySearch: (query) => {
//                 const searchTerm = query.toLowerCase().trim();
//                 return get().products.filter(
//                     (product) =>
//                         product.name.toLowerCase().includes(searchTerm) ||
//                         product.description.toLowerCase().includes(searchTerm) ||
//                         product.category.toLowerCase().includes(searchTerm)
//                 );
//             },
//         }),
//         {
//             name: 'shop-storage',
//             storage: createJSONStorage(() => AsyncStorage),
//         }
//     )
// );
