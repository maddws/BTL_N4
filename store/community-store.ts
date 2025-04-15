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
      
      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts]
      })),
      
      deletePost: (postId) => set((state) => ({
        posts: state.posts.filter(post => post.id !== postId),
        savedPosts: state.savedPosts.filter(id => id !== postId)
      })),
      
      toggleLike: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              } 
            : post
        )
      })),
      
      toggleSave: (postId) => set((state) => {
        const isSaved = state.savedPosts.includes(postId);
        
        return {
          savedPosts: isSaved
            ? state.savedPosts.filter(id => id !== postId)
            : [...state.savedPosts, postId],
          posts: state.posts.map(post => 
            post.id === postId 
              ? { ...post, isSaved: !isSaved } 
              : post
          )
        };
      }),
      
      likePost: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId && !post.isLiked
            ? { 
                ...post, 
                isLiked: true,
                likes: post.likes + 1
              } 
            : post
        )
      })),
      
      unlikePost: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId && post.isLiked
            ? { 
                ...post, 
                isLiked: false,
                likes: post.likes - 1
              } 
            : post
        )
      })),
      
      savePost: (postId) => set((state) => {
        if (state.savedPosts.includes(postId)) return state;
        
        return {
          savedPosts: [...state.savedPosts, postId],
          posts: state.posts.map(post => 
            post.id === postId 
              ? { ...post, isSaved: true } 
              : post
          )
        };
      }),
      
      unsavePost: (postId) => set((state) => {
        if (!state.savedPosts.includes(postId)) return state;
        
        return {
          savedPosts: state.savedPosts.filter(id => id !== postId),
          posts: state.posts.map(post => 
            post.id === postId 
              ? { ...post, isSaved: false } 
              : post
          )
        };
      }),
      
      getSavedPosts: () => {
        const { posts, savedPosts } = get();
        return posts.filter(post => savedPosts.includes(post.id));
      },
    }),
    {
      name: 'community-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);