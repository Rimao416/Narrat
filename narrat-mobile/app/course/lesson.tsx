import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Headphones } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';
import { formationService, type LessonContent } from '../../services/formationService';

export default function LessonScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentOp = useSharedValue(0);
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 12 }],
  }));

  useEffect(() => {
    contentOp.value = withTiming(1, { duration: 350 });
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!lessonId) return;
        setLoading(true);
        setError(null);
        const data = await formationService.getLesson(lessonId);
        if (!isMounted) return;
        setLesson(data);
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
  }, [lessonId]);

  if (loading) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color={C.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>Chargement…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color={C.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={2}>Impossible de charger</Text>
            <Text style={styles.courseLabel}>{error ?? 'Leçon introuvable'}</Text>
          </View>
        </View>
      </View>
    );
  }

  const currentLessonId = lessonId;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.moduleBadge}>
            <Text style={styles.moduleBadgeText}>Module {lesson.moduleIndex + 1}</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
        </View>
        <TouchableOpacity style={styles.audioBtn} activeOpacity={0.8} onPress={() => router.push('/audio/player')}>
          <Headphones size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={contentStyle}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.bodyText}>{lesson.content}</Text>

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} activeOpacity={0.8} onPress={() => router.back()}>
          <ChevronLeft size={18} color={C.textMuted} />
          <Text style={styles.navBtnText}>Precedent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quizBtn}
          activeOpacity={0.85}
          onPress={() => router.push(`/course/quiz?lessonId=${currentLessonId}`)}
        >
          <Text style={styles.quizBtnText}>Quiz →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
          <Text style={styles.navBtnTextNext}>Suivant</Text>
          <ChevronRight size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 52,
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.md,
      gap: SPACING.md,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCenter: { flex: 1, gap: 3 },
    moduleBadge: {
      alignSelf: 'flex-start',
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
    },
    moduleBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700' },
    headerTitle: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
    audioBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
    courseLabel: { ...TYPOGRAPHY.micro, color: C.textHint, marginBottom: SPACING.xs },
    lessonTitle: { ...TYPOGRAPHY.h3, color: C.text, marginBottom: SPACING.xl },
    bodyText: {
      ...TYPOGRAPHY.body,
      color: C.textMuted,
      lineHeight: 26,
      marginBottom: SPACING.lg,
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.xl,
      paddingBottom: 28,
      paddingTop: SPACING.md,
      backgroundColor: C.bg,
      borderTopWidth: 1,
      borderTopColor: C.border,
    },
    navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    navBtnText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '500' },
    navBtnTextNext: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
    quizBtn: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.lg,
      paddingVertical: 8,
    },
    quizBtnText: { ...TYPOGRAPHY.caption, color: '#FFF', fontWeight: '700' },
  });
}
