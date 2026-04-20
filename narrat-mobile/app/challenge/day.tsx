import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_CHALLENGE_DAYS, MOCK_CHALLENGES } from '../../data/mockData';
import { useThemeColors } from '../../hooks/useThemeColors';

const challenge = MOCK_CHALLENGES[0];
const dayData = MOCK_CHALLENGE_DAYS[0];

export default function ChallengeDayScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const [tasks, setTasks] = useState(dayData.tasks);
  const contentOp = useSharedValue(0);
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 14 }],
  }));

  useEffect(() => {
    contentOp.value = withTiming(1, { duration: 350 });
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const allDone = tasks.every((t) => t.done);

  return (
    <View style={styles.root}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(dayData.dayNum / dayData.totalDays) * 100}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.dayLabel}>Jour {dayData.dayNum} / {dayData.totalDays}</Text>
          <Text style={styles.challengeName}>{challenge.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={contentStyle}>
          <Text style={styles.dayTitle}>{dayData.title}</Text>

          {/* Teaching */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enseignement du jour</Text>
            <Text style={styles.bodyText}>{dayData.teaching}</Text>
          </View>

          {/* Verse */}
          <View style={styles.verseBlock}>
            <Text style={styles.verseText}>{dayData.verse.text}</Text>
            <Text style={styles.verseRef}>{dayData.verse.ref}</Text>
          </View>

          {/* Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercices pratiques</Text>
            <View style={styles.taskList}>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
              ))}
            </View>
          </View>

          {/* Prayer */}
          <View style={styles.section}>
            <View style={styles.prayerBlock}>
              <Text style={styles.prayerLabel}>Priere du jour</Text>
              <Text style={styles.prayerText}>{dayData.prayerText}</Text>
            </View>
          </View>

          {/* Complete CTA */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={[styles.ctaPrimary, !allDone && styles.ctaPrimaryDisabled]}
              activeOpacity={allDone ? 0.85 : 1}
              onPress={() => allDone && router.replace('/challenge/done')}
            >
              <Text style={styles.ctaPrimaryText}>
                {allDone ? 'Terminer la journee' : `Encore ${tasks.filter((t) => !t.done).length} exercice(s)`}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: SPACING.xl }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function TaskItem({ task, onToggle }: { task: { id: string; text: string; done: boolean }; onToggle: () => void }) {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity style={[styles.taskRow, task.done && styles.taskRowDone]} onPress={handlePress} activeOpacity={0.85}>
        {task.done ? (
          <CheckCircle size={20} color={COLORS.success} />
        ) : (
          <Circle size={20} color={C.border2} />
        )}
        <Text style={[styles.taskText, task.done && styles.taskTextDone]}>{task.text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
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
    headerCenter: { flex: 1 },
    dayLabel: { ...TYPOGRAPHY.micro, color: C.textHint },
    challengeName: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
    dayTitle: { ...TYPOGRAPHY.h3, color: C.text, marginBottom: SPACING.xl },
    section: { marginBottom: SPACING.xl },
    sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
    bodyText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 24 },
    verseBlock: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.md,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.primary,
      padding: SPACING.lg,
      marginBottom: SPACING.xl,
      gap: 8,
    },
    verseText: { ...TYPOGRAPHY.body, color: C.text, fontStyle: 'italic', lineHeight: 24 },
    verseRef: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700' },
    taskList: { gap: SPACING.sm },
    taskRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: C.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.md,
      gap: SPACING.md,
    },
    taskRowDone: { borderColor: 'rgba(39,174,96,0.3)', backgroundColor: 'rgba(39,174,96,0.05)' },
    taskText: { flex: 1, ...TYPOGRAPHY.body, color: C.text, lineHeight: 22 },
    taskTextDone: { color: C.textHint, textDecorationLine: 'line-through' },
    prayerBlock: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.card,
      padding: SPACING.lg,
      gap: SPACING.sm,
    },
    prayerLabel: { ...TYPOGRAPHY.label, color: COLORS.primary, fontWeight: '700' },
    prayerText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22, fontStyle: 'italic' },
    ctaSection: { marginBottom: SPACING.xl },
    ctaPrimary: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingVertical: 14,
      alignItems: 'center',
    },
    ctaPrimaryDisabled: { backgroundColor: C.surfaceElevated },
    ctaPrimaryText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
  });
}
