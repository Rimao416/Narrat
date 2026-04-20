import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Headphones } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_LESSON_CONTENT } from '../../data/mockData';

const C = COLORS.dark;
const lesson = MOCK_LESSON_CONTENT;

export default function LessonScreen() {
  const contentOp = useSharedValue(0);
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 12 }],
  }));

  useEffect(() => {
    contentOp.value = withTiming(1, { duration: 350 });
  }, []);

  const progressPct = (lesson.moduleNum / lesson.totalModules) * 100;

  return (
    <View style={styles.root}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.moduleBadge}>
            <Text style={styles.moduleBadgeText}>Module {lesson.moduleNum}/{lesson.totalModules}</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.moduleTitle}</Text>
        </View>
        <TouchableOpacity style={styles.audioBtn} activeOpacity={0.8} onPress={() => router.push('/audio/player')}>
          <Headphones size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={contentStyle}>
          <Text style={styles.courseLabel}>{lesson.courseTitle}</Text>
          <Text style={styles.lessonTitle}>{lesson.moduleTitle}</Text>

          {/* Body content */}
          {lesson.body.map((item, i) => {
            if (typeof item === 'string') {
              return <Text key={i} style={styles.bodyText}>{item}</Text>;
            }
            if (item.type === 'verse') {
              return (
                <View key={i} style={styles.verseBlock}>
                  <Text style={styles.verseText}>{item.text}</Text>
                  <Text style={styles.verseRef}>{item.ref}</Text>
                </View>
              );
            }
            return null;
          })}

          {/* Key verse */}
          <View style={styles.keyVerseCard}>
            <Text style={styles.keyVerseLabel}>Verset cle</Text>
            <Text style={styles.keyVerseText}>{lesson.keyVerse.text}</Text>
            <Text style={styles.keyVerseRef}>{lesson.keyVerse.ref}</Text>
          </View>

          {/* Quote */}
          <View style={styles.quoteBlock}>
            <View style={styles.quoteLine} />
            <Text style={styles.quoteText}>{lesson.quote.text}</Text>
            <Text style={styles.quoteAuthor}>— {lesson.quote.author}</Text>
          </View>

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
          onPress={() => router.push('/course/quiz')}
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  progressTrack: { height: 2, backgroundColor: C.surfaceElevated },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
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
  verseBlock: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    gap: 6,
  },
  verseText: { ...TYPOGRAPHY.body, color: C.text, fontStyle: 'italic', lineHeight: 24 },
  verseRef: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  keyVerseCard: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.sm,
    marginVertical: SPACING.lg,
  },
  keyVerseLabel: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  keyVerseText: { ...TYPOGRAPHY.body, color: C.text, fontStyle: 'italic', lineHeight: 24 },
  keyVerseRef: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  quoteBlock: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginVertical: SPACING.md,
  },
  quoteLine: { width: 3, height: 40, backgroundColor: COLORS.gold, position: 'absolute', left: 0, top: SPACING.md },
  quoteText: { ...TYPOGRAPHY.body, color: C.text, fontStyle: 'italic', lineHeight: 24 },
  quoteAuthor: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '600' },
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
