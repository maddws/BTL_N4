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
import { Order } from '@/types/pet';

const getRating = async (pid: string) => {
    const snap = await getDocs(query(collection(db, 'ItemRating'), where('product_id', '==', pid)));
    const total = snap.docs.reduce((s, d) => s + (d.data().rating || 0), 0);
    if (total === 0) return { rating: null, reviews: null };
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
    orders: Order[];
    loadingOrders: boolean;

    products: Product[];
    cart: CartItem[];
    userId: string | null;
    loadingCart: boolean;
    loadingProducts: boolean;
    favorites: string[];

    subscribeOrders: () => () => void; // realtime
    addRating: (
        productId: string,
        orderId: string,
        rating: number,
        review: string
    ) => Promise<void>;
    getRatingsByProduct: (pid: string) => Promise<{ rating: number; reviews: number; data: any[] }>;

    addToFavorites: (productId: string) => void;
    removeFromFavorites: (productId: string) => void;
    syncProducts: () => Promise<void>; // chỉ fetch 1 lần
    subscribeProducts: () => () => void;
    subscribeRatings: () => () => void;

    // Getters
    getFavoriteProducts: () => Product[];
    getProductsByCategory: (category: string) => Product[];
    getProductById: (id: string) => Product | undefined;
    getProductsBySearch: (query: string) => Product[];

    // Cart actions
    addToCart: (id: string, qty?: number) => void;
    updateQty: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;

    // Helpers
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
            orders: [],
            loadingOrders: false,
            cart: [],
            userId: null,
            loadingCart: false,
            loadingProducts: false,
            favorites: [],
            /* implementation fragment */
            // subscribeOrders: () => {
            //     const uid = get().userId;
            //     if (!uid) return () => {};
            //     const q = query(
            //         collection(db, 'Orders'),
            //         where('user_id', '==', uid)
            //         // orderBy('created_at', 'desc')
            //     );
            //     set({ loadingOrders: true });
            //     const unsub = onSnapshot(q, (snap) => {
            //         const arr: Order[] = [];
            //         snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
            //         set({ orders: arr, loadingOrders: false });
            //     });
            //     return unsub;
            // },
            subscribeOrders: () => {
                const uid = get().userId;
                if (!uid) return () => {};

                /* 1. query Orders của user */
                const ordQ = query(
                    collection(db, 'Orders'),
                    where('user_id', '==', uid)
                    // orderBy('created_at', 'desc')
                );

                set({ loadingOrders: true });

                const unsub = onSnapshot(ordQ, async (ordSnap) => {
                    /* 2. query toàn bộ ItemRating của user 1 lần */
                    const rateSnap = await getDocs(
                        query(collection(db, 'ItemRating'), where('user_id', '==', uid))
                    );

                    /* 3. Build set các cặp (orderId|productId) đã đánh giá */
                    const ratedSet = new Set<string>();
                    rateSnap.forEach((d) => {
                        const { order_id, product_id } = d.data() as any;
                        ratedSet.add(`${order_id}|${product_id}`);
                    });

                    /* 4. Gộp dữ liệu */
                    const orders: Order[] = [];
                    ordSnap.forEach((doc) => {
                        const raw = doc.data() as any;
                        const items = (raw.items || []).map((it: any) => ({
                            ...it,
                            rated: ratedSet.has(`${doc.id}|${it.product_id}`),
                        }));
                        orders.push({ id: doc.id, ...raw, items });
                    });

                    set({ orders, loadingOrders: false });
                });

                return unsub;
            },

            // addRating: async (pid, oid, rating, review) => {
            //     const uid = get().userId;

            //     await setDoc(doc(collection(db, 'ItemRating')), {
            //         user_id: uid,
            //         product_id: pid,
            //         order_id: oid,
            //         rating,
            //         review,
            //         created_at: Date.now(),
            //     });

            //     /* cập nhật state cục bộ */
            //     set(
            //         produce((state: ShopState) => {
            //             const order = state.orders.find((o) => o.id === oid);
            //             if (!order) return;
            //             const item = order.items.find((i) => i.product_id === pid);
            //             if (item) item.rated = true;
            //         })
            //     );
            // },

            addRating: async (pid, oid, rating, review) => {
                const uid = get().userId;
                await setDoc(doc(collection(db, 'ItemRating')), {
                    user_id: uid,
                    product_id: pid,
                    order_id: oid,
                    rating,
                    review,
                    created_at: Date.now(),
                });
            },
            getRatingsByProduct: async (pid) => {
                const q = query(collection(db, 'ItemRating'), where('product_id', '==', pid));
                const snap = await getDocs(q);
                const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
                const avg = data.reduce((s, d) => s + d.rating, 0) / (data.length || 1);
                return { rating: avg, reviews: data.length, data };
            },

            subscribeProducts: () => {
                const col = collection(db, 'Products');
                set({ loadingProducts: true });

                const unsub = onSnapshot(col, async (snap) => {
                    const prods: Product[] = [];

                    // 1. map thô
                    snap.docs.forEach((d) => {
                        prods.push({ id: d.id, ...(d.data() as any) });
                    });

                    // 2. lấy rating + reviews song song
                    await Promise.all(
                        prods.map(async (p) => {
                            const stat = await get().getRatingsByProduct(p.id);
                            p.rating = stat.rating;
                            p.reviews = stat.reviews;
                        })
                    );

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
