import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../store/authStore';

export default function ResetPassword() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim() || password.length < 8) return;
    if (!token) return;
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (e) {
      // Error handled in store
    }
  };

  if (!token) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.errorText}>Lien invalide ou manquant.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {success ? (
          <View style={styles.successContainer}>
            <CheckCircle size={64} color={COLORS.success} style={{ marginBottom: SPACING.lg }} />
            <Text style={styles.title}>Mot de passe modifié !</Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>
              Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
            </Text>
            <TouchableOpacity style={[styles.continueButton, { marginTop: SPACING.xxxl }]} onPress={() => router.replace('/(onboarding)/login')} activeOpacity={0.85}>
              <Text style={styles.continueButtonText}>Aller à la connexion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Nouveau mot de passe</Text>
              <Text style={styles.subtitle}>Saisissez un nouveau mot de passe sécurisé (minimum 8 caractères).</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
                <View style={styles.inputWrap}>
                  <Lock size={16} color={C.textHint} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Minimum 8 caractères"
                    placeholderTextColor={C.textHint}
                    value={password}
                    onChangeText={(t) => { setPassword(t); clearError(); }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                    {showPassword ? <EyeOff size={16} color={C.textMuted} /> : <Eye size={16} color={C.textMuted} />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} activeOpacity={0.85} disabled={isLoading || password.length < 8}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.continueButtonText}>Mettre à jour</Text>
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
    scroll: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: 100, paddingBottom: 40 },
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
