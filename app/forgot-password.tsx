import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Vui lòng nhập email');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateEmail()) {
      // In a real app, you would send a password reset email here
      setIsSubmitted(true);
      
      // Simulate API call
      setTimeout(() => {
        Alert.alert(
          'Đã gửi email',
          'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/login'),
            },
          ]
        );
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{
        title: 'Quên mật khẩu',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        ),
      }} />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1555685812-4b8f286e7f30' }} 
            style={styles.image} 
          />
        </View>

        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.description}>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputContainer, error && styles.inputError]}>
            <Mail size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isSubmitted}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={[
              styles.submitButton,
              isSubmitted && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitted}
          >
            {isSubmitted ? (
              <Text style={styles.submitButtonText}>Đang gửi...</Text>
            ) : (
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>Gửi hướng dẫn</Text>
                <ArrowRight size={20} color={Colors.card} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backToLoginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 24,
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
    marginBottom: 8,
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
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
  backToLoginButton: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});