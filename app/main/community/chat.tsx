import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settings-store';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot as onDocSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';

type Params = { peerId: string };

export default function ChatScreen() {
  const { peerId } = useLocalSearchParams<Params>();
  const router = useRouter();
  const { userProfile } = useSettingsStore();

  const [peerData, setPeerData] = useState<{ username: string; profile_picture: string }>(
    { username: '', profile_picture: '' }
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chatId = userProfile ? [userProfile.id, peerId].sort().join('_') : '';

  useEffect(() => {
    const peerDocRef = doc(db, 'Users', peerId);
    const unsub = onDocSnapshot(peerDocRef, snap => {
      if (snap.exists()) {
        const d = snap.data() as any;
        setPeerData({
          username: d.username,
          profile_picture: d.profile_picture
        });
      }
    });
    return () => unsub();
  }, [peerId]);

  useEffect(() => {
    const msgsCol = collection(db, 'Chat');
    const q = query(msgsCol, where('chat_id', '==', chatId));
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs
        .map(d => ({ id: d.id, ...(d.data() as any) }))
        .sort((a, b) => {
          const ta = a.timestamp?.toMillis?.() ?? 0;
          const tb = b.timestamp?.toMillis?.() ?? 0;
          return ta - tb;
        });
      setMessages(all);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => unsub();
  }, [chatId]);

  const sendMessage = async () => {
    const txt = input.trim();
    if (!txt) return;
    await addDoc(collection(db, 'Chat'), {
      chat_id: chatId,
      sender_id: userProfile?.id ?? '',
      receiver_id: peerId,
      message: txt,
      timestamp: serverTimestamp()
    });
    setInput('');
  };

  return (
    <>
      <Stack.Screen options={{ 
         title: 'Quay lại',
        headerShown: true }} />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.chatHeader}>
          <View style={styles.doctorProfile}>
            <Image source={{ uri: peerData.profile_picture }} style={styles.chatDoctorAvatar} />
            <View>
              <Text style={styles.chatDoctorName}>{peerData.username}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.statusOnline]} />
                <Text style={styles.statusText}>Đang trực tuyến</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContentContainer}
          renderItem={({ item }) => {
            const isMe = userProfile?.id === item.sender_id;
            const dt = item.timestamp?.toDate?.() ?? new Date();
            const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <View style={styles.messageContainer}>
                <View style={isMe ? styles.sentMessage : styles.receivedMessage}>
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.messageTime}>{time}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={Colors.textLight}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  activeTabButton: {
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  tabText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '500',
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
  doctorsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  doctorsList: {
    flex: 1,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusOnline: {
    backgroundColor: Colors.success,
  },
  statusOffline: {
    backgroundColor: Colors.textLight,
  },
  chatHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  doctorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatDoctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatDoctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  chatContent: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  receivedMessage: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.textLight,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: Colors.card,
    fontWeight: '500',
  },
});