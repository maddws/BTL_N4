import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  Bell, 
  Globe, 
  Moon, 
  Shield, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useSettingsStore, Language } from '@/store/settings-store';
import { useAuth } from '@/context/AuthContext';

const {signOut} = useAuth();

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { 
    language, 
    darkMode, 
    notifications, 
    userProfile,
    isLoggedIn,
    setLanguage,
    toggleDarkMode,
    updateNotificationSetting,
    //logout
  } = useSettingsStore();

  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageOptions(false);
  };

  const handleViewProfile = () => {
    router.push('/main/profile/profile-details');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        {isLoggedIn && userProfile ? (
          <TouchableOpacity 
            style={styles.profileSection}
            onPress={handleViewProfile}
          >
            <Image 
              source={{ uri: userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginSection}
            onPress={handleLogin}
          >
            <User size={24} color={Colors.primary} />
            <Text style={styles.loginText}>Đăng nhập / Đăng ký</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chọn</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Ngôn ngữ</Text>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>
                  {language === 'vi' ? 'Tiếng Việt' : 'English'}
                </Text>
                <ChevronRight size={16} color={Colors.textLight} />
              </View>
            </View>
          </TouchableOpacity>
          
          {showLanguageOptions && (
            <View style={styles.languageOptions}>
              <TouchableOpacity 
                style={[styles.languageOption, language === 'vi' && styles.activeLanguageOption]}
                onPress={() => handleLanguageChange('vi')}
              >
                <Text style={[styles.languageText, language === 'vi' && styles.activeLanguageText]}>
                  Tiếng Việt
                </Text>
                {language === 'vi' && <ChevronRight size={16} color={Colors.primary} />}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.languageOption, language === 'en' && styles.activeLanguageOption]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[styles.languageText, language === 'en' && styles.activeLanguageText]}>
                  English
                </Text>
                {language === 'en' && <ChevronRight size={16} color={Colors.primary} />}
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Chế độ tối</Text>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={darkMode ? Colors.primary : Colors.card}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Nhắc nhở</Text>
              <Switch
                value={notifications.reminders}
                onValueChange={(value) => updateNotificationSetting('reminders', value)}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={notifications.reminders ? Colors.primary : Colors.card}
              />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Tiêm phòng</Text>
              <Switch
                value={notifications.vaccinations}
                onValueChange={(value) => updateNotificationSetting('vaccinations', value)}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={notifications.vaccinations ? Colors.primary : Colors.card}
              />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Cộng đồng</Text>
              <Switch
                value={notifications.community}
                onValueChange={(value) => updateNotificationSetting('community', value)}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={notifications.community ? Colors.primary : Colors.card}
              />
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Khuyến mãi</Text>
              <Switch
                value={notifications.promotions}
                onValueChange={(value) => updateNotificationSetting('promotions', value)}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={notifications.promotions ? Colors.primary : Colors.card}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khác</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Quyền riêng tư</Text>
              <ChevronRight size={16} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Trợ giúp</Text>
              <ChevronRight size={16} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Info size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Về ứng dụng</Text>
              <ChevronRight size={16} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        </View>

        {isLoggedIn && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={signOut}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loginText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 12,
  },
  section: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 4,
  },
  languageOptions: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginVertical: 8,
    marginLeft: 48,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeLanguageOption: {
    backgroundColor: Colors.lightGray,
  },
  languageText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeLanguageText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
    marginLeft: 8,
  },
});