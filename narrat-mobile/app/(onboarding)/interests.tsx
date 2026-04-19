import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ArrowLeft, Check } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';

const C = COLORS.dark;
const MIN_SELECT = 3;

const INTERESTS = [
  { id: 'priere', label: 'Priere', color: COLORS.info },
  { id: 'bible', label: 'Etude biblique', color: COLORS.gold },
  { id: 'adoration', label: 'Adoration', color: COLORS.purple },
  { id: 'evangelisation', label: 'Evangelisation', color: COLORS.primary },
  { id: 'jeune', label: 'Jeune & Spiritual', color: COLORS.warning },
  { id: 'famille', label: 'Famille & Couple', color: COLORS.success },
  { id: 'leadership', label: 'Leadership', color: COLORS.primaryLight },
  { id: 'guerison', label: 'Guerison interieure', color: COLORS.purple },
];

function InterestChip({ item, selected, onPress }: { item: typeof INTERESTS[0]; selected: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.92, { duration: 80 }, () => {
      scale.value = withSpring(1, { duration: 120 });
    });
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[
          styles.chip,
          selected && { borderColor: item.color, backgroundColor: `${item.color}18` },
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        {selected && <Check size={13} color={item.color} strokeWidth={3} />}
        <Text style={[styles.chipText, selected && { color: item.color }]}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Interests() {
  const { selectedInterests, toggleInterest } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(selectedInterests || []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    toggleInterest(id);
  };

  const canContinue = selected.length >= MIN_SELECT;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push('/(onboarding)/ready');
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
              <View key={s} style={[styles.stepDot, s <= 4 && styles.stepDotActive]} />
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Vos centres d'interet</Text>
          <Text style={styles.subtitle}>
            Choisissez au moins {MIN_SELECT} sujets qui vous tiennent a coeur
          </Text>
        </View>

        {/* Counter */}
        <View style={styles.counterRow}>
          <Text style={[styles.counter, canContinue && styles.counterReady]}>
            {selected.length} / {MIN_SELECT} minimum
          </Text>
          {canContinue && (
            <Text style={styles.counterCheck}>Parfait !</Text>
          )}
        </View>

        {/* Chips grid */}
        <View style={styles.grid}>
          {INTERESTS.map((item) => (
            <InterestChip
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              onPress={() => toggle(item.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            {canContinue ? 'Continuer' : `Choisir encore ${MIN_SELECT - selected.length}`}
          </Text>
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
    marginBottom: SPACING.xl,
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
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  counter: {
    ...TYPOGRAPHY.caption,
    color: C.textHint,
  },
  counterReady: {
    color: COLORS.success,
  },
  counterCheck: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border2,
  },
  chipText: {
    ...TYPOGRAPHY.body,
    color: C.textMuted,
    fontWeight: '500',
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
    opacity: 0.5,
  },
  continueButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
