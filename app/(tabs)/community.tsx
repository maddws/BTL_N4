import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle, Users, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PostItem from '@/components/PostItem';
import { useCommunityStore } from '@/store/community-store';
import { useSettingsStore } from '@/store/settings-store';

type Tab = 'feed' | 'chat' | 'saved';

const doctors = [
  {
    id: 'vet1',
    name: 'Bác sĩ Nguyễn Văn A',
    specialty: 'Chuyên khoa thú nhỏ',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
    status: 'online'
  },
  {
    id: 'vet2',
    name: 'Bác sĩ Trần Thị B',
    specialty: 'Chuyên khoa dinh dưỡng',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
    status: 'offline'
  },
  {
    id: 'vet3',
    name: 'Bác sĩ Lê Văn C',
    specialty: 'Chuyên khoa ngoại',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
    status: 'online'
  },
  {
    id: 'vet4',
    name: 'Bác sĩ Phạm Thị D',
    specialty: 'Chuyên khoa da liễu',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    status: 'offline'
  }
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const router = useRouter();
  const { posts } = useCommunityStore();
  const { userProfile } = useSettingsStore();

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId);
  };

  const selectedDoctorData = doctors.find(doc => doc.id === selectedDoctor);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'feed' && styles.activeTabButton]}
          onPress={() => setActiveTab('feed')}
        >
          <Users size={20} color={activeTab === 'feed' ? Colors.primary : Colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Bài viết
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'chat' && styles.activeTabButton]}
          onPress={() => setActiveTab('chat')}
        >
          <MessageCircle size={20} color={activeTab === 'chat' ? Colors.primary : Colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Tư vấn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'saved' && styles.activeTabButton]}
          onPress={() => setActiveTab('saved')}
        >
          <MessageCircle size={20} color={activeTab === 'saved' ? Colors.primary : Colors.textLight} />
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Đã lưu
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' ? (
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
            {posts.map(post => (
              <PostItem 
                key={post.id} 
                post={post} 
                onPress={() => router.push({
                  pathname: '/main/community/post-details',
                  params: { id: post.id }
                })}
              />
            ))}
          </ScrollView>
        </>
        
      )  : activeTab === 'chat' ? (
        <View style={styles.chatContainer}>
          {!selectedDoctor ? (
            <>
              <Text style={styles.doctorsTitle}>Chọn bác sĩ để tư vấn</Text>
              <ScrollView style={styles.doctorsList}>
                {doctors.map(doctor => (
                  <TouchableOpacity 
                    key={doctor.id} 
                    style={styles.doctorItem}
                    onPress={() => handleSelectDoctor(doctor.id)}
                  >
                    <Image source={{ uri: doctor.avatar }} style={styles.doctorAvatar} />
                    <View style={styles.doctorInfo}>
                      <Text style={styles.doctorName}>{doctor.name}</Text>
                      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                    </View>
                    <View style={[
                      styles.statusIndicator, 
                      doctor.status === 'online' ? styles.statusOnline : styles.statusOffline
                    ]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <View style={styles.chatHeader}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedDoctor(null)}
                >
                  <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
                <View style={styles.doctorProfile}>
                  <Image 
                    source={{ uri: selectedDoctorData?.avatar }} 
                    style={styles.chatDoctorAvatar} 
                  />
                  <View>
                    <Text style={styles.chatDoctorName}>{selectedDoctorData?.name}</Text>
                    <View style={styles.statusRow}>
                      <View style={[
                        styles.statusDot, 
                        selectedDoctorData?.status === 'online' ? styles.statusOnline : styles.statusOffline
                      ]} />
                      <Text style={styles.statusText}>
                        {selectedDoctorData?.status === 'online' ? 'Đang trực tuyến' : 'Ngoại tuyến'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <ScrollView 
                style={styles.chatContent}
                contentContainerStyle={styles.chatContentContainer}
              >
                <View style={styles.messageContainer}>
                  <View style={styles.receivedMessage}>
                    <Text style={styles.messageText}>
                      Xin chào! Tôi là {selectedDoctorData?.name}. Tôi có thể giúp gì cho bạn và thú cưng của bạn hôm nay?
                    </Text>
                    <Text style={styles.messageTime}>10:30</Text>
                  </View>
                </View>

                {userProfile && (
                  <View style={styles.messageContainer}>
                    <View style={styles.sentMessage}>
                      <Text style={styles.messageText}>
                        Chào bác sĩ, bé mèo nhà tôi dạo này biếng ăn và hay nằm một chỗ. Tôi nên làm gì ạ?
                      </Text>
                      <Text style={styles.messageTime}>10:35</Text>
                    </View>
                  </View>
                )}

                <View style={styles.messageContainer}>
                  <View style={styles.receivedMessage}>
                    <Text style={styles.messageText}>
                      Bạn có thể cho tôi biết bé mèo bao nhiêu tuổi và tình trạng này kéo dài bao lâu rồi?
                    </Text>
                    <Text style={styles.messageTime}>10:40</Text>
                  </View>
                </View>

                {userProfile && (
                  <View style={styles.messageContainer}>
                    <View style={styles.sentMessage}>
                      <Text style={styles.messageText}>
                        Bé mèo nhà tôi 3 tuổi, và tình trạng này mới xuất hiện khoảng 2 ngày nay ạ.
                      </Text>
                      <Text style={styles.messageTime}>10:45</Text>
                    </View>
                  </View>
                )}

                <View style={styles.messageContainer}>
                  <View style={styles.receivedMessage}>
                    <Text style={styles.messageText}>
                      Bạn có thể kiểm tra nhiệt độ của bé không? Và bé có biểu hiện nôn mửa hoặc tiêu chảy không?
                    </Text>
                    <Text style={styles.messageTime}>10:50</Text>
                  </View>
                </View>
              </ScrollView>

                {/* <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView style={styles.container} edges={["right", "left"]}> */}
                        {/* Nội dung cũ của bạn ở đây */}
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        placeholderTextColor={Colors.textLight}
                        multiline
                        />
                        <TouchableOpacity style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                    {/* </SafeAreaView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView> */}
            </>
          )}
        </View>
      ) : activeTab === 'saved' ? (
        <View style={styles.content}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {posts.map(post => (
              <PostItem 
                key={post.id} 
                post={post} 
                onPress={() => router.push({
                  pathname: '/main/community/post-details',
                  params: { id: post.id }
                })}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
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
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 14,
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