import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ArrowLeft, Check } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';

const C = COLORS.dark;

const LEVELS = [
  {
    id: 'nouveau',
    label: 'Nouveau croyant',
    description: 'Je viens de commencer mon chemin de foi',
    icon: '01',
  },
  {
    id: 'etabli',
    label: 'Croyant etabli',
    description: 'Je pratique depuis quelques annees',
    icon: '02',
  },
  {
    id: 'avance',
    label: 'Croyant avance',
    description: 'J\'ai une foi solide et je cherche a approfondir',
    icon: '03',
  },
  {
    id: 'leader',
    label: 'Leader / Serviteur',
    description: 'Je sers dans mon eglise ou ma communaute',
    icon: '04',
  },
];

function LevelCard({ item, selected, onPress }: { item: typeof LEVELS[0]; selected: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { duration: 80 }, () => {
      scale.value = withSpring(1, { duration: 80 });
    });
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.levelCard, selected && styles.levelCardSelected]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={[styles.levelNum, selected && styles.levelNumSelected]}>
          <Text style={[styles.levelNumText, selected && styles.levelNumTextSelected]}>{item.icon}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={[styles.levelLabel, selected && styles.levelLabelSelected]}>{item.label}</Text>
          <Text style={styles.levelDesc}>{item.description}</Text>
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

export default function Level() {
  const { selectedLevel, setLevel } = useOnboardingStore();
  const [selected, setSelected] = useState(selectedLevel || '');

  const handleContinue = () => {
    if (!selected) return;
    setLevel(selected);
    router.push('/(onboarding)/interests');
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
              <View key={s} style={[styles.stepDot, s <= 3 && styles.stepDotActive]} />
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Votre niveau de foi</Text>
          <Text style={styles.subtitle}>Cela nous aide a personnaliser votre parcours spirituel</Text>
        </View>

        {/* Levels */}
        <View style={styles.list}>
          {LEVELS.map((level) => (
            <LevelCard
              key={level.id}
              item={level}
              selected={selected === level.id}
              onPress={() => setSelected(level.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
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
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  levelCardSelected: {
    borderColor: COLORS.primaryBorder,
    backgroundColor: COLORS.primaryMuted,
  },
  levelNum: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  levelNumText: {
    ...TYPOGRAPHY.label,
    color: C.textMuted,
  },
  levelNumTextSelected: {
    color: COLORS.primary,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    ...TYPOGRAPHY.bodyLarge,
    color: C.text,
  },
  levelLabelSelected: {
    color: COLORS.primary,
  },
  levelDesc: {
    ...TYPOGRAPHY.caption,
    color: C.textMuted,
    marginTop: 3,
    lineHeight: 16,
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
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
