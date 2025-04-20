import React, { useState } from 'react';
import { 
  collection,
  query,
  where,
  limit,
  getDocs
} from 'firebase/firestore';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';          // Firestore ví dụ
import { db } from '@/config/firebase';
import { useSettingsStore } from '@/store/settings-store';
// import { useSettingsStore, UserProfile } from '@/store/settings-store';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { FirebaseAuthTypes } from '@react-native-firebase/auth';
// import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';




export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { login } = useSettingsStore(); // Lưu trạng thái đăng nhập
  //const { isLoggedIn } = useAuth(); // Kiểm tra trạng thái đăng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleLogin = async () => {
        if (!validateForm()) return;


        try {
            // const q = await db
            // .collection('Users')
            // .where('email', '==', email)
            // .where('password', '==', await password)
            // .limit(1)
            // .get();
            // const usersCol = collection(db, 'Users');
            // const q = query(
            //     usersCol,
            //     where('email', '==', email),
            //     where('password', '==', password),  // no `await` here
            //     limit(1)
            // );
            const usersCol = collection(db, 'Users');
            const q = query(
            usersCol,
            where('email',    '==', email),
            where('password', '==', password), // pass string directly—no await
            limit(1)
            );

            // 2) Execute the query
            const snap = await getDocs(q);

            console.warn(snap)

            if (snap.empty) throw new Error('Sai tài khoản hoặc mật khẩu');
                const doc   = snap.docs[0];

            const userData = doc.data();
            const user = {
                //id: doc.id,
                create_at: userData.create_at,
                email: userData.email,
                language: userData.language || 'vi',
                password: userData.password,
                phone: userData.phone || '',
                phone_number: userData.phone_number || '',
                role: userData.role || 'user',
                username: userData.username || '',
                profile_picture: userData.profile_picture || '',
                updated_at: userData.updated_at || userData.create_at,
                ...userData
            };

            // 3. Lưu vào AsyncStorage để khôi phục lần sau
            await AsyncStorage.setItem('user', JSON.stringify({
                id: doc.id,
                name: user.username,
                email: user.email,
                phone: user.phone || '',
                avatar: user.profile_picture || '',  
            }));

            signIn(user);          // 🟢 AuthGuard sẽ tự chuyển về Home

            login({
                id: doc.id,
                name: user.username,
                email: user.email,
                phone: user.phone || '',
                avatar: user.profile_picture || '',  
            });
        } catch (err: any) {
            setErrors({ password: 'Email hoặc mật khẩu không đúng' });
            console.warn('Login error', err);
        }
        // 4. Cập nhật context
    };


  const handleForgotPassword = () => {
    router.push('./forgot-password');
  };

  const handleRegister = () => {
    router.push('./register');
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{
        title: 'Đăng nhập',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        ),
      }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560807707-8cc77767d783' }} 
              style={styles.logo} 
            />
            <Text style={styles.appName}>Pet Care</Text>
            <Text style={styles.tagline}>Chăm sóc thú cưng của bạn</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                <Mail size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Lock size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu của bạn"
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.textLight} />
                  ) : (
                    <Eye size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                //</View>onPress={handleGoogleLogin}
                >
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png' }} 
                  style={styles.socialIcon} 
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png' }} 
                  style={styles.socialIcon} 
                />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textLight,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    color: Colors.text,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.card,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.textLight,
    marginHorizontal: 16,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    paddingHorizontal: 16,
    width: '48%',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  socialLoginButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});