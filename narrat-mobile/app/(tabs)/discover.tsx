import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GraduationCap, Sword, Star, Headphones, Users, ChevronRight, Award } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { COLORS } from '../../constants/Colors';
import { SPACING, RADIUS, TYPOGRAPHY, FONTS } from '../../constants/theme';
import { useThemeColors } from '../../hooks/useThemeColors';
import { formationService, type DiscoverCourse } from '../../services/formationService';
import { challengeService, type Challenge } from '../../services/challengeService';
import { revivalService, type DiscoverRevivalFigure } from '../../services/revivalService';

const SECTIONS = ['Formation', 'Defis', 'Reveil'];

const INTENSITY_COLORS: Record<string, string> = {
  Intense: COLORS.primary,
  Modere: COLORS.warning,
  'Modéré': COLORS.warning,
  Debutant: COLORS.success,
  'Débutant': COLORS.success,
};

export default function DiscoverScreen() {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const [activeSection, setActiveSection] = useState('Formation');
  const [courses, setCourses] = useState<DiscoverCourse[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [figures, setFigures] = useState<DiscoverRevivalFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [coursesData, challengesData, figuresData] = await Promise.all([
          formationService.getCourses(),
          challengeService.getAll(),
          revivalService.getFigures(),
        ]);
        if (!isMounted) return;
        setCourses(coursesData);
        setChallenges(challengesData);
        setFigures(figuresData);
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
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Decouvrir</Text>
      </View>

      {/* Section tabs */}
      <View style={styles.sectionRow}>
        {SECTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sectionTab, activeSection === s && styles.sectionTabActive]}
            onPress={() => setActiveSection(s)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sectionTabText, activeSection === s && styles.sectionTabTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={{ paddingVertical: SPACING.lg }}>
            <Text style={{ ...TYPOGRAPHY.body, color: C.textMuted }}>Chargement…</Text>
          </View>
        )}
        {!loading && error && (
          <View style={{ paddingVertical: SPACING.lg }}>
            <Text style={{ ...TYPOGRAPHY.body, color: C.textMuted }}>{error}</Text>
          </View>
        )}
        {!loading && !error && activeSection === 'Formation' && <FormationSection courses={courses} />}
        {!loading && !error && activeSection === 'Defis' && <DefisSection challenges={challenges} />}
        {!loading && !error && activeSection === 'Reveil' && <ReveilSection figures={figures} />}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

function FormationSection({ courses }: { courses: DiscoverCourse[] }) {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  return (
    <View style={styles.list}>
      {courses.map((course) => (
        <TouchableOpacity key={course.id} style={styles.courseCard} activeOpacity={0.85} onPress={() => router.push(`/course/${course.id}`)}>
          <View style={[styles.courseHero, { backgroundColor: course.heroGradient[0] }]}>
            <View style={styles.courseHeroOverlay} />
            <View style={styles.courseHeroContent}>
              <View style={[styles.levelTag, { backgroundColor: `${INTENSITY_COLORS[course.level] || COLORS.primary}18` }]}>
                <Text style={[styles.levelTagText, { color: INTENSITY_COLORS[course.level] || COLORS.primary }]}>{course.level}</Text>
              </View>
              {course.hasAudio && (
                <View style={styles.audioBadge}>
                  <Headphones size={12} color={COLORS.info} />
                </View>
              )}
            </View>
          </View>
          <View style={styles.courseBody}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseTeacher}>{course.teacher}{course.teacherLocation ? ` · ${course.teacherLocation}` : ''}</Text>
            <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
            <View style={styles.courseMeta}>
              <View style={styles.metaItem}>
                <GraduationCap size={12} color={C.textHint} />
                <Text style={styles.metaText}>{course.modules} modules</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={12} color={C.textHint} />
                <Text style={styles.metaText}>{course.enrolled.toLocaleString()} inscrits</Text>
              </View>
              <View style={styles.metaItem}>
                <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
                <Text style={[styles.metaText, { color: COLORS.gold }]}>{course.rating}</Text>
              </View>
            </View>
            {course.tags.includes('Certificat') && (
              <View style={styles.certBadge}>
                <Award size={12} color={COLORS.gold} />
                <Text style={styles.certText}>Certificat inclus</Text>
              </View>
            )}
            {course.progress > 0 && (
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                </View>
                <Text style={styles.progressPct}>{course.progress}%</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DefisSection({ challenges }: { challenges: Challenge[] }) {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  return (
    <View style={styles.list}>
      {challenges.map((challenge) => (
        <TouchableOpacity key={challenge.id} style={styles.challengeCard} activeOpacity={0.85} onPress={() => router.push(`/challenge/${challenge.id}`)}>
          <View style={styles.challengeTop}>
            <View style={[styles.challengeIconWrap, { backgroundColor: 'rgba(120, 60, 180, 0.12)' }]}>
              <Sword size={20} color={COLORS.purple} />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeCategory}>{challenge.category}</Text>
            </View>
            <View style={[styles.intensityTag, { backgroundColor: `${INTENSITY_COLORS[challenge.intensity]}18` }]}>
              <Text style={[styles.intensityText, { color: INTENSITY_COLORS[challenge.intensity] }]}>{challenge.intensity}</Text>
            </View>
          </View>
          <Text style={styles.challengeDesc} numberOfLines={2}>{challenge.description}</Text>
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <Users size={12} color={C.textHint} />
              <Text style={styles.metaText}>{challenge.participants.toLocaleString()} participants</Text>
            </View>
            <Text style={styles.successRate}>{challenge.successRate}% reussite</Text>
          </View>
          {challenge.active ? (
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, styles.progressFillPurple, { width: `${(challenge.currentDay / challenge.days) * 100}%` }]} />
              </View>
              <Text style={styles.progressPct}>Jour {challenge.currentDay}/{challenge.days}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.startBtn} activeOpacity={0.85} onPress={() => router.push(`/challenge/${challenge.id}`)}>
              <Text style={styles.startBtnText}>Commencer ce defi</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReveilSection({ figures }: { figures: DiscoverRevivalFigure[] }) {
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const featured = figures[0];
  const rest = figures.slice(1);

  return (
    <View style={styles.list}>
      {/* Featured figure */}
      {featured && (
        <TouchableOpacity style={styles.figureCardFeatured} activeOpacity={0.85} onPress={() => router.push(`/revival/${featured.id}`)}>
          <View style={styles.figureHeaderRow}>
            <View style={styles.figureAvatar}>
              <Text style={styles.figureAvatarText}>{featured.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={styles.figureHeaderInfo}>
              <Text style={styles.figureName}>{featured.name}</Text>
              <Text style={styles.figureEra}>{featured.era}</Text>
              <Text style={styles.figureOrigin}>{featured.origin}</Text>
            </View>
            <View style={styles.featuredBadge}>
              <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
              <Text style={styles.featuredBadgeText}>A la une</Text>
            </View>
          </View>
          <View style={styles.quoteWrap}>
            <Text style={styles.quoteText}>{featured.quote}</Text>
          </View>
          <View style={styles.verseRow}>
            {!!featured.lifeVerse && <Text style={styles.verseRef}>{featured.lifeVerse}</Text>}
            {!!featured.lifeVerseText && <Text style={styles.verseText}>{featured.lifeVerseText}</Text>}
          </View>
          <View style={styles.figureTags}>
            {featured.tags.map((tag) => (
              <View key={tag} style={styles.figureTag}>
                <Text style={styles.figureTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      )}

      {/* Other figures */}
      {rest.map((figure) => (
        <TouchableOpacity key={figure.id} style={styles.figureCard} activeOpacity={0.85} onPress={() => router.push(`/revival/${figure.id}`)}>
          <View style={styles.figureAvatarSm}>
            <Text style={styles.figureAvatarSmText}>{figure.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
          </View>
          <View style={styles.figureCardInfo}>
            <Text style={styles.figureName}>{figure.name}</Text>
            <Text style={styles.figureEra}>{figure.era}</Text>
            <Text style={styles.figureQuoteShort} numberOfLines={2}>{figure.quote}</Text>
          </View>
          <ChevronRight size={16} color={C.textHint} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function createStyles(C: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    pageHeader: {
      paddingHorizontal: SPACING.xl,
      paddingTop: 56,
      paddingBottom: SPACING.md,
    },
    pageTitle: { ...TYPOGRAPHY.h2, color: C.text },
    sectionRow: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.xl,
      gap: SPACING.sm,
      marginBottom: SPACING.lg,
    },
    sectionTab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: RADIUS.md,
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
    },
    sectionTabActive: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primaryBorder },
    sectionTabText: { ...TYPOGRAPHY.caption, fontFamily: FONTS.semiBold, color: C.textMuted },
    sectionTabTextActive: { fontFamily: FONTS.bold, color: COLORS.primary },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: SPACING.xl },
    list: { gap: SPACING.md },
    courseCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      overflow: 'hidden',
    },
    courseHero: { height: 100, justifyContent: 'flex-end' },
    courseHeroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    courseHeroContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: SPACING.md,
    },
    levelTag: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
    levelTagText: { ...TYPOGRAPHY.micro, fontFamily: FONTS.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
    audioBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: COLORS.infoBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    courseBody: { padding: SPACING.lg, gap: SPACING.sm },
    courseTitle: { ...TYPOGRAPHY.h4, color: C.text },
    courseTeacher: { ...TYPOGRAPHY.caption, color: C.textMuted },
    courseDesc: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 20 },
    courseMeta: { flexDirection: 'row', gap: SPACING.md, alignItems: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { ...TYPOGRAPHY.caption, color: C.textHint },
    certBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(212,175,55,0.1)',
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    },
    certText: { ...TYPOGRAPHY.micro, fontFamily: FONTS.semiBold, color: COLORS.gold },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    progressBar: { flex: 1, height: 4, backgroundColor: C.surfaceElevated, borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
    progressFillPurple: { backgroundColor: COLORS.purple },
    progressPct: { ...TYPOGRAPHY.micro, color: C.textHint },
    challengeCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.md,
    },
    challengeTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    challengeIconWrap: { width: 44, height: 44, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
    challengeInfo: { flex: 1 },
    challengeTitle: { ...TYPOGRAPHY.h5, color: C.text },
    challengeCategory: { ...TYPOGRAPHY.caption, color: C.textMuted, marginTop: 2 },
    intensityTag: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
    intensityText: { ...TYPOGRAPHY.micro, fontFamily: FONTS.bold, textTransform: 'uppercase' },
    challengeDesc: { ...TYPOGRAPHY.body, color: C.textMuted, lineHeight: 20 },
    challengeMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    successRate: { ...TYPOGRAPHY.caption, fontFamily: FONTS.semiBold, color: COLORS.success },
    startBtn: {
      backgroundColor: COLORS.primaryMuted,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
      paddingVertical: 10,
      alignItems: 'center',
    },
    startBtnText: { ...TYPOGRAPHY.caption, fontFamily: FONTS.bold, color: COLORS.primary },
    figureCardFeatured: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
      padding: SPACING.lg,
      gap: SPACING.md,
    },
    figureHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
    figureAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: COLORS.primaryMuted,
      borderWidth: 1,
      borderColor: COLORS.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    figureAvatarText: { ...TYPOGRAPHY.label, color: COLORS.primary, fontSize: 13 },
    figureHeaderInfo: { flex: 1 },
    figureName: { ...TYPOGRAPHY.h5, color: C.text },
    figureEra: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginTop: 2 },
    figureOrigin: { ...TYPOGRAPHY.caption, color: C.textMuted },
    featuredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(212,175,55,0.12)',
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
    },
    featuredBadgeText: { ...TYPOGRAPHY.micro, fontFamily: FONTS.semiBold, color: COLORS.gold },
    quoteWrap: {
      backgroundColor: C.surfaceElevated,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.primary,
    },
    quoteText: { ...TYPOGRAPHY.body, color: C.textMuted, fontStyle: 'italic', lineHeight: 21 },
    verseRow: { gap: 3 },
    verseRef: { ...TYPOGRAPHY.caption, fontFamily: FONTS.semiBold, color: COLORS.primary },
    verseText: { ...TYPOGRAPHY.caption, color: C.textMuted, fontStyle: 'italic' },
    figureTags: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
    figureTag: {
      backgroundColor: C.surfaceElevated,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
    },
    figureTagText: { ...TYPOGRAPHY.micro, color: C.textHint },
    figureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: SPACING.lg,
      gap: SPACING.md,
    },
    figureAvatarSm: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: C.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    figureAvatarSmText: { ...TYPOGRAPHY.label, color: C.textMuted, fontSize: 11 },
    figureCardInfo: { flex: 1, gap: 3 },
    figureQuoteShort: { ...TYPOGRAPHY.caption, color: C.textHint, lineHeight: 17 },
  });
}
