import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Headphones, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_READER_CONTENT, MOCK_BOOKS } from '../../data/mockData';

const C = COLORS.dark;
const book = MOCK_BOOKS[0];
const content = MOCK_READER_CONTENT;

export default function ReaderScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const progressOp = useSharedValue(0);
  const contentOp = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${(content.chapterNum / content.totalChapters) * 100}%` as any,
  }));
  const contentAnimStyle = useAnimatedStyle(() => ({ opacity: contentOp.value }));

  useEffect(() => {
    contentOp.value = withTiming(1, { duration: 350 });
  }, []);

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <View style={styles.chapterInfo}>
          <Text style={styles.chapterLabel}>Chapitre {content.chapterNum}/{content.totalChapters}</Text>
          <Text style={styles.chapterTitle} numberOfLines={1}>{content.chapterTitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.audioBtn}
          onPress={() => router.push('/audio/player')}
          activeOpacity={0.8}
        >
          <Headphones size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={contentAnimStyle}>
          <Text style={styles.bookName}>{content.bookTitle}</Text>
          <Text style={styles.mainTitle}>{content.chapterTitle}</Text>

          {content.paragraphs.map((item, i) => {
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

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Chapter navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
          <ChevronLeft size={18} color={C.textMuted} />
          <Text style={styles.navBtnText}>Precedent</Text>
        </TouchableOpacity>

        {/* Mini audio player */}
        <TouchableOpacity
          style={styles.miniPlayer}
          onPress={() => setIsPlaying(!isPlaying)}
          activeOpacity={0.85}
        >
          <TouchableOpacity onPress={() => router.push('/audio/player')} activeOpacity={0.8}>
            <View style={styles.miniPlayerArt}>
              <Headphones size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>{content.chapterTitle}</Text>
            <Text style={styles.miniPlayerSub}>18 min · Audio</Text>
          </View>
          <TouchableOpacity style={styles.miniPlayBtn} onPress={() => setIsPlaying(!isPlaying)} activeOpacity={0.8}>
            {isPlaying ? <Pause size={16} color="#FFF" /> : <Play size={16} color="#FFF" />}
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
          <Text style={styles.navBtnText}>Suivant</Text>
          <ChevronRight size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
    backgroundColor: C.bg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterInfo: { flex: 1 },
  chapterLabel: { ...TYPOGRAPHY.micro, color: C.textHint },
  chapterTitle: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '600' },
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: { height: 2, backgroundColor: C.surfaceElevated },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  bookName: { ...TYPOGRAPHY.caption, color: C.textHint, marginBottom: SPACING.xs },
  mainTitle: { ...TYPOGRAPHY.h3, color: C.text, marginBottom: SPACING.xl },
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: 28,
    paddingTop: SPACING.sm,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: SPACING.sm,
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: SPACING.sm },
  navBtnText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '500' },
  miniPlayer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  miniPlayerArt: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlayerInfo: { flex: 1 },
  miniPlayerTitle: { ...TYPOGRAPHY.micro, color: C.text, fontWeight: '600' },
  miniPlayerSub: { ...TYPOGRAPHY.micro, color: C.textHint },
  miniPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
