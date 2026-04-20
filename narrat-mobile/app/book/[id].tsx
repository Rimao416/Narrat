import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, BookOpen, Headphones, Download, Star, Play, CheckCircle, Lock, Clock } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_BOOKS, MOCK_BOOK_CHAPTERS } from '../../data/mockData';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function BookDetailScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = MOCK_BOOKS.find((b) => b.id === id) ?? MOCK_BOOKS[0];

  const headerOp = useSharedValue(0);
  const contentOp = useSharedValue(0);
  const progressW = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOp.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 20 }],
  }));
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressW.value}%` as any }));

  useEffect(() => {
    headerOp.value = withTiming(1, { duration: 400 });
    contentOp.value = withDelay(150, withTiming(1, { duration: 400 }));
    progressW.value = withDelay(500, withTiming(book.progress, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View style={[styles.hero, { backgroundColor: book.coverGradient[0] }, headerStyle]}>
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={styles.coverArt}>
              <BookOpen size={36} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.heroTitle}>{book.title}</Text>
            <Text style={styles.heroAuthor}>{book.author} · {book.year}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.ratingRow}>
                <Star size={13} color={COLORS.gold} fill={COLORS.gold} />
                <Text style={styles.ratingText}>{book.rating}</Text>
              </View>
              <Text style={styles.heroDot}>·</Text>
              <Text style={styles.heroCategory}>{book.category}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={contentStyle}>
          {/* Stats strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <BookOpen size={16} color={COLORS.primary} />
              <Text style={styles.statVal}>{book.chapters}</Text>
              <Text style={styles.statLbl}>Chapitres</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Clock size={16} color={COLORS.info} />
              <Text style={styles.statVal}>{book.totalDuration}</Text>
              <Text style={styles.statLbl}>Duree</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Star size={16} color={COLORS.gold} />
              <Text style={styles.statVal}>{book.rating}</Text>
              <Text style={styles.statLbl}>Note</Text>
            </View>
            {book.hasAudio && (
              <>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Headphones size={16} color={COLORS.purple} />
                  <Text style={styles.statVal}>Audio</Text>
                  <Text style={styles.statLbl}>Disponible</Text>
                </View>
              </>
            )}
          </View>

          {/* Progress */}
          {book.progress > 0 && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progression</Text>
                <Text style={styles.progressPct}>{book.progress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
              <Text style={styles.progressSub}>Chapitre {book.currentChapter} sur {book.chapters}</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descText}>{book.description}</Text>
          </View>

          {/* CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.ctaPrimary}
              activeOpacity={0.85}
              onPress={() => router.push('/book/reader')}
            >
              <BookOpen size={16} color="#FFF" />
              <Text style={styles.ctaPrimaryText}>{book.progress > 0 ? 'Continuer la lecture' : 'Commencer'}</Text>
            </TouchableOpacity>
            {book.hasAudio && (
              <TouchableOpacity
                style={styles.ctaSecondary}
                activeOpacity={0.85}
                onPress={() => router.push('/audio/player')}
              >
                <Play size={16} color={COLORS.primary} />
                <Text style={styles.ctaSecondaryText}>Ecouter</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* TOC */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Table des matieres</Text>
            <View style={styles.chapList}>
              {MOCK_BOOK_CHAPTERS.map((ch) => (
                <TouchableOpacity
                  key={ch.num}
                  style={[styles.chapRow, ch.current && styles.chapRowActive]}
                  activeOpacity={ch.done || ch.current ? 0.8 : 1}
                  onPress={() => ch.done || ch.current ? router.push('/book/reader') : null}
                >
                  <View style={[styles.chapState, ch.done && styles.chapStateDone, ch.current && styles.chapStateCurrent]}>
                    {ch.done ? (
                      <CheckCircle size={16} color={COLORS.success} />
                    ) : ch.current ? (
                      <Play size={12} color={COLORS.primary} fill={COLORS.primary} />
                    ) : (
                      <Lock size={12} color={C.textHint} />
                    )}
                  </View>
                  <View style={styles.chapInfo}>
                    <Text style={[styles.chapTitle, !ch.done && !ch.current && styles.chapTitleLocked]}>
                      {ch.num}. {ch.title}
                    </Text>
                    <Text style={styles.chapDuration}>{ch.duration}</Text>
                  </View>
                  {ch.current && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>En cours</Text>
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
    hero: { height: 280, justifyContent: 'flex-end', paddingBottom: SPACING.xl },
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
    coverArt: {
      width: 72,
      height: 96,
      borderRadius: RADIUS.md,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
    },
    heroTitle: { ...TYPOGRAPHY.h3, color: '#FFF' },
    heroAuthor: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)' },
    heroMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: 2 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    ratingText: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '600' },
    heroDot: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
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
    progressSub: { ...TYPOGRAPHY.caption, color: C.textHint },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
    sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
    descText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
    ctaRow: { flexDirection: 'row', paddingHorizontal: SPACING.xl, marginTop: SPACING.xl, gap: SPACING.sm },
    ctaPrimary: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingVertical: 13,
    },
    ctaPrimaryText: { ...TYPOGRAPHY.body, color: '#FFF', fontWeight: '700' },
    ctaSecondary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingVertical: 13,
      paddingHorizontal: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
    },
    ctaSecondaryText: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: '700' },
    chapList: { gap: 2 },
    chapRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.md,
      gap: SPACING.md,
    },
    chapRowActive: { borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primaryMuted },
    chapState: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chapStateDone: { backgroundColor: 'rgba(39,174,96,0.12)' },
    chapStateCurrent: { backgroundColor: COLORS.primaryMuted },
    chapInfo: { flex: 1, gap: 3 },
    chapTitle: { ...TYPOGRAPHY.caption, color: C.text, fontWeight: '500' },
    chapTitleLocked: { color: C.textHint },
    chapDuration: { ...TYPOGRAPHY.micro, color: C.textHint },
    currentBadge: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
    },
    currentBadgeText: { ...TYPOGRAPHY.micro, color: COLORS.primary, fontWeight: '700' },
  });
}
