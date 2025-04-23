import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { posts as mockPosts } from '@/mocks/community';
import { db } from '@/config/firebase';
import { collection, query, orderBy, getDocs, addDoc, where } from 'firebase/firestore';

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
    addPost: (post: Post) => Promise<void>; // Change to Promise<void> for async
    deletePost: (postId: string) => void;
    toggleLike: (postId: string) => void;
    toggleSave: (postId: string) => void;
    likePost: (postId: string) => void;
    unlikePost: (postId: string) => void;
    savePost: (postId: string) => void;
    unsavePost: (postId: string) => void;
    reFetchFeed: () => void;
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
            resetFeed: () => set({ posts: [] }), // Reset to mock data

            reFetchFeed: async () => {
                const userId = await AsyncStorage.getItem('user').then((user) => {
                    return JSON.parse(user ? user : '{}');
                });
                const postDB = collection(db, 'Posts');
                const q = query(postDB, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const posts: Post[] = [];
                for (const doc of querySnapshot.docs) {
                    const postData = doc.data() as Post;
                    // get number of cmt
                    const cmtDB = collection(db, 'Comments');
                    const q = query(cmtDB, where('postId', '==', doc.id));
                    const querySnapshotCmt = await getDocs(q);
                    const commentsCount = querySnapshotCmt.size;
                    // check if post is liked
                    const likeDB = collection(db, 'PostLikes');
                    const qLike = query(
                        likeDB,
                        where('user_id', '==', userId.id),
                        where('post_id', '==', doc.id)
                    );
                    const querySnapshotLike = await getDocs(qLike);
                    if (!querySnapshotLike.empty) {
                        postData.isLiked = true;
                    } else {
                        postData.isLiked = false;
                    }
                    // check if post is saved
                    const saveDB = collection(db, 'SavedPosts');
                    const qSave = query(
                        saveDB,
                        where('post_id', '==', doc.id),
                        where('user_id', '==', userId.id)
                    );
                    const querySnapshotSave = await getDocs(qSave);
                    if (!querySnapshotSave.empty) {
                        postData.isSaved = true;
                    } else {
                        postData.isSaved = false;
                    }
                    // check number of likes
                    const likeCountDB = collection(db, 'PostLikes');
                    const qLikeCount = query(likeCountDB, where('post_id', '==', doc.id));
                    const querySnapshotLikeCount = await getDocs(qLikeCount);
                    const likesCount = querySnapshotLikeCount.size;

                    posts.push({
                        ...postData,
                        id: doc.id,
                        comments: commentsCount,
                        likes: likesCount,
                    });
                    console.log('Post:', postData);
                }
                // console.log(posts);
                set({ posts });
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
