import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useMemo, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../store/authStore';
import * as Google from 'expo-auth-session/providers/google';

export default function Login() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  // Google Auth config (IDs to be filled in .env later)
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID || 'dummy',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID || 'dummy',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID || 'dummy',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        loginWithGoogle(id_token).then(() => {
          router.replace('/(tabs)');
        });
      }
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
      return;
    }
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      // Error is handled in store and displayed below
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={20} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Heureux de vous revoir</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer votre croissance spirituelle.</Text>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, shakeStyle]}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse email</Text>
            <View style={[styles.inputWrap, focused === 'email' && styles.inputWrapFocused]}>
              <Mail size={16} color={focused === 'email' ? COLORS.primary : C.textHint} />
              <TextInput
                style={styles.input}
                placeholder="jean@exemple.com"
                placeholderTextColor={C.textHint}
                value={email}
                onChangeText={(t) => { setEmail(t); clearError(); }}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={[styles.inputWrap, focused === 'password' && styles.inputWrapFocused]}>
              <Lock size={16} color={focused === 'password' ? COLORS.primary : C.textHint} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Votre mot de passe"
                placeholderTextColor={C.textHint}
                value={password}
                onChangeText={(t) => { setPassword(t); clearError(); }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                {showPassword
                  ? <EyeOff size={16} color={C.textMuted} />
                  : <Eye size={16} color={C.textMuted} />
                }
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/(onboarding)/forgot-password')}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleLogin} activeOpacity={0.85} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.continueButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={[styles.line, { backgroundColor: C.border }]} />
          <Text style={[styles.dividerText, { color: C.textHint }]}>OU</Text>
          <View style={[styles.line, { backgroundColor: C.border }]} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconPlaceholder} />
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    scroll: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: 40 },
    header: { marginBottom: SPACING.xxxl },
    backBtn: { width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
    titleSection: { marginBottom: SPACING.xxxl },
    title: { ...TYPOGRAPHY.h2, color: C.text, marginBottom: SPACING.xs },
    subtitle: { ...TYPOGRAPHY.body, color: C.textMuted },
    form: { gap: SPACING.lg, marginBottom: SPACING.md },
    inputGroup: { gap: SPACING.xs },
    inputLabel: { ...TYPOGRAPHY.label, color: C.textMuted, marginLeft: SPACING.xs },
    inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: C.border, paddingHorizontal: SPACING.md, height: 52, gap: SPACING.sm },
    inputWrapFocused: { borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primaryMuted },
    input: { flex: 1, ...TYPOGRAPHY.body, color: C.text, height: '100%' },
    errorText: { color: COLORS.error, fontSize: 13, textAlign: 'center', marginBottom: SPACING.sm },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.xl },
    forgotText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
    continueButton: { height: 54, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
    continueButtonText: { ...TYPOGRAPHY.bodyLarge, color: '#FFFFFF', fontWeight: '700' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl, gap: SPACING.md },
    line: { flex: 1, height: 1 },
    dividerText: { fontSize: 12, fontWeight: '600' },
    googleButton: { width: '100%', height: 54, backgroundColor: C.surface, borderRadius: RADIUS.full, borderWidth: 1, borderColor: C.border2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
    googleIconPlaceholder: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.textMuted },
    googleButtonText: { ...TYPOGRAPHY.bodyLarge, color: C.text },
  });
}
