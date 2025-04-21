import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Camera, Mail, Phone, User, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settings-store';

export default function ProfileDetailsScreen() {
    const { userProfile, updateUserProfile } = useSettingsStore();

    const [name, setName] = useState(userProfile?.name || '');
    const [email, setEmail] = useState(userProfile?.email || '');
    const [phone, setPhone] = useState(userProfile?.phone || '');
    const [avatar, setAvatar] = useState(userProfile?.avatar || '');

    const [isEditing, setIsEditing] = useState(false);

    const pickImage = async () => {
        if (!isEditing) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!userProfile) return;

        updateUserProfile({
            name,
            email,
            phone,
            avatar,
        });

        setIsEditing(false);
    };

    if (!userProfile) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Thông tin cá nhân',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: Colors.background },
                    }}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Bạn chưa đăng nhập</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <Stack.Screen
                options={{
                    title: 'Thông tin cá nhân',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
                        >
                            {isEditing ? (
                                <Save size={20} color={Colors.primary} />
                            ) : (
                                <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{
                                    uri:
                                        avatar ||
                                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
                                }}
                                style={styles.avatar}
                            />
                            {isEditing && (
                                <View style={styles.cameraIconContainer}>
                                    <Camera size={20} color={Colors.card} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    {!isEditing && <Text style={styles.userName}>{userProfile.name}</Text>}
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <User size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Họ và tên</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Nhập họ và tên"
                                    placeholderTextColor={Colors.textLight}
                                />
                            ) : (
                                <Text style={styles.infoValue}>{userProfile.name}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Mail size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Nhập email"
                                    placeholderTextColor={Colors.textLight}
                                    keyboardType="email-address"
                                />
                            ) : (
                                <Text style={styles.infoValue}>{userProfile.email}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Phone size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Số điện thoại</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Nhập số điện thoại"
                                    placeholderTextColor={Colors.textLight}
                                    keyboardType="phone-pad"
                                />
                            ) : (
                                <Text style={styles.infoValue}>
                                    {userProfile.phone || 'Chưa cập nhật'}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContainer: {
        flex: 1,
    },
    editButton: {
        paddingHorizontal: 8,
    },
    editButtonText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.background,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 16,
    },
    infoContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        margin: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    infoItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: Colors.text,
    },
    input: {
        fontSize: 16,
        color: Colors.text,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        paddingVertical: 4,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.card,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    },
});
