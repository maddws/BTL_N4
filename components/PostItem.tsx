import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Post } from '@/types/pet';
import { useCommunityStore } from '@/store/community-store';
import { useSettingsStore } from '@/store/settings-store';
import { db } from '@/config/firebase';
import { formatTime } from '@/utils/time';
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PostItemProps {
    post: Post;
    onPress: () => void;
}

export default function PostItem({ post, onPress }: PostItemProps) {
    const { onLikePost, onSavePost, toggleLike, toggleSave } = useCommunityStore();
    const { userProfile } = useSettingsStore();
    const userId = userProfile.id;
    // console.log(post);

    const handleLike = useCallback(() => {
        onLikePost(post, userId);
    }, [post, userId]);

    const handleSave = useCallback(() => {
        onSavePost(post, userId);
    }, [post, userId]);
    // console.log(post);
    const defaultAuthor = {
        id: 'unknown',
        name: 'Unknown',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    };

    const author = post.author || defaultAuthor;
    const createdAt = post.createdAt || new Date().toISOString();
    // console.log(author);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: author.avatar }} style={styles.avatar} />
                <View style={styles.headerText}>
                    <Text style={styles.userName}>{author.name}</Text>
                    <Text style={styles.date}>{formatTime(createdAt)}</Text>
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
