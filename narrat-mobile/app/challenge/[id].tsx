import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Users, TrendingUp, Calendar, Zap, CheckCircle, Lock, Play } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_CHALLENGES } from '../../data/mockData';
import { useThemeColors } from '../../hooks/useThemeColors';

const DAY_PROGRAM = [
  { day: 1, title: 'Prendre conscience', done: true },
  { day: 2, title: 'Reconnaitre les declencheurs', done: true },
  { day: 3, title: 'La verite qui libere', done: true },
  { day: 4, title: 'Repentance profonde', done: true },
  { day: 5, title: 'Soutien communautaire', done: true },
  { day: 6, title: 'Guerison des blessures', done: true },
  { day: 7, title: 'Bilan de semaine 1', done: true },
  { day: 8, title: 'Renouveler son esprit', done: false, today: true },
  { day: 9, title: 'La puissance du jeune', done: false },
  { day: 10, title: 'Autorite spirituelle', done: false },
  { day: 11, title: 'Gardes et frontieres', done: false, locked: true },
  { day: 12, title: 'Victoire durable', done: false, locked: true },
];

export default function ChallengeDetailScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const challenge = MOCK_CHALLENGES.find((c) => c.id === id) ?? MOCK_CHALLENGES[0];

  const headerOp = useSharedValue(0);
  const contentOp = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOp.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 16 }],
  }));

  useEffect(() => {
    headerOp.value = withTiming(1, { duration: 400 });
    contentOp.value = withDelay(150, withTiming(1, { duration: 400 }));
  }, []);

  const progressPct = (challenge.currentDay / challenge.days) * 100;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View style={[styles.hero, headerStyle]}>
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={styles.intensityBadge}>
              <Text style={styles.intensityText}>{challenge.intensity}</Text>
            </View>
            <Text style={styles.heroTitle}>{challenge.title}</Text>
            <Text style={styles.heroCategory}>{challenge.category} · {challenge.days} jours</Text>
          </View>
        </Animated.View>

        <Animated.View style={contentStyle}>
          {/* Stats */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Users size={16} color={COLORS.info} />
              <Text style={styles.statVal}>{challenge.participants.toLocaleString()}</Text>
              <Text style={styles.statLbl}>Participants</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <TrendingUp size={16} color={COLORS.success} />
              <Text style={styles.statVal}>{challenge.successRate}%</Text>
              <Text style={styles.statLbl}>Reussite</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Calendar size={16} color={COLORS.gold} />
              <Text style={styles.statVal}>{challenge.days}j</Text>
              <Text style={styles.statLbl}>Duree</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Zap size={16} color={COLORS.purple} />
              <Text style={styles.statVal}>{challenge.currentDay > 0 ? `J${challenge.currentDay}` : '--'}</Text>
              <Text style={styles.statLbl}>Avancement</Text>
            </View>
          </View>

          {/* Progress */}
          {challenge.currentDay > 0 && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progression</Text>
                <Text style={styles.progressPct}>Jour {challenge.currentDay}/{challenge.days}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descText}>{challenge.description}</Text>
          </View>

          {/* Accountability partner */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Partenaire de responsabilite</Text>
            <View style={styles.partnerCard}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerAvatarText}>?</Text>
              </View>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>Partenaire anonyme</Text>
                <Text style={styles.partnerSub}>Vous etes apparies automatiquement · Anonymat preserve</Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.ctaPrimary}
              activeOpacity={0.85}
              onPress={() => router.push('/challenge/day')}
            >
              <Text style={styles.ctaPrimaryText}>
                {challenge.currentDay > 0 ? `Continuer — Jour ${challenge.currentDay}` : 'Commencer le defi'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day program */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Programme quotidien</Text>
            <View style={styles.dayList}>
              {DAY_PROGRAM.map((day) => (
                <TouchableOpacity
                  key={day.day}
                  style={[styles.dayRow, day.today && styles.dayRowToday, day.locked && styles.dayRowLocked]}
                  activeOpacity={day.locked ? 1 : 0.85}
                  onPress={() => !day.locked && router.push('/challenge/day')}
                >
                  <View style={[
                    styles.dayState,
                    day.done && styles.dayStateDone,
                    day.today && styles.dayStateToday,
                    day.locked && styles.dayStateLocked,
                  ]}>
                    {day.done ? (
                      <CheckCircle size={14} color={COLORS.success} />
                    ) : day.today ? (
                      <Play size={10} color={COLORS.primary} fill={COLORS.primary} />
                    ) : day.locked ? (
                      <Lock size={12} color={C.textHint} />
                    ) : (
                      <Text style={styles.dayNum}>{day.day}</Text>
                    )}
                  </View>
                  <Text style={[styles.dayTitle, day.locked && styles.dayTitleLocked, day.today && styles.dayTitleToday]}>
                    Jour {day.day} · {day.title}
                  </Text>
                  {day.today && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>Aujourd'hui</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: SPACING.xl }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    scroll: { flex: 1 },
    scrollContent: {},
    hero: {
      height: 260,
      backgroundColor: '#2A0A0A',
      justifyContent: 'flex-end',
      paddingBottom: SPACING.xl,
    },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    backBtn: {
      position: 'absolute',
      top: 52,
      left: SPACING.xl,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroContent: { paddingHorizontal: SPACING.xl, gap: SPACING.xs },
    intensityBadge: {
      alignSelf: 'flex-start',
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      marginBottom: SPACING.xs,
    },
    intensityText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    heroTitle: { ...TYPOGRAPHY.h3, color: '#FFF' },
    heroCategory: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.6)' },
    statsStrip: {
      flexDirection: 'row',
      backgroundColor: C.surface,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
      paddingVertical: SPACING.md,
    },
    statItem: { flex: 1, alignItems: 'center', gap: 4 },
    statVal: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '700', fontSize: 13 },
    statLbl: { ...TYPOGRAPHY.micro, color: C.textMuted },
    divider: { width: 1, backgroundColor: C.border },
    progressCard: {
      margin: SPACING.xl,
      marginBottom: 0,
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.sm,
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    progressLabel: { ...TYPOGRAPHY.label, color: C.textMuted },
    progressPct: { ...TYPOGRAPHY.label, color: COLORS.primary, fontWeight: '700' },
    progressTrack: { height: 6, backgroundColor: C.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
    sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
    descText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
    partnerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.md,
    },
    partnerAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    partnerAvatarText: { ...TYPOGRAPHY.h4, color: C.textHint },
    partnerInfo: { flex: 1, gap: 3 },
    partnerName: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
    partnerSub: { ...TYPOGRAPHY.micro, color: C.textHint },
    ctaSection: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
    ctaPrimary: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingVertical: 14,
      alignItems: 'center',
    },
    ctaPrimaryText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
    dayList: { gap: SPACING.xs },
    dayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.md,
      gap: SPACING.md,
    },
    dayRowToday: { borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primaryMuted },
    dayRowLocked: { opacity: 0.5 },
    dayState: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayStateDone: { backgroundColor: 'rgba(39,174,96,0.12)' },
    dayStateToday: { backgroundColor: COLORS.primaryMuted },
    dayStateLocked: {},
    dayNum: { ...TYPOGRAPHY.micro, color: C.textHint, fontWeight: '600' },
    dayTitle: { flex: 1, ...TYPOGRAPHY.caption, color: C.text, fontWeight: '500' },
    dayTitleLocked: { color: C.textHint },
    dayTitleToday: { color: COLORS.primary, fontWeight: '600' },
    todayBadge: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
    },
    todayBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700' },
  });
}
