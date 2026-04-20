import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Headphones, MapPin, Flame, Globe } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useEffect } from 'react';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_REVIVAL_FIGURES, MOCK_REVIVAL_BIOGRAPHY } from '../../data/mockData';

const C = COLORS.dark;

const SECTION_ICONS: Record<string, any> = {
  'map-pin': MapPin,
  'flame': Flame,
  'globe': Globe,
};

export default function RevivalFigureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const figure = MOCK_REVIVAL_FIGURES.find((f) => f.id === id) ?? MOCK_REVIVAL_FIGURES[0];
  const bio = MOCK_REVIVAL_BIOGRAPHY[figure.id as keyof typeof MOCK_REVIVAL_BIOGRAPHY] ?? MOCK_REVIVAL_BIOGRAPHY['1'];

  const headerOp = useSharedValue(0);
  const contentOp = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOp.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOp.value,
    transform: [{ translateY: (1 - contentOp.value) * 14 }],
  }));

  useEffect(() => {
    headerOp.value = withTiming(1, { duration: 400 });
    contentOp.value = withDelay(200, withTiming(1, { duration: 400 }));
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View style={[styles.hero, headerStyle]}>
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioBtn} activeOpacity={0.8}>
            <Headphones size={16} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={styles.tagsRow}>
              {figure.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.heroName}>{figure.name}</Text>
            <Text style={styles.heroYears}>{figure.origin}</Text>
            <Text style={styles.heroEra}>{figure.years}</Text>
          </View>
        </Animated.View>

        <Animated.View style={contentStyle}>
          {/* Life verse */}
          <View style={styles.lifeVerseCard}>
            <Text style={styles.lifeVerseLabel}>Verset de vie</Text>
            <Text style={styles.lifeVerseText}>{figure.lifeVerseText}</Text>
            <Text style={styles.lifeVerseRef}>{figure.lifeVerse}</Text>
          </View>

          {/* Intro */}
          <View style={styles.section}>
            <Text style={styles.bioIntro}>{bio.intro}</Text>
          </View>

          {/* Biography sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biographie</Text>
            <View style={styles.bioList}>
              {bio.sections.map((s, i) => {
                const Icon = SECTION_ICONS[s.icon] ?? MapPin;
                return (
                  <View key={i} style={styles.bioSection}>
                    <View style={styles.bioSectionHeader}>
                      <View style={styles.bioIconWrap}>
                        <Icon size={16} color={COLORS.gold} />
                      </View>
                      <Text style={styles.bioSectionTitle}>{s.title}</Text>
                    </View>
                    <Text style={styles.bioSectionText}>{s.text}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Quotes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Citations</Text>
            <View style={styles.quotesList}>
              {bio.quotes.map((q, i) => (
                <View key={i} style={styles.quoteCard}>
                  <View style={styles.quoteBorder} />
                  <Text style={styles.quoteText}>{q}</Text>
                  <Text style={styles.quoteAuthor}>— {figure.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: SPACING.xl }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: {},
  hero: {
    height: 300,
    backgroundColor: '#1A1205',
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBtn: {
    position: 'absolute',
    top: 52,
    right: SPACING.xl,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212,175,55,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: { paddingHorizontal: SPACING.xl, gap: SPACING.xs },
  tagsRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.sm },
  tag: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  tagText: { ...TYPOGRAPHY.micro, color: COLORS.gold, fontWeight: '600' },
  heroName: { ...TYPOGRAPHY.h2, color: '#FFF' },
  heroYears: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.7)' },
  heroEra: { ...TYPOGRAPHY.caption, color: COLORS.gold },
  lifeVerseCard: {
    margin: SPACING.xl,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  lifeVerseLabel: { ...TYPOGRAPHY.micro, color: COLORS.gold, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  lifeVerseText: { ...TYPOGRAPHY.body, color: C.text, fontStyle: 'italic', lineHeight: 24 },
  lifeVerseRef: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '600' },
  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, color: C.text, marginBottom: SPACING.md },
  bioIntro: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 24 },
  bioList: { gap: SPACING.md },
  bioSection: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  bioSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  bioIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioSectionTitle: { ...TYPOGRAPHY.label, color: C.text, fontWeight: '700' },
  bioSectionText: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 22 },
  quotesList: { gap: SPACING.md },
  quoteCard: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    position: 'relative',
  },
  quoteBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.gold,
    borderTopLeftRadius: RADIUS.card,
    borderBottomLeftRadius: RADIUS.card,
  },
  quoteText: { ...TYPOGRAPHY.body, color: C.text, fontStyle: 'italic', lineHeight: 24 },
  quoteAuthor: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '600' },
});
