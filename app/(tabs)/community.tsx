// CommunityScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle, Users, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PostItem from '@/components/PostItem';
import { useCommunityStore } from '@/store/community-store';
import { useSettingsStore } from '@/store/settings-store';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

type Tab = 'feed' | 'chat' | 'saved';

// **CHANGE THIS** to your actual doctor UID
const DOCTOR_ID = 'U3J9nEV500hMEr5iC6mX';

export default function CommunityScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('feed');
    const [peers, setPeers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { posts } = useCommunityStore();
    const { userProfile } = useSettingsStore(); // expects { id: string, ... }

    // load list of chat‑peers whenever we switch to "chat"
    useEffect(() => {
        if (activeTab !== 'chat' || !userProfile?.id) {
            setPeers([]);
            return;
        }
        setLoading(true);
        getDocs(collection(db, 'Users'))
            .then((snap) => {
                const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                if (userProfile.id !== DOCTOR_ID) {
                    // patient: only show the doctor
                    setPeers(all.filter((u) => u.id === DOCTOR_ID));
                } else {
                    // doctor: show everyone except themselves
                    setPeers(all.filter((u) => u.id !== DOCTOR_ID));
                }
            })
            .finally(() => setLoading(false));
    }, [activeTab, userProfile]);

    const renderFeed = () => (
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
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {posts.map((p) => (
                    <PostItem
                        key={p.id}
                        post={p}
                        onPress={() =>
                            router.push({
                                pathname: '/main/community/post-details',
                                params: { id: p.id },
                            })
                        }
                    />
                ))}
            </ScrollView>
        </>
    );

    const renderChatList = () => (
        <View style={styles.chatContainer}>
            <Text style={styles.chatTitle}>Chọn người để chat</Text>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                peers.map((peer) => (
                    <TouchableOpacity
                        key={peer.id}
                        style={styles.peerItem}
                        onPress={() =>
                            router.push({
                                pathname: '/main/community/chat',
                                params: { peerId: peer.id },
                            })
                        }
                    >
                        <Image source={{ uri: peer.profile_picture }} style={styles.avatar} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{peer.username}</Text>
                            <Text style={styles.sub}>
                                {peer.id === DOCTOR_ID ? 'Bác sĩ' : peer.email}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statusDot,
                                {
                                    backgroundColor:
                                        peer.status === 'online'
                                            ? Colors.success
                                            : Colors.textLight,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                ))
            )}
        </View>
    );

    const renderSaved = () => (
        <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {posts
                .filter((p) => p.saved)
                .map((p) => (
                    <PostItem
                        key={p.id}
                        post={p}
                        onPress={() =>
                            router.push({
                                pathname: '/main/community/post-details',
                                params: { id: p.id },
                            })
                        }
                    />
                ))}
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {(['feed', 'chat', 'saved'] as Tab[]).map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tabButton, activeTab === t && styles.activeTabButton]}
                        onPress={() => setActiveTab(t)}
                    >
                        {t === 'feed' && (
                            <Users
                                size={20}
                                color={activeTab === t ? Colors.primary : Colors.textLight}
                            />
                        )}
                        {t === 'chat' && (
                            <MessageCircle
                                size={20}
                                color={activeTab === t ? Colors.primary : Colors.textLight}
                            />
                        )}
                        {t === 'saved' && (
                            <MessageCircle
                                size={20}
                                color={activeTab === t ? Colors.primary : Colors.textLight}
                            />
                        )}
                        <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>
                            {t === 'feed' ? 'Bài viết' : t === 'chat' ? 'Tư vấn' : 'Đã lưu'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {activeTab === 'feed' && renderFeed()}
            {activeTab === 'chat' && renderChatList()}
            {activeTab === 'saved' && renderSaved()}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    tabContainer: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        marginHorizontal: 4,
        borderRadius: 24,
        backgroundColor: Colors.lightGray,
    },
    activeTabButton: {
        backgroundColor: Colors.primary + '20',
    },
    tabText: {
        fontSize: 16,
        color: Colors.textLight,
        marginLeft: 8,
        fontWeight: '500',
    },
    activeTabText: {
        color: Colors.primary,
        fontWeight: '700',
    },
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
    chatContainer: {
        flex: 1,
        backgroundColor: Colors.card,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    peerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
    },
    sub: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 2,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    tabTextActive: {
        color: Colors.primary,
        fontWeight: '600',
    },
    tabActive: {
        backgroundColor: Colors.primary + '20',
    },
});
