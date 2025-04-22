import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { posts as mockPosts } from '@/mocks/community';

export interface Author {
    id: string;
    name: string;
    avatar: string;
}

export interface Post {
    id: string;
    author: Author;
    content: string;
    images?: string[];
    likes: number;
    comments: number;
    createdAt: string;
    isLiked: boolean;
    isSaved: boolean;
}

interface CommunityState {
    posts: Post[];
    savedPosts: string[];

    // Actions
    addPost: (post: Post) => void;
    deletePost: (postId: string) => void;
    toggleLike: (postId: string) => void;
    toggleSave: (postId: string) => void;
    likePost: (postId: string) => void;
    unlikePost: (postId: string) => void;
    savePost: (postId: string) => void;
    unsavePost: (postId: string) => void;

    // Getters
    getSavedPosts: () => Post[];
}

export const useCommunityStore = create<CommunityState>()(
    persist(
        (set, get) => ({
            posts: mockPosts,
            savedPosts: [],

            addPost: (post) =>
                set((state) => ({
                    posts: [post, ...state.posts],
                })),

            deletePost: (postId) =>
                set((state) => ({
                    posts: state.posts.filter((post) => post.id !== postId),
                    savedPosts: state.savedPosts.filter((id) => id !== postId),
                })),

            toggleLike: (postId) =>
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  isLiked: !post.isLiked,
                                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                              }
                            : post
                    ),
                })),

            toggleSave: (postId) =>
                set((state) => {
                    const isSaved = state.savedPosts.includes(postId);

                    return {
                        savedPosts: isSaved
                            ? state.savedPosts.filter((id) => id !== postId)
                            : [...state.savedPosts, postId],
                        posts: state.posts.map((post) =>
                            post.id === postId ? { ...post, isSaved: !isSaved } : post
                        ),
                    };
                }),

            likePost: (postId) =>
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === postId && !post.isLiked
                            ? {
                                  ...post,
                                  isLiked: true,
                                  likes: post.likes + 1,
                              }
                            : post
                    ),
                })),

            unlikePost: (postId) =>
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === postId && post.isLiked
                            ? {
                                  ...post,
                                  isLiked: false,
                                  likes: post.likes - 1,
                              }
                            : post
                    ),
                })),

            savePost: (postId) =>
                set((state) => {
                    if (state.savedPosts.includes(postId)) return state;

                    return {
                        savedPosts: [...state.savedPosts, postId],
                        posts: state.posts.map((post) =>
                            post.id === postId ? { ...post, isSaved: true } : post
                        ),
                    };
                }),

            unsavePost: (postId) =>
                set((state) => {
                    if (!state.savedPosts.includes(postId)) return state;

                    return {
                        savedPosts: state.savedPosts.filter((id) => id !== postId),
                        posts: state.posts.map((post) =>
                            post.id === postId ? { ...post, isSaved: false } : post
                        ),
                    };
                }),

            getSavedPosts: () => {
                const { posts, savedPosts } = get();
                return posts.filter((post) => savedPosts.includes(post.id));
            },
        }),
        {
            name: 'community-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// // import { getProductsFromFirestore, addToCartInFirestore } from '@/utils/firestore'; // Import các hàm Firestore
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//     collection,
//     getDoc,
//     setDoc,
//     getDocs,
//     addDoc,
//     updateDoc,
//     doc,
//     deleteDoc,
// } from 'firebase/firestore';
// import { Product } from '@/types/pet'; // Import kiểu dữ liệu sản phẩm

// import { db } from '@/config/firebase'; // Import db từ firebase config

// const productsCollection = collection(db, 'products');
// const cartCollection = collection(db, 'carts'); // Giả sử giỏ hàng lưu trong Firestore

// // Lấy tất cả sản phẩm từ Firestore
// export const getProductsFromFirestore = async () => {
//     const querySnapshot = await getDocs(productsCollection);
//     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Thêm một sản phẩm vào giỏ hàng
// export const addToCartInFirestore = async (userId: string, productId: string, quantity: number) => {
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
//                 const products = await getProductsFromFirestore();
//                 set({ products });
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
