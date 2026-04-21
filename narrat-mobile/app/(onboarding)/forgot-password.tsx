import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../store/authStore';

export default function ForgotPassword() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (e) {
      // Error is handled in store
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

        {success ? (
          <View style={styles.successContainer}>
            <CheckCircle size={64} color={COLORS.success} style={{ marginBottom: SPACING.lg }} />
            <Text style={styles.title}>Email envoyé !</Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>
              Vérifiez votre boîte de réception (et vos spams) pour réinitialiser votre mot de passe.
            </Text>
            <TouchableOpacity style={[styles.continueButton, { marginTop: SPACING.xxxl }]} onPress={() => router.push('/(onboarding)/login')} activeOpacity={0.85}>
              <Text style={styles.continueButtonText}>Retour à la connexion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Mot de passe oublié ?</Text>
              <Text style={styles.subtitle}>Saisissez votre adresse email, nous vous enverrons un lien pour le réinitialiser.</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse email</Text>
                <View style={styles.inputWrap}>
                  <Mail size={16} color={C.textHint} />
                  <TextInput
                    style={styles.input}
                    placeholder="jean@exemple.com"
                    placeholderTextColor={C.textHint}
                    value={email}
                    onChangeText={(t) => { setEmail(t); clearError(); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} activeOpacity={0.85} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.continueButtonText}>Envoyer le lien</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
    form: { gap: SPACING.lg, marginBottom: SPACING.xl },
    inputGroup: { gap: SPACING.xs },
    inputLabel: { ...TYPOGRAPHY.label, color: C.textMuted, marginLeft: SPACING.xs },
    inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: C.border, paddingHorizontal: SPACING.md, height: 52, gap: SPACING.sm },
    input: { flex: 1, ...TYPOGRAPHY.body, color: C.text, height: '100%' },
    errorText: { color: COLORS.error, fontSize: 13, textAlign: 'center', marginBottom: SPACING.sm },
    continueButton: { height: 54, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
    continueButtonText: { ...TYPOGRAPHY.bodyLarge, color: '#FFFFFF', fontWeight: '700' },
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -60 },
  });
}
