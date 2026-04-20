import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, List, SkipBack, SkipForward, Play, Pause, Volume2 } from 'lucide-react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withDelay, Easing,
} from 'react-native-reanimated';
import { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_BOOKS, MOCK_BOOK_CHAPTERS } from '../../data/mockData';
import { useThemeColors } from '../../hooks/useThemeColors';

const book = MOCK_BOOKS[0];
const chapter = MOCK_BOOK_CHAPTERS[4];

const WAVEFORM_BARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  height: Math.floor(Math.random() * 28) + 8,
  active: i < 18,
}));

export default function AudioPlayerScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const artScale = useSharedValue(1);
  const containerOp = useSharedValue(0);

  const artStyle = useAnimatedStyle(() => ({ transform: [{ scale: artScale.value }] }));
  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOp.value }));

  useEffect(() => {
    containerOp.value = withTiming(1, { duration: 350 });
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      artScale.value = withSequence(
        withTiming(1.04, { duration: 200 }),
        withTiming(1, { duration: 200 }),
      );
    }
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];
  const cycleSpeed = () => {
    const idx = speedOptions.indexOf(speed);
    setSpeed(speedOptions[(idx + 1) % speedOptions.length]);
  };

  return (
    <Animated.View style={[styles.root, containerStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronDown size={20} color={C.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Lecture en cours</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/audio/chapters')} activeOpacity={0.8}>
          <List size={20} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* Artwork */}
      <View style={styles.artworkSection}>
        <Animated.View style={[styles.artworkWrap, artStyle]}>
          <View style={[styles.artwork, { backgroundColor: book.coverGradient[0] }]}>
            <Text style={styles.artworkInitials}>{book.title.slice(0, 2).toUpperCase()}</Text>
          </View>
        </Animated.View>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        <Text style={styles.chapterMeta}>Chapitre 5 · {chapter.duration}</Text>
      </View>

      {/* Waveform */}
      <View style={styles.waveformSection}>
        <View style={styles.waveform}>
          {WAVEFORM_BARS.map((bar) => (
            <View
              key={bar.id}
              style={[
                styles.bar,
                { height: bar.height },
                bar.active ? styles.barActive : styles.barInactive,
              ]}
            />
          ))}
          {/* Playhead */}
          <View style={[styles.playhead, { left: `${(18 / 40) * 100}%` as any }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>21:34</Text>
          <Text style={styles.timeText}>{chapter.duration}</Text>
        </View>
      </View>

      {/* Speed */}
      <View style={styles.speedRow}>
        <TouchableOpacity style={styles.speedBadge} onPress={cycleSpeed} activeOpacity={0.8}>
          <Text style={styles.speedText}>{speed.toFixed(2)}x</Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.8}>
          <Text style={styles.skipLabel}>-15</Text>
          <SkipBack size={20} color={C.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prevBtn} activeOpacity={0.8}>
          <SkipBack size={22} color={C.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn} onPress={handlePlay} activeOpacity={0.85}>
          {isPlaying ? <Pause size={28} color="#FFF" fill="#FFF" /> : <Play size={28} color="#FFF" fill="#FFF" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} activeOpacity={0.8}>
          <SkipForward size={22} color={C.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.8}>
          <SkipForward size={20} color={C.textMuted} />
          <Text style={styles.skipLabel}>+15</Text>
        </TouchableOpacity>
      </View>

      {/* Volume */}
      <View style={styles.volumeRow}>
        <Volume2 size={14} color={C.textHint} />
        <View style={styles.volumeTrack}>
          <View style={styles.volumeFill} />
          <View style={styles.volumeThumb} />
        </View>
        <Volume2 size={18} color={C.textMuted} />
      </View>
    </Animated.View>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg, paddingBottom: 36 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 52,
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.md,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerLabel: { ...TYPOGRAPHY.caption, color: C.textMuted, fontWeight: '600' },
    artworkSection: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
    artworkWrap: {},
    artwork: {
      width: 180,
      height: 180,
      borderRadius: RADIUS.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
    },
    artworkInitials: { ...TYPOGRAPHY.h2, color: 'rgba(255,255,255,0.6)', fontSize: 48 },
    bookTitle: { ...TYPOGRAPHY.h4, color: C.text },
    chapterTitle: { ...TYPOGRAPHY.body, color: C.textMuted, textAlign: 'center', paddingHorizontal: SPACING.xl },
    chapterMeta: { ...TYPOGRAPHY.micro, color: C.textHint },
    waveformSection: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
    waveform: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      gap: 2,
      position: 'relative',
    },
    bar: { flex: 1, borderRadius: 2 },
    barActive: { backgroundColor: COLORS.primary },
    barInactive: { backgroundColor: C.surfaceElevated },
    playhead: {
      position: 'absolute',
      top: -4,
      bottom: -4,
      width: 2,
      backgroundColor: '#FFF',
      borderRadius: 1,
    },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
    timeText: { ...TYPOGRAPHY.micro, color: C.textHint },
    speedRow: { alignItems: 'center', marginBottom: SPACING.lg },
    speedBadge: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: C.border2,
    },
    speedText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700' },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xl,
      paddingHorizontal: SPACING.xl,
      marginBottom: SPACING.xl,
    },
    ctrlBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    skipLabel: { ...TYPOGRAPHY.micro, color: C.textHint },
    prevBtn: { padding: SPACING.sm },
    nextBtn: { padding: SPACING.sm },
    playBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
    volumeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl * 2,
      gap: SPACING.md,
    },
    volumeTrack: {
      flex: 1,
      height: 4,
      backgroundColor: C.surfaceElevated,
      borderRadius: 2,
      position: 'relative',
    },
    volumeFill: { width: '70%', height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
    volumeThumb: {
      position: 'absolute',
      left: '70%',
      top: -5,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#FFF',
      transform: [{ translateX: -7 }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
  });
}
