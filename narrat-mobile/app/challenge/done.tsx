import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle, Bell } from 'lucide-react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, withSequence,
} from 'react-native-reanimated';
import { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { WEEK_STREAK } from '../../data/mockData';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function ChallengeDoneScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const [note, setNote] = useState('');

  const badgeScale = useSharedValue(0);
  const badgeOp = useSharedValue(0);
  const contentOp = useSharedValue(0);
  const xpOp = useSharedValue(0);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOp.value,
  }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOp.value }));
  const xpStyle = useAnimatedStyle(() => ({
    opacity: xpOp.value,
    transform: [{ translateY: (1 - xpOp.value) * 12 }],
  }));

  useEffect(() => {
    badgeScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    badgeOp.value = withTiming(1, { duration: 300 });
    contentOp.value = withDelay(400, withTiming(1, { duration: 400 }));
    xpOp.value = withDelay(700, withTiming(1, { duration: 400 }));
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Success badge */}
      <View style={styles.badgeSection}>
        <Animated.View style={[styles.badgeWrap, badgeStyle]}>
          <CheckCircle size={48} color={COLORS.success} />
        </Animated.View>
        <Text style={styles.successTitle}>Journee accomplie !</Text>
        <Text style={styles.successSub}>Vous avez complete le Jour 8 du defi "Vaincre la pornographie"</Text>
      </View>

      <Animated.View style={contentStyle}>
        {/* Streak week */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Votre semaine · 8 jours de suite</Text>
          <View style={styles.weekGrid}>
            {WEEK_STREAK.map((d, i) => (
              <View key={i} style={styles.dayCell}>
                <View style={[styles.dayDot, d.done && styles.dayDotDone, d.today && styles.dayDotToday]}>
                  {d.done && <CheckCircle size={10} color="#FFF" />}
                </View>
                <Text style={[styles.dayLabel, d.today && styles.dayLabelToday]}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Personal note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note personnelle</Text>
          <Text style={styles.sectionSub}>Comment vous sentez-vous ? Qu'avez-vous appris aujourd'hui ?</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Partagez vos reflexions (visible seulement par vous)..."
            placeholderTextColor={C.textHint}
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
        </View>

        {/* Partner block */}
        <View style={styles.section}>
          <View style={styles.partnerCard}>
            <View style={styles.partnerLeft}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerAvatarText}>?</Text>
              </View>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>Votre partenaire anonyme</Text>
                <Text style={styles.partnerSub}>En ligne · A aussi progresse aujourd'hui</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifyBtn} activeOpacity={0.8}>
              <Bell size={14} color={COLORS.primary} />
              <Text style={styles.notifyBtnText}>Notifier</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* XP Banner */}
        <Animated.View style={[styles.xpBanner, xpStyle]}>
          <Text style={styles.xpAmount}>+120 XP</Text>
          <Text style={styles.xpLabel}>Gagne pour cette journee</Text>
        </Animated.View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            activeOpacity={0.85}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.ctaPrimaryText}>Retour au tableau de bord</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaSecondary}
            activeOpacity={0.8}
            onPress={() => router.replace('/challenge/day')}
          >
            <Text style={styles.ctaSecondaryText}>Voir le programme complet</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    content: { paddingTop: 72, paddingHorizontal: SPACING.xl },
    badgeSection: { alignItems: 'center', marginBottom: SPACING.xl, gap: SPACING.md },
    badgeWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: 'rgba(39,174,96,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(39,174,96,0.3)',
    },
    successTitle: { ...TYPOGRAPHY.h3, color: C.text, textAlign: 'center' },
    successSub: { ...TYPOGRAPHY.body, color: C.textMuted, textAlign: 'center', lineHeight: 22 },
    streakCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.md,
      marginBottom: SPACING.xl,
    },
    streakTitle: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
    weekGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCell: { alignItems: 'center', gap: 6 },
    dayDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: C.surfaceElevated,
      borderWidth: 1,
      borderColor: C.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayDotDone: { backgroundColor: COLORS.success, borderColor: 'transparent' },
    dayDotToday: { borderColor: COLORS.primary },
    dayLabel: { ...TYPOGRAPHY.micro, color: C.textHint },
    dayLabelToday: { color: COLORS.primary, fontWeight: '700' },
    section: { marginBottom: SPACING.xl },
    sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: 4 },
    sectionSub: { ...TYPOGRAPHY.caption, color: C.textHint, marginBottom: SPACING.md },
    noteInput: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      ...TYPOGRAPHY.body,
      color: C.text,
      minHeight: 100,
      lineHeight: 22,
    },
    partnerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
    },
    partnerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    partnerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    partnerAvatarText: { ...TYPOGRAPHY.h4, color: C.textHint },
    partnerInfo: { gap: 2 },
    partnerName: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
    partnerSub: { ...TYPOGRAPHY.micro, color: COLORS.success },
    notifyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md,
      paddingVertical: 7,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
    },
    notifyBtnText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700' },
    xpBanner: {
      backgroundColor: 'rgba(212,175,55,0.1)',
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: 'rgba(212,175,55,0.25)',
      padding: SPACING.lg,
      alignItems: 'center',
      gap: 4,
      marginBottom: SPACING.xl,
    },
    xpAmount: { ...TYPOGRAPHY.h3, color: COLORS.gold },
    xpLabel: { ...TYPOGRAPHY.caption, color: C.textMuted },
    actions: { gap: SPACING.sm },
    ctaPrimary: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingVertical: 14,
      alignItems: 'center',
    },
    ctaPrimaryText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
    ctaSecondary: {
      borderRadius: RADIUS.full,
      paddingVertical: 13,
      alignItems: 'center',
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
    },
    ctaSecondaryText: { ...TYPOGRAPHY.body, color: C.textMuted, fontWeight: '600' },
  });
}
