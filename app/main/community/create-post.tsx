import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, X, Camera, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { useCommunityStore } from '@/store/community-store';
import { useSettingsStore } from '@/store/settings-store';

export default function CreatePostScreen() {
    const router = useRouter();
    const { addPost } = useCommunityStore();
    const { userProfile } = useSettingsStore();

    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImages([...images, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImages([...images, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Lỗi', 'Không thể chụp ảnh');
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = () => {
        if (!content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập nội dung bài viết');
            return;
        }

        if (!userProfile) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để đăng bài');
            return;
        }

        setIsSubmitting(true);

        // Create new post
        const newPost = {
            id: Date.now().toString(),
            author: {
                id: 'user1',
                name: userProfile.name,
                avatar:
                    userProfile.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            },
            content: content,
            images: images.length > 0 ? images : undefined,
            likes: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
            isLiked: false,
            isSaved: false,
        };

        // Add post to store
        addPost(newPost);

        // Navigate back to community screen
        Alert.alert('Thành công', 'Bài viết của bạn đã được đăng', [
            {
                text: 'OK',
                onPress: () => router.push('/(tabs)/community'),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Tạo bài viết',
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
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.userInfo}>
                        <Image
                            source={{
                                uri:
                                    userProfile?.avatar ||
                                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
                            }}
                            style={styles.userAvatar}
                        />
                        <Text style={styles.userName}>{userProfile?.name || 'Người dùng'}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.contentInput}
                            placeholder="Bạn đang nghĩ gì về thú cưng của mình?"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            value={content}
                            onChangeText={setContent}
                            editable={!isSubmitting}
                        />
                    </View>

                    {images.length > 0 && (
                        <View style={styles.imagesContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.imagesScrollContent}
                            >
                                {images.map((image, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.imagePreview}
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                            disabled={isSubmitting}
                                        >
                                            <X size={16} color={Colors.card} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={pickImage}
                            disabled={isSubmitting || images.length >= 5}
                        >
                            <ImageIcon size={20} color={Colors.primary} />
                            <Text style={styles.actionText}>Thư viện</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={takePhoto}
                            disabled={isSubmitting || images.length >= 5}
                        >
                            <Camera size={20} color={Colors.primary} />
                            <Text style={styles.actionText}>Camera</Text>
                        </TouchableOpacity>
                    </View>

                    {images.length >= 5 && (
                        <Text style={styles.limitText}>Đã đạt giới hạn 5 ảnh</Text>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!content.trim() || isSubmitting) && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={!content.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <Text style={styles.submitButtonText}>Đang đăng...</Text>
                        ) : (
                            <View style={styles.submitButtonContent}>
                                <Text style={styles.submitButtonText}>Đăng bài</Text>
                                <Send size={20} color={Colors.card} />
                            </View>
                        )}
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
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    inputContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        minHeight: 150,
    },
    contentInput: {
        fontSize: 16,
        color: Colors.text,
        textAlignVertical: 'top',
        flex: 1,
    },
    imagesContainer: {
        marginBottom: 16,
    },
    imagesScrollContent: {
        paddingRight: 16,
    },
    imageWrapper: {
        marginRight: 8,
        position: 'relative',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    actionText: {
        fontSize: 14,
        color: Colors.primary,
        marginLeft: 8,
    },
    limitText: {
        fontSize: 12,
        color: Colors.textLight,
        fontStyle: 'italic',
        marginBottom: 16,
    },
    footer: {
        padding: 16,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.card,
        marginRight: 8,
    },
});
