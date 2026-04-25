import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Users, Star, Clock, BookOpen, Lock, ChevronRight } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';
import { formationService, type CourseDetail } from '../../services/formationService';

const DEFAULT_OBJECTIVES = [
  "Identifier les stratégies de l'ennemi dans votre vie quotidienne",
  'Utiliser les armes spirituelles avec autorité et précision',
  'Prier avec puissance et persistance pour vous et votre entourage',
  'Marcher dans une victoire spirituelle durable',
];

export default function CourseDetailScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headerOp = useSharedValue(0);
  const contentOp = useSharedValue(0);
  const progressW = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOp.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 16 }],
  }));
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressW.value}%` as any }));

  useEffect(() => {
    headerOp.value = withTiming(1, { duration: 400 });
    contentOp.value = withDelay(150, withTiming(1, { duration: 400 }));
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);
        const data = await formationService.getCourseById(id);
        if (!isMounted) return;
        setCourse(data);
        setHeroImageFailed(false);
        progressW.value = withDelay(
          500,
          withTiming(data.progress ?? 0, { duration: 700, easing: Easing.out(Easing.cubic) })
        );
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message ?? 'Une erreur est survenue');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id, progressW]);

  if (loading) {
    return (
      <View style={styles.root}>
        <View style={[styles.hero, { backgroundColor: COLORS.primary }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Chargement…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={styles.root}>
        <View style={[styles.hero, { backgroundColor: COLORS.primary }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Impossible de charger</Text>
            <Text style={styles.heroTeacher}>{error ?? 'Formation introuvable'}</Text>
          </View>
        </View>
      </View>
    );
  }

  const objectives = (course.objectives?.length ? course.objectives : DEFAULT_OBJECTIVES) as string[];
  const modules = course.modulesList ?? [];

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View style={[styles.hero, { backgroundColor: course.heroGradient[0] }, headerStyle]}>
          {!!course.coverUrl && !heroImageFailed && (
            <ImageBackground
              source={{ uri: course.coverUrl }}
              style={styles.heroImage}
              onError={() => setHeroImageFailed(true)}
            />
          )}
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{course.level}</Text>
            </View>
            <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroTeacher}>{course.teacher}{course.teacherLocation ? ` · ${course.teacherLocation}` : ''}</Text>
          </View>
        </Animated.View>

        <Animated.View style={contentStyle}>
          {/* Stats */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Star size={15} color={COLORS.gold} />
              <Text style={styles.statVal}>{course.rating}</Text>
              <Text style={styles.statLbl}>Note</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Users size={15} color={COLORS.info} />
              <Text style={styles.statVal}>{course.enrolled.toLocaleString()}</Text>
              <Text style={styles.statLbl}>Inscrits</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Clock size={15} color={COLORS.purple} />
              <Text style={styles.statVal}>{course.duration ?? '—'}</Text>
              <Text style={styles.statLbl}>Duree</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <BookOpen size={15} color={COLORS.success} />
              <Text style={styles.statVal}>{course.modules}</Text>
              <Text style={styles.statLbl}>Modules</Text>
            </View>
          </View>

          {/* Progress */}
          {course.progress > 0 && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progression</Text>
                <Text style={styles.progressPct}>{course.progress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
            <Text style={styles.progressSub}>Module {course.currentModule ?? 0}/{course.modules}</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descText}>{course.description}</Text>
          </View>

          {/* Objectives */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ce que vous apprendrez</Text>
            <View style={styles.objectivesList}>
            {objectives.map((obj, i) => (
                <View key={i} style={styles.objectiveRow}>
                  <View style={styles.objectiveNum}>
                    <Text style={styles.objectiveNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.objectiveText}>{obj}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.ctaPrimary}
              activeOpacity={0.85}
            onPress={() => {
              const first = modules.find((m) => !m.isLocked) ?? modules[0];
              if (first?.id) router.push(`/course/lesson?lessonId=${first.id}`);
            }}
            >
              <Text style={styles.ctaPrimaryText}>
              {course.progress > 0 ? `Continuer — Module ${course.currentModule ?? 1}` : 'Commencer la formation'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modules</Text>
            <View style={styles.moduleList}>
              {modules.map((mod) => (
                <TouchableOpacity
                  key={mod.id}
                  style={[styles.moduleRow, mod.isLocked && styles.moduleRowLocked]}
                  activeOpacity={mod.isLocked ? 1 : 0.85}
                  onPress={() => !mod.isLocked && router.push(`/course/lesson?lessonId=${mod.id}`)}
                >
                  <View style={[
                    styles.moduleState,
                    styles.moduleStateCurrent,
                  ]}>
                    {mod.isLocked ? (
                      <Lock size={12} color={C.textHint} />
                    ) : (
                      <Text style={styles.moduleNumText}>{mod.moduleIndex + 1}</Text>
                    )}
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text style={[styles.moduleTitle, mod.isLocked && styles.moduleTitleLocked]}>
                      {mod.moduleIndex + 1}. {mod.title}
                    </Text>
                    <Text style={styles.moduleDuration}>{mod.readTime ? `${mod.readTime} min` : '—'}</Text>
                  </View>
                  {!mod.isLocked && <ChevronRight size={16} color={C.textHint} />}
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
    hero: { height: 270, justifyContent: 'flex-end', paddingBottom: SPACING.xl },
    heroImage: { ...StyleSheet.absoluteFillObject },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
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
    levelBadge: {
      alignSelf: 'flex-start',
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      marginBottom: SPACING.xs,
    },
    levelBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    heroTitle: { ...TYPOGRAPHY.h3, color: '#FFF' },
    heroTeacher: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.65)' },
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
    progressSub: { ...TYPOGRAPHY.caption, color: C.textHint },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
    sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
    descText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
    objectivesList: { gap: SPACING.sm },
    objectiveRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
    objectiveNum: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: COLORS.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    objectiveNumText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700' },
    objectiveText: { flex: 1, ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
    ctaSection: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
    ctaPrimary: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingVertical: 14,
      alignItems: 'center',
    },
    ctaPrimaryText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
    moduleList: { gap: SPACING.xs },
    moduleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.md,
      gap: SPACING.md,
    },
    moduleRowActive: { borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primaryMuted },
    moduleRowLocked: { opacity: 0.5 },
    moduleState: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moduleStateDone: { backgroundColor: 'rgba(39,174,96,0.12)' },
    moduleStateCurrent: { backgroundColor: COLORS.primaryMuted },
    moduleNumText: { ...TYPOGRAPHY.caption, color: C.textHint, fontWeight: '600' },
    moduleInfo: { flex: 1, gap: 3 },
    moduleTitle: { ...TYPOGRAPHY.caption, color: C.text, fontWeight: '500' },
    moduleTitleLocked: { color: C.textHint },
    moduleDuration: { ...TYPOGRAPHY.micro, color: C.textHint },
    currentBadge: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
    },
    currentBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700' },
  });
}
