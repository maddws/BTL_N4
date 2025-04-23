import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Post } from '@/types/pet';
import { useCommunityStore } from '@/store/community-store';
import { db } from '@/config/firebase';
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PostItemProps {
    post: Post;
    onPress: () => void;
}

export default function PostItem({ post, onPress }: PostItemProps) {
    const { toggleLike, toggleSave } = useCommunityStore();
    const userProfile = AsyncStorage.getItem('user').then((user) => {
        if (user) {
            const userData = JSON.parse(user);
            return userData;
        }
        return null;
    });

    // const handleLike = () => {
    //     toggleLike(post.id);
    // };

    // const handleSave = () => {
    //     toggleSave(post.id);
    // };
    const handleLike = async () => {
        console.log('handleLike called');
        const userId = userProfile._j.id; // Get current user id
        const postId = post.id; // Get the post id

        console.log('userId:', userId);
        if (!userId) return; // Ensure user is logged in

        // Check if the user has already liked the post
        const likeRef = collection(db, 'PostLikes');
        const q = query(likeRef, where('user_id', '==', userId), where('post_id', '==', postId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If the like already exists, remove it (unlike)
            console.log('Like already exists, removing it');
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref); // Delete the like from Firestore
            });
            toggleLike(post.id); // Update local state
        } else {
            // If the like doesn't exist, add it
            console.log('Like does not exist, adding it');
            await addDoc(likeRef, { user_id: userId, post_id: postId });
            toggleLike(post.id); // Update local state
        }
    };

    const handleSave = async () => {
        const userId = userProfile._j.id; // Get current user id
        const postId = post.id; // Get the post id

        if (!userId) return; // Ensure user is logged in

        // Check if the post is already saved by the user
        const savedRef = collection(db, 'SavedPosts');
        const q = query(savedRef, where('user_id', '==', userId), where('post_id', '==', postId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If the post is already saved, remove it
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref); // Remove the saved post
            });
            toggleSave(post.id); // Update local state
        } else {
            // If the post is not saved, save it
            await addDoc(savedRef, { user_id: userId, post_id: postId });
            toggleSave(post.id); // Update local state
        }
    };

    // const handleShare = () => {
    //     // Share functionality would be implemented here
    //     alert('Chia sẻ bài viết');
    // };

    // Format date
    const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
        // Chuyển đổi Firestore timestamp (seconds + nanoseconds) thành đối tượng Date
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000); // nanoseconds / 1000000 để chuyển đổi nanoseconds thành milliseconds
        const now = new Date();

        // Tính toán sự khác biệt giữa thời gian hiện tại và thời gian đã cho
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000); // Chuyển đổi sang phút
        const diffHours = Math.round(diffMins / 60); // Chuyển đổi sang giờ
        const diffDays = Math.round(diffHours / 24); // Chuyển đổi sang ngày

        // Trả về thời gian theo định dạng "xx phút trước", "xx giờ trước", "xx ngày trước"
        if (diffMins < 60) {
            return `${diffMins} phút trước`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else {
            return `${diffDays} ngày trước`;
        }
    };
    // const formatDate = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const now = new Date();
    //     const diffMs = now.getTime() - date.getTime();
    //     const diffMins = Math.round(diffMs / 60000);
    //     const diffHours = Math.round(diffMins / 60);
    //     const diffDays = Math.round(diffHours / 24);

    //     if (diffMins < 60) {
    //         return `${diffMins} phút trước`;
    //     } else if (diffHours < 24) {
    //         return `${diffHours} giờ trước`;
    //     } else {
    //         return `${diffDays} ngày trước`;
    //     }
    // };

    // Ensure post.author exists to prevent "Cannot read property 'avatar' of undefined"
    // console.log(post);
    const defaultAuthor = {
        id: 'unknown',
        name: 'Unknown',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    };

    const author = post.author || defaultAuthor;
    const createdAt = post.createdAt || new Date().toISOString();
    // console.log(createdAt);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: author.avatar }} style={styles.avatar} />
                <View style={styles.headerText}>
                    <Text style={styles.userName}>{author.name}</Text>
                    <Text style={styles.date}>{formatDate(createdAt)}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                <Text style={styles.content}>{post.content}</Text>

                {post.images && post.images.length > 0 && (
                    <Image source={{ uri: post.images[0] }} style={styles.image} />
                )}
            </TouchableOpacity>

            <View style={styles.stats}>
                <Text style={styles.statsText}>{post.likes} lượt thích</Text>
                <Text style={styles.statsText}>{post.comments} bình luận</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <Heart
                        size={20}
                        color={post.isLiked ? Colors.error : Colors.textLight}
                        fill={post.isLiked ? Colors.error : 'none'}
                    />
                    <Text style={[styles.actionText, post.isLiked && styles.activeAction]}>
                        Thích
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onPress}>
                    <MessageCircle size={20} color={Colors.textLight} />
                    <Text style={styles.actionText}>Bình luận</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                    <Bookmark
                        size={20}
                        color={post.isSaved ? Colors.primary : Colors.textLight}
                        fill={post.isSaved ? Colors.primary : 'none'}
                    />
                    <Text style={[styles.actionText, post.isSaved && styles.activeAction]}>
                        Lưu
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={Colors.textLight} />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    date: {
        fontSize: 12,
        color: Colors.textLight,
    },
    content: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        marginBottom: 8,
    },
    statsText: {
        fontSize: 12,
        color: Colors.textLight,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 20,
    },
    actionText: {
        fontSize: 12,
        color: Colors.textLight,
        marginLeft: 4,
    },
    activeAction: {
        color: Colors.primary,
        fontWeight: '500',
    },
});
