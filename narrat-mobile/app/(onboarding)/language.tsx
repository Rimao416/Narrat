import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ArrowLeft, Check } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';

const C = COLORS.dark;

const LANGUAGES = [
  { code: 'fr', label: 'Francais', native: 'Francais', flag: 'FR' },
  { code: 'en', label: 'Anglais', native: 'English', flag: 'EN' },
  { code: 'ln', label: 'Lingala', native: 'Lingala', flag: 'LN' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', flag: 'SW' },
];

function LanguageCard({ item, selected, onPress }: { item: typeof LANGUAGES[0]; selected: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.96, { duration: 100 }, () => {
      scale.value = withSpring(1, { duration: 100 });
    });
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.langCard, selected && styles.langCardSelected]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={styles.flagBadge}>
          <Text style={styles.flagText}>{item.flag}</Text>
        </View>
        <View style={styles.langInfo}>
          <Text style={[styles.langLabel, selected && styles.langLabelSelected]}>{item.label}</Text>
          <Text style={styles.langNative}>{item.native}</Text>
        </View>
        {selected && (
          <View style={styles.checkCircle}>
            <Check size={14} color="#FFF" strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Language() {
  const { selectedLanguage, setLanguage } = useOnboardingStore();
  const [selected, setSelected] = useState(selectedLanguage || 'fr');

  const handleContinue = () => {
    setLanguage(selected);
    router.push('/(onboarding)/level');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={20} color={C.textMuted} />
          </TouchableOpacity>
          <View style={styles.stepIndicator}>
            {[1, 2, 3, 4, 5].map((s) => (
              <View key={s} style={[styles.stepDot, s <= 2 && styles.stepDotActive]} />
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Choisissez votre langue</Text>
          <Text style={styles.subtitle}>Dans quelle langue souhaitez-vous apprendre ?</Text>
        </View>

        {/* Language list */}
        <View style={styles.list}>
          {LANGUAGES.map((lang) => (
            <LanguageCard
              key={lang.code}
              item={lang}
              selected={selected === lang.code || selected === lang.label}
              onPress={() => setSelected(lang.code)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 20,
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
  list: {
    gap: SPACING.md,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  langCardSelected: {
    borderColor: COLORS.primaryBorder,
    backgroundColor: COLORS.primaryMuted,
  },
  flagBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    ...TYPOGRAPHY.label,
    color: C.textMuted,
    fontSize: 11,
  },
  langInfo: {
    flex: 1,
  },
  langLabel: {
    ...TYPOGRAPHY.bodyLarge,
    color: C.text,
  },
  langLabelSelected: {
    color: COLORS.primary,
  },
  langNative: {
    ...TYPOGRAPHY.caption,
    color: C.textMuted,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
    paddingTop: SPACING.md,
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
