import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function Signup() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const handleContinue = () => {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
      return;
    }
    router.push('/(onboarding)/language');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={20} color={C.textMuted} />
          </TouchableOpacity>
          <View style={styles.stepIndicator}>
            {[1, 2, 3, 4, 5].map((s) => (
              <View key={s} style={[styles.stepDot, s === 1 && styles.stepDotActive]} />
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Creer votre compte</Text>
          <Text style={styles.subtitle}>Rejoignez des milliers de croyants en croissance</Text>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, shakeStyle]}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Prenom</Text>
            <View style={[styles.inputWrap, focused === 'name' && styles.inputWrapFocused]}>
              <User size={16} color={focused === 'name' ? COLORS.primary : C.textHint} />
              <TextInput
                style={styles.input}
                placeholder="Jean-Kevin"
                placeholderTextColor={C.textHint}
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse email</Text>
            <View style={[styles.inputWrap, focused === 'email' && styles.inputWrapFocused]}>
              <Mail size={16} color={focused === 'email' ? COLORS.primary : C.textHint} />
              <TextInput
                style={styles.input}
                placeholder="jean@exemple.com"
                placeholderTextColor={C.textHint}
                value={email}
                onChangeText={setEmail}
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
                placeholder="Minimum 8 caracteres"
                placeholderTextColor={C.textHint}
                value={password}
                onChangeText={setPassword}
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

        <Text style={styles.terms}>
          En continuant, vous acceptez nos{' '}
          <Text style={styles.termsLink}>Conditions d'utilisation</Text>
          {' '}et notre{' '}
          <Text style={styles.termsLink}>Politique de confidentialite</Text>
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.bg,
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: SPACING.xl,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.xxxl,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.full,
      backgroundColor: C.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepIndicator: {
      flexDirection: 'row',
      gap: SPACING.xs,
    },
    stepDot: {
      width: 24,
      height: 4,
      borderRadius: 2,
      backgroundColor: C.border2,
    },
    stepDotActive: {
      backgroundColor: COLORS.primary,
      width: 32,
    },
    titleSection: {
      marginBottom: SPACING.xxxl,
    },
    title: {
      ...TYPOGRAPHY.h2,
      color: C.text,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      ...TYPOGRAPHY.body,
      color: C.textMuted,
    },
    form: {
      gap: SPACING.lg,
      marginBottom: SPACING.xl,
    },
    inputGroup: {
      gap: SPACING.xs,
    },
    inputLabel: {
      ...TYPOGRAPHY.label,
      color: C.textMuted,
      marginLeft: SPACING.xs,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: SPACING.md,
      height: 52,
      gap: SPACING.sm,
    },
    inputWrapFocused: {
      borderColor: COLORS.primaryBorder,
      backgroundColor: COLORS.primaryMuted,
    },
    input: {
      flex: 1,
      ...TYPOGRAPHY.body,
      color: C.text,
      height: '100%',
    },
    terms: {
      ...TYPOGRAPHY.caption,
      color: C.textHint,
      textAlign: 'center',
      lineHeight: 18,
      marginBottom: SPACING.xl,
    },
    termsLink: {
      color: COLORS.primary,
    },
    continueButton: {
      height: 54,
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueButtonText: {
      ...TYPOGRAPHY.bodyLarge,
      color: '#FFFFFF',
      fontWeight: '700',
    },
  });
}
