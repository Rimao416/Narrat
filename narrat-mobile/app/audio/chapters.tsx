import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, CheckCircle, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_BOOK_CHAPTERS, MOCK_BOOKS } from '../../data/mockData';

const C = COLORS.dark;
const book = MOCK_BOOKS[0];

export default function AudioChaptersScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.root}>
      {/* Sticky mini player */}
      <View style={styles.miniPlayer}>
        <TouchableOpacity style={styles.miniBackBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <View style={[styles.miniArt, { backgroundColor: book.coverGradient[0] }]}>
          <Text style={styles.miniArtText}>{book.title.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.miniInfo}>
          <Text style={styles.miniTitle} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.miniChapter}>{MOCK_BOOK_CHAPTERS[4].title}</Text>
        </View>
        <TouchableOpacity style={styles.miniPlayBtn} onPress={() => setIsPlaying(!isPlaying)} activeOpacity={0.8}>
          {isPlaying ? <Pause size={18} color="#FFF" /> : <Play size={18} color="#FFF" fill="#FFF" />}
        </TouchableOpacity>
      </View>

      {/* Mini progress bar */}
      <View style={styles.miniProgressTrack}>
        <View style={styles.miniProgressFill} />
      </View>

      {/* Chapter list */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.listTitle}>Tous les chapitres</Text>
        {MOCK_BOOK_CHAPTERS.map((ch) => (
          <TouchableOpacity
            key={ch.num}
            style={[styles.chapRow, ch.current && styles.chapRowActive]}
            activeOpacity={0.85}
            onPress={() => router.push('/audio/player')}
          >
            <View style={[styles.chapStateWrap, ch.done && styles.chapStateWrapDone, ch.current && styles.chapStateWrapCurrent]}>
              {ch.done ? (
                <CheckCircle size={16} color={COLORS.success} />
              ) : ch.current ? (
                <View style={styles.playingDot} />
              ) : (
                <Text style={styles.chapNumText}>{ch.num}</Text>
              )}
            </View>

            <View style={styles.chapInfo}>
              <Text style={[styles.chapTitle, ch.current && styles.chapTitleActive]}>{ch.title}</Text>
              <View style={styles.chapMeta}>
                <Clock size={11} color={C.textHint} />
                <Text style={styles.chapDuration}>{ch.duration}</Text>
              </View>
            </View>

            {ch.current ? (
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => { setIsPlaying(!isPlaying); router.push('/audio/player'); }}
                activeOpacity={0.8}
              >
                {isPlaying ? <Pause size={14} color="#FFF" /> : <Play size={14} color="#FFF" fill="#FFF" />}
              </TouchableOpacity>
            ) : !ch.done ? (
              <Play size={16} color={C.textHint} />
            ) : null}
          </TouchableOpacity>
        ))}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A0505',
    paddingTop: 52,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  miniBackBtn: { marginRight: SPACING.xs },
  miniArt: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniArtText: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  miniInfo: { flex: 1, gap: 2 },
  miniTitle: { ...TYPOGRAPHY.label, color: '#FFF', fontWeight: '600' },
  miniChapter: { ...TYPOGRAPHY.micro, color: 'rgba(255,255,255,0.5)' },
  miniPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniProgressTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
  miniProgressFill: { width: '55%', height: '100%', backgroundColor: COLORS.primary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  listTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.lg },
  chapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  chapRowActive: { borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primaryMuted },
  chapStateWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapStateWrapDone: { backgroundColor: 'rgba(39,174,96,0.12)' },
  chapStateWrapCurrent: { backgroundColor: COLORS.primaryMuted },
  playingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  chapNumText: { ...TYPOGRAPHY.caption, color: C.textHint, fontWeight: '600' },
  chapInfo: { flex: 1, gap: 4 },
  chapTitle: { ...TYPOGRAPHY.caption, color: C.text, fontWeight: '500' },
  chapTitleActive: { color: COLORS.primary },
  chapMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  chapDuration: { ...TYPOGRAPHY.micro, color: C.textHint },
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
