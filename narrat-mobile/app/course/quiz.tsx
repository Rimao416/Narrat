import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useState } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_QUIZ } from '../../data/mockData';

const C = COLORS.dark;

export default function QuizScreen() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = MOCK_QUIZ.questions[currentIdx];
  const isCorrect = selectedId === question.correctId;

  const slideOp = useSharedValue(1);
  const slideStyle = useAnimatedStyle(() => ({
    opacity: slideOp.value,
    transform: [{ translateX: (1 - slideOp.value) * 30 }],
  }));

  const handleSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    if (id === question.correctId) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < MOCK_QUIZ.questions.length - 1) {
      slideOp.value = withTiming(0, { duration: 200 }, () => {
        setCurrentIdx((i) => i + 1);
        setSelectedId(null);
        slideOp.value = withTiming(1, { duration: 250 });
      });
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return <QuizResult score={score} total={MOCK_QUIZ.questions.length} />;
  }

  const getOptionStyle = (id: string) => {
    if (!selectedId) return styles.option;
    if (id === question.correctId) return [styles.option, styles.optionCorrect];
    if (id === selectedId && id !== question.correctId) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDimmed];
  };

  const getOptionTextStyle = (id: string) => {
    if (!selectedId) return styles.optionText;
    if (id === question.correctId) return [styles.optionText, styles.optionTextCorrect];
    if (id === selectedId && id !== question.correctId) return [styles.optionText, styles.optionTextWrong];
    return [styles.optionText, styles.optionTextDimmed];
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>{MOCK_QUIZ.moduleTitle}</Text>
          <Text style={styles.headerSub}>{MOCK_QUIZ.courseId === '1' ? 'Guerre Spirituelle' : ''}</Text>
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {MOCK_QUIZ.questions.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIdx && styles.dotActive, i < currentIdx && styles.dotDone]} />
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={slideStyle}>
          <Text style={styles.questionNum}>Question {question.num} / {question.total}</Text>
          <Text style={styles.questionText}>{question.question}</Text>

          {/* Verse context */}
          <View style={styles.verseContext}>
            <Text style={styles.verseContextText}>{question.verse}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            {question.options.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={getOptionStyle(opt.id)}
                onPress={() => handleSelect(opt.id)}
                activeOpacity={selectedId ? 1 : 0.85}
              >
                <View style={[styles.optionLetter, selectedId && opt.id === question.correctId && styles.optionLetterCorrect, selectedId && opt.id === selectedId && opt.id !== question.correctId && styles.optionLetterWrong]}>
                  <Text style={styles.optionLetterText}>{opt.id.toUpperCase()}</Text>
                </View>
                <Text style={getOptionTextStyle(opt.id)}>{opt.text}</Text>
                {selectedId && opt.id === question.correctId && <CheckCircle size={16} color={COLORS.success} />}
                {selectedId && opt.id === selectedId && opt.id !== question.correctId && <XCircle size={16} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          {selectedId && (
            <Animated.View style={[styles.explanationBox, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
              <Text style={[styles.explanationTitle, isCorrect ? styles.explanationTitleCorrect : styles.explanationTitleWrong]}>
                {isCorrect ? 'Bonne reponse !' : 'Pas tout a fait...'}
              </Text>
              <Text style={styles.explanationText}>
                {isCorrect
                  ? 'La ceinture de verite est en effet la premiere piece mentionnee par Paul, car la verite est le fondement de toute l\'armure spirituelle.'
                  : 'La bonne reponse est la ceinture de la verite (Eph. 6:14). Elle est la premiere car elle stabilise toutes les autres pieces de l\'armure.'}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7} onPress={handleNext}>
          <Text style={styles.skipBtnText}>Passer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextBtn, !selectedId && styles.nextBtnDisabled]}
          activeOpacity={selectedId ? 0.85 : 1}
          onPress={() => selectedId && handleNext()}
        >
          <Text style={styles.nextBtnText}>
            {currentIdx < MOCK_QUIZ.questions.length - 1 ? 'Question suivante' : 'Terminer'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function QuizResult({ score, total }: { score: number; total: number }) {
  const scale = useSharedValue(0.7);
  const op = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: op.value,
  }));

  useState(() => {
    scale.value = withSpring(1, { damping: 12 });
    op.value = withTiming(1, { duration: 300 });
  });

  return (
    <View style={styles.resultRoot}>
      <Animated.View style={[styles.resultBadge, animStyle]}>
        <Text style={styles.resultScore}>{score}/{total}</Text>
        <Text style={styles.resultLabel}>Bonne(s) reponse(s)</Text>
      </Animated.View>
      <Text style={styles.resultTitle}>{score === total ? 'Parfait !' : score >= total / 2 ? 'Bien joue !' : 'Continuez !'}</Text>
      <Text style={styles.resultSub}>Module 3 complete · +80 XP</Text>
      <TouchableOpacity style={styles.resultBtn} activeOpacity={0.85} onPress={() => router.back()}>
        <Text style={styles.resultBtnText}>Continuer la formation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerCenter: { flex: 1 },
  headerLabel: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
  headerSub: { ...TYPOGRAPHY.micro, color: C.textHint },
  dotsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.surfaceElevated,
  },
  dotActive: { backgroundColor: COLORS.primary },
  dotDone: { backgroundColor: 'rgba(192,57,43,0.4)' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl },
  questionNum: { ...TYPOGRAPHY.micro, color: C.textHint, marginBottom: SPACING.sm },
  questionText: { ...TYPOGRAPHY.h4, color: C.text, lineHeight: 26, marginBottom: SPACING.md },
  verseContext: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  verseContextText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontStyle: 'italic' },
  optionsList: { gap: SPACING.sm, marginBottom: SPACING.xl },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  optionCorrect: { borderColor: COLORS.success, backgroundColor: 'rgba(39,174,96,0.08)' },
  optionWrong: { borderColor: COLORS.primary, backgroundColor: 'rgba(192,57,43,0.08)' },
  optionDimmed: { opacity: 0.45 },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterCorrect: { backgroundColor: COLORS.success },
  optionLetterWrong: { backgroundColor: COLORS.primary },
  optionLetterText: { ...TYPOGRAPHY.caption, color: C.text, fontWeight: '700' },
  optionText: { flex: 1, ...TYPOGRAPHY.body, color: C.text },
  optionTextCorrect: { color: COLORS.success, fontWeight: '600' },
  optionTextWrong: { color: COLORS.primary, fontWeight: '600' },
  optionTextDimmed: { color: C.textHint },
  explanationBox: {
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  explanationCorrect: { backgroundColor: 'rgba(39,174,96,0.08)', borderWidth: 1, borderColor: 'rgba(39,174,96,0.2)' },
  explanationWrong: { backgroundColor: 'rgba(192,57,43,0.06)', borderWidth: 1, borderColor: COLORS.primaryBorder },
  explanationTitle: { ...TYPOGRAPHY.label, fontWeight: '700' },
  explanationTitleCorrect: { color: COLORS.success },
  explanationTitleWrong: { color: COLORS.primary },
  explanationText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: 28,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: SPACING.md,
  },
  skipBtn: { paddingVertical: 12, paddingHorizontal: SPACING.md },
  skipBtnText: { ...TYPOGRAPHY.caption, color: C.textHint },
  nextBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 13,
    alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: C.surfaceElevated },
  nextBtnText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
  resultRoot: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  resultBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 2,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  resultScore: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  resultLabel: { ...TYPOGRAPHY.micro, color: C.textMuted },
  resultTitle: { ...TYPOGRAPHY.h3, color: C.text, textAlign: 'center' },
  resultSub: { ...TYPOGRAPHY.body, color: COLORS.gold, fontWeight: '600' },
  resultBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl * 2,
    marginTop: SPACING.md,
  },
  resultBtnText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
});
