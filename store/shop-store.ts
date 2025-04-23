import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/pet';
import { db } from '@/config/firebase'; // Import Firestore instance
import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    setDoc,
    deleteDoc,
} from 'firebase/firestore';
import { Alert } from 'react-native';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
//import { products as mockProducts } from '@/mocks/products';

const getProductsFromFirestore = async () => {
    const productsCollection = collection(db, 'Products');
    const querySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
// Giả sử bạn đã có ID sản phẩm
const getProductWithReviewsAndRating = async (productId: string) => {
    try {
        // Lấy các đánh giá từ collection 'reviews' của sản phẩm
        const reviewsRef = collection(db, 'ItemRating');
        const reviewsSnap = await getDocs(query(reviewsRef, where('product_id', '==', productId)));

        let totalRating = 0;
        let reviewCount = 0;
        const reviews: any[] = [];

        // Duyệt qua tất cả các review của sản phẩm
        reviewsSnap.forEach((doc) => {
            const review = doc.data();
            reviews.push({
                userId: review.user_id, // Lưu lại user_id (nếu cần)
                rating: review.rating, // Chỉ lấy rating
            });

            // Tính tổng điểm rating và đếm số lượng đánh giá
            totalRating += review.rating || 0;
            reviewCount++;
        });

        // Tính rating trung bình
        const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

        // Trả về sản phẩm kèm thông tin đánh giá và rating
        return {
            // ...productData,
            // reviews,
            rating: averageRating, // Điểm trung bình từ tất cả các review
            count: reviewCount, // Số lượng đánh giá
        };
    } catch (error) {
        console.error('Error fetching product data: ', error);
        return null;
    }
};

interface CartItem {
    productId: string;
    quantity: number;
}

interface ShopState {
    products: Product[];
    nbusy: boolean;
    cart: CartItem[];
    favorites: string[];
    first_login: boolean;

    // Actions
    addToCart: (productId: string, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartItemQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    fetchProducts: () => void;

    addToFavorites: (productId: string) => void;
    removeFromFavorites: (productId: string) => void;

    // Getters
    getCartItems: () => { product: Product; quantity: number }[];
    getCartTotal: () => number;
    getFavoriteProducts: () => Product[];
    getProductsByCategory: (category: string) => Product[];
    getProductById: (id: string) => Product | undefined;
    getProductsBySearch: (query: string) => Product[];
    saveCart: () => void;
    fetchSavedCart: (userId: string) => Promise<CartItem[]>;
    resetCart: () => void;
    fetchByFirstLogin: () => void;
}

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            products: [],
            cart: [],
            nbusy: false,
            favorites: [],
            first_login: true,

            fetchByFirstLogin: async () => {
                if (get().first_login) {
                    await get().fetchSavedCart(
                        await AsyncStorage.getItem('user').then((user) => {
                            return JSON.parse(user ? user : '{}').id;
                        })
                    );
                    set({ first_login: false });
                }
            },

            // Fetch products from Firestore when the store is initialized
            // saveCart: async () => {
            //     const save = collection(db, 'Carts');
            //     const cartItems = get().cart;
            //     const userId = await AsyncStorage.getItem('user');
            //     if (userId) {
            //         const cartRef = doc(save, userId);
            //         await setDoc(cartRef, { items: cartItems });
            //         Alert.alert('Cart saved successfully!'); // Added alert to notify user
            //     } else {
            //         Alert.alert('User not found!'); // Added alert to notify user
            //     }
            // },
            resetCart: () => {
                set({ cart: [] });
                set({ favorites: [] });
            },
            saveCart: async () => {
                const userId = await AsyncStorage.getItem('user').then((user) => {
                    console.log('userId ' + user);
                    if (user) {
                        const parsedUser = JSON.parse(user);
                        console.log('mo phac ' + parsedUser.id);
                        return parsedUser.id; // Lấy ID người dùng từ AsyncStorage
                    }
                });

                const cartItems = get().cart; // Giỏ hàng từ store

                if (userId) {
                    // Tham chiếu đến document của giỏ hàng người dùng
                    const cartRef = doc(db, 'Carts', userId);

                    try {
                        // Xoá giỏ hàng cũ trước khi thêm giỏ hàng mới
                        await deleteDoc(cartRef); // Xoá giỏ hàng cũ của người dùng
                        // Thêm giỏ hàng mới vào Firestore
                        await setDoc(cartRef, { items: cartItems });

                        Alert.alert('Lưu giỏ hàng thành công!!'); // Thông báo thành công
                    } catch (error) {
                        console.error('Error saving cart:', error);
                        Alert.alert('Error saving cart. Please try again later.'); // Thông báo lỗi
                    }
                } else {
                    Alert.alert('User not found!'); // Thông báo khi không tìm thấy userId
                }
            },
            fetchSavedCart: async (userId: string) => {
                try {
                    set({ nbusy: false });
                    console.log('Fetching saved cart for user:', userId);
                    const cartRef = doc(db, 'Carts', userId); // Tham chiếu đến document của giỏ hàng người dùng
                    const cartSnap = await getDoc(cartRef);

                    if (cartSnap.exists()) {
                        const cartItems = cartSnap.data().items || [];
                        set({ cart: cartItems }); // Cập nhật giỏ hàng trong store
                        console.log('Fetched saved cart:', cartItems);
                        return cartItems;
                    } else {
                        console.log('No saved cart found for this user.');
                        set({ cart: [] }); // Nếu không có giỏ hàng, đặt giỏ hàng là mảng trống
                        return [];
                    }
                } catch (error) {
                    console.error('Error fetching saved cart:', error);
                    set({ cart: [] }); // Nếu có lỗi, đặt giỏ hàng là mảng trống
                    return [];
                }
            },
            fetchProducts: async () => {
                try {
                    const products = await getProductsFromFirestore();

                    // Dùng Promise.all để đợi tất cả các review được lấy về
                    const visualProducts = await Promise.all(
                        products.map(async (pr) => {
                            // Lấy thông tin review cho từng sản phẩm
                            const review = await getProductWithReviewsAndRating(pr.id);

                            return {
                                id: pr.id,
                                name: pr.name,
                                description: pr.description,
                                price: pr.price,
                                imageUrl: pr.imageUrl,
                                category: pr.category,
                                rating: review?.rating || 0, // Lấy giá trị rating từ review nếu có
                                reviews: review?.count || 0, // Lấy số lượng đánh giá từ review nếu có
                                inStock: pr.inStock,
                            };
                        })
                    );

                    // Cập nhật state với mảng visualProducts đã tạo
                    set({ products: visualProducts });
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            },

            addToCart: (productId, quantity = 1) =>
                set((state) => {
                    const existingItem = state.cart.find((item) => item.productId === productId);

                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.productId === productId
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    } else {
                        return {
                            cart: [...state.cart, { productId, quantity }],
                        };
                    }
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    nbusy: false,
                    cart: state.cart.filter((item) => item.productId !== productId),
                })),

            updateCartItemQuantity: (productId, quantity) =>
                set((state) => ({
                    nbusy: false,
                    cart: state.cart.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    ),
                })),

            clearCart: async () => {
                set({ cart: [] });
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    const userId = parsedUser.id;
                    const cartRef = doc(db, 'Carts', userId);
                    try {
                        await setDoc(cartRef, {
                            items: [],
                            userId: userId,
                        });
                    } catch (error) {
                        console.error('Error clearing cart in Firestore:', error);
                    }
                    console.log('Done clear cart');
                }
            },

            addToFavorites: (productId) =>
                set((state) => ({
                    favorites: [...state.favorites, productId],
                })),

            removeFromFavorites: (productId) =>
                set((state) => ({
                    favorites: state.favorites.filter((id) => id !== productId),
                })),

            getCartItems: () => {
                // console.log('hello');
                // console.log(get().cart); // Updated to use get() to access cart
                if (get().nbusy == true) {
                    AsyncStorage.getItem('user').then((user) => {
                        if (user) {
                            const userId = JSON.parse(user).id;
                            get().fetchSavedCart(userId);
                            console.log('Fetching saved cart for user:', userId);
                            set({ nbusy: false });
                        }
                    });
                }

                const { products, cart } = get();
                return cart
                    .map((item) => ({
                        product: products.find((p) => p.id === item.productId)!,
                        quantity: item.quantity,
                    }))
                    .filter((item) => item.product); // Filter out any items where product wasn't found
            },

            getCartTotal: () => {
                const cartItems = get().getCartItems();
                return cartItems.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },

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
