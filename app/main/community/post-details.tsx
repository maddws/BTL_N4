import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, MessageCircle, Bookmark, Send, ArrowLeft, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCommunityStore } from '@/store/community-store';
import { useSettingsStore } from '@/store/settings-store';

interface Comment {
    id: string;
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    createdAt: string;
    likes: number;
    isLiked: boolean;
}

export default function PostDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { posts, toggleLike, toggleSave } = useCommunityStore();
    const { userProfile } = useSettingsStore();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            author: {
                id: 'user2',
                name: 'Nguyễn Văn A',
                avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
            },
            content: 'Thú cưng của bạn dễ thương quá! Giống gì vậy?',
            createdAt: '2023-05-15T08:30:00Z',
            likes: 2,
            isLiked: false,
        },
        {
            id: '2',
            author: {
                id: 'user3',
                name: 'Trần Thị B',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            },
            content: 'Tôi cũng có một bé giống như vậy. Chúng rất thông minh và dễ huấn luyện.',
            createdAt: '2023-05-15T09:15:00Z',
            likes: 1,
            isLiked: false,
        },
    ]);

    const post = posts.find((p) => p.id === id);

    if (!post) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Chi tiết bài viết',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Không tìm thấy bài viết</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleLike = () => {
        toggleLike(post.id);
    };

    const handleSave = () => {
        toggleSave(post.id);
    };

    const handleShare = () => {
        // Share functionality would be implemented here
        alert('Chia sẻ bài viết');
    };

    const handleComment = () => {
        if (!comment.trim()) return;
        if (!userProfile) {
            alert('Vui lòng đăng nhập để bình luận');
            return;
        }

        const newComment: Comment = {
            id: Date.now().toString(),
            author: {
                id: 'user1',
                name: userProfile.name,
                avatar:
                    userProfile.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            },
            content: comment,
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false,
        };

        setComments([...comments, newComment]);
        setComment('');
    };

    const toggleLikeComment = (commentId: string) => {
        setComments(
            comments.map((c) => {
                if (c.id === commentId) {
                    const isLiked = !c.isLiked;
                    return {
                        ...c,
                        isLiked,
                        likes: isLiked ? c.likes + 1 : c.likes - 1,
                    };
                }
                return c;
            })
        );
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMins / 60);
        const diffDays = Math.round(diffHours / 24);

        if (diffMins < 60) {
            return `${diffMins} phút trước`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else {
            return `${diffDays} ngày trước`;
        }
    };

    // Ensure post.author exists to prevent "Cannot read property 'avatar' of undefined"
    const defaultAuthor = {
        id: 'unknown',
        name: 'Unknown',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    };

    const author = post.author || defaultAuthor;
    const createdAt = post.createdAt || new Date().toISOString();

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Chi tiết bài viết',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
            >
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={() => (
                        <View style={styles.postContainer}>
                            <View style={styles.postHeader}>
                                <Image
                                    source={{ uri: author.avatar }}
                                    style={styles.authorAvatar}
                                />
                                <View style={styles.authorInfo}>
                                    <Text style={styles.authorName}>{author.name}</Text>
                                    <Text style={styles.postTime}>{formatTime(createdAt)}</Text>
                                </View>
                            </View>

                            <Text style={styles.postContent}>{post.content}</Text>

                            {post.images && post.images.length > 0 && (
                                <View style={styles.imagesContainer}>
                                    {post.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: image }}
                                            style={styles.postImage}
                                        />
                                    ))}
                                </View>
                            )}

                            <View style={styles.postStats}>
                                <Text style={styles.statsText}>{post.likes} lượt thích</Text>
                                <Text style={styles.statsText}>{comments.length} bình luận</Text>
                            </View>

                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                                    <Heart
                                        size={20}
                                        color={post.isLiked ? Colors.error : Colors.textLight}
                                        fill={post.isLiked ? Colors.error : 'transparent'}
                                    />
                                    <Text
                                        style={[
                                            styles.actionText,
                                            post.isLiked && {
                                                color: Colors.error,
                                            },
                                        ]}
                                    >
                                        Thích
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton}>
                                    <MessageCircle size={20} color={Colors.textLight} />
                                    <Text style={styles.actionText}>Bình luận</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                                    <Bookmark
                                        size={20}
                                        color={post.isSaved ? Colors.primary : Colors.textLight}
                                        fill={post.isSaved ? Colors.primary : 'transparent'}
                                    />
                                    <Text
                                        style={[
                                            styles.actionText,
                                            post.isSaved && {
                                                color: Colors.primary,
                                            },
                                        ]}
                                    >
                                        Lưu
                                    </Text>
                                </TouchableOpacity>

                                {/* <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                                    <Share2 size={20} color={Colors.textLight} />
                                    <Text style={styles.actionText}>Chia sẻ</Text>
                                </TouchableOpacity> */}
                            </View>

                            <View style={styles.commentsHeader}>
                                <Text style={styles.commentsTitle}>Bình luận</Text>
                            </View>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.commentItem}>
                            <Image
                                source={{ uri: item.author.avatar }}
                                style={styles.commentAvatar}
                            />
                            <View style={styles.commentContent}>
                                <Text style={styles.commentAuthor}>{item.author.name}</Text>
                                <Text style={styles.commentText}>{item.content}</Text>
                                <View style={styles.commentActions}>
                                    <Text style={styles.commentTime}>
                                        {formatTime(item.createdAt)}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.commentLikeButton}
                                        onPress={() => toggleLikeComment(item.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.commentActionText,
                                                item.isLiked && styles.commentActionTextActive,
                                            ]}
                                        >
                                            Thích
                                        </Text>
                                        {item.likes > 0 && (
                                            <View style={styles.commentLikeCount}>
                                                <Heart
                                                    size={12}
                                                    color={Colors.error}
                                                    fill={Colors.error}
                                                />
                                                <Text style={styles.commentLikeCountText}>
                                                    {item.likes}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.commentReplyButton}>
                                        <Text style={styles.commentActionText}>Trả lời</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    ListFooterComponent={<View style={{ height: 80 }} />}
                />

                <View style={styles.commentInputContainer}>
                    {userProfile && (
                        <Image
                            source={{
                                uri:
                                    userProfile.avatar ||
                                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
                            }}
                            style={styles.commentInputAvatar}
                        />
                    )}
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Viết bình luận..."
                        placeholderTextColor={Colors.textLight}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
                        onPress={handleComment}
                        disabled={!comment.trim()}
                    >
                        <Send size={20} color={Colors.card} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    notFoundText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    },
    postContainer: {
        backgroundColor: Colors.card,
        padding: 16,
        marginBottom: 8,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    postTime: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 2,
    },
    postContent: {
        fontSize: 16,
        color: Colors.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    imagesContainer: {
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    postStats: {
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
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    actionText: {
        fontSize: 14,
        color: Colors.textLight,
        marginLeft: 4,
    },
    commentsHeader: {
        marginTop: 16,
        marginBottom: 8,
    },
    commentsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    commentItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: Colors.card,
        marginBottom: 1,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    commentText: {
        fontSize: 14,
        color: Colors.text,
        marginTop: 4,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    commentTime: {
        fontSize: 12,
        color: Colors.textLight,
        marginRight: 12,
    },
    commentLikeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    commentReplyButton: {
        marginRight: 12,
    },
    commentActionText: {
        fontSize: 12,
        color: Colors.textLight,
        fontWeight: '500',
    },
    commentActionTextActive: {
        color: Colors.primary,
    },
    commentLikeCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
    },
    commentLikeCountText: {
        fontSize: 10,
        color: Colors.text,
        marginLeft: 2,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    commentInputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
    },
    commentInput: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 14,
        color: Colors.text,
    },
    sendButton: {
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
