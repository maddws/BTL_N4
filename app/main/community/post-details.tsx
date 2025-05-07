import React, { useState, useEffect, useCallback } from 'react';
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
import { db } from '@/config/firebase';
import { formatTime } from '@/utils/time';
import {
    addDoc,
    collection,
    orderBy,
    serverTimestamp,
    getDocs,
    query,
    where,
    onSnapshot,
    doc,
    deleteDoc,
} from 'firebase/firestore';

interface Comment {
    id: string;
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    createdAt: Date;
    likes: number;
    isLiked: boolean;
}

export default function PostDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { posts, onLikePost, onSavePost } = useCommunityStore();
    const { userProfile } = useSettingsStore();

    const post = posts.find((p) => p.id === id);
    const postId = post?.id;

    /* ---------- local state ---------- */
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<any[]>([]); // có thể typing chi tiết hơ
    // console.log(comments);
    const userId = userProfile?.id;

    /* ---------- sub comments ---------- */
    useEffect(() => {
        if (!postId) return;
        const q = query(collection(db, 'Comments'), where('postId', '==', postId));
        const un = onSnapshot(q, (snap) => {
            const arr = snap.docs.map((d) => {
                const data = d.data();
                return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.() ?? new Date() };
            });
            // mới nhất ở dưới cùng
            setComments(arr.sort((a, b) => b.createdAt - a.createdAt));
        });
        return un;
    }, [postId]);

    /* ---------- handlers (đã useCallback) ---------- */
    const handleLikePost = useCallback(() => {
        onLikePost(post, userId);
    }, [post, userId]);

    const handleSavePost = useCallback(() => {
        onSavePost(post, userId);
    }, [post, userId]);

    const handleLikeComment = async (comment: Comment) => {
        if (!comment || !userId) return;
        const likeRef = collection(db, 'CommentLikes');
        const q = query(likeRef, where('cmt_id', '==', comment.id), where('user_id', '==', userId));
        const s = await getDocs(q);
        if (s.empty) {
            await addDoc(likeRef, { user_id: userId, post_id: post.id, cmt_id: comment.id });
        } else {
            await deleteDoc(doc(db, 'CommentLikes', s.docs[0].id));
        }
        setComments(
            comments.map((c) => {
                if (c.id === comment.id) {
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

    const onSendComment = async () => {
        if (!comment.trim() || !post || !userProfile) return;
        await addDoc(collection(db, 'Comments'), {
            postId: post.id,
            author: {
                id: userProfile.id,
                name: userProfile.name,
                avatar: userProfile.avatar ?? 'https://i.pravatar.cc/50',
            },
            content: comment.trim(),
            createdAt: serverTimestamp(),
            // likes: 0,
            // isLiked: false,
        });
        setComment('');
    };

    useEffect(() => {
        if (!post?.id) return; // chưa có post → bỏ qua
        if (!userId) return; // đảm bảo userId sẵn sàng

        const q = query(collection(db, 'CommentLikes'), where('post_id', '==', post.id));

        const unsub = onSnapshot(q, (snap) => {
            /* ----------- 1. DUYỆT QUA TỪNG DOC ----------- */
            const likesArr = snap.docs.map((doc) => {
                const d = doc.data(); // LÚC NÀY doc là QueryDocumentSnapshot
                // d = { post_id, cmt_id, user_id }
                return { id: doc.id, ...d };
            });

            /* ----------- 2. GOM LƯỢT THÍCH THEO COMMENT ----------- */
            const likeMap: Record<string, number> = {};
            const likedByMe = new Set<string>();

            likesArr.forEach((l) => {
                likeMap[l.cmt_id] = (likeMap[l.cmt_id] ?? 0) + 1;
                if (l.user_id === userId) likedByMe.add(l.cmt_id);
            });

            /* ----------- 3. CẬP NHẬT STATE comments ----------- */
            setComments((prev) =>
                prev.map((c) => ({
                    ...c,
                    likes: likeMap[c.id] ?? 0,
                    isLiked: likedByMe.has(c.id),
                }))
            );
        });

        return unsub; // hủy listener khi unmount
    }, [post, userId]);

    // useEffect(() => {
    //     if (!post?.id) return; // chưa có post → bỏ qua
    //     if (!userId) return; // đảm bảo userId sẵn sàng
    //     console.log(post.id);

    //     const q = query(collection(db, 'CommentLikes'), where('cmt_id', '==', post.id));

    //     const unsub = onSnapshot(q, (snap) => {
    //         /* ----------- 1. DUYỆT QUA TỪNG DOC ----------- */
    //         const likesArr = snap.docs.map((doc) => {
    //             if (doc.data()) return { id: doc.id, ...doc.data() };
    //         });

    //         /* ----------- 2. GOM LƯỢT THÍCH THEO COMMENT ----------- */
    //         const likeMap: Record<string, number> = {};
    //         const likedByMe = new Set<string>();

    //         likesArr.forEach((l) => {
    //             likeMap[l.cmt_id] = (likeMap[l.cmt_id] ?? 0) + 1;
    //             if (l.user_id === userId) likedByMe.add(l.cmt_id);
    //         });

    //         /* ----------- 3. CẬP NHẬT STATE comments ----------- */
    //         setComments((prev) =>
    //             prev.map((c) => ({
    //                 ...c,
    //                 likes: likeMap[c.id] ?? 0,
    //                 isLiked: likedByMe.has(c.id),
    //             }))
    //         );
    //     });

    //     return unsub; // hủy listener khi unmount
    // }, [post, userId]);

    // useEffect(() => {
    //     if (!postId) return;

    //     // nghe tất cả like của bài viết này

    //     let result: any[] = [];
    //     const unsub = onSnapshot(q, (snap) => {
    //         const arr = snap.docs.map(async (d) => {
    //             const data = await d.data();
    //             result.push(data);
    //             return data;
    //         });
    //         /* -----------------------------------------
    //      1. Gom like theo commentId
    //   ------------------------------------------*/
    //         type LikeMap = Record<string, { likes: number; isLiked: boolean }>;
    //         const map: LikeMap = {};

    //         result.forEach((d) => {
    //             const { cmt_id, user_id } = d;
    //             if (!map[cmt_id]) map[cmt_id] = { likes: 0, isLiked: false };
    //             map[cmt_id].likes += 1;
    //             if (user_id === userId) map[cmt_id].isLiked = true;
    //         });

    //         /* -----------------------------------------
    //      2. Cập nhật state comments
    //      (giả định bạn đang giữ comments trong store
    //       và có hàm update theo id)
    //   ------------------------------------------*/
    //         setComments((prev) =>
    //             prev.map((c) => {
    //                 const info = map[c.id] ?? { count: 0, likedByMe: false };
    //                 return {
    //                     ...c,
    //                     likes: info.likes,
    //                     isLiked: info.isLiked,
    //                 };
    //             })
    //         );
    //     });

    //     return unsub; // cleanup
    // }, [postId, userId]);
    // useEffect(() => {
    //     const q = query(collection(db, 'CommentLikes'), where('post_id', '==', post.id));
    //     const un = onSnapshot(q, (snap) => {
    //         const arr = snap.docs.map((d) => {
    //             const data = d.data();
    //             const q = query(
    //                 collection(db, 'CommentLikes'),
    //                 where('post_id', '==', post.id),
    //                 where('cmt_id', '==', data.cmt_id)
    //             );
    //             const s = getDocs(q);
    //             console.log(s);
    //         });
    //         // setComments(arr.sort((a, b) => b.createdAt - a.createdAt));
    //     });
    // }, [post?.id, userId]);

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
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                                // refetchFeed();
                            }}
                        >
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />
            {!post ? (
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Không tìm thấy bài viết</Text>
                </View>
            ) : (
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
                                    <Text style={styles.statsText}>
                                        {comments.length} bình luận
                                    </Text>
                                </View>

                                <View style={styles.postActions}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handleLikePost}
                                    >
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

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handleSavePost}
                                    >
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
                                            onPress={() => handleLikeComment(item)}
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
                                        {/* <TouchableOpacity style={styles.commentReplyButton}>
                                            <Text style={styles.commentActionText}>Trả lời</Text>
                                        </TouchableOpacity> */}
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
                            style={[
                                styles.sendButton,
                                !comment.trim() && styles.sendButtonDisabled,
                            ]}
                            onPress={onSendComment}
                            disabled={!comment.trim()}
                        >
                            <Send size={20} color={Colors.card} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
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
