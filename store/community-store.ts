import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { posts as mockPosts } from '@/mocks/community';
import { db } from '@/config/firebase';
import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    where,
    onSnapshot,
    deleteDoc,
    doc,
} from 'firebase/firestore';

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
    loading: boolean;

    // Actions
    addPost: (post: Post) => Promise<void>; // Change to Promise<void> for async
    deletePost: (postId: string) => void;
    toggleLike: (postId: string) => void;
    toggleSave: (postId: string) => void;
    likePost: (postId: string) => void;
    unlikePost: (postId: string) => void;
    savePost: (postId: string) => void;
    unsavePost: (postId: string) => void;
    subscribeFeed: () => () => void; // Subscribe to feed updates
    onSavePost: (post: any, userId: string) => void; // Save a post
    onLikePost: (post: any, userId: string) => void; // Like a post
    // fetchCommentPost: (postId: string) => void; // Fetch comments for a specific post

    resetFeed: () => void; // Reset to mock data
    // Getters
    getSavedPosts: () => Post[];
}

export const useCommunityStore = create<CommunityState>()(
    persist(
        (set, get) => ({
            posts: [],
            savedPosts: [],
            loading: false,
            resetFeed: () => set({ posts: [], savedPosts: [] }), // Reset to mock data
            clearPosts: () => set({ posts: [], loading: false }),

            subscribeFeed: () => {
                set({ loading: true });

                // Kick off read of current userId once
                const userPromise = AsyncStorage.getItem('user').then((u) => {
                    try {
                        return JSON.parse(u || '{}').id as string;
                    } catch {
                        return null;
                    }
                });

                const postsRef = collection(db, 'Posts');
                const q = query(postsRef, orderBy('createdAt', 'desc'));

                // Start listening
                const unsub = onSnapshot(
                    q,
                    async (snapshot) => {
                        const userId = await userPromise;

                        // For each doc in this snapshot, build a Promise<Post>
                        const pPromises = snapshot.docs.map(async (docSnap) => {
                            const d = docSnap.data() as any;

                            // convert Firestore Timestamp → JS Date
                            const createdAt =
                                typeof d.createdAt?.toDate === 'function'
                                    ? d.createdAt.toDate()
                                    : new Date();

                            // prepare parallel queries
                            const commentsCountP = getDocs(
                                query(collection(db, 'Comments'), where('postId', '==', docSnap.id))
                            ).then((s) => s.size);

                            const likesCountP = getDocs(
                                query(
                                    collection(db, 'PostLikes'),
                                    where('post_id', '==', docSnap.id)
                                )
                            ).then((s) => s.size);

                            const isLikedP = userId
                                ? getDocs(
                                      query(
                                          collection(db, 'PostLikes'),
                                          where('post_id', '==', docSnap.id),
                                          where('user_id', '==', userId)
                                      )
                                  ).then((s) => !s.empty)
                                : Promise.resolve(false);

                            const isSavedP = userId
                                ? getDocs(
                                      query(
                                          collection(db, 'SavedPosts'),
                                          where('post_id', '==', docSnap.id),
                                          where('user_id', '==', userId)
                                      )
                                  ).then((s) => !s.empty)
                                : Promise.resolve(false);

                            // wait for them all
                            const [comments, likes, isLiked, isSaved] = await Promise.all([
                                commentsCountP,
                                likesCountP,
                                isLikedP,
                                isSavedP,
                            ]);

                            return {
                                id: docSnap.id,
                                ...d,
                                comments,
                                likes,
                                isLiked,
                                isSaved,
                                createdAt,
                            } as Post & { createdAt: Date };
                        });

                        // await and update store
                        const posts = await Promise.all(pPromises);
                        set({ posts, loading: false });
                    },
                    (err) => {
                        console.error('subscribeFeed snapshot error', err);
                        set({ loading: false });
                    }
                );

                return unsub;
            },
            onLikePost: async (post, userId) => {
                if (!post || !userId) return;
                const likeRef = collection(db, 'PostLikes');
                const q = query(
                    likeRef,
                    where('post_id', '==', post.id),
                    where('user_id', '==', userId)
                );
                const s = await getDocs(q);
                if (s.empty) {
                    // thêm like
                    await addDoc(likeRef, { user_id: userId, post_id: post.id });
                } else {
                    // bỏ like
                    await deleteDoc(doc(db, 'PostLikes', s.docs[0].id));
                }
                get().toggleLike(post.id); // Updated to use get() to access toggleLike
            },

            onSavePost: async (post, userId) => {
                if (!post || !userId) return;
                const saveRef = collection(db, 'SavedPosts');
                const q = query(
                    saveRef,
                    where('post_id', '==', post.id),
                    where('user_id', '==', userId)
                );
                const s = await getDocs(q);
                if (s.empty) {
                    await addDoc(saveRef, { user_id: userId, post_id: post.id });
                } else {
                    await deleteDoc(doc(db, 'SavedPosts', s.docs[0].id));
                }
                get().toggleSave(post.id);
            },

            addPost: async (post) => {
                const { id, ...postWithoutId } = post;
                const docRef = await addDoc(collection(db, 'Posts'), postWithoutId);
                // console.log(post);
                set((state) => ({
                    posts: [{ ...postWithoutId, id: docRef.id }, ...state.posts],
                }));
            },

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
