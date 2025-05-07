import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Colors from '@/constants/colors';
import { useCommunityStore } from '@/store/community-store';
import { Plus } from 'lucide-react-native';
import PostItem from '@/components/PostItem';

export default function Feed() {
    const { posts } = useCommunityStore();
    const router = useRouter();
    return (
        <>
            <View style={styles.createPostContainer}>
                <TouchableOpacity
                    style={styles.createPostButton}
                    onPress={() => router.push('/main/community/create-post')}
                >
                    <Text style={styles.createPostText}>Bạn đang nghĩ gì?</Text>
                    <Plus size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onPress={() =>
                            router.push({
                                pathname: '/main/community/post-details',
                                params: { id: post.id },
                            })
                        }
                    />
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    createPostContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    createPostButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    createPostText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 0,
    },
});
